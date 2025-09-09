import { useMemo } from 'react'

/**
 * Hook especializado para cálculos estadísticos de usuario externo
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Statistics calculation
 * ✅ Optimizado con useMemo
 */
const useExternalStats = (currentUser) => {
  // Validación del usuario externo
  const isValidExternalUser = useMemo(() => {
    return currentUser && currentUser.role === 'EXTERNO'
  }, [currentUser])

  // Determinación del tipo de caso
  const userCaseType = useMemo(() => {
    if (!currentUser) return null
    return {
      isCaso1: currentUser.plan.subtype === 'CASO_1',
      isCaso2: currentUser.plan.subtype === 'CASO_2'
    }
  }, [currentUser])

  // Estadísticas del usuario externo
  const externalStats = useMemo(() => {
    if (!currentUser) return null

    const totalUsed = currentUser.service_usage.services_used || currentUser.service_usage.individual_used || 0
    const individualRemaining = currentUser.service_usage.individual_remaining || 0
    const generalRemaining = currentUser.client_company?.general_services_remaining || 0
    const lastService = currentUser.service_usage.last_service

    return {
      totalUsed,
      individualRemaining,
      generalRemaining,
      lastServiceDate: lastService
        ? new Date(lastService).toLocaleDateString('es-CL')
        : 'Sin atenciones',
      hasRemainingServices: individualRemaining > 0,
      needsAdditionalCost: userCaseType.isCaso2 && individualRemaining <= 0,
      isUnlimited: userCaseType.isCaso1
    }
  }, [currentUser, userCaseType])

  // Límites para mostrar
  const displayLimits = useMemo(() => {
    if (!currentUser) return {}

    if (userCaseType.isCaso1) {
      return {
        EMERGENCIA: 'ILIMITADO',
        MEDICO_DOMICILIO: 'ILIMITADO'
      }
    } else {
      return {
        individual_remaining: currentUser.service_usage.individual_remaining,
        general_remaining: currentUser.client_company?.general_services_remaining || 0
      }
    }
  }, [currentUser, userCaseType])

  // Desglose de servicios usados
  const serviceBreakdown = useMemo(() => {
    if (!currentUser) return {}
    return currentUser.service_usage.breakdown || {}
  }, [currentUser])

  // Verificar si el servicio se puede usar
  const canUseService = useMemo(() => {
    return (serviceType) => {
      if (userCaseType?.isCaso1) return true

      // Para Caso 2, siempre se puede usar pero puede tener costo adicional
      return currentUser?.client_company?.general_services_remaining > 0
    }
  }, [userCaseType, currentUser])

  // Verificar si el servicio tiene costo adicional
  const hasAdditionalCost = useMemo(() => {
    return (serviceType) => {
      if (userCaseType?.isCaso1) return false

      // Si agotó sus servicios gratuitos individuales, tiene costo adicional
      return currentUser?.service_usage?.individual_remaining <= 0
    }
  }, [userCaseType, currentUser])

  return {
    // Estados calculados
    isValidExternalUser,
    userCaseType,
    externalStats,
    displayLimits,
    serviceBreakdown,
    
    // Funciones de verificación
    canUseService,
    hasAdditionalCost
  }
}

export default useExternalStats