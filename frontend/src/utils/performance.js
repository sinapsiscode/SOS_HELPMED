// Utilidades para optimización de performance

import { memo, useMemo, useCallback, lazy, useState, useEffect, useRef } from 'react'

// Lazy loading de componentes con manejo de errores mejorado
export const LazyAdminDashboard = lazy(() => 
  import('../components/admin/AdminDashboard').catch(err => {
    console.error('Error loading AdminDashboard:', err)
    throw err // Lanzar error en lugar de cargar versión simplificada
  })
)
export const LazyFamiliarDashboard = lazy(() => 
  import('../components/familiar/FamiliarDashboard').catch(err => {
    console.error('Error loading FamiliarDashboard:', err)
    throw err
  })
)
export const LazyCorporateDashboard = lazy(() => 
  import('../components/corporate/CorporateDashboard').catch(err => {
    console.error('Error loading CorporateDashboard:', err)
    throw err
  })
)
export const LazyExternalDashboard = lazy(() => 
  import('../components/external/ExternalDashboard').catch(err => {
    console.error('Error loading ExternalDashboard:', err)
    throw err
  })
)
export const LazyExternalAdminDashboard = lazy(() => 
  import('../components/external/ExternalAdminDashboard').catch(err => {
    console.error('Error loading ExternalAdminDashboard:', err)
    throw err
  })
)
export const LazyAmbulanceDashboard = lazy(() => 
  import('../components/ambulance/AmbulanceDashboard').catch(err => {
    console.error('Error loading AmbulanceDashboard:', err)
    throw err
  })
)

// HOC para memoización de componentes
export const withMemo = (Component, areEqual) => {
  return memo(Component, areEqual)
}

// Hook para debouncing
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

// Hook para throttling
export const useThrottle = (fn, delay) => {
  const [throttledFn, setThrottledFn] = useState(null)

  useEffect(() => {
    let lastCall = 0
    const throttled = (...args) => {
      const now = Date.now()
      if (now - lastCall >= delay) {
        lastCall = now
        return fn(...args)
      }
    }
    setThrottledFn(() => throttled)
  }, [fn, delay])

  return throttledFn
}

// Utilidad para medir performance
export const measurePerformance = (name, fn) => {
  return (...args) => {
    const start = performance.now()
    const result = fn(...args)
    const end = performance.now()

    console.log(`${name} took ${(end - start).toFixed(2)} milliseconds`)

    // Enviar métricas de performance si es necesario
    if (typeof result?.then === 'function') {
      return result.finally(() => {
        const finalEnd = performance.now()
        console.log(`${name} (async) took ${(finalEnd - start).toFixed(2)} milliseconds`)
      })
    }

    return result
  }
}

// Virtual scrolling para listas grandes
export const useVirtualScroll = (items, itemHeight, containerHeight) => {
  const [scrollTop, setScrollTop] = useState(0)

  const visibleStart = Math.floor(scrollTop / itemHeight)
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + 1,
    items.length
  )

  const visibleItems = useMemo(() => {
    return items.slice(visibleStart, visibleEnd).map((item, index) => ({
      ...item,
      index: visibleStart + index
    }))
  }, [items, visibleStart, visibleEnd])

  const totalHeight = items.length * itemHeight
  const offsetY = visibleStart * itemHeight

  return {
    visibleItems,
    totalHeight,
    offsetY,
    setScrollTop
  }
}

// Cache para datos
class DataCache {
  constructor(maxSize = 100, ttl = 5 * 60 * 1000) {
    // 5 minutos por defecto
    this.cache = new Map()
    this.maxSize = maxSize
    this.ttl = ttl
  }

  set(key, value) {
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value
      this.cache.delete(firstKey)
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now()
    })
  }

  get(key) {
    const item = this.cache.get(key)
    if (!item) return null

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return null
    }

    return item.value
  }

  clear() {
    this.cache.clear()
  }

  has(key) {
    const item = this.cache.get(key)
    if (!item) return false

    if (Date.now() - item.timestamp > this.ttl) {
      this.cache.delete(key)
      return false
    }

    return true
  }
}

export const dataCache = new DataCache()

// Hook para datos con cache
export const useCachedData = (key, fetchFn, dependencies = []) => {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const memoizedFetch = useCallback(fetchFn, dependencies)

  useEffect(() => {
    const cachedData = dataCache.get(key)
    if (cachedData) {
      setData(cachedData)
      return
    }

    setLoading(true)
    setError(null)

    memoizedFetch()
      .then((result) => {
        dataCache.set(key, result)
        setData(result)
      })
      .catch((err) => {
        setError(err)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [key, memoizedFetch])

  return { data, loading, error }
}

// Optimización de imágenes
export const optimizeImage = (src, options = {}) => {
  const { width = 'auto', height = 'auto', quality = 80, format = 'webp' } = options

  // En un entorno real, esto podría usar un servicio de optimización de imágenes
  return src
}

// Lazy loading de imágenes
export const useLazyImage = (src, options = {}) => {
  const [imageSrc, setImageSrc] = useState(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [isError, setIsError] = useState(false)
  const imgRef = useRef()

  useEffect(() => {
    const img = imgRef.current
    if (!img) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const optimizedSrc = optimizeImage(src, options)
            setImageSrc(optimizedSrc)
            observer.unobserve(img)
          }
        })
      },
      { threshold: 0.1 }
    )

    observer.observe(img)

    return () => {
      if (img) observer.unobserve(img)
    }
  }, [src, options])

  const handleLoad = useCallback(() => {
    setIsLoaded(true)
  }, [])

  const handleError = useCallback(() => {
    setIsError(true)
  }, [])

  return {
    imgRef,
    imageSrc,
    isLoaded,
    isError,
    handleLoad,
    handleError
  }
}

// Batch de actualizaciones
export const batchUpdates = (updates) => {
  return new Promise((resolve) => {
    requestAnimationFrame(() => {
      updates.forEach((update) => update())
      resolve()
    })
  })
}

// Web Workers para procesamiento pesado
export const createWorker = (workerFunction) => {
  const workerScript = `
    self.onmessage = function(e) {
      const result = (${workerFunction.toString()})(e.data);
      self.postMessage(result);
    }
  `

  const blob = new Blob([workerScript], { type: 'application/javascript' })
  return new Worker(URL.createObjectURL(blob))
}

// Service Worker para caching
export const registerServiceWorker = () => {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => {
          console.log('SW registered: ', registration)
        })
        .catch((registrationError) => {
          console.log('SW registration failed: ', registrationError)
        })
    })
  }
}

// Monitoreo de performance
export const PerformanceMonitor = {
  start: (name) => {
    performance.mark(`${name}-start`)
  },

  end: (name) => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)

    const measure = performance.getEntriesByName(name)[0]
    console.log(`${name}: ${measure.duration.toFixed(2)}ms`)

    return measure.duration
  },

  getMetrics: () => {
    return {
      navigation: performance.getEntriesByType('navigation')[0],
      resources: performance.getEntriesByType('resource'),
      measures: performance.getEntriesByType('measure'),
      marks: performance.getEntriesByType('mark')
    }
  },

  clearMetrics: () => {
    performance.clearMarks()
    performance.clearMeasures()
  }
}

export default {
  LazyAdminDashboard,
  LazyFamiliarDashboard,
  LazyCorporateDashboard,
  LazyExternalDashboard,
  LazyExternalAdminDashboard,
  withMemo,
  useDebounce,
  useThrottle,
  measurePerformance,
  useVirtualScroll,
  dataCache,
  useCachedData,
  optimizeImage,
  useLazyImage,
  batchUpdates,
  createWorker,
  registerServiceWorker,
  PerformanceMonitor
}
