import PropTypes from 'prop-types'

/**
 * Tarjeta de próxima facturación (Familiar)
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const NextBillingCard = ({ nextBillingDate }) => (
  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
    <div className="flex items-center justify-between">
      <div>
        <div className="font-medium text-green-800">Próxima Facturación</div>
        <div className="text-sm text-green-600">{nextBillingDate}</div>
      </div>
      <i className="fas fa-calendar-alt text-green-600"></i>
    </div>
  </div>
)

NextBillingCard.propTypes = {
  nextBillingDate: PropTypes.string.isRequired
}

export default NextBillingCard