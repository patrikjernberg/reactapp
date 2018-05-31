    const staticAssets = [
        '/',
        '/index.html',
        '/offline.html',
        '/styles.css',
        '/static/js/bundle.js'
    ];

    const staticCache = 'news-static-cache';
    const apiCache = "news-api-cache";

    self.addEventListener('install', function(e) {
        console.log('Cache SW -  Install');
        e.waitUntil(
            caches.open(staticCache).then(function(cache) {
                console.log('Cache SW -  Caching app shell');
                return cache.addAll(staticAssets);
            })
        );
    });

    self.addEventListener('activate', function(e) {
        console.log('Cache SW -  Activate');
        e.waitUntil(
            caches.keys().then(function(keyList) {
                return Promise.all(keyList.map(function(key) {
                    if (key !== staticCache && key !== apiCache) {
                        console.log('Cache SW -  Removing old cache', key);
                        return caches.delete(key);
                    }
                }));
            })
        );
        return self.clients.claim();
    });

    self.addEventListener('fetch', function(e) {
        console.log('Cache SW - Fetch', e.request.url);
        const dataUrl = 'https://newsapi.org/';

        if (e.request.url.indexOf(dataUrl) > -1) {
            e.respondWith(
                caches.match(e.request).then(function(resp) {
                    return resp || fetch(e.request).then(function(response) {
                        return caches.open(apiCache).then(function(cache) {
                            cache.put(e.request, response.clone());
                            return response;
                        });
                    });
                })
            );
        } else {
            e.respondWith(
                caches.match(e.request).then(function(response) {
                    return response || fetch(e.request);
                })
            );
        }
    });
