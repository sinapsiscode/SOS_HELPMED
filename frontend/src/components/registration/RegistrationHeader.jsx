import PropTypes from 'prop-types'

/**
 * Header del formulario de registro
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const RegistrationHeader = ({ onBack }) => (
  <div className="text-center mb-8">
    <button
      onClick={onBack}
      className="absolute top-6 left-6 text-gray-600 hover:text-helpmed-blue transition-colors"
    >
      <i className="fas fa-arrow-left text-xl"></i>
    </button>

    <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-r from-helpmed-blue to-primary-blue rounded-full flex items-center justify-center">
      <i className="fas fa-user-plus text-white text-2xl"></i>
    </div>
    <h1 className="text-2xl font-exo font-bold text-gray-800 mb-2">
      Solicitud de Registro
    </h1>
    <p className="text-gray-600 font-roboto">
      Completa el formulario para solicitar tu membresía
    </p>
  </div>
)

RegistrationHeader.propTypes = {
  onBack: PropTypes.func.isRequired
}

export default RegistrationHeader