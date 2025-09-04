import PropTypes from 'prop-types'

/**
 * Sección de fechas del contrato (Corporativo)
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ContractDatesSection = ({ planInfo, contractStatus }) => (
  <div className="space-y-3">
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-medium text-blue-800">Inicio del Contrato</div>
          <div className="text-sm text-blue-600">{planInfo?.startDate || 'No disponible'}</div>
        </div>
        <i className="fas fa-calendar-check text-blue-600"></i>
      </div>
    </div>

    <div
      className={`border rounded-lg p-4 ${
        contractStatus?.isExpiringSoon
          ? 'bg-orange-50 border-orange-200'
          : 'bg-gray-50 border-gray-200'
      }`}
    >
      <div className="flex items-center justify-between">
        <div>
          <div
            className={`font-medium ${
              contractStatus?.isExpiringSoon ? 'text-orange-800' : 'text-gray-800'
            }`}
          >
            Vencimiento del Contrato
          </div>
          <div
            className={`text-sm ${
              contractStatus?.isExpiringSoon ? 'text-orange-600' : 'text-gray-600'
            }`}
          >
            {planInfo?.endDate || 'No disponible'}
            {contractStatus?.isExpiringSoon && (
              <span className="block text-xs mt-1">
                Expira en {contractStatus.daysUntilExpiry} días
              </span>
            )}
          </div>
        </div>
        <i
          className={`fas fa-calendar-times ${
            contractStatus?.isExpiringSoon ? 'text-orange-600' : 'text-gray-600'
          }`}
        ></i>
      </div>
    </div>
  </div>
)

ContractDatesSection.propTypes = {
  planInfo: PropTypes.object,
  contractStatus: PropTypes.object
}

export default ContractDatesSection