import React from 'react'

/**
 * Resumen de pago
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {number} props.amount - Monto a cobrar
 * @param {string} props.currency - Moneda (S/, USD, etc.)
 * @param {string} props.description - Descripción del pago
 * @param {Array} props.breakdown - Desglose de costos (opcional)
 * @returns {JSX.Element} Resumen de pago
 */
const PaymentSummary = ({ amount, currency = 'S/', description, breakdown }) => {
  return (
    <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
      <h4 className="font-medium text-blue-800 mb-3 flex items-center font-exo">
        <i className="fas fa-receipt mr-2"></i>
        Resumen de Pago
      </h4>

      {/* Descripción del servicio */}
      {description && (
        <div className="mb-3">
          <p className="text-sm text-blue-700 font-roboto">{description}</p>
        </div>
      )}

      {/* Desglose de costos */}
      {breakdown && breakdown.length > 0 && (
        <div className="mb-3 space-y-2">
          {breakdown.map((item, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span className="text-blue-700 font-roboto">{item.description}</span>
              <span className="font-medium text-blue-800 font-exo">
                {currency} {item.amount.toFixed(2)}
              </span>
            </div>
          ))}
          <div className="border-t border-blue-300 pt-2 mt-2">
            <div className="flex justify-between items-center text-sm">
              <span className="font-medium text-blue-700 font-roboto">Subtotal:</span>
              <span className="font-medium text-blue-800 font-exo">
                {currency} {breakdown.reduce((sum, item) => sum + item.amount, 0).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Total a cobrar */}
      <div className="border-t border-blue-300 pt-3">
        <div className="flex items-center justify-between">
          <span className="text-sm text-blue-800 font-medium font-roboto">Total a cobrar:</span>
          <div className="text-right">
            <span className="text-2xl font-bold text-blue-600 font-exo">
              {currency} {amount.toFixed(2)}
            </span>
            <div className="text-xs text-blue-600 font-roboto">Incluye impuestos</div>
          </div>
        </div>
      </div>

      {/* Información adicional */}
      <div className="mt-3 pt-3 border-t border-blue-300">
        <div className="flex items-center text-xs text-blue-600">
          <i className="fas fa-info-circle mr-2"></i>
          <span className="font-roboto">
            El cargo aparecerá en tu estado de cuenta como "HelpMED - Servicio Médico"
          </span>
        </div>
      </div>
    </div>
  )
}

export default PaymentSummary
