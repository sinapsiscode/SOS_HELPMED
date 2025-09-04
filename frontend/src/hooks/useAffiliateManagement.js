import { useState, useCallback } from 'react'
import logger from '../utils/logger'
import { affiliateSchema } from '../schemas/affiliateSchema'
import {
  AFFILIATE_STATUSES,
  ERROR_MESSAGES,
  SUCCESS_MESSAGES
} from '../constants/affiliateConstants'

/**
 * Hook para gestionar afiliados de un plan familiar
 * Maneja operaciones CRUD, validaci\u00f3n y estado de afiliados
 *
 * @param {Object} initialUser - Usuario con datos iniciales de afiliados
 * @returns {Object} Estado y funciones para gestionar afiliados
 */
export const useAffiliateManagement = (initialUser) => {
  const [affiliates, setAffiliates] = useState(initialUser?.affiliates || [])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Agregar nuevo afiliado al listado
   * Valida datos y genera ID único
   */
  const addAffiliate = useCallback(
    async (affiliateData) => {
      try {
        setLoading(true)
        setError(null)

        // Validar datos con esquema
        await affiliateSchema.validate(affiliateData, { abortEarly: false })

        // Verificar duplicados por DNI
        const existingAffiliate = affiliates.find((a) => a.dni === affiliateData.dni)
        if (existingAffiliate) {
          throw new Error('Ya existe un afiliado con este DNI')
        }

        const newAffiliate = {
          id: `aff_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
          ...affiliateData,
          addedAt: new Date().toISOString(),
          status: AFFILIATE_STATUSES.ACTIVE
        }

        setAffiliates((prev) => [...prev, newAffiliate])

        logger.info('Affiliate added successfully', {
          affiliateId: newAffiliate.id,
          name: newAffiliate.name
        })

        return {
          success: true,
          data: newAffiliate,
          message: SUCCESS_MESSAGES.AFFILIATE_ADDED
        }
      } catch (err) {
        const errorMessage = err.message || ERROR_MESSAGES.GENERIC
        setError(errorMessage)
        logger.error('Failed to add affiliate', err, { affiliateData })

        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [affiliates]
  )

  /**
   * Actualizar datos de un afiliado existente
   */
  const updateAffiliate = useCallback(
    async (affiliateId, updateData) => {
      try {
        setLoading(true)
        setError(null)

        if (!affiliateId) {
          throw new Error('ID de afiliado es requerido')
        }

        // Verificar que el afiliado existe
        const affiliateExists = affiliates.some((a) => a.id === affiliateId)
        if (!affiliateExists) {
          throw new Error('Afiliado no encontrado')
        }

        // Validar datos de actualización
        await affiliateSchema.validate(updateData, { abortEarly: false })

        // Verificar duplicados de DNI (excluyendo el actual)
        if (updateData.dni) {
          const duplicateDni = affiliates.find(
            (a) => a.id !== affiliateId && a.dni === updateData.dni
          )
          if (duplicateDni) {
            throw new Error('Ya existe otro afiliado con este DNI')
          }
        }

        setAffiliates((prev) =>
          prev.map((a) =>
            a.id === affiliateId ? { ...a, ...updateData, updatedAt: new Date().toISOString() } : a
          )
        )

        logger.info('Affiliate updated successfully', { affiliateId, updateData })

        return {
          success: true,
          message: SUCCESS_MESSAGES.AFFILIATE_UPDATED
        }
      } catch (err) {
        const errorMessage = err.message || ERROR_MESSAGES.GENERIC
        setError(errorMessage)
        logger.error('Failed to update affiliate', err, { affiliateId, updateData })

        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [affiliates]
  )

  /**
   * Eliminar afiliado del listado
   */
  const removeAffiliate = useCallback(
    async (affiliateId) => {
      try {
        setLoading(true)
        setError(null)

        if (!affiliateId) {
          throw new Error('ID de afiliado es requerido')
        }

        const affiliate = affiliates.find((a) => a.id === affiliateId)
        if (!affiliate) {
          throw new Error('Afiliado no encontrado')
        }

        setAffiliates((prev) => prev.filter((a) => a.id !== affiliateId))

        logger.info('Affiliate removed successfully', {
          affiliateId,
          name: affiliate.name
        })

        return {
          success: true,
          message: SUCCESS_MESSAGES.AFFILIATE_DELETED
        }
      } catch (err) {
        const errorMessage = err.message || ERROR_MESSAGES.GENERIC
        setError(errorMessage)
        logger.error('Failed to remove affiliate', err, { affiliateId })

        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [affiliates]
  )

  /**
   * Cambiar estado de un afiliado (activo/inactivo)
   */
  const toggleAffiliateStatus = useCallback(
    async (affiliateId) => {
      try {
        setLoading(true)
        setError(null)

        const affiliate = affiliates.find((a) => a.id === affiliateId)
        if (!affiliate) {
          throw new Error('Afiliado no encontrado')
        }

        const newStatus =
          affiliate.status === AFFILIATE_STATUSES.ACTIVE
            ? AFFILIATE_STATUSES.INACTIVE
            : AFFILIATE_STATUSES.ACTIVE

        setAffiliates((prev) =>
          prev.map((a) =>
            a.id === affiliateId
              ? { ...a, status: newStatus, updatedAt: new Date().toISOString() }
              : a
          )
        )

        logger.info('Affiliate status toggled', {
          affiliateId,
          oldStatus: affiliate.status,
          newStatus
        })

        return {
          success: true,
          message: `Afiliado ${newStatus === AFFILIATE_STATUSES.ACTIVE ? 'activado' : 'desactivado'} correctamente`
        }
      } catch (err) {
        const errorMessage = err.message || ERROR_MESSAGES.GENERIC
        setError(errorMessage)
        logger.error('Failed to toggle affiliate status', err, { affiliateId })

        return {
          success: false,
          error: errorMessage
        }
      } finally {
        setLoading(false)
      }
    },
    [affiliates]
  )

  /**
   * Obtener afiliado por ID
   */
  const getAffiliateById = useCallback(
    (affiliateId) => {
      return affiliates.find((a) => a.id === affiliateId) || null
    },
    [affiliates]
  )

  /**
   * Obtener estadísticas de afiliados
   */
  const getAffiliateStats = useCallback(() => {
    const total = affiliates.length
    const active = affiliates.filter((a) => a.status === AFFILIATE_STATUSES.ACTIVE).length
    const inactive = affiliates.filter((a) => a.status === AFFILIATE_STATUSES.INACTIVE).length

    return {
      total,
      active,
      inactive,
      activePercentage: total > 0 ? Math.round((active / total) * 100) : 0
    }
  }, [affiliates])

  return {
    affiliates,
    loading,
    error,
    addAffiliate,
    updateAffiliate,
    removeAffiliate,
    toggleAffiliateStatus,
    getAffiliateById,
    getAffiliateStats,
    setError // Para limpiar errores manualmente
  }
}
