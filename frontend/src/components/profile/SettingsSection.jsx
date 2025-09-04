import PropTypes from 'prop-types'
import SettingItem from './SettingItem'

/**
 * Sección de configuraciones
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const SettingsSection = ({ settingsItems, onSettingAction }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Configuración</h3>

    <div className="space-y-3">
      {settingsItems.map((item) => (
        <SettingItem
          key={item.id}
          icon={item.icon}
          title={item.title}
          description={item.description}
          onClick={() => onSettingAction(item.id)}
        />
      ))}
    </div>
  </div>
)

SettingsSection.propTypes = {
  settingsItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired
    })
  ).isRequired,
  onSettingAction: PropTypes.func.isRequired
}

export default SettingsSection