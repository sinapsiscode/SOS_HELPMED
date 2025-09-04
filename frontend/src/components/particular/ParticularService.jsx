import React from 'react'
import useParticularService from '../../hooks/useParticularService'
import CreditCardRegistration from './CreditCardRegistration'
import ServiceRequestForm from './ServiceRequestForm'
import PricingSummary from './PricingSummary'
import ProgressSteps from './ProgressSteps'
import ConfirmationScreen from './ConfirmationScreen'
import ServiceWarning from './ServiceWarning'

/**
 * Componente de servicio particular refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useParticularService
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onBack - Función para volver atrás
 * @returns {JSX.Element} Flujo de servicio particular optimizado
 */
const ParticularService = ({ onBack }) => {
  const {
    // Estados
    currentStep,
    selectedService,
    serviceDetails,
    isProcessing,
    servicePrices,

    // Funciones
    calculateTotalPrice,
    handleServiceSubmit,
    handlePaymentSubmit,
    resetService,
    goBackToService
  } = useParticularService(onBack)

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 'service':
        return (
          <div className="space-y-6">
            <ServiceWarning />
            <ServiceRequestForm
              onSubmit={handleServiceSubmit}
              prices={servicePrices}
              calculateTotal={calculateTotalPrice}
            />
          </div>
        )

      case 'payment':
        return (
          <div className="space-y-6">
            <PricingSummary
              service={selectedService}
              details={serviceDetails}
              prices={servicePrices}
              total={calculateTotalPrice(selectedService, serviceDetails)}
            />

            <CreditCardRegistration
              onSubmit={handlePaymentSubmit}
              isProcessing={isProcessing}
              amount={calculateTotalPrice(selectedService, serviceDetails)}
            />

            <button
              onClick={goBackToService}
              className="w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-roboto"
            >
              <i className="fas fa-arrow-left mr-2"></i>
              Volver a selección de servicio
            </button>
          </div>
        )

      case 'confirmation':
        return (
          <ConfirmationScreen
            selectedService={selectedService}
            serviceDetails={serviceDetails}
            servicePrices={servicePrices}
            calculateTotalPrice={calculateTotalPrice}
            onRequestNew={resetService}
            onBack={onBack}
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-helpmed-blue/5 to-helpmed-red/5 p-3 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-4 sm:mb-6">
            <button
              onClick={onBack}
              className="text-gray-600 hover:text-gray-800 transition-colors p-1"
            >
              <i className="fas fa-arrow-left text-lg sm:text-xl"></i>
            </button>
            <h1 className="text-lg sm:text-2xl font-bold text-gray-800 font-exo">
              Servicio Particular
            </h1>
            <div className="w-8"></div>
          </div>

          <ProgressSteps currentStep={currentStep} />

          {renderCurrentStep()}
        </div>
      </div>
    </div>
  )
}

export default ParticularService
