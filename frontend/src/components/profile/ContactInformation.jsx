import PropTypes from 'prop-types'
import ContactItem from './ContactItem'

/**
 * Sección de información de contacto
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ContactInformation = ({ userInfo }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Información de Contacto</h3>

    <div className="space-y-4">
      <ContactItem icon="fas fa-phone" label="Teléfono" value={userInfo.phone} />
      <ContactItem icon="fas fa-envelope" label="Email" value={userInfo.email} />
      <ContactItem icon="fas fa-map-marker-alt" label="Dirección" value={userInfo.address} />
    </div>
  </div>
)

ContactInformation.propTypes = {
  userInfo: PropTypes.shape({
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    address: PropTypes.string.isRequired
  }).isRequired
}

export default ContactInformation