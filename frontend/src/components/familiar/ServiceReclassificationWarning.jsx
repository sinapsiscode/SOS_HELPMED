import { useState } from 'react'

const ServiceReclassificationWarning = ({ onAccept, onCancel, requestedService, symptoms }) => {
  const [understood, setUnderstood] = useState(false)

  const getServiceTypeInfo = (serviceType) => {
    const serviceInfo = {
      EMERGENCIA: {
        name: 'Emergencia',
        icon: 'fas fa-ambulance',
        color: 'red',
        description: 'Situación crítica que pone en riesgo la vida'
      },
      URGENCIA: {
        name: 'Urgencia',
        icon: 'fas fa-hospital',
        color: 'yellow',
        description: 'Requiere atención pronta pero sin riesgo vital'
      },
      MEDICO_DOMICILIO: {
        name: 'Médico a Domicilio',
        icon: 'fas fa-user-md',
        color: 'blue',
        description: 'Consulta médica programada'
      }
    }
    return serviceInfo[serviceType] || serviceInfo.EMERGENCIA
  }

  const serviceInfo = getServiceTypeInfo(requestedService)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-2xl w-full shadow-2xl overflow-hidden">
        {/* Header con advertencia */}
        <div className="bg-yellow-500 p-6 text-white">
          <div className="flex items-center space-x-4">
            <i className="fas fa-exclamation-triangle text-4xl"></i>
            <div>
              <h2 className="text-2xl font-bold">Advertencia Importante</h2>
              <p className="text-yellow-100">Sobre la clasificación de su servicio</p>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6 space-y-6">
          {/* Servicio solicitado */}
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-2">Usted ha solicitado:</p>
            <div className="flex items-center space-x-3">
              <div
                className={`w-12 h-12 bg-${serviceInfo.color}-100 rounded-full flex items-center justify-center`}
              >
                <i className={`${serviceInfo.icon} text-${serviceInfo.color}-600 text-xl`}></i>
              </div>
              <div>
                <h3 className="font-bold text-lg">{serviceInfo.name}</h3>
                <p className="text-sm text-gray-600">{serviceInfo.description}</p>
              </div>
            </div>
          </div>

          {/* Síntomas reportados */}
          {symptoms && (
            <div className="bg-blue-50 rounded-lg p-4">
              <p className="text-sm font-medium text-blue-800 mb-2">Síntomas reportados:</p>
              <p className="text-gray-700">{symptoms}</p>
            </div>
          )}

          {/* Advertencia principal */}
          <div className="border-2 border-orange-300 rounded-lg p-4 bg-orange-50">
            <h4 className="font-bold text-orange-800 mb-2 flex items-center">
              <i className="fas fa-info-circle mr-2"></i>
              Importante - Reclasificación de Servicio
            </h4>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                El personal médico de la ambulancia evaluará su situación al llegar y determinará el
                tipo de servicio apropiado según criterios médicos objetivos.
              </p>
              <p className="font-medium">
                Si la evaluación médica determina que su situación NO constituye una emergencia
                real, el servicio será reclasificado como:
              </p>
              <ul className="list-disc ml-6 space-y-1">
                <li>
                  <strong>Urgencia:</strong> Si requiere atención médica pronta
                </li>
                <li>
                  <strong>Médico a domicilio:</strong> Si es una consulta que no requiere traslado
                </li>
              </ul>
              <p className="text-orange-700 font-medium">
                La reclasificación afectará el conteo de servicios según su plan contratado.
              </p>
            </div>
          </div>

          {/* Ejemplos de emergencias reales */}
          <div className="bg-red-50 rounded-lg p-4">
            <h4 className="font-semibold text-red-800 mb-2">
              Ejemplos de emergencias médicas reales:
            </h4>
            <ul className="grid grid-cols-2 gap-2 text-sm text-gray-700">
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Pérdida de conocimiento
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Dificultad respiratoria severa
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Dolor torácico intenso
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Hemorragias severas
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Traumatismos graves
              </li>
              <li className="flex items-start">
                <i className="fas fa-check text-red-600 mr-2 mt-0.5"></i>
                Convulsiones activas
              </li>
            </ul>
          </div>

          {/* Checkbox de confirmación */}
          <div className="border-t pt-4">
            <label className="flex items-start space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={understood}
                onChange={(e) => setUnderstood(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500 mt-0.5"
              />
              <span className="text-sm text-gray-700">
                Entiendo que el personal médico puede reclasificar mi servicio según la evaluación
                clínica y que esto afectará mi límite de servicios disponibles.
              </span>
            </label>
          </div>
        </div>

        {/* Botones de acción */}
        <div className="p-6 bg-gray-50 border-t flex space-x-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Cancelar Solicitud
          </button>
          <button
            onClick={onAccept}
            disabled={!understood}
            className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
              understood
                ? 'bg-blue-600 text-white hover:bg-blue-700'
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Continuar con la Solicitud
          </button>
        </div>
      </div>
    </div>
  )
}

export default ServiceReclassificationWarning
