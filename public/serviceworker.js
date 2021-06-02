const CACHE_NAME = "version-1";
const urlsToCache = ['index.html'];

self.addEventListener('install', (e) => {
    e.waitUntil(caches.open(CACHE_NAME)
        .then((cache) => { return cache.addAll(urlsToCache) }));
});


self.addEventListener('fetch', (e) => {
    e.respondWith(
        caches.match(e.request).then(() => {
            return fetch(e.request).catch(() => caches.match('offline.html'))
        })
    )
});

self.addEventListener('activate', (e) => {
    const cacheWhitelist = [];
    cacheWhitelist.push(CACHE_NAME);

    e.waitUntil(
        caches.keys().then((names) => Promise.all(
            names.map((name) => {
                if (!cacheWhitelist.includes(name)) {
                    return caches.delete(name);
                }
            })
        ))
    )
})