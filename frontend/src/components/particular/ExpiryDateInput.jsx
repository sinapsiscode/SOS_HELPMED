import React from 'react'

/**
 * Campo de entrada de fecha de expiración y CVV
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.expiryMonth - Mes de expiración
 * @param {string} props.expiryYear - Año de expiración
 * @param {string} props.cvv - Código CVV
 * @param {Function} props.onMonthChange - Función para cambiar mes
 * @param {Function} props.onYearChange - Función para cambiar año
 * @param {Function} props.onCVVChange - Función para cambiar CVV
 * @param {string} props.expiryError - Error de fecha de expiración
 * @param {string} props.cvvError - Error de CVV
 * @param {boolean} props.isAmex - Si es American Express
 * @returns {JSX.Element} Campos de fecha y CVV
 */
const ExpiryDateInput = ({
  expiryMonth,
  expiryYear,
  cvv,
  onMonthChange,
  onYearChange,
  onCVVChange,
  expiryError,
  cvvError,
  isAmex
}) => {
  const cvvLength = isAmex ? 4 : 3
  const cvvPlaceholder = isAmex ? '1234' : '123'

  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Fecha de Expiración */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
          Fecha de Expiración
        </label>
        <div className="flex space-x-2">
          <div className="flex-1">
            <input
              type="text"
              value={expiryMonth}
              onChange={(e) => onMonthChange(e.target.value)}
              placeholder="MM"
              maxLength="2"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
                expiryError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
          <div className="flex items-center text-gray-500">
            <span className="font-exo">/</span>
          </div>
          <div className="flex-1">
            <input
              type="text"
              value={expiryYear}
              onChange={(e) => onYearChange(e.target.value)}
              placeholder="AA"
              maxLength="2"
              className={`w-full px-3 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
                expiryError ? 'border-red-500 bg-red-50' : 'border-gray-300'
              }`}
            />
          </div>
        </div>
        {expiryError && (
          <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
            <i className="fas fa-exclamation-circle mr-1"></i>
            {expiryError}
          </p>
        )}
        {!expiryError && expiryMonth && expiryYear && (
          <p className="mt-1 text-sm text-green-600 flex items-center font-roboto">
            <i className="fas fa-check-circle mr-1"></i>
            Válida hasta {expiryMonth}/{expiryYear}
          </p>
        )}
      </div>

      {/* CVV */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
          CVV
          <CVVHelpButton isAmex={isAmex} />
        </label>
        <input
          type="text"
          value={cvv}
          onChange={(e) => onCVVChange(e.target.value)}
          placeholder={cvvPlaceholder}
          maxLength={cvvLength}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
            cvvError ? 'border-red-500 bg-red-50' : 'border-gray-300'
          }`}
        />
        {cvvError && (
          <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
            <i className="fas fa-exclamation-circle mr-1"></i>
            {cvvError}
          </p>
        )}
        {!cvvError && cvv && cvv.length === cvvLength && (
          <p className="mt-1 text-sm text-green-600 flex items-center font-roboto">
            <i className="fas fa-check-circle mr-1"></i>
            CVV válido
          </p>
        )}
      </div>
    </div>
  )
}

/**
 * Botón de ayuda para CVV
 */
const CVVHelpButton = ({ isAmex }) => {
  const handleHelpClick = () => {
    const message = isAmex
      ? 'Para American Express: código de 4 dígitos en el frente de la tarjeta'
      : 'Código de 3 dígitos en el reverso de tu tarjeta'

    // Mostrar tooltip o modal simple
    alert(message) // En un proyecto real, usar un tooltip más elegante
  }

  return (
    <button
      type="button"
      className="ml-2 text-gray-400 hover:text-gray-600 transition-colors"
      onClick={handleHelpClick}
      title={
        isAmex
          ? 'CVV de 4 dígitos en el frente para American Express'
          : 'CVV de 3 dígitos en el reverso de la tarjeta'
      }
    >
      <i className="fas fa-question-circle text-sm"></i>
    </button>
  )
}

export default ExpiryDateInput
