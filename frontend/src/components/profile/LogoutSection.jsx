import PropTypes from 'prop-types'

/**
 * Sección de cierre de sesión
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const LogoutSection = ({ onLogout }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <button
      onClick={onLogout}
      className="w-full bg-red-50 hover:bg-red-100 text-red-600 py-3 px-4 rounded-lg font-medium transition-colors"
    >
      <i className="fas fa-sign-out-alt mr-2"></i>
      Cerrar Sesión
    </button>
  </div>
)

LogoutSection.propTypes = {
  onLogout: PropTypes.func.isRequired
}

export default LogoutSection