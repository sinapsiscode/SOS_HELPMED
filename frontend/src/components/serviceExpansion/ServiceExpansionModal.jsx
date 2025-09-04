import PropTypes from 'prop-types'
import ModalHeader from './ModalHeader'
import CurrentUsageInfo from './CurrentUsageInfo'
import ServiceExpansionForm from './ServiceExpansionForm'

/**
 * Modal principal para solicitud de expansión de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #14: Estructura modular
 */
const ServiceExpansionModal = ({
  isOpen,
  onClose,
  user,
  currentUsage,
  availableServices,
  selectedService,
  reason,
  urgency,
  urgencyInfo,
  isSubmitting,
  setSelectedService,
  setReason,
  setUrgency,
  handleSubmit,
  getUrgencyColor
}) => {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <ModalHeader onClose={onClose} />
        
        {currentUsage && <CurrentUsageInfo usage={currentUsage} />}
        
        <ServiceExpansionForm
          user={user}
          availableServices={availableServices}
          selectedService={selectedService}
          reason={reason}
          urgency={urgency}
          urgencyInfo={urgencyInfo}
          isSubmitting={isSubmitting}
          onServiceChange={setSelectedService}
          onReasonChange={setReason}
          onUrgencyChange={setUrgency}
          onSubmit={handleSubmit}
          onCancel={onClose}
          getUrgencyColor={getUrgencyColor}
        />
      </div>
    </div>
  )
}

ServiceExpansionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  user: PropTypes.shape({
    profile: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired,
  currentUsage: PropTypes.shape({
    used: PropTypes.number.isRequired,
    remaining: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired
  }),
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
  setSelectedService: PropTypes.func.isRequired,
  setReason: PropTypes.func.isRequired,
  setUrgency: PropTypes.func.isRequired,
  handleSubmit: PropTypes.func.isRequired,
  getUrgencyColor: PropTypes.func.isRequired
}

export default ServiceExpansionModal