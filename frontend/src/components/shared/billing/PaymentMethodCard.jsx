import PropTypes from 'prop-types'

/**
 * Tarjeta de método de pago
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PaymentMethodCard = ({ paymentMethod, billingContact, userRole, getIcon, getName }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
    <div className="flex items-center space-x-3 mb-3">
      <i className={`${getIcon(paymentMethod)} text-gray-600`}></i>
      <span className="font-medium text-gray-800">{getName(paymentMethod)}</span>
    </div>

    {paymentMethod === 'invoice' && userRole === 'CORPORATIVO' && billingContact && (
      <div className="text-sm text-gray-600">
        <div>{billingContact.name}</div>
        <div>{billingContact.email}</div>
      </div>
    )}
  </div>
)

PaymentMethodCard.propTypes = {
  paymentMethod: PropTypes.string.isRequired,
  billingContact: PropTypes.object,
  userRole: PropTypes.string.isRequired,
  getIcon: PropTypes.func.isRequired,
  getName: PropTypes.func.isRequired
}

export default PaymentMethodCard