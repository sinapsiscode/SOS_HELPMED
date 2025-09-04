import PropTypes from 'prop-types'

/**
 * Botones de acción del formulario de registro
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const RegistrationFormActions = ({ formData, isSubmitting, onBack }) => {
  if (!formData.planType) return null

  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onBack}
        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 font-exo font-medium hover:bg-gray-50 transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-helpmed-blue to-primary-blue text-white rounded-lg font-exo font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <div className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Enviando...
          </div>
        ) : (
          'Enviar Solicitud'
        )}
      </button>
    </div>
  )
}

RegistrationFormActions.propTypes = {
  formData: PropTypes.shape({
    planType: PropTypes.string.isRequired
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired
}

export default RegistrationFormActions