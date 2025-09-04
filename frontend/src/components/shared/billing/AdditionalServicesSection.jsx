import PropTypes from 'prop-types'

/**
 * Sección de servicios adicionales
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const AdditionalServicesSection = ({ services, formatCurrency }) => (
  <div className="space-y-2">
    <h4 className="font-medium text-gray-700">Servicios Adicionales</h4>
    {services.map((service, index) => (
      <div key={index} className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
        <div className="flex justify-between items-center">
          <span className="text-yellow-700 text-sm">{service.description}</span>
          <span className="font-medium text-yellow-800">{formatCurrency(service.cost)}</span>
        </div>
        <div className="text-xs text-yellow-600">
          {new Date(service.date).toLocaleDateString('es-PE')}
        </div>
      </div>
    ))}
  </div>
)

AdditionalServicesSection.propTypes = {
  services: PropTypes.array.isRequired,
  formatCurrency: PropTypes.func.isRequired
}

export default AdditionalServicesSection