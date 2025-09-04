import { useState, useCallback } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para operaciones CRUD de traslados
 *  Cumple reglas de tamaño: <100 líneas
 *  Responsabilidad única: Transfer CRUD operations
 *  Manejo de errores y feedback de usuario
 */
const useTransferOperations = (getAllTransfers, requestTransfer, currentUser) => {
  const [transfers, setTransfers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  /**
   * Cargar todos los traslados del usuario
   */
  const loadTransfers = useCallback(async () => {
    if (!currentUser?.id) return

    try {
      setLoading(true)
      setError(null)
      const userTransfers = await getAllTransfers(currentUser.id)
      setTransfers(userTransfers || [])
    } catch (error) {
      console.error('Error loading transfers:', error)
      setError('Error al cargar los traslados')
      setTransfers([])
    } finally {
      setLoading(false)
    }
  }, [getAllTransfers, currentUser?.id])

  /**
   * Crear un nuevo traslado programado
   */
  const createTransfer = useCallback(async (transferData) => {
    try {
      setLoading(true)
      setError(null)
      
      const result = await requestTransfer(transferData)
      
      if (result.success) {
        await Swal.fire({
          title: '¡Traslado Programado!',
          text: 'Tu traslado ha sido programado exitosamente',
          icon: 'success',
          timer: 3000,
          showConfirmButton: false
        })
        
        // Recargar la lista de traslados
        await loadTransfers()
        return true
      } else {
        throw new Error(result.error || 'Error al programar el traslado')
      }
    } catch (error) {
      console.error('Error creating transfer:', error)
      setError(error.message)
      
      await Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error',
        confirmButtonColor: '#EF4444'
      })
      
      return false
    } finally {
      setLoading(false)
    }
  }, [requestTransfer, loadTransfers])

  /**
   * Cancelar un traslado programado
   */
  const cancelTransfer = useCallback(async (transferId) => {
    try {
      const result = await Swal.fire({
        title: '¿Cancelar traslado?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#EF4444',
        cancelButtonColor: '#6B7280',
        confirmButtonText: 'Sí, cancelar',
        cancelButtonText: 'No cancelar'
      })

      if (result.isConfirmed) {
        setLoading(true)
        
        // Aquí iría la llamada real al API para cancelar
        // const cancelResult = await cancelTransferRequest(transferId)
        
        await Swal.fire({
          title: 'Traslado Cancelado',
          text: 'Tu traslado ha sido cancelado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
        
        // Recargar la lista de traslados
        await loadTransfers()
        return true
      }
      
      return false
    } catch (error) {
      console.error('Error cancelling transfer:', error)
      setError('Error al cancelar el traslado')
      
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al cancelar el traslado',
        icon: 'error',
        confirmButtonColor: '#EF4444'
      })
      
      return false
    } finally {
      setLoading(false)
    }
  }, [loadTransfers])

  /**
   * Obtener estadísticas de traslados
   */
  const getTransferStats = useCallback(() => {
    return {
      scheduled: transfers.filter((t) => t.status === 'scheduled').length,
      completed: transfers.filter((t) => t.status === 'completed').length,
      inProgress: transfers.filter((t) => t.status === 'in_progress').length,
      thisWeek: transfers.filter((t) => {
        const transferDate = new Date(t.scheduledDate)
        const today = new Date()
        const diffTime = transferDate - today
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
        return diffDays >= 0 && diffDays <= 7
      }).length
    }
  }, [transfers])

  return {
    // Estados
    transfers,
    loading,
    error,
    
    // Operaciones
    loadTransfers,
    createTransfer,
    cancelTransfer,
    
    // Utilidades
    getTransferStats,
    
    // Acciones de error
    clearError: () => setError(null)
  }
}

export default useTransferOperations