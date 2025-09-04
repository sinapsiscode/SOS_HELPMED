import React from 'react'
import usePricingSummary from '../../hooks/usePricingSummary'

/**
 * Componente de resumen de precios refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica en hook usePricingSummary
 * ✅ Regla #3: Componente <200 líneas
 *
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Resumen de precios
 */
const PricingSummary = ({ service, details, prices, total }) => {
  const serviceInfo = prices[service]

  const { surcharges, estimatedArrivalTime, getUrgencyColor, getUrgencyLabel } = usePricingSummary(
    service,
    serviceInfo
  )

  return (
    <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Resumen de Servicio</h3>
      </div>

      <div className="p-6 space-y-4">
        {/* Información del servicio */}
        <div className="pb-4 border-b border-gray-100">
          <div className="flex items-start justify-between mb-2">
            <div>
              <h4 className="font-medium text-gray-800">{serviceInfo.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{serviceInfo.description}</p>
            </div>
            <span className="text-lg font-semibold text-gray-800">
              S/ {serviceInfo.basePrice.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Detalles del paciente */}
        <div className="pb-4 border-b border-gray-100">
          <h5 className="text-sm font-medium text-gray-700 mb-2">Detalles del Servicio</h5>
          <div className="space-y-1 text-sm text-gray-600">
            <div className="flex justify-between">
              <span>Paciente:</span>
              <span className="font-medium">{details.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span>Teléfono:</span>
              <span className="font-medium">{details.patientPhone}</span>
            </div>
            <div className="flex justify-between">
              <span>Ubicación:</span>
              <span className="font-medium text-right max-w-xs">{details.location}</span>
            </div>
            <div className="flex justify-between">
              <span>Urgencia:</span>
              <span className={`font-medium ${getUrgencyColor(details.urgencyLevel)}`}>
                {getUrgencyLabel(details.urgencyLevel)}
              </span>
            </div>
          </div>
        </div>

        {/* Recargos si aplican */}
        {surcharges.length > 0 && (
          <div className="pb-4 border-b border-gray-100">
            <h5 className="text-sm font-medium text-gray-700 mb-2">Recargos Aplicados</h5>
            <div className="space-y-1">
              {surcharges.map((surcharge, index) => (
                <div key={index} className="flex justify-between text-sm">
                  <span className="text-gray-600">{surcharge.name}</span>
                  <span className="font-medium text-gray-800">
                    + S/ {surcharge.amount.toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Total */}
        <div className="pt-2">
          <div className="flex items-center justify-between">
            <span className="text-lg font-semibold text-gray-800">Total a Pagar</span>
            <span className="text-2xl font-bold text-red-600">S/ {total.toFixed(2)}</span>
          </div>
          <p className="text-xs text-gray-500 mt-1 text-right">Incluye IGV</p>
        </div>

        {/* Información adicional */}
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <div className="flex items-start space-x-2">
            <i className="fas fa-info-circle text-blue-600 text-sm mt-0.5"></i>
            <div className="text-xs text-blue-800">
              <p className="font-medium mb-1">Tiempo estimado de llegada</p>
              <p>{estimatedArrivalTime}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PricingSummary
