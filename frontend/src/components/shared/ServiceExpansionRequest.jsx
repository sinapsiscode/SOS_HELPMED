import React from 'react'
import PropTypes from 'prop-types'
import useServiceExpansion from '../../hooks/useServiceExpansion'
import ServiceExpansionTrigger from '../serviceExpansion/ServiceExpansionTrigger'
import ServiceExpansionModal from '../serviceExpansion/ServiceExpansionModal'

/**
 * Componente principal para solicitar ampliación de servicios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 55 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: PropTypes definidos
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const ServiceExpansionRequest = ({ user, serviceType = null, trigger = 'button' }) => {
  const {
    isOpen,
    selectedService,
    reason,
    urgency,
    isSubmitting,
    currentUsage,
    availableServices,
    urgencyInfo,
    setSelectedService,
    setReason,
    setUrgency,
    openModal,
    closeModal,
    handleSubmit,
    getUrgencyColor
  } = useServiceExpansion(user, serviceType)

  return (
    <>
      <ServiceExpansionTrigger trigger={trigger} onOpen={openModal} />

      <ServiceExpansionModal
        isOpen={isOpen}
        onClose={closeModal}
        user={user}
        currentUsage={currentUsage}
        availableServices={availableServices}
        selectedService={selectedService}
        reason={reason}
        urgency={urgency}
        urgencyInfo={urgencyInfo}
        isSubmitting={isSubmitting}
        setSelectedService={setSelectedService}
        setReason={setReason}
        setUrgency={setUrgency}
        handleSubmit={handleSubmit}
        getUrgencyColor={getUrgencyColor}
      />
    </>
  )
}

ServiceExpansionRequest.propTypes = {
  user: PropTypes.shape({
    profile: PropTypes.shape({
      phone: PropTypes.string,
      email: PropTypes.string
    })
  }).isRequired,
  serviceType: PropTypes.string,
  trigger: PropTypes.oneOf(['button', 'link', 'alert'])
}

export default ServiceExpansionRequest
