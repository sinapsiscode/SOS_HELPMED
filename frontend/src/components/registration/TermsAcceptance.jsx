import PropTypes from 'prop-types'

/**
 * Sección de aceptación de términos y condiciones
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const TermsAcceptance = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
    <div className="flex items-start space-x-3">
      <input
        type="checkbox"
        id="terms"
        required
        className="mt-1 w-4 h-4 text-helpmed-blue bg-gray-100 border-gray-300 rounded focus:ring-helpmed-blue"
      />
      <label htmlFor="terms" className="text-sm text-gray-700 font-roboto">
        Acepto los{' '}
        <span className="text-helpmed-blue font-medium">términos y condiciones</span>{' '}
        de Help MED y autorizo el tratamiento de mis datos personales según la
        política de privacidad.
      </label>
    </div>
  </div>
)

TermsAcceptance.propTypes = {}

export default TermsAcceptance