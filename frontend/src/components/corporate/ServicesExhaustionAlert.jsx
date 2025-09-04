import React from 'react'

/**
 * Alerta de servicios agotándose
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.alert - Datos de alerta de servicios
 * @param {Function} props.onPurchase - Función para comprar servicios adicionales
 * @returns {JSX.Element} Alerta de servicios agotándose
 */
const ServicesExhaustionAlert = ({ alert, onPurchase }) => {
  if (!alert.showServicesAlert) return null

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6">
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <i className="fas fa-exclamation-circle text-red-600 text-xl"></i>
        </div>

        <div className="ml-3 flex-1">
          <h3 className="text-sm font-semibold text-red-800 font-exo">Servicios Agotándose</h3>

          <div className="mt-2 text-sm text-red-700">
            <p>
              Solo te quedan <strong>{alert.servicesRemaining} servicios</strong> en tu plan actual.
            </p>
            <p className="mt-1">Compra servicios adicionales para evitar interrupciones.</p>
          </div>

          <div className="mt-4">
            <button
              onClick={() => onPurchase(alert)}
              className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors font-roboto"
            >
              <i className="fas fa-plus mr-2"></i>
              Comprar Servicios
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ServicesExhaustionAlert
