const FILES_TO_CACHE = [
    "/",
    "/index.html",
    "/styles.css",
    "/dist/index.bundle.js",
    "https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"
];
const PRECACHE = "precache-v1";
const RUNTIME = "runtime";

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(PRECACHE)
            .then((cache) => cache.addAll(FILES_TO_CACHE))
            .then(self.skipWaiting())
    );
});

self.addEventListener("activate", (event) => {
    const currentCaches = [PRECACHE, RUNTIME];

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
                    }

                    return caches.open(RUNTIME).then((cache) => {
                        return fetch(event.request).then((response) => {
                            return cache.put(event.request, response.clone()).then(() => {
                                return response;
                            })
                        })
                    })
                })
        );
    }
});