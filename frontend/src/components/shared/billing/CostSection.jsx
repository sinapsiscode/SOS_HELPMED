import PropTypes from 'prop-types'
import AdditionalServicesSection from './AdditionalServicesSection'

/**
 * Sección de costos del plan
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const CostSection = ({ user, planInfo, additionalServices, totalAmount, formatCurrency }) => (
  <div className="space-y-4">
    <h3 className="font-medium text-gray-800">Costo del Plan</h3>

    {/* Plan actual */}
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="text-blue-700">{planInfo?.name || 'Plan Actual'}</span>
        <span className="font-bold text-blue-800">{formatCurrency(user.billing.monthly_cost)}</span>
      </div>
      <div className="text-sm text-blue-600">
        {user.role === 'FAMILIAR' ? 'Mensual' : 'Según contrato'}
      </div>
    </div>

    {/* Servicios adicionales */}
    {additionalServices.length > 0 && (
      <AdditionalServicesSection services={additionalServices} formatCurrency={formatCurrency} />
    )}

    {/* Total */}
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-800">Total a Pagar</span>
        <span className="text-2xl font-bold text-gray-900">{formatCurrency(totalAmount)}</span>
      </div>
    </div>
  </div>
)

CostSection.propTypes = {
  user: PropTypes.object.isRequired,
  planInfo: PropTypes.object,
  additionalServices: PropTypes.array.isRequired,
  totalAmount: PropTypes.number.isRequired,
  formatCurrency: PropTypes.func.isRequired
}

export default CostSection