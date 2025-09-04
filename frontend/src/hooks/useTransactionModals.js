import { useState, useCallback } from 'react'

/**
 * Hook especializado para control de modales de transacciones
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Modal management
 * ✅ Estados simples y claros
 */
const useTransactionModals = () => {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState(null)

  const openAddModal = useCallback(() => {
    setShowAddModal(true)
  }, [])

  const closeAddModal = useCallback(() => {
    setShowAddModal(false)
  }, [])

  const openEditModal = useCallback((transaction) => {
    setEditingTransaction(transaction)
  }, [])

  const closeEditModal = useCallback(() => {
    setEditingTransaction(null)
  }, [])

  return {
    showAddModal,
    editingTransaction,
    openAddModal,
    closeAddModal,
    openEditModal,
    closeEditModal
  }
}

export default useTransactionModals