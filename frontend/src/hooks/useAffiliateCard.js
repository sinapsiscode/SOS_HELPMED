import { useCallback, useMemo } from 'react'
import { AFFILIATE_STATUSES } from '../constants/affiliateConstants'
import {
  formatAge,
  getRelationshipText,
  getStatusColor,
  getStatusText,
  formatDate
} from '../utils/affiliateHelpers'
import { LABELS } from '../config/labels'

/**
 * Hook que maneja TODA la lógica de la tarjeta de afiliado
 * El componente será un template puro sin decisiones
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} affiliate - Datos del afiliado
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onToggleStatus - Callback para cambiar estado
 * @returns {Object} Todo lo necesario para renderizar la UI
 */
export const useAffiliateCard = (affiliate, onEdit, onDelete, onToggleStatus) => {
  // ============================================
  // VALORES CALCULADOS
  // ============================================

  /**
   * Información del encabezado de la tarjeta
   */
  const headerInfo = useMemo(
    () => ({
      name: affiliate.name || LABELS.admin.affiliates.card.noName,
      relationship: getRelationshipText(affiliate.relationship),
      avatarIcon: '👤',
      statusBadge: {
        text: getStatusText(affiliate.status),
        className: `px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(affiliate.status)}`
      }
    }),
    [affiliate.name, affiliate.relationship, affiliate.status]
  )

  /**
   * Filas de información detallada
   * Solo las que tienen valor se mostrarán
   */
  const infoRows = useMemo(() => {
    const rows = []

    // DNI siempre se muestra
    rows.push({
      id: 'dni',
      label: LABELS.admin.affiliates.card.labels.dni,
      value: affiliate.dni || LABELS.admin.affiliates.card.notSpecified,
      visible: true
    })

    // Teléfono solo si existe
    if (affiliate.phone) {
      rows.push({
        id: 'phone',
        label: LABELS.admin.affiliates.card.labels.phone,
        value: affiliate.phone,
        visible: true
      })
    }

    // Edad
    rows.push({
      id: 'age',
      label: LABELS.admin.affiliates.card.labels.age,
      value: formatAge(affiliate.birthDate),
      visible: true
    })

    // Fecha de agregado
    rows.push({
      id: 'addedAt',
      label: LABELS.admin.affiliates.card.labels.added,
      value: formatDate(affiliate.addedAt),
      visible: true
    })

    return rows
  }, [affiliate.dni, affiliate.phone, affiliate.birthDate, affiliate.addedAt])

  /**
   * Configuración del botón de cambio de estado
   */
  const toggleButton = useMemo(() => {
    const isActive = affiliate.status === AFFILIATE_STATUSES.ACTIVE

    return {
      text: isActive ? LABELS.admin.affiliates.card.actions.deactivate : LABELS.admin.affiliates.card.actions.activate,
      className: isActive
        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
        : 'bg-green-100 text-green-800 hover:bg-green-200',
      title: isActive ? LABELS.admin.affiliates.card.actions.deactivateTitle : LABELS.admin.affiliates.card.actions.activateTitle
    }
  }, [affiliate.status])

  /**
   * Configuración del botón de editar
   */
  const editButton = useMemo(
    () => ({
      text: LABELS.admin.affiliates.card.actions.edit,
      className: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      title: LABELS.admin.affiliates.card.actions.editTitle
    }),
    []
  )

  /**
   * Configuración del botón de eliminar
   */
  const deleteButton = useMemo(
    () => ({
      text: LABELS.admin.affiliates.card.actions.delete,
      className: 'bg-red-100 text-red-800 hover:bg-red-200',
      title: LABELS.admin.affiliates.card.actions.deleteTitle
    }),
    []
  )

  // ============================================
  // MANEJADORES DE EVENTOS
  // ============================================

  /**
   * Manejador para editar
   * Memoizado para evitar re-renders
   */
  const handleEdit = useCallback(() => {
    onEdit(affiliate.id)
  }, [affiliate.id, onEdit])

  /**
   * Manejador para eliminar
   * Memoizado para evitar re-renders
   */
  const handleDelete = useCallback(() => {
    onDelete(affiliate.id)
  }, [affiliate.id, onDelete])

  /**
   * Manejador para cambiar estado
   * Memoizado para evitar re-renders
   */
  const handleToggleStatus = useCallback(() => {
    onToggleStatus(affiliate.id)
  }, [affiliate.id, onToggleStatus])

  // ============================================
  // ESTILOS Y CLASES
  // ============================================

  /**
   * Clases CSS para la tarjeta
   */
  const cardClasses = useMemo(
    () => ({
      container: 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow',
      header: {
        wrapper: 'flex items-start justify-between mb-3',
        leftSection: 'flex items-center space-x-3',
        avatar: {
          container: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center',
          icon: 'text-blue-600 font-medium'
        },
        info: {
          name: 'font-semibold text-gray-800',
          relationship: 'text-sm text-gray-600'
        }
      },
      infoSection: {
        wrapper: 'space-y-2 mb-4 text-sm',
        row: {
          container: 'flex items-center justify-between',
          label: 'text-gray-600',
          value: 'font-medium text-gray-800'
        }
      },
      actions: {
        wrapper: 'flex space-x-2',
        button: 'flex-1 px-3 py-1 rounded text-xs font-medium transition-colors'
      }
    }),
    []
  )

  // ============================================
  // CONFIGURACIÓN DE ACCIONES
  // ============================================

  /**
   * Lista de botones de acción con toda su configuración
   */
  const actionButtons = useMemo(
    () => [
      {
        id: 'toggle',
        onClick: handleToggleStatus,
        ...toggleButton
      },
      {
        id: 'edit',
        onClick: handleEdit,
        ...editButton
      },
      {
        id: 'delete',
        onClick: handleDelete,
        ...deleteButton
      }
    ],
    [handleToggleStatus, handleEdit, handleDelete, toggleButton, editButton, deleteButton]
  )

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Datos formateados
    header: headerInfo,
    infoRows,

    // Acciones
    actions: actionButtons,

    // Estilos
    classes: cardClasses
  }
}
