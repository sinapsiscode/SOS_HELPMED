import { useState, useCallback } from 'react'
import Swal from 'sweetalert2'
import { INITIAL_PLANS_CONFIG, PLAN_VALIDATION } from '../mocks/planConfigurationData'
import { validatePlanData } from '../utils/planValidators'
import logger from '../utils/logger'

/**
 * Hook especializado para operaciones CRUD de planes
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: CRUD operations
 * ✅ Funciones extraídas a utils
 */
const usePlanCRUD = () => {
  const [plansConfig, setPlansConfig] = useState(INITIAL_PLANS_CONFIG)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // Crear nuevo plan
  const createPlan = useCallback(async (planData) => {
    try {
      setIsLoading(true)
      setError(null)

      const validation = validatePlanData(planData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const newPlan = {
        ...planData,
        id: `plan_${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        active: true
      }

      setPlansConfig(prev => ({
        ...prev,
        [planData.category]: {
          ...prev[planData.category],
          [newPlan.id]: newPlan
        }
      }))

      await Swal.fire({
        title: '¡Plan Creado!',
        text: `El plan "${planData.name}" ha sido creado exitosamente.`,
        icon: 'success',
        confirmButtonColor: '#1D44D1'
      })

      logger.info('Plan creado exitosamente', { planId: newPlan.id })
      return { success: true, planId: newPlan.id }

    } catch (error) {
      logger.error('Error creando plan', error)
      setError(error.message)
      
      await Swal.fire({
        title: 'Error',
        text: 'No se pudo crear el plan. ' + error.message,
        icon: 'error',
        confirmButtonColor: '#1D44D1'
      })

      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Actualizar plan existente
  const updatePlan = useCallback(async (planId, category, updateData) => {
    try {
      setIsLoading(true)
      setError(null)

      const validation = validatePlanData(updateData)
      if (!validation.isValid) {
        throw new Error(validation.errors.join(', '))
      }

      const updatedPlan = {
        ...updateData,
        updated_at: new Date().toISOString()
      }

      setPlansConfig(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [planId]: updatedPlan
        }
      }))

      logger.info('Plan actualizado exitosamente', { planId })
      return { success: true }

    } catch (error) {
      logger.error('Error actualizando plan', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Eliminar plan
  const deletePlan = useCallback(async (planId, category, planName) => {
    try {
      const result = await Swal.fire({
        title: '¿Eliminar Plan?',
        text: `¿Estás seguro de que deseas eliminar el plan "${planName}"?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        setPlansConfig(prev => {
          const newConfig = { ...prev }
          delete newConfig[category][planId]
          return newConfig
        })

        logger.info('Plan eliminado exitosamente', { planId })
        return { success: true }
      }

      return { success: false, cancelled: true }

    } catch (error) {
      logger.error('Error eliminando plan', error)
      setError(error.message)
      return { success: false, error: error.message }
    }
  }, [])

  // Duplicar plan
  const duplicatePlan = useCallback(async (planId, category) => {
    try {
      setIsLoading(true)
      setError(null)

      const planToDuplicate = plansConfig[category]?.[planId]
      if (!planToDuplicate) {
        throw new Error('Plan no encontrado para duplicar')
      }

      const newPlanId = `${planId}_copy_${Date.now()}`
      const duplicatedPlan = {
        ...planToDuplicate,
        name: `${planToDuplicate.name} - Copia`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }

      setPlansConfig(prev => ({
        ...prev,
        [category]: {
          ...prev[category],
          [newPlanId]: duplicatedPlan
        }
      }))

      logger.info('Plan duplicado exitosamente', { originalPlanId: planId, newPlanId })
      return { success: true, newPlanId }

    } catch (error) {
      logger.error('Error duplicando plan', error)
      setError(error.message)
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }, [plansConfig])

  const clearError = useCallback(() => {
    setError(null)
  }, [])

  return {
    // Estado
    plansConfig,
    isLoading,
    error,

    // Operaciones CRUD
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,
    clearError
  }
}

export default usePlanCRUD