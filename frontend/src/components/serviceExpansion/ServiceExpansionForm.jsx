import PropTypes from 'prop-types'
import ServiceTypeSelector from './ServiceTypeSelector'
import UrgencySelector from './UrgencySelector'
import ReasonInput from './ReasonInput'
import ContactInfo from './ContactInfo'
import ActionButtons from './ActionButtons'

/**
 * Formulario principal de expansión de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #14: Estructura modular
 */
const ServiceExpansionForm = ({
  user,
  availableServices,
  selectedService,
  reason,
  urgency,
  urgencyInfo,
  isSubmitting,
  onServiceChange,
  onReasonChange,
  onUrgencyChange,
  onSubmit,
  onCancel,
  getUrgencyColor
}) => (
  <form onSubmit={onSubmit} className="p-6 space-y-6">
    <ServiceTypeSelector
      services={availableServices}
      selectedService={selectedService}
      onServiceChange={onServiceChange}
    />

    <UrgencySelector
      urgency={urgency}
      urgencyInfo={urgencyInfo}
      onUrgencyChange={onUrgencyChange}
      getUrgencyColor={getUrgencyColor}
    />

    <ReasonInput 
      reason={reason} 
      onReasonChange={onReasonChange} 
    />

    <ContactInfo user={user} />

    <ActionButtons 
      onCancel={onCancel} 
      isSubmitting={isSubmitting} 
    />
  </form>
)

ServiceExpansionForm.propTypes = {
  user: PropTypes.shape({
    profile: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired,
  availableServices: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      name: PropTypes.string.isRequired,
      description: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  ).isRequired,
  selectedService: PropTypes.string,
  reason: PropTypes.string.isRequired,
  urgency: PropTypes.oneOf(['baja', 'media', 'alta']).isRequired,
  urgencyInfo: PropTypes.shape({
    icon: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired
  }).isRequired,
  isSubmitting: PropTypes.bool.isRequired,
  onServiceChange: PropTypes.func.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  onUrgencyChange: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  getUrgencyColor: PropTypes.func.isRequired
}

export default ServiceExpansionForm