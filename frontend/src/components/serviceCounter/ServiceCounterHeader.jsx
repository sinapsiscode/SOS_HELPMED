import PropTypes from 'prop-types'

/**
 * Header del contador de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceCounterHeader = ({ periodLabel }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-800">Uso de Servicios</h2>
    <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
      Período {periodLabel}
    </span>
  </div>
)

ServiceCounterHeader.propTypes = {
  periodLabel: PropTypes.string.isRequired
}

export default ServiceCounterHeader