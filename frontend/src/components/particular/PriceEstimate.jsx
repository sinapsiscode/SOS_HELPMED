import React from 'react'

/**
 * Estimación de precio del servicio
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {number} props.estimatedPrice - Precio estimado
 * @param {string} props.priceMessage - Mensaje sobre el precio
 * @returns {JSX.Element} Estimación de precio
 */
const PriceEstimate = ({ estimatedPrice, priceMessage }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <PriceInfo priceMessage={priceMessage} />
        <PriceAmount estimatedPrice={estimatedPrice} />
      </div>
    </div>
  )
}

/**
 * Información sobre el precio
 */
const PriceInfo = ({ priceMessage }) => {
  return (
    <div>
      <h4 className="font-semibold text-blue-800 font-exo">Precio Estimado</h4>
      <p className="text-sm text-blue-600 mt-1 font-roboto">{priceMessage}</p>
    </div>
  )
}

/**
 * Monto del precio
 */
const PriceAmount = ({ estimatedPrice }) => {
  return (
    <div className="text-right">
      <p className="text-2xl font-bold text-blue-800 font-exo">S/ {estimatedPrice.toFixed(2)}</p>
      <p className="text-xs text-blue-600 font-roboto">Pago al confirmar</p>
    </div>
  )
}

export default PriceEstimate
