const CACHE_NAME = "cache-v1.3.2";
const PRECACHE_ASSETS = [
    "./",
    "./index.html",
    "./site.webmanifest",
    "./favicon.ico",
    "./assets/css/os.css",
    "./assets/css/device.css",
    "./assets/js/device.js",
    "./assets/js/core/dock.js",
    "./assets/js/core/finder.js",
    "./assets/js/apps/gallery.js",
    "./assets/js/apps/pdf.js",
    "./assets/js/apps/terminal.js",
    "./assets/images/dp.webp",
    "./assets/images/favicon.svg",
    "./assets/images/gmail.png",
    "./assets/images/maps.png",
    "./assets/images/web-app-manifest-192x192.png",
    "./assets/images/web-app-manifest-512x512.png"
];

/**
 * Install event
 * Pre-caches essential shell assets and activates immediately
 */
self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(PRECACHE_ASSETS))
            .then(() => self.skipWaiting())
    );
});

/**
 * Activate event
 * Cleans up old caches and claims active clients
 */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys()
            .then(keys =>
                Promise.all(
                    keys.map(key => {
                        if (key !== CACHE_NAME) {
                            return caches.delete(key);
                        }
                    })
                )
            )
            .then(() => self.clients.claim())
    );
});

/**
 * Fetch event
 * Network-first strategy with cache fallback and runtime caching for successful GET requests
 */
self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return;

    event.respondWith(
        fetch(event.request)
            .then(response => {
                if (response && response.status === 200) {
                    const url = new URL(event.request.url);
                    if (url.origin === self.location.origin) {
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then(cache => {
                            cache.put(event.request, responseToCache).catch(() => {});
                        });
                    }
                }
                return response;
            })
            .catch(() => {
                return caches.match(event.request, { ignoreSearch: true }).then(cachedResponse => {
                    if (cachedResponse) {
                        return cachedResponse;
                    }
                    if (event.request.mode === "navigate") {
                        return caches.match("./index.html");
                    }
                    return null;
                });
            })
    );
});
