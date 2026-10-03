import dns from "node:dns/promises";
import net from "node:net";

const MAX_RESPONSE_BYTES = 1_000_000;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 3;

export type UrlExtractionResult = {
  source: {
    website: string;
    finalUrl: string;
  };
  extracted: {
    title: string | null;
    emails: string[];
    phones: string[];
    whatsappNumbers: string[];
    textPreview: string;
  };
};

function isPrivateIp(ip: string): boolean {
  if (net.isIPv4(ip)) {
    const [a, b] = ip.split(".").map(Number);

    return (
      a === 10 ||
      a === 127 ||
      (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && b === 168) ||
      (a === 169 && b === 254) ||
      a === 0
    );
  }

  if (net.isIPv6(ip)) {
    const normalized = ip.toLowerCase();

    return (
      normalized === "::1" ||
      normalized.startsWith("fc") ||
      normalized.startsWith("fd") ||
      normalized.startsWith("fe80:")
    );
  }

  return true;
}

async function assertSafeHost(hostname: string) {
  const addresses = await dns.lookup(hostname, {
    all: true,
    verbatim: true,
  });

  if (!addresses.length) {
    throw new Error("Unable to resolve website host");
  }

  for (const address of addresses) {
    if (isPrivateIp(address.address)) {
      throw new Error("Private or local network addresses are not allowed");
    }
  }
}

async function fetchPublicUrl(inputUrl: string) {
  let currentUrl = inputUrl;

  for (let redirect = 0; redirect <= MAX_REDIRECTS; redirect++) {
    const url = new URL(currentUrl);

    if (!["http:", "https:"].includes(url.protocol)) {
      throw new Error("Only HTTP and HTTPS URLs are allowed");
    }

    await assertSafeHost(url.hostname);

    const controller = new AbortController();
    const timeout = setTimeout(
      () => controller.abort(),
      FETCH_TIMEOUT_MS,
    );

    try {
      const response = await fetch(url, {
        redirect: "manual",
        signal: controller.signal,
        headers: {
          "User-Agent": "SmartCampusAI-URL-Extractor/1.0",
        },
      });

      if (
        response.status >= 300 &&
        response.status < 400 &&
        response.headers.get("location")
      ) {
        currentUrl = new URL(
          response.headers.get("location")!,
          url,
        ).toString();

        continue;
      }

      if (!response.ok) {
        throw new Error(`Website returned HTTP ${response.status}`);
      }

      const contentType =
        response.headers.get("content-type") || "";

      if (!contentType.toLowerCase().includes("text/html")) {
        throw new Error("Website is not an HTML page");
      }

      const contentLength = Number(
        response.headers.get("content-length") || 0,
      );

      if (contentLength > MAX_RESPONSE_BYTES) {
        throw new Error("Website response is too large");
      }

      const buffer = await response.arrayBuffer();

      if (buffer.byteLength > MAX_RESPONSE_BYTES) {
        throw new Error("Website response is too large");
      }

      return {
        finalUrl: url.toString(),
        html: new TextDecoder().decode(buffer),
      };
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error("Too many redirects");
}

function extractEmails(text: string, html?: string): string[] {
  const found = new Set<string>();

  const textMatches =
    text.match(
      /[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi,
    ) || [];

  for (const email of textMatches) {
    found.add(email.trim().toLowerCase());
  }

  if (html) {
    const mailtoMatches =
      html.match(/mailto:[^"'<>\\s?#]+/gi) || [];

    for (const value of mailtoMatches) {
      const email = value
        .replace(/^mailto:/i, "")
        .split("?")[0]
        .trim()
        .toLowerCase();

      if (
        /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)
      ) {
        found.add(email);
      }
    }
  }

  return Array.from(found).slice(0, 10);
}

function normalizePhone(value: string): string {
  let phone = value
    .replace(/&nbsp;/gi, " ")
    .replace(/[^\d+().\-\s]/g, "")
    .replace(/\s+/g, " ")
    .trim();

  phone = phone
    .replace(/^[().\-\s]+/, "")
    .replace(/[().\-\s]+$/, "");

  if (phone.startsWith("+")) {
    phone =
      "+" +
      phone.slice(1).replace(/[^\d]/g, "");
  } else {
    phone = phone.replace(/[^\d]/g, "");
  }

  const digitCount = phone.replace(/\D/g, "").length;

  if (digitCount < 8 || digitCount > 15) {
    return "";
  }

  return phone;
}

function extractPhones(text: string, html?: string): string[] {
  const found = new Set<string>();

  if (html) {
    const telMatches =
      html.match(/tel:\+?[\d\s().-]{8,}/gi) || [];

    for (const value of telMatches) {
      const normalized = normalizePhone(
        value.replace(/^tel:/i, ""),
      );

      if (normalized) {
        found.add(normalized);
      }
    }
  }

  const candidates =
    text.match(/(?:\+?\d[\d\s().-]{6,}\d)/g) || [];

  for (const candidate of candidates) {
    for (const part of candidate.split(/[;,|]/)) {
      const normalized = normalizePhone(part);

      if (normalized) {
        found.add(normalized);
      }
    }
  }

  return Array.from(found).slice(0, 10);
}

function extractWhatsAppNumbers(
  html: string,
  text: string,
): string[] {
  const found = new Set<string>();

  const whatsappLinks =
    html.match(
      /(?:https?:\/\/|whatsapp:\/\/)[^"'<>\\s]*(?:wa\.me|api\.whatsapp\.com|whatsapp)[^"'<>\\s]*/gi,
    ) || [];

  for (const rawLink of whatsappLinks) {
    try {
      const link = rawLink.replace(/&amp;/gi, "&");

      const waMatch =
        link.match(/wa\.me\/(\d{8,15})/i);

      if (waMatch) {
        found.add(`+${waMatch[1]}`);
        continue;
      }

      const queryIndex = link.indexOf("?");

      if (queryIndex >= 0) {
        const params = new URLSearchParams(
          link.slice(queryIndex + 1),
        );

        const phone = params.get("phone");

        if (phone) {
          const normalized = normalizePhone(phone);

          if (normalized) {
            found.add(
              normalized.startsWith("+")
                ? normalized
                : `+${normalized}`,
            );
          }
        }
      }
    } catch {
      // Ignore malformed WhatsApp links.
    }
  }

  const whatsappContexts =
    text.match(/.{0,120}whatsapp.{0,180}/gi) || [];

  for (const context of whatsappContexts) {
    const phones = extractPhones(context);

    for (const phone of phones) {
      found.add(
        phone.startsWith("+")
          ? phone
          : `+${phone}`,
      );
    }
  }

  return Array.from(found).slice(0, 10);
}

function stripHtml(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractTitle(html: string): string | null {
  const match = html.match(
    /<title[^>]*>([\s\S]*?)<\/title>/i,
  );

  return (
    match?.[1]
      ?.replace(/\s+/g, " ")
      .trim()
      .slice(0, 255) || null
  );
}

export async function extractPublicWebsite(
  website: string,
): Promise<UrlExtractionResult> {
  const trimmed = website.trim();

  if (!trimmed) {
    throw new Error("website is required");
  }

  if (
    trimmed.startsWith("[") ||
    trimmed.includes("](") ||
    trimmed.includes(")")
  ) {
    throw new Error(
      "website must be a plain http or https URL",
    );
  }

  const normalizedWebsite =
    /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;

  let url: URL;

  try {
    url = new URL(normalizedWebsite);
  } catch {
    throw new Error(
      "Invalid website URL. Enter a domain such as example.com or a full URL such as https://example.com",
    );
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are allowed");
  }

  const result = await fetchPublicUrl(url.toString());
  const text = stripHtml(result.html);

  return {
    source: {
      website: normalizedWebsite,
      finalUrl: result.finalUrl,
    },
    extracted: {
      title: extractTitle(result.html),
      emails: extractEmails(text, result.html),
      phones: extractPhones(text, result.html),
      whatsappNumbers: extractWhatsAppNumbers(
        result.html,
        text,
      ),
      textPreview: text.slice(0, 3000),
    },
  };
}
