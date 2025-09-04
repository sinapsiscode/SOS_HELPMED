import React from 'react'

const ContractDetailsModal = ({ isOpen, onClose, request, onEditContract }) => {
  if (!isOpen || !request) return null

  const formatDate = (date) => {
    const d = new Date(date)
    return `${d.getDate().toString().padStart(2, '0')}-${(d.getMonth() + 1).toString().padStart(2, '0')}-${d.getFullYear()}`
  }

  // Determinar si el contrato está por vencer (ejemplo: menos de 30 días)
  const isContractExpiring = () => {
    if (!request.renewalDate) return false
    const renewalDate = new Date(request.renewalDate || '2024-12-31')
    const today = new Date()
    const daysUntilRenewal = Math.ceil((renewalDate - today) / (1000 * 60 * 60 * 24))
    return daysUntilRenewal <= 30
  }

  const handleEditContract = () => {
    onEditContract && onEditContract(request)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">
            Contrato: {request.userName || 'Empresa ABC Ltda.'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-4 space-y-6">
          {/* Información del Contrato */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Información del Contrato</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">ID Contrato:</span>
                <span className="ml-2 text-gray-600">CORP-ABC-2024-001</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Plan:</span>
                <span className="ml-2 text-gray-600">Área Protegida - Empresa ABC</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Servicios:</span>
                <span className="ml-2 text-gray-600">{request.servicesTotal || '50'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Inicio:</span>
                <span className="ml-2 text-gray-600">31-12-2023</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Renovación:</span>
                <span className="ml-2 text-gray-600">31-12-2024</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Costo Mensual:</span>
                <span className="ml-2 text-gray-600">S/ 1075</span>
              </div>
            </div>
          </div>

          {/* Información de la Empresa */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Información de la Empresa</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Empresa:</span>
                <span className="ml-2 text-gray-600">Empresa ABC Ltda.</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">RUC:</span>
                <span className="ml-2 text-gray-600">96.123.456-7</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Industria:</span>
                <span className="ml-2 text-gray-600">Construcción</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Contacto:</span>
                <span className="ml-2 text-gray-600">Carlos Ramírez (Gerente de RRHH)</span>
              </div>
            </div>
          </div>

          {/* Uso de Servicios */}
          <div className="bg-green-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-800 mb-3">Uso de Servicios</h3>
            <div className="space-y-2 text-sm">
              <div>
                <span className="font-medium text-gray-700">Servicios Usados:</span>
                <span className="ml-2 text-gray-600">{request.servicesUsed || '50'}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Servicios Restantes:</span>
                <span className="ml-2 text-gray-600">{(request.servicesTotal || 50) - (request.servicesUsed || 50)}</span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Porcentaje de Uso:</span>
                <span className="ml-2 text-gray-600">100%</span>
              </div>
            </div>
          </div>

          {/* Alerta de Contrato por Vencer */}
          {isContractExpiring() && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-start">
                <i className="fas fa-exclamation-triangle text-red-500 mt-0.5 mr-2"></i>
                <div>
                  <h4 className="font-medium text-red-800">Contrato por Vencer</h4>
                  <p className="text-sm text-red-700 mt-1">
                    Este contrato vence el 31-12-2024. Contacte al cliente para renovación.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 flex justify-center gap-3">
          <button
            onClick={handleEditContract}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Editar Contrato
          </button>
          <button
            onClick={onClose}
            className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-lg font-medium transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  )
}

export default ContractDetailsModal