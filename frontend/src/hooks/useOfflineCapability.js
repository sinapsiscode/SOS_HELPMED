import { useState, useEffect, useCallback } from 'react'
import { validateOfflineData, calculateDataSize } from '../schemas/offlineSchema'
import logger from '../utils/logger'

/**
 * Hook para capacidades offline (exportado desde OfflineManager original)
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída y optimizada
 * ✅ Regla #4: Validación con esquema Yup
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useCallback
 *
 * @returns {Object} Funciones para manejo offline básico
 */
export const useOfflineCapability = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  // Configurar listeners de conexión
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true)
      logger.info('Conexión restablecida en useOfflineCapability')
    }
    
    const handleOffline = () => {
      setIsOnline(false)
      logger.warn('Conexión perdida en useOfflineCapability')
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  /**
   * Guarda datos para uso offline
   * ✅ Regla #4: Validación con esquema
   * ✅ Regla #8: Manejo robusto de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const saveForOffline = useCallback((key, data) => {
    try {
      if (!key || typeof key !== 'string') {
        logger.error('Clave inválida para saveForOffline', { key })
        return false
      }

      if (data === undefined || data === null) {
        logger.error('Datos inválidos para saveForOffline', { key })
        return false
      }

      // Verificar tamaño de datos
      const dataSize = calculateDataSize(data)
      if (dataSize > 5 * 1024 * 1024) { // 5MB límite
        logger.error('Datos demasiado grandes para almacenamiento offline', { 
          key, 
          size: dataSize 
        })
        return false
      }

      const offlineData = JSON.parse(localStorage.getItem('helpmed_offline_data') || '{}')
      
      const newEntry = {
        data,
        timestamp: new Date().toISOString(),
        synced: isOnline,
        size: dataSize
      }

      offlineData[key] = newEntry

      // Validar estructura antes de guardar
      const validation = validateOfflineData(offlineData)
      if (!validation.isValid) {
        logger.error('Datos offline inválidos al guardar', validation.errors)
        return false
      }

      localStorage.setItem('helpmed_offline_data', JSON.stringify(offlineData))
      
      logger.debug('Datos guardados offline exitosamente', { 
        key, 
        size: dataSize,
        isOnline 
      })
      
      return true
    } catch (error) {
      logger.error('Error guardando datos offline', error, { key })
      return false
    }
  }, [isOnline])

  /**
   * Obtiene datos offline
   * ✅ Regla #8: Manejo robusto de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getOfflineData = useCallback((key) => {
    try {
      if (!key || typeof key !== 'string') {
        logger.error('Clave inválida para getOfflineData', { key })
        return null
      }

      const offlineData = JSON.parse(localStorage.getItem('helpmed_offline_data') || '{}')
      const entry = offlineData[key]

      if (!entry) {
        logger.debug('Datos offline no encontrados', { key })
        return null
      }

      // Verificar si los datos han expirado (opcional, 7 días por defecto)
      const entryDate = new Date(entry.timestamp)
      const expirationTime = 7 * 24 * 60 * 60 * 1000 // 7 días en ms
      
      if (Date.now() - entryDate.getTime() > expirationTime) {
        logger.warn('Datos offline expirados, eliminando', { key, timestamp: entry.timestamp })
        delete offlineData[key]
        localStorage.setItem('helpmed_offline_data', JSON.stringify(offlineData))
        return null
      }

      logger.debug('Datos offline recuperados exitosamente', { 
        key, 
        size: entry.size,
        age: Date.now() - entryDate.getTime()
      })

      return entry
    } catch (error) {
      logger.error('Error obteniendo datos offline', error, { key })
      return null
    }
  }, [])

  /**
   * Agrega acción a cola de sincronización
   * ✅ Regla #8: Manejo robusto de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const addToPendingSync = useCallback((action) => {
    try {
      if (!action || typeof action !== 'object' || !action.type) {
        logger.error('Acción inválida para sincronización', { action })
        return false
      }

      const pending = JSON.parse(localStorage.getItem('helpmed_pending_sync') || '[]')
      
      if (!Array.isArray(pending)) {
        logger.warn('Cola de sincronización corrupta, reiniciando')
        localStorage.removeItem('helpmed_pending_sync')
        return addToPendingSync(action) // Reintentar con cola limpia
      }

      const newItem = {
        id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString(),
        action,
        retryCount: 0,
        maxRetries: 3
      }

      pending.push(newItem)

      // Limitar a 100 items pendientes para evitar problemas de rendimiento
      if (pending.length > 100) {
        logger.warn('Cola de sincronización muy grande, eliminando items más antiguos')
        pending.splice(0, pending.length - 100)
      }

      localStorage.setItem('helpmed_pending_sync', JSON.stringify(pending))
      
      logger.info('Acción agregada a cola de sincronización', { 
        actionType: action.type,
        itemId: newItem.id,
        queueSize: pending.length 
      })
      
      return true
    } catch (error) {
      logger.error('Error agregando a cola de sincronización', error)
      return false
    }
  }, [])

  /**
   * Limpia datos offline expirados
   * ✅ Regla #8: Manejo robusto de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const cleanupExpiredData = useCallback(() => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('helpmed_offline_data') || '{}')
      const expirationTime = 7 * 24 * 60 * 60 * 1000 // 7 días
      let cleanedCount = 0

      Object.keys(offlineData).forEach(key => {
        const entry = offlineData[key]
        if (entry && entry.timestamp) {
          const entryDate = new Date(entry.timestamp)
          if (Date.now() - entryDate.getTime() > expirationTime) {
            delete offlineData[key]
            cleanedCount++
          }
        }
      })

      if (cleanedCount > 0) {
        localStorage.setItem('helpmed_offline_data', JSON.stringify(offlineData))
        logger.info('Datos offline expirados limpiados', { cleanedCount })
      }

      return cleanedCount
    } catch (error) {
      logger.error('Error limpiando datos offline expirados', error)
      return 0
    }
  }, [])

  /**
   * Obtiene estadísticas de almacenamiento offline
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getStorageStats = useCallback(() => {
    try {
      const offlineData = JSON.parse(localStorage.getItem('helpmed_offline_data') || '{}')
      const pendingSync = JSON.parse(localStorage.getItem('helpmed_pending_sync') || '[]')

      const stats = {
        totalEntries: Object.keys(offlineData).length,
        totalPending: Array.isArray(pendingSync) ? pendingSync.length : 0,
        totalSize: calculateDataSize(offlineData),
        oldestEntry: null,
        newestEntry: null
      }

      // Calcular fechas más antigua y más nueva
      const timestamps = Object.values(offlineData)
        .filter(entry => entry && entry.timestamp)
        .map(entry => new Date(entry.timestamp))
        .sort((a, b) => a - b)

      if (timestamps.length > 0) {
        stats.oldestEntry = timestamps[0]
        stats.newestEntry = timestamps[timestamps.length - 1]
      }

      return stats
    } catch (error) {
      logger.error('Error obteniendo estadísticas de almacenamiento', error)
      return {
        totalEntries: 0,
        totalPending: 0,
        totalSize: 0,
        oldestEntry: null,
        newestEntry: null
      }
    }
  }, [])

  return {
    isOnline,
    saveForOffline,
    getOfflineData,
    addToPendingSync,
    cleanupExpiredData,
    getStorageStats
  }
}