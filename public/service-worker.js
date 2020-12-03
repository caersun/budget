const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/assets/css/styles.css",
    "/assets/images/icons/icon-192x192.png",
    "/assets/images/icons/icon-512x512.png",
    "/assets/js/index.js",
    "/assets/js/db.js",
    "/dist/bundle.js",
    "/dist/manifest.webmanifest",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css",
    "https://cdn.jsdelivr.net/npm/chart.js@2.8.0"
];
const STATIC_CACHE = "static-cache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(STATIC_CACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(() => self.skipWaiting())
    );
});

// handler takes care of cleaning up old caches
self.addEventListener("activate", (event) => {
    const currentCaches = [STATIC_CACHE, RUNTIME];

    event.waitUntil(
        caches
            .keys()
            .then((names) => {
                return names.filter((name) => !currentCaches.includes(name));
            })
            .then((cachesToDelete) => {
                return Promise.all(
                    cachesToDelete.map((cache) => { return caches.delete(cache); })
                )
            })
            .then(() => self.clients.claim())
    );
});

self.addEventListener("fetch", (event) => {  
    if (event.request.url.startsWith(self.location.origin)) {
        event.respondWith(
            caches
                .match(event.request)
                .then((cachedResponse) => {
                    if (cachedResponse) {
                        return cachedResponse;
                    };

                    return caches.open(RUNTIME).then((cache) => {
                        return fetch(event.request).then((response) => {
                            return Promise.all(cache.put(event.request, response.clone())).then(() => {
                                return response;
                            });
                        });
                    });
                })
        );
    }
});