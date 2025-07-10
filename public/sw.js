const CACHE_NAME = 'prime-erp-v1.0.0';
const STATIC_CACHE = 'prime-static-v1.0.0';
const DYNAMIC_CACHE = 'prime-dynamic-v1.0.0';

// Recursos estáticos essenciais
const STATIC_ASSETS = [
  '/',
  '/admin',
  '/manifest.json',
  '/lovable-uploads/0b5e2834-14f7-48ac-9d10-1496398c9096.png',
  '/lovable-uploads/b216e2c3-802a-4554-8699-511071d5a50c.png'
];

// URLs da API para cache prioritário
const API_CACHE_PATTERNS = [
  /\/rest\/v1\/products/,
  /\/rest\/v1\/customers/,
  /\/rest\/v1\/orders/,
  /\/rest\/v1\/inventory_movements/
];

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('Service Worker: Skip waiting');
        return self.skipWaiting();
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('Service Worker: Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Claiming clients');
      return self.clients.claim();
    })
  );
});

// Fetch event - Strategy: Cache First for static, Network First for API
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip chrome-extension and other non-http requests
  if (!request.url.startsWith('http')) return;

  // Handle API requests
  if (url.hostname.includes('supabase.co') || API_CACHE_PATTERNS.some(pattern => pattern.test(url.pathname))) {
    event.respondWith(networkFirstStrategy(request));
    return;
  }

  // Handle static assets
  if (STATIC_ASSETS.includes(url.pathname) || url.pathname.startsWith('/lovable-uploads/')) {
    event.respondWith(cacheFirstStrategy(request));
    return;
  }

  // Handle navigation requests
  if (request.mode === 'navigate') {
    event.respondWith(networkFirstWithFallback(request));
    return;
  }

  // Default strategy for other requests
  event.respondWith(staleWhileRevalidate(request));
});

// Cache First Strategy (for static assets)
async function cacheFirstStrategy(request) {
  try {
    const cache = await caches.open(STATIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    const networkResponse = await fetch(request);
    await cache.put(request, networkResponse.clone());
    return networkResponse;
  } catch (error) {
    console.log('Cache First failed:', error);
    return new Response('Offline - Resource not available', { status: 503 });
  }
}

// Network First Strategy (for API calls)
async function networkFirstStrategy(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      await cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    console.log('Network failed, trying cache:', error);
    const cache = await caches.open(DYNAMIC_CACHE);
    const cachedResponse = await cache.match(request);
    
    if (cachedResponse) {
      return cachedResponse;
    }
    
    return new Response(JSON.stringify({ 
      error: 'Offline - Data not available',
      cached: false 
    }), { 
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Network First with Fallback (for navigation)
async function networkFirstWithFallback(request) {
  try {
    const networkResponse = await fetch(request);
    return networkResponse;
  } catch (error) {
    console.log('Navigation failed, serving offline page');
    const cache = await caches.open(STATIC_CACHE);
    const fallbackResponse = await cache.match('/');
    return fallbackResponse || new Response('Offline', { status: 503 });
  }
}

// Stale While Revalidate (for other resources)
async function staleWhileRevalidate(request) {
  const cache = await caches.open(DYNAMIC_CACHE);
  const cachedResponse = await cache.match(request);
  
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  }).catch(() => cachedResponse);
  
  return cachedResponse || fetchPromise;
}

// Background sync for form submissions
self.addEventListener('sync', (event) => {
  console.log('Background sync triggered:', event.tag);
  
  if (event.tag === 'background-sync-forms') {
    event.waitUntil(syncForms());
  }
});

async function syncForms() {
  try {
    const cache = await caches.open('forms-cache');
    const requests = await cache.keys();
    
    for (const request of requests) {
      try {
        await fetch(request);
        await cache.delete(request);
        console.log('Form synced successfully');
      } catch (error) {
        console.log('Form sync failed, will retry later');
      }
    }
  } catch (error) {
    console.log('Background sync error:', error);
  }
}

// Push notification handling
self.addEventListener('push', (event) => {
  console.log('Push notification received:', event);
  
  const options = {
    body: event.data ? event.data.text() : 'Nova notificação do Prime ERP',
    icon: '/lovable-uploads/b216e2c3-802a-4554-8699-511071d5a50c.png',
    badge: '/lovable-uploads/b216e2c3-802a-4554-8699-511071d5a50c.png',
    vibrate: [200, 100, 200],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: '1'
    },
    actions: [
      {
        action: 'explore',
        title: 'Ver Detalhes',
        icon: '/lovable-uploads/b216e2c3-802a-4554-8699-511071d5a50c.png'
      },
      {
        action: 'close',
        title: 'Fechar',
        icon: '/lovable-uploads/b216e2c3-802a-4554-8699-511071d5a50c.png'
      }
    ]
  };
  
  event.waitUntil(
    self.registration.showNotification('Prime ERP', options)
  );
});

// Notification click handling
self.addEventListener('notificationclick', (event) => {
  console.log('Notification clicked:', event);
  event.notification.close();
  
  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/admin')
    );
  }
});

// Message handling for client communication
self.addEventListener('message', (event) => {
  console.log('Service Worker received message:', event.data);
  
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'GET_VERSION') {
    event.ports[0].postMessage({ version: CACHE_NAME });
  }
});