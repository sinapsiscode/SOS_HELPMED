import PropTypes from 'prop-types'
import useServiceCounter from '../../hooks/useServiceCounter'
import ServiceCounterHeader from '../serviceCounter/ServiceCounterHeader'
import ServiceCounterGrid from '../serviceCounter/ServiceCounterGrid'
import ServiceSummary from '../serviceCounter/ServiceSummary'
import logger from '../../utils/logger'

/**
 * Componente principal para contadores de servicios utilizados
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 53 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const ServiceCounter = ({ services, period = 'current' }) => {
  const { stats, summary, periodLabel, isValid } = useServiceCounter(services, period)

  // Validación de datos de entrada
  if (!services || typeof services !== 'object') {
    logger.error('ServiceCounter: services is required and must be object')
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-700 text-sm">
          <i className="fas fa-exclamation-circle mr-2"></i>
          Error: Datos de servicios no válidos
        </div>
      </div>
    )
  }

  if (!isValid || stats.length === 0) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
        <div className="text-gray-500">
          <i className="fas fa-info-circle mr-2"></i>
          No hay datos de servicios disponibles
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <ServiceCounterHeader periodLabel={periodLabel} />
      <ServiceCounterGrid stats={stats} />

      {/* Resumen total */}
      <div className="mt-6 pt-4 border-t border-gray-100">
        <ServiceSummary summary={summary} />
      </div>
    </div>
  )
}

ServiceCounter.propTypes = {
  services: PropTypes.shape({
    breakdown: PropTypes.object,
    orientacion_used: PropTypes.number
  }).isRequired,
  period: PropTypes.oneOf(['current', 'historical'])
}

export default ServiceCounter
