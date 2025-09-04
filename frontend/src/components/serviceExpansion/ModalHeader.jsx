import PropTypes from 'prop-types'

/**
 * Header del modal de expansión de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ModalHeader = ({ onClose }) => (
  <div className="flex items-center justify-between p-6 border-b border-gray-200">
    <div>
      <h2 className="text-xl font-bold text-gray-800">Solicitar Ampliación de Servicios</h2>
      <p className="text-gray-600 text-sm">Envía tu solicitud al equipo comercial</p>
    </div>
    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
      <i className="fas fa-times text-xl" />
    </button>
  </div>
)

ModalHeader.propTypes = {
  onClose: PropTypes.func.isRequired
}

export default ModalHeader