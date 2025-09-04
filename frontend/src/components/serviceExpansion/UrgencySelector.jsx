import PropTypes from 'prop-types'

/**
 * Selector de nivel de urgencia
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const UrgencySelector = ({ urgency, urgencyInfo, onUrgencyChange, getUrgencyColor }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-2">Nivel de Urgencia</label>
    <select
      value={urgency}
      onChange={(e) => onUrgencyChange(e.target.value)}
      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
    >
      <option value="baja">Baja - Planificación futura</option>
      <option value="media">Media - En las próximas semanas</option>
      <option value="alta">Alta - Necesito pronto</option>
    </select>
    <p className={`text-xs mt-1 ${getUrgencyColor(urgency)}`}>
      {urgencyInfo.icon} {urgencyInfo.text}
    </p>
  </div>
)

UrgencySelector.propTypes = {
  urgency: PropTypes.oneOf(['baja', 'media', 'alta']).isRequired,
  urgencyInfo: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  onUrgencyChange: PropTypes.func.isRequired,
  getUrgencyColor: PropTypes.func.isRequired
}

export default UrgencySelector