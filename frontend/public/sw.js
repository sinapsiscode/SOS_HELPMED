// Service Worker para HelpMED - Caching y funcionalidad offline

const CACHE_NAME = 'helpmed-v1.0.0'
const STATIC_CACHE = 'helpmed-static-v1.0.0'
const DYNAMIC_CACHE = 'helpmed-dynamic-v1.0.0'

// Archivos estáticos a cachear
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json',
  '/static/css/main.css',
  '/static/js/main.js'
  // Agregar otros assets estáticos
]

// URLs de API que necesitan estrategias especiales de cache
const API_ENDPOINTS = ['/api/users', '/api/emergencies', '/api/units', '/api/plans']

// Instalación del Service Worker
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...')
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => {
        console.log('Service Worker: Caching static files')
        return cache.addAll(STATIC_FILES)
      })
      .then(() => {
        console.log('Service Worker: Static files cached')
        return self.skipWaiting()
      })
      .catch((error) => {
        console.error('Service Worker: Error caching static files', error)
      })
  )
})

// Activación del Service Worker
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...')
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cache) => {
            if (cache !== STATIC_CACHE && cache !== DYNAMIC_CACHE) {
              console.log('Service Worker: Deleting old cache', cache)
              return caches.delete(cache)
            }
          })
        )
      })
      .then(() => {
        console.log('Service Worker: Activated')
        return self.clients.claim()
      })
  )
})

// Manejo de peticiones
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)

  // Solo interceptar peticiones del mismo origen
  if (url.origin !== location.origin) return

  // Estrategia para archivos estáticos
  if (isStaticFile(request.url)) {
    event.respondWith(cacheFirstStrategy(request, STATIC_CACHE))
    return
  }

  // Estrategia para API calls
  if (isApiCall(request.url)) {
    event.respondWith(networkFirstStrategy(request, DYNAMIC_CACHE))
    return
  }

  // Estrategia por defecto para otras peticiones
  event.respondWith(staleWhileRevalidateStrategy(request, DYNAMIC_CACHE))
})

// Verificar si es un archivo estático
function isStaticFile(url) {
  return (
    STATIC_FILES.some((file) => url.includes(file)) ||
    url.includes('/static/') ||
    url.includes('.css') ||
    url.includes('.js') ||
    url.includes('.png') ||
    url.includes('.jpg') ||
    url.includes('.svg')
  )
}

// Verificar si es una llamada a API
function isApiCall(url) {
  return url.includes('/api/') || API_ENDPOINTS.some((endpoint) => url.includes(endpoint))
}

// Estrategia Cache First (para archivos estáticos)
async function cacheFirstStrategy(request, cacheName) {
  try {
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      console.log('Service Worker: Serving from cache', request.url)
      return cachedResponse
    }

    console.log('Service Worker: Fetching and caching', request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.status === 200) {
      const responseClone = networkResponse.clone()
      cache.put(request, responseClone)
    }

    return networkResponse
  } catch (error) {
    console.error('Service Worker: Cache first strategy failed', error)
    return new Response('Offline content not available', { status: 503 })
  }
}

// Estrategia Network First (para API calls)
async function networkFirstStrategy(request, cacheName) {
  try {
    console.log('Service Worker: Trying network first', request.url)
    const networkResponse = await fetch(request)

    if (networkResponse.status === 200) {
      const cache = await caches.open(cacheName)
      const responseClone = networkResponse.clone()
      cache.put(request, responseClone)
    }

    return networkResponse
  } catch (error) {
    console.log('Service Worker: Network failed, trying cache', request.url)
    const cache = await caches.open(cacheName)
    const cachedResponse = await cache.match(request)

    if (cachedResponse) {
      // Agregar header para indicar que viene del cache
      const response = cachedResponse.clone()
      response.headers.set('X-Served-By', 'ServiceWorker-Cache')
      return response
    }

    // Retornar respuesta offline para API calls
    return new Response(
      JSON.stringify({
        error: 'Offline',
        message: 'No network connection and no cached data available',
        offline: true,
        timestamp: new Date().toISOString()
      }),
      {
        status: 503,
        headers: { 'Content-Type': 'application/json' }
      }
    )
  }
}

// Estrategia Stale While Revalidate (para contenido dinámico)
async function staleWhileRevalidateStrategy(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cachedResponse = await cache.match(request)

  // Fetch en paralelo
  const fetchPromise = fetch(request)
    .then((networkResponse) => {
      if (networkResponse.status === 200) {
        cache.put(request, networkResponse.clone())
      }
      return networkResponse
    })
    .catch((error) => {
      console.log('Service Worker: Network request failed', error)
      return null
    })

  // Retornar cache inmediatamente si está disponible
  if (cachedResponse) {
    console.log('Service Worker: Serving stale content', request.url)
    return cachedResponse
  }

  // Si no hay cache, esperar por la red
  const networkResponse = await fetchPromise
  if (networkResponse) {
    return networkResponse
  }

  return new Response('Content not available offline', { status: 503 })
}

// Manejo de mensajes desde el cliente
self.addEventListener('message', (event) => {
  const { type, payload } = event.data

  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting()
      break

    case 'GET_CACHE_STATS':
      getCacheStats().then((stats) => {
        event.ports[0].postMessage({ type: 'CACHE_STATS', payload: stats })
      })
      break

    case 'CLEAR_CACHE':
      clearSpecificCache(payload.cacheName).then((success) => {
        event.ports[0].postMessage({ type: 'CACHE_CLEARED', payload: { success } })
      })
      break

    case 'PREFETCH_RESOURCES':
      prefetchResources(payload.urls).then((results) => {
        event.ports[0].postMessage({ type: 'PREFETCH_COMPLETE', payload: results })
      })
      break
  }
})

// Obtener estadísticas de cache
async function getCacheStats() {
  const cacheNames = await caches.keys()
  const stats = {}

  for (const cacheName of cacheNames) {
    const cache = await caches.open(cacheName)
    const keys = await cache.keys()
    stats[cacheName] = {
      count: keys.length,
      size: await getCacheSize(cache, keys)
    }
  }

  return stats
}

// Calcular tamaño aproximado del cache
async function getCacheSize(cache, keys) {
  let totalSize = 0

  for (const key of keys.slice(0, 10)) {
    // Muestra de los primeros 10
    try {
      const response = await cache.match(key)
      if (response) {
        const text = await response.text()
        totalSize += text.length
      }
    } catch (error) {
      // Ignorar errores individuales
    }
  }

  return Math.round((totalSize * keys.length) / 10) // Estimación
}

// Limpiar cache específico
async function clearSpecificCache(cacheName) {
  try {
    const success = await caches.delete(cacheName)
    console.log(`Service Worker: Cache ${cacheName} cleared:`, success)
    return success
  } catch (error) {
    console.error('Service Worker: Error clearing cache', error)
    return false
  }
}

// Pre-cargar recursos
async function prefetchResources(urls) {
  const cache = await caches.open(DYNAMIC_CACHE)
  const results = await Promise.allSettled(
    urls.map(async (url) => {
      try {
        const response = await fetch(url)
        if (response.status === 200) {
          await cache.put(url, response.clone())
          return { url, status: 'success' }
        }
        return { url, status: 'failed', reason: `HTTP ${response.status}` }
      } catch (error) {
        return { url, status: 'failed', reason: error.message }
      }
    })
  )

  return results.map((result) => result.value)
}

// Sincronización en background
self.addEventListener('sync', (event) => {
  console.log('Service Worker: Background sync triggered', event.tag)

  if (event.tag === 'background-sync') {
    event.waitUntil(performBackgroundSync())
  }
})

// Realizar sincronización en background
async function performBackgroundSync() {
  try {
    // Obtener datos pendientes del IndexedDB o localStorage
    const pendingData = await getPendingSyncData()

    if (pendingData && pendingData.length > 0) {
      console.log('Service Worker: Syncing pending data', pendingData.length)

      for (const item of pendingData) {
        try {
          await syncItem(item)
          await removePendingSyncItem(item.id)
        } catch (error) {
          console.error('Service Worker: Failed to sync item', item.id, error)
        }
      }
    }
  } catch (error) {
    console.error('Service Worker: Background sync failed', error)
  }
}

// Placeholder functions para manejo de datos pendientes
async function getPendingSyncData() {
  // En implementación real, esto obtendría datos de IndexedDB
  return []
}

async function syncItem(item) {
  // En implementación real, esto enviaría el item al servidor
  console.log('Service Worker: Syncing item', item)
}

async function removePendingSyncItem(id) {
  // En implementación real, esto removería el item de IndexedDB
  console.log('Service Worker: Removing synced item', id)
}

// Push notifications
self.addEventListener('push', (event) => {
  console.log('Service Worker: Push message received', event)

  const options = {
    body: event.data ? event.data.text() : 'Nueva notificación de HelpMED',
    icon: '/favicon.ico',
    badge: '/badge.png',
    vibrate: [200, 100, 200],
    tag: 'helpmed-notification',
    requireInteraction: true,
    actions: [
      {
        action: 'view',
        title: 'Ver'
      },
      {
        action: 'dismiss',
        title: 'Descartar'
      }
    ]
  }

  event.waitUntil(self.registration.showNotification('HelpMED', options))
})

// Manejo de clicks en notificaciones
self.addEventListener('notificationclick', (event) => {
  console.log('Service Worker: Notification clicked', event)

  event.notification.close()

  if (event.action === 'view') {
    event.waitUntil(clients.openWindow('/'))
  }
})
