import { useState, useEffect } from 'react'
import logger from '../utils/logger'
import { userSearchSchema } from '../schemas/userSchema'
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from '../constants/adminDashboard'

/**
 * Hook para manejar la gestión de usuarios en el dashboard de administrador
 * Incluye operaciones CRUD, filtrado y búsqueda de usuarios
 */
export const useAdminUsers = () => {
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  const fetchUsers = async () => {
    try {
      setLoading(true)
      setError(null)

      // Simular llamada a API
      await new Promise((resolve) => setTimeout(resolve, 800))

      const mockUsers = [
        {
          id: '1',
          name: 'Juan Pérez',
          email: 'juan@email.com',
          role: 'familiar',
          status: 'active',
          createdAt: '2024-01-15',
          plan: 'Básico'
        },
        {
          id: '2',
          name: 'María García',
          email: 'maria@email.com',
          role: 'corporate',
          status: 'active',
          createdAt: '2024-01-10',
          plan: 'Corporativo'
        },
        {
          id: '3',
          name: 'Carlos López',
          email: 'carlos@email.com',
          role: 'familiar',
          status: 'inactive',
          createdAt: '2024-01-08',
          plan: 'Premium'
        }
      ]

      setUsers(mockUsers)
      setFilteredUsers(mockUsers)
      logger.info('Users loaded successfully', { count: mockUsers.length })
    } catch (err) {
      const errorMessage = 'Error al cargar usuarios'
      setError(errorMessage)
      logger.error('Failed to load users', err, { context: 'useAdminUsers' })
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Filtrar por término de búsqueda
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filtrar por status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((user) => user.status === filterStatus)
    }

    setFilteredUsers(filtered)
  }

  const updateUser = async (userId, userData) => {
    try {
      setError(null)

      // Validar datos de entrada
      if (!userId) {
        throw new Error('ID de usuario es requerido')
      }

      if (!userData || typeof userData !== 'object') {
        throw new Error('Datos de usuario inválidos')
      }

      // Simular actualización
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers((prev) => prev.map((user) => (user.id === userId ? { ...user, ...userData } : user)))

      logger.info('User updated successfully', { userId, userData })
      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_UPDATED
      }
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.GENERIC
      setError(errorMessage)
      logger.error('Failed to update user', err, { userId, userData })
      return { success: false, error: errorMessage }
    }
  }

  const deleteUser = async (userId) => {
    try {
      setError(null)

      // Validar ID de usuario
      if (!userId) {
        throw new Error('ID de usuario es requerido')
      }

      // Verificar que el usuario existe
      const userExists = users.some((user) => user.id === userId)
      if (!userExists) {
        throw new Error('Usuario no encontrado')
      }

      // Simular eliminación
      await new Promise((resolve) => setTimeout(resolve, 500))

      setUsers((prev) => prev.filter((user) => user.id !== userId))

      logger.info('User deleted successfully', { userId })
      return {
        success: true,
        message: SUCCESS_MESSAGES.USER_DELETED
      }
    } catch (err) {
      const errorMessage = err.message || ERROR_MESSAGES.GENERIC
      setError(errorMessage)
      logger.error('Failed to delete user', err, { userId })
      return { success: false, error: errorMessage }
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchTerm, filterStatus])

  return {
    users: filteredUsers,
    loading,
    error,
    searchTerm,
    setSearchTerm,
    filterStatus,
    setFilterStatus,
    refreshUsers: fetchUsers,
    updateUser,
    deleteUser
  }
}
