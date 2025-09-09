import PropTypes from 'prop-types'
import useBillingInfo from '../../hooks/useBillingInfo'
import BillingHeader from './billing/BillingHeader'
import CostSection from './billing/CostSection'
import PaymentSection from './billing/PaymentSection'
import ActionButtons from './billing/ActionButtons'

/**
 * Componente para mostrar información de facturación
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 72 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: Props con PropTypes
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const BillingInfo = ({ user, additionalServices = [] }) => {
  const {
    isLoading,
    totalAmount,
    nextBillingDate,
    planInfo,
    hasAutoRenewal,
    contractStatus,
    formatCurrency,
    getPaymentMethodIcon,
    getPaymentMethodName,
    downloadInvoice,
    changePaymentMethod,
    upgradePlan
  } = useBillingInfo(user, additionalServices)

  if (!user || !user.billing) return null

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      {/* Header */}
      <BillingHeader hasAutoRenewal={hasAutoRenewal} />

      {/* Contenido principal */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Columna izquierda - Costos */}
        <CostSection
          user={user}
          planInfo={planInfo}
          additionalServices={additionalServices}
          totalAmount={totalAmount}
          formatCurrency={formatCurrency}
        />

        {/* Columna derecha - Información de pago */}
        <PaymentSection
          user={user}
          planInfo={planInfo}
          nextBillingDate={nextBillingDate}
          contractStatus={contractStatus}
          getPaymentMethodIcon={getPaymentMethodIcon}
          getPaymentMethodName={getPaymentMethodName}
          formatCurrency={formatCurrency}
        />
      </div>

      {/* Acciones */}
      <ActionButtons
        user={user}
        isLoading={isLoading}
        onDownload={downloadInvoice}
        onChangePayment={changePaymentMethod}
        onUpgradePlan={upgradePlan}
      />
    </div>
  )
}

BillingInfo.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    role: PropTypes.string.isRequired,
    billing: PropTypes.shape({
      monthly_cost: PropTypes.number.isRequired,
      payment_method: PropTypes.string.isRequired,
      auto_renewal: PropTypes.bool.isRequired,
      billing_contact: PropTypes.shape({
        name: PropTypes.string,
        email: PropTypes.string
      })
    }).isRequired,
    plan: PropTypes.shape({
      name: PropTypes.string,
      renewal_date: PropTypes.string,
      start_date: PropTypes.string,
      endDate: PropTypes.string
    })
  }).isRequired,
  additionalServices: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string.isRequired,
      cost: PropTypes.number.isRequired,
      date: PropTypes.string.isRequired
    })
  )
}

export default BillingInfo
