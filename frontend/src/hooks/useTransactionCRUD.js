import { useState, useCallback } from 'react'
import Swal from 'sweetalert2'

/**
 * Hook especializado para operaciones CRUD de transacciones
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Transaction CRUD operations
 * ✅ Manejo de errores incluido
 */
const useTransactionCRUD = (registerManualTransaction, updateTransaction, deleteTransaction) => {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const handleAddTransaction = useCallback(
    async (transactionData) => {
      try {
        setLoading(true)
        setError(null)

        const newTransaction = {
          ...transactionData,
          id: Date.now().toString(),
          date: new Date().toISOString(),
          status: 'COMPLETED'
        }

        await registerManualTransaction(newTransaction)

        await Swal.fire({
          title: 'Transacción Registrada',
          text: 'La transacción ha sido registrada exitosamente',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        })

        return { success: true }
      } catch (error) {
        console.error('Error registrando transacción:', error)
        setError('Error al registrar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo registrar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    [registerManualTransaction]
  )

  const handleEditTransaction = useCallback(
    async (editingTransaction, transactionData) => {
      try {
        setLoading(true)
        setError(null)

        await updateTransaction(editingTransaction.id, transactionData)

        await Swal.fire({
          title: 'Transacción Actualizada',
          text: 'La transacción ha sido actualizada exitosamente',
          icon: 'success',
          confirmButtonColor: '#1976d2'
        })

        return { success: true }
      } catch (error) {
        console.error('Error actualizando transacción:', error)
        setError('Error al actualizar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo actualizar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    [updateTransaction]
  )

  const handleDeleteTransaction = useCallback(
    async (transactionId) => {
      try {
        const result = await Swal.fire({
          title: '¿Estás seguro?',
          text: 'Esta acción no se puede deshacer',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#DC2626',
          cancelButtonColor: '#6B7280',
          confirmButtonText: 'Sí, eliminar',
          cancelButtonText: 'Cancelar'
        })

        if (result.isConfirmed) {
          setLoading(true)
          await deleteTransaction(transactionId)

          await Swal.fire({
            title: 'Eliminado',
            text: 'La transacción ha sido eliminada',
            icon: 'success',
            confirmButtonColor: '#1976d2'
          })

          return { success: true }
        }

        return { success: false, cancelled: true }
      } catch (error) {
        console.error('Error eliminando transacción:', error)
        setError('Error al eliminar la transacción: ' + error.message)

        await Swal.fire({
          title: 'Error',
          text: 'No se pudo eliminar la transacción. Intenta nuevamente.',
          icon: 'error',
          confirmButtonColor: '#DC2626'
        })

        return { success: false, error }
      } finally {
        setLoading(false)
      }
    },
    [deleteTransaction]
  )

  return {
    loading,
    error,
    handleAddTransaction,
    handleEditTransaction,
    handleDeleteTransaction,
    clearError: () => setError(null)
  }
}

export default useTransactionCRUD