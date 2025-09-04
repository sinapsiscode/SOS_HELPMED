import { useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import { calculateUnitStats, validateUnitsArray } from '../schemas/unitsSectionSchema'
import logger from '../utils/logger'

/**
 * Hook para lógica de sección de unidades médicas
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #4: Validación con esquema
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo
 */
const useUnitsSection = () => {
  const { availableUnits } = useAppStore()

  // Validar datos de unidades
  const validatedUnits = useMemo(() => {
    try {
      if (!availableUnits || !Array.isArray(availableUnits)) {
        logger.warn('useUnitsSection: availableUnits no es un array válido')
        return []
      }

      const validation = validateUnitsArray(availableUnits)
      if (!validation.isValid) {
        logger.error('useUnitsSection: Datos de unidades inválidos', validation.errors)
        // Filtrar solo las unidades válidas
        return availableUnits.filter(unit => {
          try {
            return unit && typeof unit === 'object' && unit.id && unit.status
          } catch {
            return false
          }
        })
      }

      return availableUnits
    } catch (error) {
      logger.error('Error validando unidades', error)
      return []
    }
  }, [availableUnits])

  // Calcular estadísticas de unidades
  const unitStats = useMemo(() => {
    try {
      return calculateUnitStats(validatedUnits)
    } catch (error) {
      logger.error('Error calculando estadísticas de unidades', error)
      return {
        available: 0,
        busy: 0,
        maintenance: 0,
        total: 0
      }
    }
  }, [validatedUnits])

  // Configuraciones de estado
  const getStatusConfig = (status) => {
    const configs = {
      available: {
        bg: 'bg-green-50 border-green-200',
        text: 'text-green-800',
        dot: 'bg-green-500',
        label: 'Disponible',
        icon: 'fas fa-check-circle',
        message: 'Lista para emergencias'
      },
      busy: {
        bg: 'bg-yellow-50 border-yellow-200',
        text: 'text-yellow-800',
        dot: 'bg-yellow-500',
        label: 'En Servicio',
        icon: 'fas fa-clock',
        message: 'Atendiendo emergencia'
      },
      maintenance: {
        bg: 'bg-red-50 border-red-200',
        text: 'text-red-800',
        dot: 'bg-red-500',
        label: 'Mantenimiento',
        icon: 'fas fa-wrench',
        message: 'En mantenimiento'
      }
    }

    return configs[status] || {
      bg: 'bg-gray-50 border-gray-200',
      text: 'text-gray-800',
      dot: 'bg-gray-500',
      label: status,
      icon: 'fas fa-question-circle',
      message: 'Estado desconocido'
    }
  }

  // Configuraciones de colores para stats cards
  const getStatsCardColor = (type) => {
    const colors = {
      available: 'green',
      busy: 'yellow',
      maintenance: 'red'
    }
    return colors[type] || 'gray'
  }

  // Datos para stats cards
  const statsCards = useMemo(() => [
    {
      icon: 'fas fa-ambulance',
      title: 'Disponibles',
      value: unitStats.available,
      color: getStatsCardColor('available'),
      type: 'available'
    },
    {
      icon: 'fas fa-clock',
      title: 'En Servicio',
      value: unitStats.busy,
      color: getStatsCardColor('busy'),
      type: 'busy'
    }
  ], [unitStats])

  return {
    // Datos
    units: validatedUnits,
    unitStats,
    statsCards,

    // Funciones utilitarias
    getStatusConfig,
    getStatsCardColor,

    // Estados computados
    hasUnits: validatedUnits.length > 0,
    isLoading: false // Podría ser útil para futuras implementaciones
  }
}

export default useUnitsSection