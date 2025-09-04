import PropTypes from 'prop-types'

/**
 * Item individual de configuración
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const SettingItem = ({ icon, title, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
  >
    <i className={`${icon} text-gray-400 w-5`}></i>
    <div className="flex-1">
      <p className="font-medium text-gray-800">{title}</p>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
    <i className="fas fa-chevron-right text-gray-400"></i>
  </button>
)

SettingItem.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired
}

export default SettingItem