const CACHE_NAME = "smartcampusai-shell-v1";

const APP_SHELL = [
  "/",
  "/app",
  "/app/attendance",
  "/manifest.webmanifest",
  "/icon.svg",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) =>
      cache.addAll(APP_SHELL).catch(() => undefined),
    ),
  );

  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );

  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const request = event.request;

  if (request.method !== "GET") {
    return;
  }

  const url = new URL(request.url);

  if (url.origin !== self.location.origin) {
    return;
  }

  // Never cache API responses as part of the basic shell.
  if (url.pathname.startsWith("/api/")) {
    return;
  }

  // Navigation requests use network-first, then cached shell.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, copy);
          });

          return response;
        })
        .catch(async () => {
          const cached =
            (await caches.match(request)) ??
            (await caches.match("/app"));

          return (
            cached ??
            new Response(
              "SmartCampusAI is offline. Please reconnect.",
              {
                status: 503,
                headers: {
                  "Content-Type": "text/plain; charset=utf-8",
                },
              },
            )
          );
        }),
    );

    return;
  }

  // Static assets use cache-first with runtime population.
  if (
    url.pathname.startsWith("/_next/") ||
    url.pathname.startsWith("/fonts/") ||
    url.pathname === "/manifest.webmanifest" ||
    url.pathname === "/icon.svg"
  ) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) {
          return cached;
        }

        return fetch(request).then((response) => {
          if (response.ok) {
            const copy = response.clone();

            caches.open(CACHE_NAME).then((cache) => {
              cache.put(request, copy);
            });
          }

          return response;
        });
      }),
    );
  }
});
