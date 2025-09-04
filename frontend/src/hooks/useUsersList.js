import { useMemo, useCallback } from 'react'
import { USER_STATUSES, USER_STATUS_LABELS, USER_STATUS_CLASSES } from '../constants/adminDashboard'

/**
 * Hook que maneja la LÓGICA DE NEGOCIO de la lista de usuarios
 * ENFOQUE BALANCEADO: Solo transformaciones de datos y lógica compleja
 * Las clases CSS estáticas viven en el componente
 *
 * @param {Array} users - Lista de usuarios
 * @param {Function} onUpdate - Callback para actualizar usuario
 * @param {Function} onDelete - Callback para eliminar usuario
 * @returns {Object} Datos procesados y manejadores
 */
export const useUsersList = (users, onUpdate, onDelete) => {
  // ============================================
  // VALIDACIÓN DE DATOS
  // ============================================

  /**
   * Asegurar que users sea un array válido
   */
  const safeUsers = useMemo(() => {
    return Array.isArray(users) ? users : []
  }, [users])

  /**
   * Determinar si la lista está vacía
   */
  const isEmpty = useMemo(() => {
    return safeUsers.length === 0
  }, [safeUsers])

  // ============================================
  // PROCESAMIENTO DE USUARIOS (Lógica de negocio)
  // ============================================

  /**
   * Procesa los datos del usuario
   * Solo transformaciones de datos, no clases CSS estáticas
   */
  const processedUsers = useMemo(() => {
    return safeUsers.map((user) => {
      // Lógica de negocio: calcular inicial
      const initial = user.name ? user.name.charAt(0).toUpperCase() : '?'

      // Lógica de negocio: determinar estado
      const isActive = user.status === USER_STATUSES.ACTIVE
      const toggleButtonText = isActive ? 'Desactivar' : 'Activar'
      const newStatus = isActive ? USER_STATUSES.INACTIVE : USER_STATUSES.ACTIVE

      // Lógica de negocio: obtener etiqueta y clases dinámicas del estado
      const statusLabel =
        USER_STATUS_LABELS[user.status] || USER_STATUS_LABELS[USER_STATUSES.INACTIVE]
      const statusClasses = `inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
        USER_STATUS_CLASSES[user.status] || USER_STATUS_CLASSES[USER_STATUSES.INACTIVE]
      }`

      // Lógica de negocio: formatear fecha
      const formattedDate = user.createdAt
        ? new Date(user.createdAt).toLocaleDateString('es-CL')
        : 'Sin fecha'

      return {
        id: user.id,
        // Datos procesados (sin clases estáticas)
        initial,
        name: user.name || 'Sin nombre',
        email: user.email || 'Sin email',
        role: user.role || 'Sin rol',
        plan: user.plan || 'Sin plan',
        statusLabel,
        statusClasses, // Solo clases dinámicas basadas en estado
        formattedDate,
        toggleButtonText,
        newStatus
      }
    })
  }, [safeUsers])

  // ============================================
  // MANEJADORES DE EVENTOS (Lógica de negocio)
  // ============================================

  /**
   * Manejador para cambiar el estado de un usuario
   */
  const handleStatusToggle = useCallback(
    async (userId, newStatus) => {
      await onUpdate(userId, { status: newStatus })
    },
    [onUpdate]
  )

  /**
   * Manejador para eliminar un usuario con confirmación
   */
  const handleDelete = useCallback(
    async (user) => {
      const confirmMessage = `¿Estás seguro de eliminar al usuario ${user.name}?`
      if (window.confirm(confirmMessage)) {
        await onDelete(user.id)
      }
    },
    [onDelete]
  )

  // NOTA: En el enfoque balanceado, NO incluimos:
  // - Clases CSS estáticas (van en el componente)
  // - Configuración de layout estática
  // - Encabezados de tabla estáticos

  // ============================================
  // RETORNO - Solo lógica y datos procesados
  // ============================================

  return {
    // Datos procesados
    processedUsers,
    isEmpty,

    // Manejadores
    handleStatusToggle,
    handleDelete
  }
}
