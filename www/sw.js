// Service Worker para funcionalidad PWA
const CACHE_NAME = 'residencia-v1.0.0';
const urlsToCache = [
    '/',
    '/styles.css',
    '/app.js',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
    self.skipWaiting();
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Return cached version or fetch from network
                return response || fetch(event.request);
            })
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
    self.clients.claim();
});

// Background sync for data saving
self.addEventListener('sync', event => {
    if (event.tag === 'background-save') {
        event.waitUntil(saveDataToServer());
    }
});

// Función para guardar datos en servidor (simulada)
async function saveDataToServer() {
    // En una app real, aquí irían las llamadas a API
    console.log('Background sync: guardando datos...');
    return Promise.resolve();
}