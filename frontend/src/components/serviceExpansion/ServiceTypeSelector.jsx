import PropTypes from 'prop-types'

/**
 * Selector de tipo de servicio a ampliar
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceTypeSelector = ({ services, selectedService, onServiceChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-3">
      Tipo de Servicio a Ampliar
    </label>
    <div className="space-y-2">
      {services.map((service) => (
        <label
          key={service.type}
          className={`flex items-center p-3 border rounded-lg cursor-pointer transition-colors ${
            selectedService === service.type
              ? 'border-blue-500 bg-blue-50'
              : 'border-gray-300 hover:bg-gray-50'
          }`}
        >
          <input
            type="radio"
            name="serviceType"
            value={service.type}
            checked={selectedService === service.type}
            onChange={(e) => onServiceChange(e.target.value)}
            className="text-blue-600 focus:ring-blue-500"
          />
          <div className="ml-3">
            <div className="font-medium text-gray-800">
              <i className={`${service.icon} mr-2 text-blue-500`} />
              {service.name}
            </div>
            <div className="text-sm text-gray-600">{service.description}</div>
          </div>
        </label>
      ))}
    </div>
  </div>
)

ServiceTypeSelector.propTypes = {
  services: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedService: PropTypes.string,
  onServiceChange: PropTypes.func.isRequired
}

export default ServiceTypeSelector