import PropTypes from 'prop-types'

/**
 * Componente trigger para abrir modal de expansión
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceExpansionTrigger = ({ trigger, onOpen }) => {
  const triggers = {
    button: (
      <button
        onClick={onOpen}
        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2"
      >
        <i className="fas fa-expand-arrows-alt" />
        <span>Ampliar Servicios</span>
      </button>
    ),
    link: (
      <button
        onClick={onOpen}
        className="text-blue-600 hover:text-blue-700 font-medium transition-colors flex items-center space-x-1"
      >
        <i className="fas fa-plus-circle" />
        <span>Solicitar más servicios</span>
      </button>
    ),
    alert: null
  }

  return triggers[trigger] || null
}

ServiceExpansionTrigger.propTypes = {
  trigger: PropTypes.oneOf(['button', 'link', 'alert']).isRequired,
  onOpen: PropTypes.func.isRequired
}

export default ServiceExpansionTrigger