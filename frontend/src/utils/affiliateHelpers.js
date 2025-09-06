/**
 * Funciones utilitarias para el manejo de afiliados
 * Separa la lógica de los componentes siguiendo Regla #2
 */

import {
  AFFILIATE_STATUS_CLASSES,
  AFFILIATE_STATUS_LABELS,
  AFFILIATE_STATUSES,
  RELATIONSHIP_LABELS
} from '../constants/affiliateConstants'
import { LABELS } from '../config/labels'

/**
 * Calcula la edad basada en la fecha de nacimiento
 *
 * @param {string} birthDate - Fecha de nacimiento en formato ISO
 * @returns {number|null} Edad calculada o null si no hay fecha
 *
 * @example
 * const age = calculateAge('1990-05-15')
 * // Returns: 34 (si estamos en 2024)
 */
export const calculateAge = (birthDate) => {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)

  // Validar fecha válida
  if (isNaN(birth.getTime())) return null

  let age = today.getFullYear() - birth.getFullYear()
  const monthDiff = today.getMonth() - birth.getMonth()

  // Ajustar edad si el cumpleaños no ha ocurrido este año
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
    age = age - 1
  }

  // Validar edad razonable
  if (age < 0 || age > 150) return null

  return age
}

/**
 * Formatea la edad para mostrar en UI
 *
 * @param {string} birthDate - Fecha de nacimiento
 * @returns {string} Edad formateada o mensaje por defecto
 */
export const formatAge = (birthDate) => {
  const age = calculateAge(birthDate)

  if (age === null) {
    return LABELS.admin.affiliates.card.notSpecifiedFemale
  }

  return `${age} ${LABELS.admin.affiliates.card.years}`
}

/**
 * Obtiene el texto de relación familiar formateado
 *
 * @param {string} relationship - Código de relación
 * @returns {string} Texto formateado de la relación
 */
export const getRelationshipText = (relationship) => {
  return RELATIONSHIP_LABELS[relationship] || LABELS.admin.affiliates.card.notSpecified
}

/**
 * Obtiene las clases CSS para el estado del afiliado
 *
 * @param {string} status - Estado del afiliado
 * @returns {string} Clases CSS para aplicar al elemento
 */
export const getStatusColor = (status) => {
  return AFFILIATE_STATUS_CLASSES[status] || AFFILIATE_STATUS_CLASSES[AFFILIATE_STATUSES.INACTIVE]
}

/**
 * Obtiene el texto del estado formateado
 *
 * @param {string} status - Estado del afiliado
 * @returns {string} Texto formateado del estado
 */
export const getStatusText = (status) => {
  return AFFILIATE_STATUS_LABELS[status] || AFFILIATE_STATUS_LABELS[AFFILIATE_STATUSES.INACTIVE]
}

/**
 * Formatea una fecha para mostrar en UI
 *
 * @param {string|Date} date - Fecha a formatear
 * @param {Object} options - Opciones de formato
 * @returns {string} Fecha formateada
 */
export const formatDate = (date, options = {}) => {
  if (!date) return LABELS.admin.affiliates.card.notSpecifiedFemale

  try {
    const dateObj = date instanceof Date ? date : new Date(date)

    if (isNaN(dateObj.getTime())) {
      return LABELS.admin.affiliates.card.invalidDate
    }

    return dateObj.toLocaleDateString('es-CL', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    })
  } catch (error) {
    return LABELS.admin.affiliates.card.invalidDate
  }
}

/**
 * Valida si un afiliado puede ser activado según reglas de negocio
 *
 * @param {Object} affiliate - Datos del afiliado
 * @param {number} maxAffiliates - Máximo de afiliados permitidos
 * @param {number} currentActiveCount - Cantidad actual de afiliados activos
 * @returns {Object} Resultado de validación {canActivate: boolean, reason?: string}
 */
export const validateAffiliateActivation = (affiliate, maxAffiliates, currentActiveCount) => {
  // Ya está activo
  if (affiliate.status === AFFILIATE_STATUSES.ACTIVE) {
    return {
      canActivate: false,
      reason: LABELS.admin.affiliates.messages.alreadyActive
    }
  }

  // Verificar límite de afiliados
  if (currentActiveCount >= maxAffiliates) {
    return {
      canActivate: false,
      reason: LABELS.admin.affiliates.messages.limitReached
    }
  }

  // Verificar datos completos
  if (!affiliate.dni || !affiliate.name) {
    return {
      canActivate: false,
      reason: LABELS.admin.affiliates.messages.incompleteData
    }
  }

  return {
    canActivate: true
  }
}

/**
 * Obtiene estadísticas de los afiliados
 *
 * @param {Array} affiliates - Lista de afiliados
 * @returns {Object} Estadísticas calculadas
 */
export const getAffiliatesStats = (affiliates) => {
  if (!Array.isArray(affiliates)) {
    return {
      total: 0,
      active: 0,
      inactive: 0,
      averageAge: null,
      relationships: {}
    }
  }

  const stats = {
    total: affiliates.length,
    active: 0,
    inactive: 0,
    ages: [],
    relationships: {}
  }

  affiliates.forEach((affiliate) => {
    // Contar por estado
    if (affiliate.status === AFFILIATE_STATUSES.ACTIVE) {
      stats.active++
    } else {
      stats.inactive++
    }

    // Recolectar edades
    const age = calculateAge(affiliate.birthDate)
    if (age !== null) {
      stats.ages.push(age)
    }

    // Contar relaciones
    const relationship = affiliate.relationship || 'otro'
    stats.relationships[relationship] = (stats.relationships[relationship] || 0) + 1
  })

  // Calcular edad promedio
  const averageAge =
    stats.ages.length > 0
      ? Math.round(stats.ages.reduce((a, b) => a + b, 0) / stats.ages.length)
      : null

  return {
    total: stats.total,
    active: stats.active,
    inactive: stats.inactive,
    averageAge,
    relationships: stats.relationships
  }
}
