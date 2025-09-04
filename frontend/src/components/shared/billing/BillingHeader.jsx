import PropTypes from 'prop-types'

/**
 * Encabezado del componente de facturación
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const BillingHeader = ({ hasAutoRenewal }) => (
  <div className="flex items-center justify-between mb-6">
    <h2 className="text-xl font-bold text-gray-800">Información de Facturación</h2>
    <span
      className={`px-3 py-1 rounded-full text-sm font-medium ${
        hasAutoRenewal ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
      }`}
    >
      {hasAutoRenewal ? 'Auto-renovación' : 'Renovación Manual'}
    </span>
  </div>
)

BillingHeader.propTypes = {
  hasAutoRenewal: PropTypes.bool.isRequired
}

export default BillingHeader