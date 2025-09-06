import { useMemo } from 'react'
import { getAffiliatesStats } from '../utils/affiliateHelpers'
import { LABELS } from '../config/labels'

/**
 * Hook que maneja TODA la lógica de la lista de afiliados
 * El componente será un template puro sin decisiones
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Array} affiliates - Lista de afiliados
 * @param {Function} onEdit - Callback para editar
 * @param {Function} onDelete - Callback para eliminar
 * @param {Function} onToggleStatus - Callback para cambiar estado
 * @param {Function} onAddFirst - Callback para agregar primer afiliado
 * @returns {Object} Todo lo necesario para renderizar la UI
 */
export const useAffiliatesList = (affiliates, onEdit, onDelete, onToggleStatus, onAddFirst) => {
  // ============================================
  // VALIDACIONES Y VALORES POR DEFECTO
  // ============================================

  /**
   * Asegurar que affiliates sea un array válido
   */
  const safeAffiliates = useMemo(() => {
    return Array.isArray(affiliates) ? affiliates : []
  }, [affiliates])

  /**
   * Determinar si la lista está vacía
   */
  const isEmpty = useMemo(() => {
    return safeAffiliates.length === 0
  }, [safeAffiliates])

  // ============================================
  // ESTADO VACÍO
  // ============================================

  /**
   * Configuración para cuando no hay afiliados
   */
  const emptyState = useMemo(
    () => ({
      icon: LABELS.admin.affiliates.list.empty.icon,
      title: LABELS.admin.affiliates.list.empty.title,
      description: LABELS.admin.affiliates.list.empty.description,
      button: {
        text: LABELS.admin.affiliates.list.empty.addButton,
        icon: '➕',
        onClick: onAddFirst,
        className:
          'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2'
      }
    }),
    [onAddFirst]
  )

  // ============================================
  // ENCABEZADO
  // ============================================

  /**
   * Información del encabezado de la lista
   */
  const headerInfo = useMemo(
    () => ({
      title: `${LABELS.admin.affiliates.list.title} (${safeAffiliates.length})`,
      subtitle: LABELS.admin.affiliates.list.subtitle,
      visible: !isEmpty
    }),
    [safeAffiliates.length, isEmpty]
  )

  // ============================================
  // ESTADÍSTICAS
  // ============================================

  /**
   * Estadísticas calculadas de los afiliados
   */
  const stats = useMemo(() => {
    const calculatedStats = getAffiliatesStats(safeAffiliates)

    return {
      visible: !isEmpty,
      title: LABELS.admin.affiliates.list.stats.title,
      items: [
        {
          id: 'total',
          label: LABELS.admin.affiliates.list.stats.total,
          value: calculatedStats.total,
          colorClass: 'text-blue-600',
          bgClass: 'bg-white'
        },
        {
          id: 'active',
          label: LABELS.admin.affiliates.list.stats.active,
          value: calculatedStats.active,
          colorClass: 'text-green-600',
          bgClass: 'bg-white'
        },
        {
          id: 'inactive',
          label: LABELS.admin.affiliates.list.stats.inactive,
          value: calculatedStats.inactive,
          colorClass: 'text-red-600',
          bgClass: 'bg-white'
        }
      ]
    }
  }, [safeAffiliates, isEmpty])

  // ============================================
  // CONFIGURACIÓN DE GRID
  // ============================================

  /**
   * Configuración para el grid de tarjetas
   */
  const gridConfig = useMemo(
    () => ({
      className: 'grid grid-cols-1 md:grid-cols-2 gap-4',
      visible: !isEmpty
    }),
    [isEmpty]
  )

  // ============================================
  // CLASES CSS
  // ============================================

  /**
   * Todas las clases CSS organizadas
   */
  const classes = useMemo(
    () => ({
      container: 'space-y-4',
      emptyState: {
        container: 'text-center py-12',
        icon: 'text-6xl mb-4',
        title: 'text-lg font-semibold text-gray-800 mb-2',
        description: 'text-gray-600 mb-6',
        buttonIcon: 'span',
        buttonText: 'span'
      },
      header: {
        wrapper: 'flex items-center justify-between',
        leftSection: 'div',
        title: 'text-lg font-semibold text-gray-800',
        subtitle: 'text-sm text-gray-600'
      },
      stats: {
        wrapper: 'mt-6 bg-gray-50 rounded-lg p-4',
        title: 'text-sm font-medium text-gray-700 mb-3',
        grid: 'grid grid-cols-3 gap-4 text-center',
        item: {
          container: 'bg-white rounded-lg p-3',
          value: 'text-2xl font-bold',
          label: 'text-xs text-gray-600'
        }
      }
    }),
    []
  )

  // ============================================
  // PROPS PARA TARJETAS
  // ============================================

  /**
   * Props preparadas para cada tarjeta de afiliado
   */
  const affiliateCards = useMemo(() => {
    return safeAffiliates.map((affiliate) => ({
      key: affiliate.id,
      affiliate,
      onEdit,
      onDelete,
      onToggleStatus
    }))
  }, [safeAffiliates, onEdit, onDelete, onToggleStatus])

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Estado
    isEmpty,

    // Configuraciones
    emptyState,
    header: headerInfo,
    stats,
    gridConfig,

    // Datos
    affiliateCards,

    // Estilos
    classes
  }
}
