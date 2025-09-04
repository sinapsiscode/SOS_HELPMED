/**
 * Servicio especializado para solicitudes de servicio particular
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Servicio especializado con responsabilidad única
 * ✅ Regla #2: Lógica de negocio separada de componentes
 * ✅ Regla #6: Manejo centralizado de validaciones
 *
 * Responsabilidades:
 * - Validación de formularios
 * - Configuración de servicios (iconos, colores)
 * - Reglas de negocio para solicitudes
 * - Formateo de datos
 */
class ServiceRequestService {
  constructor() {
    // Configuración de iconos para cada tipo de servicio
    this.serviceIcons = {
      EMERGENCIA: 'fas fa-ambulance',
      URGENCIA: 'fas fa-hospital',
      MEDICO_DOMICILIO: 'fas fa-user-md',
      TRASLADO_PROGRAMADO: 'fas fa-shuttle-van',
      ZONA_PROTEGIDA: 'fas fa-shield-alt'
    }

    // Configuración de colores para cada tipo de servicio
    this.serviceColors = {
      EMERGENCIA: 'red',
      URGENCIA: 'orange',
      MEDICO_DOMICILIO: 'blue',
      TRASLADO_PROGRAMADO: 'green',
      ZONA_PROTEGIDA: 'purple'
    }

    // Patrones de validación
    this.validationPatterns = {
      phone: /^[0-9]{9}$/,
      dni: /^[0-9]{8}$/
    }

    // Mensajes de error
    this.errorMessages = {
      service: 'Debe seleccionar un servicio',
      patientName: 'Nombre del paciente requerido',
      patientPhone: {
        required: 'Teléfono requerido',
        invalid: 'Teléfono debe tener 9 dígitos'
      },
      patientDNI: {
        required: 'DNI requerido',
        invalid: 'DNI debe tener 8 dígitos'
      },
      location: 'Dirección requerida',
      symptoms: {
        required: 'Debe describir los síntomas',
        tooShort: 'Descripción muy corta (mínimo 10 caracteres)'
      }
    }
  }

  /**
   * Obtiene el icono del servicio
   */
  getServiceIcon(type) {
    return this.serviceIcons[type] || 'fas fa-medkit'
  }

  /**
   * Obtiene el color del servicio
   */
  getServiceColor(type) {
    return this.serviceColors[type] || 'gray'
  }

  /**
   * Obtiene información completa del servicio
   */
  getServiceInfo(type) {
    return {
      icon: this.getServiceIcon(type),
      color: this.getServiceColor(type)
    }
  }

  /**
   * Valida un campo específico
   */
  validateField(field, value, formData = {}) {
    switch (field) {
      case 'patientName':
        return this.validatePatientName(value)

      case 'patientPhone':
        return this.validatePhone(value)

      case 'patientDNI':
        return this.validateDNI(value)

      case 'location':
        return this.validateLocation(value)

      case 'symptoms':
        return this.validateSymptoms(value)

      default:
        return { isValid: true }
    }
  }

  /**
   * Valida el nombre del paciente
   */
  validatePatientName(name) {
    if (!name || !name.trim()) {
      return {
        isValid: false,
        error: this.errorMessages.patientName
      }
    }
    return { isValid: true }
  }

  /**
   * Valida el teléfono
   */
  validatePhone(phone) {
    if (!phone || !phone.trim()) {
      return {
        isValid: false,
        error: this.errorMessages.patientPhone.required
      }
    }

    const cleanPhone = phone.replace(/\s/g, '')
    if (!this.validationPatterns.phone.test(cleanPhone)) {
      return {
        isValid: false,
        error: this.errorMessages.patientPhone.invalid
      }
    }

    return { isValid: true }
  }

  /**
   * Valida el DNI
   */
  validateDNI(dni) {
    if (!dni || !dni.trim()) {
      return {
        isValid: false,
        error: this.errorMessages.patientDNI.required
      }
    }

    if (!this.validationPatterns.dni.test(dni)) {
      return {
        isValid: false,
        error: this.errorMessages.patientDNI.invalid
      }
    }

    return { isValid: true }
  }

  /**
   * Valida la ubicación
   */
  validateLocation(location) {
    if (!location || !location.trim()) {
      return {
        isValid: false,
        error: this.errorMessages.location
      }
    }
    return { isValid: true }
  }

  /**
   * Valida los síntomas
   */
  validateSymptoms(symptoms) {
    if (!symptoms || !symptoms.trim()) {
      return {
        isValid: false,
        error: this.errorMessages.symptoms.required
      }
    }

    if (symptoms.trim().length < 10) {
      return {
        isValid: false,
        error: this.errorMessages.symptoms.tooShort
      }
    }

    return { isValid: true }
  }

  /**
   * Valida todo el formulario
   */
  validateForm({ selectedService, formData }) {
    const errors = {}

    // Validar selección de servicio
    if (!selectedService) {
      errors.service = this.errorMessages.service
    }

    // Validar cada campo del formulario
    const fieldsToValidate = ['patientName', 'patientPhone', 'patientDNI', 'location', 'symptoms']

    fieldsToValidate.forEach((field) => {
      const validation = this.validateField(field, formData[field], formData)
      if (!validation.isValid) {
        errors[field] = validation.error
      }
    })

    return {
      isValid: Object.keys(errors).length === 0,
      errors
    }
  }

  /**
   * Formatea los datos del formulario para envío
   */
  formatFormData({ selectedService, formData }) {
    return {
      serviceType: selectedService,
      patient: {
        name: formData.patientName.trim(),
        phone: formData.patientPhone.replace(/\s/g, ''),
        dni: formData.patientDNI,
        location: formData.location.trim(),
        symptoms: formData.symptoms.trim(),
        urgencyLevel: formData.urgencyLevel,
        preferredTime: formData.preferredTime
      },
      timestamp: new Date().toISOString(),
      requestId: this.generateRequestId()
    }
  }

  /**
   * Genera un ID único para la solicitud
   */
  generateRequestId() {
    return `REQ-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Determina si es horario nocturno
   */
  isNightTime() {
    const hour = new Date().getHours()
    return hour >= 22 || hour < 6
  }

  /**
   * Obtiene información sobre el horario actual
   */
  getTimeInfo() {
    return {
      isNight: this.isNightTime(),
      message: this.isNightTime() ? 'Incluye recargo nocturno' : 'Tarifa regular'
    }
  }
}

// Exportar instancia singleton
export const serviceRequestService = new ServiceRequestService()
