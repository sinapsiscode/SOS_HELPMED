import PropTypes from 'prop-types'
import EmergencyContact from './EmergencyContact'

/**
 * Sección de contactos de emergencia
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const EmergencyContacts = ({ contacts, onCallContact }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Contactos de Emergencia</h3>

    <div className="space-y-3">
      {contacts.map((contact) => (
        <EmergencyContact
          key={contact.id}
          contact={contact}
          onCall={() => onCallContact(contact)}
        />
      ))}
    </div>

    <div className="mt-4 text-xs text-gray-500 text-center">
      <i className="fas fa-info-circle mr-1"></i>
      Contacto principal + {contacts.length - 1} contacto{contacts.length !== 2 ? 's' : ''} adicional
      {contacts.length !== 2 ? 'es' : ''} permitido{contacts.length !== 2 ? 's' : ''}
    </div>
  </div>
)

EmergencyContacts.propTypes = {
  contacts: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
      name: PropTypes.string.isRequired,
      relationship: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
      isPrimary: PropTypes.bool.isRequired
    })
  ).isRequired,
  onCallContact: PropTypes.func.isRequired
}

export default EmergencyContacts