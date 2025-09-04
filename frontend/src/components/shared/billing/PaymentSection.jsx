import PropTypes from 'prop-types'
import PaymentMethodCard from './PaymentMethodCard'
import ContractDatesSection from './ContractDatesSection'
import NextBillingCard from './NextBillingCard'

/**
 * Sección de información de pago
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PaymentSection = ({
  user,
  planInfo,
  nextBillingDate,
  contractStatus,
  getPaymentMethodIcon,
  getPaymentMethodName
}) => (
  <div className="space-y-4">
    <h3 className="font-medium text-gray-800">Método de Pago</h3>

    <PaymentMethodCard
      paymentMethod={user.billing.payment_method}
      billingContact={user.billing.billing_contact}
      userRole={user.role}
      getIcon={getPaymentMethodIcon}
      getName={getPaymentMethodName}
    />

    {user.role === 'CORPORATIVO' && (
      <ContractDatesSection planInfo={planInfo} contractStatus={contractStatus} />
    )}

    {user.role === 'FAMILIAR' && <NextBillingCard nextBillingDate={nextBillingDate} />}
  </div>
)

PaymentSection.propTypes = {
  user: PropTypes.object.isRequired,
  planInfo: PropTypes.object,
  nextBillingDate: PropTypes.string.isRequired,
  contractStatus: PropTypes.object,
  getPaymentMethodIcon: PropTypes.func.isRequired,
  getPaymentMethodName: PropTypes.func.isRequired
}

export default PaymentSection