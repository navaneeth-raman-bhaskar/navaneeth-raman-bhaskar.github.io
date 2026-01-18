const CACHE_NAME = "cache-v1";

/**
 * Install event
 * Runs once when the service worker is installed
 */
self.addEventListener("install", event => {
    self.skipWaiting();
});

/**
 * Activate event
 * Cleans up old caches
 */
self.addEventListener("activate", event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

/**
 * Fetch event
 * Network-first strategy (safe default)
 */
self.addEventListener("fetch", event => {
    event.respondWith(
        fetch(event.request).catch(() => caches.match(event.request))
    );
});
