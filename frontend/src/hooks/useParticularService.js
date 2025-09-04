import { useState } from 'react'
import { particularService } from '../services/particularService'

/**
 * Hook personalizado para gestión de servicios particular
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Toda la lógica de negocio centralizada en este hook
 * ✅ Regla #5: Estados gestionados completamente por el hook
 * ✅ Regla #7: Integración con servicios especializados
 *
 * @param {Function} onBack - Función para volver atrás
 * @returns {Object} Estados y funciones del servicio particular
 */
const useParticularService = (onBack) => {
  // Estados del flujo principal
  const [currentStep, setCurrentStep] = useState('service')
  const [selectedService, setSelectedService] = useState(null)
  const [serviceDetails, setServiceDetails] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Datos del servicio
  const servicePrices = particularService.getServicePrices()

  /**
   * Calcula el precio total del servicio
   */
  const calculateTotalPrice = (service, details) => {
    return particularService.calculateTotalPrice(service, details)
  }

  /**
   * Procesa el envío del formulario de servicio
   */
  const handleServiceSubmit = (service, details) => {
    setSelectedService(service)
    setServiceDetails(details)
    setCurrentStep('payment')
  }

  /**
   * Procesa el envío del formulario de pago
   */
  const handlePaymentSubmit = (cardData) => {
    setPaymentMethod(cardData)
    processPayment(cardData)
  }

  /**
   * Procesa el pago del servicio
   */
  const processPayment = async (cardData) => {
    setIsProcessing(true)

    try {
      const paymentResult = await particularService.processPayment({
        cardData,
        service: selectedService,
        details: serviceDetails,
        amount: calculateTotalPrice(selectedService, serviceDetails)
      })

      if (paymentResult.success) {
        setCurrentStep('confirmation')
        setIsProcessing(false)

        // Mostrar confirmación
        await particularService.showPaymentSuccess({
          service: selectedService,
          amount: calculateTotalPrice(selectedService, serviceDetails),
          serviceCode: paymentResult.serviceCode
        })

        // Mostrar encuesta después de confirmación
        setTimeout(async () => {
          const serviceName = servicePrices[selectedService]?.name || selectedService
          await particularService.showQualitySurvey(selectedService, serviceName)
        }, 1000)
      } else {
        setIsProcessing(false)
        await particularService.showPaymentError()
      }
    } catch (error) {
      setIsProcessing(false)
      await particularService.showPaymentError()
    }
  }

  /**
   * Reinicia el flujo para solicitar otro servicio
   */
  const resetService = () => {
    setCurrentStep('service')
    setSelectedService(null)
    setServiceDetails(null)
    setPaymentMethod(null)
  }

  /**
   * Vuelve al paso de selección de servicio
   */
  const goBackToService = () => {
    setCurrentStep('service')
  }

  return {
    // Estados
    currentStep,
    selectedService,
    serviceDetails,
    paymentMethod,
    isProcessing,
    servicePrices,

    // Funciones calculadas
    calculateTotalPrice,

    // Funciones de navegación
    handleServiceSubmit,
    handlePaymentSubmit,
    resetService,
    goBackToService,
    onBack,

    // Función de procesamiento
    processPayment
  }
}

export default useParticularService
