import { useMemo, useCallback } from 'react'
import logger from '../utils/logger'
import { validateLimitsData } from '../schemas/limitsSchema'

/**
 * Hook para gestión de límites de servicios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae toda la lógica del componente
 * ✅ Regla #4: Validación de formularios
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @param {string} title - Título de la tarjeta
 * @param {Object} limits - Límites de servicios
 * @param {string} userType - Tipo de usuario
 * @param {Object} planInfo - Información del plan
 * @returns {Object} Estados y funciones para manejo de límites
 */
const useLimitsCard = (title, limits, userType, planInfo) => {
  /**
   * Normaliza los datos de límites para backward compatibility
   * ✅ Defensive programming
   * ✅ Manejo de estructuras antiguas y nuevas
   */
  const normalizedData = useMemo(() => {
    // Null safety - si no hay límites, usar estructura por defecto
    if (!limits) {
      logger.warn('LimitsCard: limits is undefined, using default structure')
      return {
        title: title || 'Plan',
        limits: { general: {} },
        userType: userType || 'familiar', 
        planInfo: planInfo || {}
      }
    }
    
    // Backward compatibility - si limits no tiene 'general', crearlo
    const normalizedLimits = limits.general ? limits : { general: limits }
    
    return {
      title: title || 'Plan',
      limits: normalizedLimits,
      userType: userType || 'familiar',
      planInfo: planInfo || {}
    }
  }, [title, limits, userType, planInfo])

  /**
   * Valida los datos de límites normalizados
   * ✅ Regla #4: Validación con esquema
   * ✅ Regla #8: Manejo de errores
   */
  const validationResult = useMemo(() => {
    try {
      const validation = validateLimitsData(normalizedData)
      if (!validation.isValid) {
        logger.warn('Datos de límites inválidos', validation.errors)
      }
      return {
        isValid: validation.isValid || false,
        errors: validation.errors || {}
      }
    } catch (error) {
      logger.error('Error validando datos de límites', error)
      return { 
        isValid: false, 
        errors: { general: 'Error de validación' } 
      }
    }
  }, [normalizedData])

  /**
   * Obtiene el ícono del servicio
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getServiceIcon = useCallback((serviceType) => {
    const icons = {
      EMERGENCIA: 'fas fa-ambulance',
      URGENCIA: 'fas fa-clock',
      MEDICO_DOMICILIO: 'fas fa-user-md',
      TRASLADO_PROGRAMADO: 'fas fa-route',
      ZONA_PROTEGIDA: 'fas fa-shield-alt',
      ORIENTACION_TELEFONICA: 'fas fa-phone',
      EXAMENES_LABORATORIO: 'fas fa-flask'
    }
    return icons[serviceType] || 'fas fa-medical-cross'
  }, [])

  /**
   * Obtiene el nombre del servicio
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getServiceName = useCallback((serviceType) => {
    const names = {
      EMERGENCIA: 'Emergencias',
      URGENCIA: 'Urgencias',
      MEDICO_DOMICILIO: 'Médico a Domicilio',
      TRASLADO_PROGRAMADO: 'Traslado Programado',
      ZONA_PROTEGIDA: 'Zona Protegida',
      ORIENTACION_TELEFONICA: 'Orientación Telefónica',
      EXAMENES_LABORATORIO: 'Exámenes de Laboratorio'
    }
    return names[serviceType] || serviceType
  }, [])

  /**
   * Obtiene la descripción del servicio
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getServiceDescription = useCallback((serviceType) => {
    const descriptions = {
      EMERGENCIA: 'Situaciones críticas 24/7',
      URGENCIA: 'Atención médica prioritaria',
      MEDICO_DOMICILIO: 'Consultas en tu hogar',
      TRASLADO_PROGRAMADO: 'Traslados médicos planificados',
      ZONA_PROTEGIDA: 'Emergencia/urgencia para terceros en tu dirección',
      ORIENTACION_TELEFONICA: 'Consultas telefónicas',
      EXAMENES_LABORATORIO: 'Análisis clínicos'
    }
    return descriptions[serviceType] || 'Servicio médico'
  }, [])

  /**
   * Obtiene el color del badge del plan
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getPlanBadgeColor = useCallback((type) => {
    const colors = {
      FAMILIAR: 'bg-green-100 text-green-800',
      CORPORATIVO: 'bg-purple-100 text-purple-800',
      EXTERNO: 'bg-blue-100 text-blue-800',
      ADMIN: 'bg-red-100 text-red-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }, [])

  /**
   * Calcula el estado de un límite con uso
   * ✅ Regla #6: Función compleja documentada
   * ✅ Regla #13: Optimizada con useCallback
   */
  const calculateLimitStatus = useCallback((limitData) => {
    if (typeof limitData !== 'object' || limitData.used === undefined) {
      return null
    }

    const percentage = Math.round((limitData.used / limitData.limit) * 100)
    const isNearLimit = percentage >= 80
    const isAtLimit = limitData.used >= limitData.limit

    return {
      percentage,
      isNearLimit,
      isAtLimit,
      used: limitData.used,
      limit: limitData.limit,
      status: isAtLimit ? 'exhausted' : isNearLimit ? 'warning' : 'normal'
    }
  }, [])

  /**
   * Calcula el estado para Plan Help (límite flexible)
   * ✅ Regla #6: Función compleja documentada
   * ✅ Regla #13: Optimizada con useCallback
   */
  const calculateFlexibleLimitStatus = useCallback((remaining, planInfo) => {
    const total = planInfo?.total_services || 12
    const used = total - remaining
    const percentage = Math.round((used / total) * 100)
    const isNearLimit = percentage >= 80
    const isAtLimit = remaining === 0

    return {
      percentage,
      isNearLimit,
      isAtLimit,
      used,
      total,
      remaining,
      status: isAtLimit ? 'exhausted' : isNearLimit ? 'warning' : 'normal'
    }
  }, [])

  /**
   * Obtiene los colores según el estado
   * ✅ Regla #13: Optimizado con useCallback
   */
  const getStatusColors = useCallback((status) => {
    const colorMap = {
      exhausted: {
        bg: 'bg-red-100',
        text: 'text-red-600',
        badge: 'bg-red-100 text-red-800',
        progress: 'bg-red-500'
      },
      warning: {
        bg: 'bg-yellow-100',
        text: 'text-yellow-600',
        badge: 'bg-yellow-100 text-yellow-800',
        progress: 'bg-yellow-500'
      },
      normal: {
        bg: 'bg-blue-100',
        text: 'text-blue-600',
        badge: 'bg-blue-100 text-blue-800',
        progress: 'bg-blue-500'
      },
      unlimited: {
        bg: 'bg-green-100',
        text: 'text-green-600',
        badge: 'bg-green-100 text-green-800',
        progress: 'bg-green-500'
      }
    }
    return colorMap[status] || colorMap.normal
  }, [])

  /**
   * Lista de beneficios del plan procesada
   * ✅ Regla #13: Optimizada con useMemo
   */
  const planBenefits = useMemo(() => {
    if (!planInfo?.benefits) return []

    const benefitsList = []
    const benefits = planInfo.benefits

    if (benefits.emergencias_ilimitadas) {
      benefitsList.push({
        key: 'emergencias_ilimitadas',
        text: 'Emergencias ilimitadas',
        icon: 'fas fa-check'
      })
    }
    if (benefits.orientacion_telefonica) {
      benefitsList.push({
        key: 'orientacion_telefonica',
        text: 'Orientación telefónica',
        icon: 'fas fa-check'
      })
    }
    if (benefits.zona_protegida) {
      benefitsList.push({
        key: 'zona_protegida',
        text: 'Zona protegida',
        icon: 'fas fa-check'
      })
    }
    if (benefits.seguro_accidentes) {
      benefitsList.push({
        key: 'seguro_accidentes',
        text: 'Seguro de accidentes',
        icon: 'fas fa-check'
      })
    }
    if (benefits.examenes_laboratorio) {
      benefitsList.push({
        key: 'examenes_laboratorio',
        text: 'Exámenes de laboratorio',
        icon: 'fas fa-check'
      })
    }

    return benefitsList
  }, [planInfo?.benefits])

  /**
   * Procesa los límites para el renderizado
   * ✅ Regla #13: Optimizado con useMemo
   */
  const processedLimits = useMemo(() => {
    if (!normalizedData.limits || !validationResult.isValid) return []

    return Object.entries(normalizedData.limits.general || {}).map(([serviceType, limitData]) => {
      const baseData = {
        serviceType,
        icon: getServiceIcon(serviceType),
        name: getServiceName(serviceType),
        description: getServiceDescription(serviceType)
      }

      if (typeof limitData === 'string') {
        // Casos especiales: ILIMITADO, FLEXIBLE, etc.
        return {
          ...baseData,
          type: 'unlimited',
          value: limitData,
          colors: getStatusColors('unlimited')
        }
      } else if (typeof limitData === 'object' && limitData.used !== undefined) {
        // Límites con uso actual
        const status = calculateLimitStatus(limitData)
        return {
          ...baseData,
          type: 'tracked',
          ...status,
          colors: getStatusColors(status.status)
        }
      } else if (typeof limitData === 'number') {
        // Plan Help - límite total flexible
        const status = calculateFlexibleLimitStatus(limitData, normalizedData.planInfo)
        return {
          ...baseData,
          type: 'flexible',
          ...status,
          colors: getStatusColors(status.status)
        }
      }

      return null
    }).filter(Boolean)
  }, [normalizedData.limits, validationResult.isValid, normalizedData.planInfo, getServiceIcon, getServiceName, getServiceDescription, calculateLimitStatus, calculateFlexibleLimitStatus, getStatusColors])

  /**
   * Obtiene estadísticas generales
   * ✅ Regla #13: Optimizado con useMemo
   */
  const statistics = useMemo(() => {
    const stats = {
      totalServices: processedLimits.length,
      exhaustedServices: 0,
      warningServices: 0,
      unlimitedServices: 0
    }

    processedLimits.forEach(limit => {
      if (limit.type === 'unlimited') {
        stats.unlimitedServices++
      } else if (limit.isAtLimit) {
        stats.exhaustedServices++
      } else if (limit.isNearLimit) {
        stats.warningServices++
      }
    })

    return stats
  }, [processedLimits])

  return {
    // Estados de validación
    isValid: validationResult.isValid,
    errors: validationResult.errors || {},

    // Datos procesados
    processedLimits,
    planBenefits,
    statistics,

    // Funciones auxiliares
    getServiceIcon,
    getServiceName,
    getServiceDescription,
    getPlanBadgeColor,
    getStatusColors,
    calculateLimitStatus,
    calculateFlexibleLimitStatus
  }
}

export default useLimitsCard