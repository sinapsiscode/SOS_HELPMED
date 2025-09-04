import { useCallback } from 'react'
import { useAffiliateManagement } from './useAffiliateManagement'
import { SUCCESS_MESSAGES } from '../constants/affiliateConstants'
import Swal from 'sweetalert2'

/**
 * Hook que maneja toda la lógica de negocio compleja para gestión de afiliados
 * ENFOQUE BALANCEADO: Concentra lógica de negocio, validaciones y notificaciones
 * Las clases CSS y estructura quedan en el componente
 *
 * @param {Object} user - Usuario actual con sus datos y afiliados
 * @param {Function} onSave - Callback para guardar cambios del usuario
 * @returns {Object} Handlers y estado para gestión de afiliados
 */
export const useAffiliateManagementLogic = (user, onSave) => {
  const {
    affiliates,
    loading,
    error,
    addAffiliate,
    updateAffiliate,
    removeAffiliate,
    toggleAffiliateStatus,
    getAffiliateById,
    setError
  } = useAffiliateManagement(user)

  /**
   * Maneja la adición de un nuevo afiliado con notificación
   * Incluye validación y feedback visual con SweetAlert2
   *
   * @param {Object} affiliateData - Datos del nuevo afiliado
   * @returns {Promise<Object>} Resultado de la operación
   */
  const handleAddAffiliate = useCallback(
    async (affiliateData) => {
      const result = await addAffiliate(affiliateData)

      if (result.success) {
        await Swal.fire({
          title: '¡Afiliado Agregado!',
          text: result.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }

      return result
    },
    [addAffiliate]
  )

  /**
   * Maneja la edición de un afiliado existente con notificación
   *
   * @param {string} affiliateId - ID del afiliado a editar
   * @param {Object} updateData - Datos actualizados
   * @returns {Promise<Object>} Resultado de la operación
   */
  const handleEditAffiliate = useCallback(
    async (affiliateId, updateData) => {
      const result = await updateAffiliate(affiliateId, updateData)

      if (result.success) {
        await Swal.fire({
          title: '¡Afiliado Actualizado!',
          text: result.message,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }

      return result
    },
    [updateAffiliate]
  )

  /**
   * Maneja la eliminación de un afiliado con confirmación
   * Muestra un modal de confirmación detallado antes de eliminar
   *
   * @param {string} affiliateId - ID del afiliado a eliminar
   * @returns {Promise<void>}
   */
  const handleDeleteAffiliate = useCallback(
    async (affiliateId) => {
      const affiliate = getAffiliateById(affiliateId)
      if (!affiliate) return

      const result = await Swal.fire({
        title: '¿Eliminar Afiliado?',
        html: `
        <div class="text-left">
          <p class="mb-3">¿Estás seguro de que deseas eliminar a:</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="font-medium text-red-800">${affiliate.name}</p>
            <p class="text-sm text-red-600">DNI: ${affiliate.dni}</p>
          </div>
          <p class="mt-3 text-sm text-gray-600">Esta acción no se puede deshacer.</p>
        </div>
      `,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#DC2626',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, Eliminar',
        cancelButtonText: 'Cancelar'
      })

      if (result.isConfirmed) {
        const deleteResult = await removeAffiliate(affiliateId)

        if (deleteResult.success) {
          await Swal.fire({
            title: 'Afiliado Eliminado',
            text: deleteResult.message,
            icon: 'success',
            timer: 2000,
            showConfirmButton: false
          })
        }
      }
    },
    [getAffiliateById, removeAffiliate]
  )

  /**
   * Maneja el cambio de estado con notificación tipo toast
   * Usa notificación no intrusiva para cambios de estado
   *
   * @param {string} affiliateId - ID del afiliado
   * @returns {Promise<Object>} Resultado de la operación
   */
  const handleToggleStatus = useCallback(
    async (affiliateId) => {
      const result = await toggleAffiliateStatus(affiliateId)

      if (result.success) {
        const Toast = Swal.mixin({
          toast: true,
          position: 'top-end',
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true
        })

        await Toast.fire({
          icon: 'success',
          title: result.message
        })
      }

      return result
    },
    [toggleAffiliateStatus]
  )

  /**
   * Guarda todos los cambios con actualización de timestamp
   * Actualiza el usuario completo y muestra confirmación
   */
  const handleSaveChanges = useCallback(() => {
    const updatedUser = {
      ...user,
      affiliates: affiliates,
      affiliatesCount: affiliates.length,
      updatedAt: new Date().toISOString()
    }

    onSave(updatedUser)

    Swal.fire({
      title: '¡Guardado!',
      text: SUCCESS_MESSAGES.CHANGES_SAVED,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }, [user, affiliates, onSave])

  /**
   * Limpia el error actual
   */
  const clearError = useCallback(() => {
    setError(null)
  }, [setError])

  return {
    // Estado
    affiliates,
    loading,
    error,

    // Handlers con lógica compleja
    handleAddAffiliate,
    handleEditAffiliate,
    handleDeleteAffiliate,
    handleToggleStatus,
    handleSaveChanges,

    // Utilidades
    clearError,
    getAffiliateById
  }
}
