import React from 'react'

/**
 * Campo de entrada de número de tarjeta
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.value - Valor del número de tarjeta
 * @param {Function} props.onChange - Función para cambiar valor
 * @param {string} props.error - Error de validación
 * @param {string} props.cardIcon - Icono de la tarjeta detectada
 * @param {string} props.cardType - Tipo de tarjeta detectada
 * @returns {JSX.Element} Campo de número de tarjeta
 */
const CardInput = ({ value, onChange, error, cardIcon, cardType }) => {
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        Número de Tarjeta
      </label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="1234 5678 9012 3456"
          maxLength="19"
          className={`w-full px-4 py-3 pr-12 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
          <i
            className={`${cardIcon} text-xl transition-colors ${
              cardType ? 'text-gray-600' : 'text-gray-400'
            }`}
          ></i>
        </div>
      </div>
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
      {cardType && !error && (
        <p className="mt-1 text-sm text-green-600 flex items-center font-roboto">
          <i className="fas fa-check-circle mr-1"></i>
          {getCardTypeName(cardType)} detectada
        </p>
      )}
    </div>
  )
}

/**
 * Obtiene el nombre descriptivo del tipo de tarjeta
 */
const getCardTypeName = (cardType) => {
  const names = {
    visa: 'Visa',
    mastercard: 'Mastercard',
    amex: 'American Express',
    diners: 'Diners Club',
    discover: 'Discover',
    jcb: 'JCB'
  }
  return names[cardType] || 'Tarjeta'
}

export default CardInput
