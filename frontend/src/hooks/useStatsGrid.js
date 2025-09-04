import { useMemo } from 'react'
import { STATS_COLOR_CLASSES, STATS_COLORS } from '../constants/adminDashboard'

/**
 * Hook que maneja TODA la lógica del grid de estadísticas
 * El componente NO tomará ninguna decisión, solo mostrará lo que este hook provee
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Array} stats - Array de estadísticas a mostrar
 * @returns {Object} Todo lo necesario para el componente UI
 */
export const useStatsGrid = (stats) => {
  // ============================================
  // VALIDACIÓN DE DATOS
  // ============================================

  /**
   * Asegurar que stats sea un array válido
   */
  const safeStats = useMemo(() => {
    return Array.isArray(stats) ? stats : []
  }, [stats])

  // ============================================
  // FUNCIONES DE PROCESAMIENTO
  // ============================================

  /**
   * Obtiene las clases de color para una estadística
   * Toda la lógica de decisión está aquí, no en el componente
   *
   * @param {string} color - Color de la estadística
   * @returns {string} Clases CSS para el color
   */
  const getColorClasses = (color) => {
    return STATS_COLOR_CLASSES[color] || STATS_COLOR_CLASSES[STATS_COLORS.GRAY]
  }

  /**
   * Formatea un valor para mostrar
   * Aplica formato de miles con separadores
   *
   * @param {number|string} value - Valor a formatear
   * @returns {string} Valor formateado
   */
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return value.toLocaleString('es-CL')
    }
    return String(value)
  }

  // ============================================
  // PROCESAMIENTO DE ESTADÍSTICAS
  // ============================================

  /**
   * Procesa cada estadística agregando toda la información necesaria
   * El componente recibe todo listo para renderizar
   */
  const processedStats = useMemo(() => {
    return safeStats.map((stat, index) => ({
      // Identificador único
      key: stat.id || `stat-${index}`,

      // Contenido
      title: {
        text: stat.title || 'Sin título',
        className: 'text-sm font-medium opacity-80'
      },

      value: {
        text: formatValue(stat.value || 0),
        className: 'text-3xl font-bold mt-1'
      },

      subtitle: {
        text: stat.subtitle || '',
        visible: Boolean(stat.subtitle),
        className: 'text-xs opacity-70 mt-1'
      },

      icon: {
        content: stat.icon || '📊',
        className: 'text-3xl opacity-70'
      },

      // Estilo del contenedor
      containerClasses: `
        p-6 rounded-lg border-2 transition-all duration-200 hover:shadow-md
        ${getColorClasses(stat.color)}
      `.trim(),

      // Layout
      layout: {
        wrapper: 'flex items-center justify-between',
        contentSection: 'div',
        iconSection: 'div'
      }
    }))
  }, [safeStats])

  // ============================================
  // CONFIGURACIÓN DE ESTILOS
  // ============================================

  /**
   * Clases CSS para el grid principal
   */
  const gridClassName = useMemo(() => {
    return 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6'
  }, [])

  // ============================================
  // CONFIGURACIÓN DE GRID
  // ============================================

  /**
   * Configuración del grid responsivo
   */
  const gridConfig = useMemo(
    () => ({
      className: gridClassName,
      columns: {
        mobile: 1,
        tablet: 2,
        desktop: 4
      },
      gap: 6,
      isEmpty: processedStats.length === 0
    }),
    [gridClassName, processedStats.length]
  )

  // ============================================
  // ESTADO VACÍO
  // ============================================

  /**
   * Configuración para cuando no hay estadísticas
   */
  const emptyState = useMemo(
    () => ({
      visible: processedStats.length === 0,
      message: 'No hay estadísticas disponibles',
      className: 'text-center py-8 text-gray-500'
    }),
    [processedStats.length]
  )

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Configuración del grid
    grid: gridConfig,

    // Estadísticas procesadas
    stats: processedStats,

    // Estado vacío
    emptyState,

    // Helpers
    hasStats: processedStats.length > 0
  }
}
