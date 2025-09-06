import React from 'react'
import { LABELS } from '../../../config/labels'
import { DATE_FORMATS } from '../../../config/constants'

/**
 * Componente de lista de contratos corporativos
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Array} contracts - Lista de contratos filtrados
 * @param {Function} getContractStatus - Función para obtener estado
 * @param {Function} getUsageColor - Función para color de uso
 * @param {Function} getContractStatusClass - Función para clase CSS
 * @param {Function} onViewContract - Función para ver contrato
 * @param {Function} onRenewContract - Función para renovar contrato
 */
const ContractsList = ({
  contracts,
  getContractStatus,
  getUsageColor,
  getContractStatusClass,
  onViewContract,
  onRenewContract
}) => {
  const labels = LABELS.admin.corporate.contracts.list
  const detailLabels = LABELS.admin.corporate.contracts.detail
  
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(contracts)) {
    console.error(labels.errors.contractsRequired)
    return null
  }

  if (typeof getContractStatus !== 'function') {
    console.error(labels.errors.getContractStatusRequired)
    return null
  }

  if (typeof getUsageColor !== 'function') {
    console.error(labels.errors.getUsageColorRequired)
    return null
  }

  if (typeof getContractStatusClass !== 'function') {
    console.error(labels.errors.getContractStatusClassRequired)
    return null
  }

  if (typeof onViewContract !== 'function') {
    console.error(labels.errors.onViewContractRequired)
    return null
  }

  if (typeof onRenewContract !== 'function') {
    console.error(labels.errors.onRenewContractRequired)
    return null
  }

  if (contracts.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-800">{labels.titleWithCount.replace('{count}', '0')}</h3>
        </div>
        <div className="p-8 text-center">
          <i className="fas fa-file-contract text-4xl text-gray-400 mb-4"></i>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">{labels.empty.title}</h3>
          <p className="text-gray-600">{labels.empty.description}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">
          {labels.titleWithCount.replace('{count}', contracts.length)}
        </h3>
      </div>

      <div className="divide-y divide-gray-200">
        {contracts.map((contract) => {
          const contractStatus = getContractStatus(contract)
          const usagePercentage = contract.service_usage?.current_period?.usage_percentage || 0

          return (
            <React.Fragment key={contract.id}>
              {/* Vista Desktop */}
              <div className="hidden sm:block p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-semibold text-gray-800">
                        {contract.company?.name}
                      </h4>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium border ${getContractStatusClass(contractStatus.status)}`}
                      >
                        {contractStatus.text}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                        {contract.company?.industry}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-3">
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.contact}:</strong> {contract.company?.contact_person?.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.ruc}:</strong> {contract.company?.rut}
                        </p>
                      </div>
                      <div></div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.usage}:</strong>
                          <span className={`ml-1 font-medium ${getUsageColor(usagePercentage)}`}>
                            {contract.service_usage?.current_period?.used_services || 0}/
                            {contract.plan?.contract_services || 0} ({usagePercentage}%)
                          </span>
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.renewal}:</strong>{' '}
                          {new Date(contract.plan?.renewal_date).toLocaleDateString(DATE_FORMATS.locale)}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.monthlyCost}:</strong> {detailLabels.defaults.currencySymbol}{' '}
                          {contract.billing?.monthly_cost?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-600">
                          <strong>{labels.fields.id}:</strong> {contract.plan?.contract_id}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-xs text-gray-500">
                        {labels.fields.phone}: {contract.company?.contact_person?.phone} • {labels.fields.email}:{' '}
                        {contract.company?.contact_person?.email}
                      </div>

                      <div className="flex space-x-2">
                        <button
                          onClick={() => onViewContract(contract)}
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                        >
                          <i className="fas fa-eye"></i>
                          <span>{labels.buttons.viewDetail}</span>
                        </button>
                        {contractStatus.status === 'expiring' && (
                          <button
                            onClick={() => onRenewContract(contract)}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center space-x-2"
                          >
                            <i className="fas fa-sync-alt"></i>
                            <span>{labels.buttons.renew}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Vista Mobile */}
              <div
                key={`${contract.id}-mobile`}
                className="block sm:hidden bg-white border border-gray-200 rounded-lg shadow-sm mx-2 mb-3 max-w-full overflow-hidden"
              >
                <div className="p-3">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 text-sm leading-tight truncate">
                          {contract.company?.name}
                        </h4>
                        <p className="text-xs text-gray-600 truncate">
                          {contract.company?.contact_person?.name}
                        </p>
                      </div>
                      <div className="flex flex-col items-end space-y-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getContractStatusClass(contractStatus.status)}`}
                        >
                          {contractStatus.text}
                        </span>
                        <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                          {contract.company?.industry}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2 mt-3 text-xs">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-gray-500">{labels.fields.ruc}:</span>
                        <p className="font-medium text-gray-900">{contract.company?.rut}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">{labels.fields.usage}:</span>
                        <span className={`font-semibold ${getUsageColor(usagePercentage)}`}>
                          {usagePercentage}%
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">{labels.fields.cost}:</span>
                        <p className="font-bold text-green-600">
                          {detailLabels.defaults.currencySymbol} {contract.billing?.monthly_cost?.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <span className="text-gray-500">{labels.fields.renewal}:</span>
                        <p className="font-medium text-gray-900">
                          {new Date(contract.plan?.renewal_date).toLocaleDateString(DATE_FORMATS.locale)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 border-t border-gray-200 p-2">
                  <div className="space-y-2">
                    <button
                      onClick={() => onViewContract(contract)}
                      className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded text-sm font-medium"
                    >
                      {labels.buttons.viewDetail}
                    </button>

                    {contractStatus.status === 'expiring' && (
                      <button
                        onClick={() => onRenewContract(contract)}
                        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded text-sm font-medium"
                      >
                        {labels.buttons.renewContract}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </React.Fragment>
          )
        })}
      </div>
    </div>
  )
}

export default ContractsList
