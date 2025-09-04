import PropTypes from 'prop-types'

/**
 * Item individual de contacto de emergencia
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const EmergencyContact = ({ contact, onCall }) => (
  <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
    <div>
      <div className="flex items-center space-x-2">
        <p className="font-medium text-red-800">{contact.name}</p>
        {contact.isPrimary && (
          <span className="bg-red-200 text-red-800 text-xs px-2 py-1 rounded-full">Principal</span>
        )}
      </div>
      <p className="text-sm text-red-600">{contact.relationship}</p>
    </div>
    <div className="text-right">
      <p className="font-medium text-red-800">{contact.phone}</p>
      <button onClick={onCall} className="text-xs text-red-600 hover:text-red-800 transition-colors">
        <i className="fas fa-phone mr-1"></i>
        Llamar
      </button>
    </div>
  </div>
)

EmergencyContact.propTypes = {
  contact: PropTypes.shape({
    name: PropTypes.string.isRequired,
    relationship: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    isPrimary: PropTypes.bool.isRequired
  }).isRequired,
  onCall: PropTypes.func.isRequired
}

export default EmergencyContact