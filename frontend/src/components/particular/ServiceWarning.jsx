import React from 'react'

/**
 * Advertencia sobre servicios sin suscripción
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Advertencia de servicio sin plan
 */
const ServiceWarning = () => {
  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
      <div className="flex items-start space-x-3">
        <i className="fas fa-info-circle text-yellow-600 mt-1"></i>
        <div>
          <h4 className="font-semibold text-yellow-800 font-exo">Servicio sin Suscripción</h4>
          <p className="text-sm text-yellow-700 mt-1 font-roboto">
            Los servicios sin plan tienen un costo mayor. Considere adquirir un plan para obtener
            mejores tarifas y beneficios adicionales.
          </p>
        </div>
      </div>
    </div>
  )
}

export default ServiceWarning
