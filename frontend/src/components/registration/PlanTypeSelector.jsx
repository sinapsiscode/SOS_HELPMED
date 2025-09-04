import PropTypes from 'prop-types'

/**
 * Selector de tipo de plan
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PlanTypeSelector = ({ formData, planOptions, onInputChange }) => (
  <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-6">
    <h3 className="text-lg font-exo font-semibold text-blue-800 mb-4">
      <i className="fas fa-clipboard-list mr-2"></i>
      Tipo de Plan Solicitado
    </h3>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
          Tipo de Plan *
        </label>
        <select
          name="planType"
          value={formData.planType}
          onChange={onInputChange}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        >
          <option value="">Selecciona un tipo de plan</option>
          <option value="familiar">Plan Familiar</option>
          <option value="corporativo">Plan Corporativo</option>
          <option value="externo">Afiliado Externo</option>
        </select>
      </div>

      {formData.planType && formData.planType !== 'externo' && (
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Plan Específico *
          </label>
          <select
            name="planSubtype"
            value={formData.planSubtype}
            onChange={onInputChange}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            required
          >
            <option value="">Selecciona un plan</option>
            {formData.planType &&
              Object.entries(planOptions[formData.planType]).map(([key, label]) => (
                <option key={key} value={key}>
                  {label}
                </option>
              ))}
          </select>
        </div>
      )}
    </div>

    {!formData.planType && (
      <div className="mt-4 p-4 bg-blue-100 rounded-lg">
        <p className="text-sm text-blue-700">
          <i className="fas fa-info-circle mr-2"></i>
          Por favor, selecciona primero el tipo de plan para continuar con el registro.
        </p>
      </div>
    )}
  </div>
)

PlanTypeSelector.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    planSubtype: PropTypes.string.isRequired
  }).isRequired,
  planOptions: PropTypes.objectOf(
    PropTypes.objectOf(PropTypes.string)
  ).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default PlanTypeSelector