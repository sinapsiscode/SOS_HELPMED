import PropTypes from 'prop-types'

/**
 * Campo de entrada para el motivo de la solicitud
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ReasonInput = ({ reason, onReasonChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Motivo de la Solicitud</label>
    <textarea
      value={reason}
      onChange={(e) => onReasonChange(e.target.value)}
      rows={4}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      placeholder="Explica brevemente por qué necesitas ampliar tus servicios. Ej: Mayor demanda de servicios médicos, crecimiento del equipo, necesidades especiales, etc."
      required
    />
    <p className="text-xs text-gray-500 mt-1">
      Entre más detalles proporciones, mejor podremos ayudarte
    </p>
  </div>
)

ReasonInput.propTypes = {
  reason: PropTypes.string.isRequired,
  onReasonChange: PropTypes.func.isRequired
}

export default ReasonInput