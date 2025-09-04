import PropTypes from 'prop-types'

/**
 * Información de contacto del usuario
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ContactInfo = ({ user }) => (
  <div className="bg-blue-50 rounded-lg p-4">
    <h4 className="font-medium text-blue-800 mb-2">Información de Contacto</h4>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
      <div>
        <span className="text-blue-700 font-medium">Teléfono:</span>
        <span className="text-blue-600 ml-2">{user?.profile?.phone}</span>
      </div>
      <div>
        <span className="text-blue-700 font-medium">Email:</span>
        <span className="text-blue-600 ml-2">{user?.profile?.email}</span>
      </div>
    </div>
    <p className="text-xs text-blue-600 mt-2">Te contactaremos usando esta información</p>
  </div>
)

ContactInfo.propTypes = {
  user: PropTypes.shape({
    profile: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired
}

export default ContactInfo