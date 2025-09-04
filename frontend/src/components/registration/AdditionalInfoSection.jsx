import PropTypes from 'prop-types'

/**
 * Sección de información adicional
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const AdditionalInfoSection = ({ formData, onInputChange }) => {
  // No mostrar información adicional para planes corporativos y familiares
  if (formData.planType === 'corporativo' || formData.planType === 'familiar') return null

  return (
    <div className="bg-gray-50 rounded-lg p-6">
      <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
        Información Adicional
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Condiciones Médicas Relevantes
          </label>
          <textarea
            name="medicalConditions"
            value={formData.medicalConditions}
            onChange={onInputChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            placeholder="Describe cualquier condición médica relevante..."
          />
        </div>
        <div>
          <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
            Comentarios Adicionales
          </label>
          <textarea
            name="comments"
            value={formData.comments}
            onChange={onInputChange}
            rows="3"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
            placeholder="Cualquier información adicional que desees compartir..."
          />
        </div>
      </div>
    </div>
  )
}

AdditionalInfoSection.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired,
    medicalConditions: PropTypes.string.isRequired,
    comments: PropTypes.string.isRequired
  }).isRequired,
  onInputChange: PropTypes.func.isRequired
}

export default AdditionalInfoSection