import { useState, useEffect } from 'react'
import { serviceRequestService } from '../services/serviceRequestService'

/**
 * Hook personalizado para gestión de formulario de solicitud de servicio
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Toda la lógica de negocio centralizada en este hook
 * ✅ Regla #5: Estados gestionados completamente por el hook
 * ✅ Regla #7: Integración con servicios especializados
 *
 * @param {Function} onSubmit - Función para enviar el formulario
 * @param {Object} prices - Configuración de precios
 * @param {Function} calculateTotal - Función para calcular precio total
 * @returns {Object} Estados y funciones del formulario de servicio
 */
const useServiceRequest = (onSubmit, prices, calculateTotal) => {
  // Estados del formulario
  const [selectedService, setSelectedService] = useState('')
  const [formData, setFormData] = useState({
    patientName: '',
    patientPhone: '',
    patientDNI: '',
    location: '',
    symptoms: '',
    urgencyLevel: 'normal',
    preferredTime: 'now'
  })
  const [errors, setErrors] = useState({})
  const [estimatedPrice, setEstimatedPrice] = useState(0)

  // Calcular precio estimado cuando cambia la selección o datos
  useEffect(() => {
    if (selectedService) {
      const price = calculateTotal(selectedService, formData)
      setEstimatedPrice(price)
    }
  }, [selectedService, formData, calculateTotal])

  /**
   * Maneja el cambio en los campos del formulario
   */
  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar error cuando el usuario empieza a escribir
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  /**
   * Maneja la selección de servicio
   */
  const handleServiceSelect = (serviceType) => {
    setSelectedService(serviceType)

    // Limpiar error de servicio si existía
    if (errors.service) {
      setErrors((prev) => ({ ...prev, service: '' }))
    }
  }

  /**
   * Valida el formulario completo
   */
  const validateForm = () => {
    return serviceRequestService.validateForm({
      selectedService,
      formData
    })
  }

  /**
   * Maneja el envío del formulario
   */
  const handleSubmit = (e) => {
    e.preventDefault()

    const validation = validateForm()

    if (validation.isValid) {
      onSubmit(selectedService, formData)
    } else {
      setErrors(validation.errors)
    }
  }

  /**
   * Obtiene información del servicio (icono, color)
   */
  const getServiceInfo = (type) => {
    return serviceRequestService.getServiceInfo(type)
  }

  /**
   * Determina si es horario nocturno
   */
  const isNightTime = () => {
    const hour = new Date().getHours()
    return hour >= 22 || hour < 6
  }

  /**
   * Obtiene el mensaje de tarifa
   */
  const getPriceMessage = () => {
    return isNightTime() ? 'Incluye recargo nocturno' : 'Tarifa regular'
  }

  return {
    // Estados
    selectedService,
    formData,
    errors,
    estimatedPrice,
    prices,

    // Funciones de manipulación
    handleInputChange,
    handleServiceSelect,
    handleSubmit,

    // Funciones auxiliares
    getServiceInfo,
    getPriceMessage,
    isNightTime
  }
}

export default useServiceRequest
