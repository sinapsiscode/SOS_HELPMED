import React from 'react'

/**
 * Alerta de vencimiento de contrato corporativo
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.alert - Datos de alerta de contrato
 * @param {Function} props.onRenewal - Función para renovar contrato
 * @param {Function} props.onContact - Función para contactar ventas
 * @returns {JSX.Element} Alerta de vencimiento de contrato
 */
const ContractExpirationAlert = ({ alert, onRenewal, onContact }) => {
  if (!alert.showContractAlert) return null

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-triangle text-yellow-600 text-xl"></i>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-yellow-800 font-exo">Contrato por Vencer</h3>

          <div className="mt-2 text-sm text-yellow-700">
            <p>
              Tu contrato vence en <strong>{alert.contractDaysRemaining} días</strong>(
              {new Date(alert.contractEndDate).toLocaleDateString('es-PE')}).
            </p>
            <p className="mt-1">
              Para evitar interrupciones en el servicio, renueva tu contrato ahora.
            </p>
          </div>

          <div className="mt-4 flex flex-col sm:flex-row gap-2">
            <button
              onClick={onRenewal}
              className="inline-flex items-center px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-medium rounded-lg transition-colors font-roboto"
            >
              <i className="fas fa-sync-alt mr-2"></i>
              Renovar Contrato
            </button>

            <button
              onClick={onContact}
              className="inline-flex items-center px-4 py-2 bg-white hover:bg-gray-50 text-yellow-800 text-sm font-medium rounded-lg border border-yellow-300 transition-colors font-roboto"
            >
              <i className="fas fa-phone mr-2"></i>
              Contactar Ventas
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ContractExpirationAlert
