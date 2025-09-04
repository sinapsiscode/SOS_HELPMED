import React from 'react'

/**
 * Nota informativa sobre el servicio sin suscripción
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Nota informativa
 */
const ServiceInfoNote = () => {
  return (
    <div className="flex items-start space-x-3 p-4 bg-yellow-50 rounded-lg">
      <i className="fas fa-info-circle text-yellow-600 mt-0.5"></i>
      <div className="text-sm text-yellow-800">
        <p className="font-medium font-exo">Servicio sin suscripción</p>
        <p className="font-roboto">
          Este es un servicio único que será cobrado inmediatamente. Para obtener mejores tarifas,
          considere nuestros planes mensuales.
        </p>
      </div>
    </div>
  )
}

export default ServiceInfoNote
