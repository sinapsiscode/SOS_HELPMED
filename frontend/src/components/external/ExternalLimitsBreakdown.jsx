import React from 'react'

/**
 * Desglose detallado de límites para usuarios externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario externo
 * @returns {JSX.Element} Desglose de límites
 */
const ExternalLimitsBreakdown = ({ user }) => {
  if (user.plan.subtype === 'CASO_1') return null

  const individualRemaining = user.service_usage.current_period.individual_remaining
  const individualUsed = 3 - individualRemaining
  const generalRemaining = user.client_company?.general_services_remaining || 0
  const generalTotal = 430
  const generalUsed = generalTotal - generalRemaining

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 font-exo">
        Desglose de Límites
      </h2>

      <div className="space-y-3 sm:space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-blue-800 mb-2 text-sm sm:text-base font-exo">
            <span className="hidden sm:inline">Límite Individual (Anual)</span>
            <span className="sm:hidden">Individual</span>
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm sm:text-base font-roboto">
              <span className="hidden sm:inline">Servicios restantes:</span>
              <span className="sm:hidden">Restantes:</span>
            </span>
            <span className="font-bold text-blue-600 text-sm sm:text-base font-exo">
              {individualRemaining} / 3
            </span>
          </div>
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(individualUsed / 3) * 100}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-blue-600 mt-1 font-roboto">
            <span>Utilizados: {individualUsed}</span>
            <span>{Math.round((individualUsed / 3) * 100)}%</span>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
          <h3 className="font-medium text-yellow-800 mb-2 text-sm sm:text-base font-exo">
            <span className="hidden sm:inline">Límite General de la Empresa</span>
            <span className="sm:hidden">Empresa</span>
          </h3>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm sm:text-base font-roboto">
              <span className="hidden sm:inline">Servicios disponibles:</span>
              <span className="sm:hidden">Disponibles:</span>
            </span>
            <span className="font-bold text-yellow-600 text-sm sm:text-base font-exo">
              {generalRemaining} / {generalTotal}
            </span>
          </div>
          <div className="w-full bg-yellow-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${(generalUsed / generalTotal) * 100}%`
              }}
            ></div>
          </div>
          <div className="flex justify-between text-xs text-yellow-600 mt-1 font-roboto">
            <span>Utilizados: {generalUsed}</span>
            <span>{Math.round((generalUsed / generalTotal) * 100)}%</span>
          </div>
        </div>

        {/* Información adicional */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-3 sm:p-4">
          <h4 className="font-medium text-gray-800 mb-2 text-sm font-exo">
            <i className="fas fa-info-circle text-gray-600 mr-2"></i>
            Información Importante
          </h4>
          <ul className="text-xs sm:text-sm text-gray-600 space-y-1 font-roboto">
            <li>• Los servicios individuales se renuevan anualmente</li>
            <li>• Después de los 3 servicios gratuitos, cada servicio cuesta $45.000</li>
            <li>• El límite empresarial es compartido con todos los afiliados</li>
            <li>• Los costos adicionales se facturan mensualmente</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default ExternalLimitsBreakdown
