export type WebsiteDiscoveryConfidence =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "NONE";

export type WebsiteDiscoveryCandidate = {
  website: string;
  title: string | null;
  confidence: WebsiteDiscoveryConfidence;
};

export type WebsiteDiscoveryResult = {
  found: boolean;
  website: string | null;
  confidence: WebsiteDiscoveryConfidence;
  source: string | null;
  candidates: WebsiteDiscoveryCandidate[];
};

export type WebsiteDiscoveryInput = {
  campusName: string;
  city?: string | null;
  state?: string | null;
};

export interface WebsiteSearchProvider {
  search(
    input: WebsiteDiscoveryInput
  ): Promise<WebsiteDiscoveryResult>;
}

function noResult(source: string): WebsiteDiscoveryResult {
  return {
    found: false,
    website: null,
    confidence: "NONE",
    source,
    candidates: [],
  };
}

class GoogleCustomSearchProvider implements WebsiteSearchProvider {
  async search(
    input: WebsiteDiscoveryInput
  ): Promise<WebsiteDiscoveryResult> {
    const apiKey = process.env.GOOGLE_SEARCH_API_KEY;
    const cx = process.env.GOOGLE_SEARCH_ENGINE_ID;

    if (!apiKey || !cx) {
      return noResult("GOOGLE_SEARCH_NOT_CONFIGURED");
    }

    const location = [input.city, input.state]
      .filter(Boolean)
      .join(", ");

    const query = [
      `"${input.campusName}"`,
      location,
      "school",
      "-facebook",
      "-instagram",
      "-youtube",
      "-justdial",
      "-linkedin",
    ]
      .filter(Boolean)
      .join(" ");

    const url = new URL(
      "https://www.googleapis.com/customsearch/v1"
    );

    url.searchParams.set("key", apiKey);
    url.searchParams.set("cx", cx);
    url.searchParams.set("q", query);
    url.searchParams.set("num", "10");
    url.searchParams.set("gl", "in");
    url.searchParams.set("hl", "en");

    const response = await fetch(url, {
      method: "GET",
      signal: AbortSignal.timeout(10000),
      cache: "no-store",
    });

    if (!response.ok) {
      throw new Error(
        `Google search failed with HTTP ${response.status}`
      );
    }

    const data = await response.json();

    const candidates: WebsiteSearchProvider extends never
      ? never
      : WebsiteDiscoveryCandidate[] = (data.items ?? [])
      .map((item: {
        link?: string;
        title?: string;
      }) => {
        if (!item.link) return null;

        try {
          const parsed = new URL(item.link);

          if (
            parsed.protocol !== "http:" &&
            parsed.protocol !== "https:"
          ) {
            return null;
          }

          return {
            website: `${parsed.protocol}//${parsed.host}`,
            title: item.title ?? null,
            confidence: "LOW" as const,
          };
        } catch {
          return null;
        }
      })
      .filter(
        (
          candidate: WebsiteDiscoveryCandidate | null
        ): candidate is WebsiteDiscoveryCandidate =>
          candidate !== null
      );

    const unique = Array.from(
      new Map(
        candidates.map(candidate => [
          candidate.website.toLowerCase(),
          candidate,
        ])
      ).values()
    );

    if (unique.length === 0) {
      return noResult("GOOGLE_CUSTOM_SEARCH");
    }

    const scored = unique.map(candidate => {
      let score = 0;

      const host = new URL(candidate.website).hostname;

      if (
        host.endsWith(".edu.in") ||
        host.endsWith(".ac.in") ||
        host.endsWith(".org.in")
      ) {
        score += 3;
      }

      if (
        host.includes(
          input.campusName
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, "")
        )
      ) {
        score += 3;
      }

      const title = (candidate.title ?? "").toLowerCase();

      if (title.includes(input.campusName.toLowerCase())) {
        score += 2;
      }

      if (
        title.includes("school") ||
        title.includes("academy") ||
        title.includes("college")
      ) {
        score += 1;
      }

      const confidence =
        score >= 6
          ? "HIGH"
          : score >= 3
            ? "MEDIUM"
            : "LOW";

      return {
        ...candidate,
        confidence,
        score,
      };
    });

    scored.sort((a, b) => b.score - a.score);

    const top = scored[0];

    return {
      found: true,
      website: top.website,
      confidence: top.confidence,
      source: "GOOGLE_CUSTOM_SEARCH",
      candidates: scored.map(
        ({ website, title, confidence }) => ({
          website,
          title,
          confidence,
        })
      ),
    };
  }
}

class UnconfiguredWebsiteSearchProvider
  implements WebsiteSearchProvider
{
  async search(
    _input: WebsiteDiscoveryInput
  ): Promise<WebsiteDiscoveryResult> {
    return noResult("SEARCH_PROVIDER_NOT_CONFIGURED");
  }
}

export function getWebsiteSearchProvider(): WebsiteSearchProvider {
  if (
    process.env.GOOGLE_SEARCH_API_KEY &&
    process.env.GOOGLE_SEARCH_ENGINE_ID
  ) {
    return new GoogleCustomSearchProvider();
  }

  return new UnconfiguredWebsiteSearchProvider();
}

export async function discoverWebsite(
  input: WebsiteDiscoveryInput
) {
  return getWebsiteSearchProvider().search(input);
}
