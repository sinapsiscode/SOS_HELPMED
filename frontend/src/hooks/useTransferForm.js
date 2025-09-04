import { useState, useEffect, useCallback } from 'react'

/**
 * Hook especializado para gesti�n del formulario de traslados
 *  Cumple reglas de tama�o: <100 l�neas
 *  Responsabilidad �nica: Form state and validation
 *  Validaci�n exhaustiva y manejo de errores
 */
const useTransferForm = (selectedDate, selectedTimeSlot, currentUser) => {
  const [formData, setFormData] = useState({
    selectedTime: '',
    origin: '',
    destination: '',
    patientName: '',
    transferType: 'medical_appointment',
    otherTransferType: '',
    reason: '',
    otherReason: '',
    hospitalizationReason: '',
    appointmentTime: '',
    specialRequirements: '',
    notes: '',
    isRoundTrip: false,
    waitingType: 'con_espera',
    waitingTime: '60',
    // Opciones adicionales que faltaban
    requiresWheelchair: false,
    requiresOxygen: false,
    requiresStretcher: false
  })

  const [errors, setErrors] = useState({})

  // Configuraciones del formulario
  const transferTypes = [
    { value: 'medical_appointment', label: 'Cita M�dica' },
    { value: 'medical_procedure', label: 'Procedimiento M�dico' },
    { value: 'routine_checkup', label: 'Control de Rutina' },
    { value: 'therapy_session', label: 'Sesi�n de Terapia' },
    { value: 'dialysis', label: 'Di�lisis' },
    { value: 'other', label: 'Otro' }
  ]

  const reasons = [
    'Alta hospitalaria',
    'Consulta m�dica de rutina',
    'Cita con especialista',
    'Ex�menes m�dicos',
    'Procedimiento ambulatorio',
    'Control post-operatorio',
    'Terapia f�sica',
    'Hemodi�lisis',
    'Oncolog�a',
    'Cardiolog�a',
    'Neurolog�a',
    'Otro'
  ]

  // Inicializar con la hora seleccionada del calendario
  useEffect(() => {
    if (selectedTimeSlot) {
      setFormData((prev) => ({
        ...prev,
        selectedTime: selectedTimeSlot.timeString
      }))
    }
  }, [selectedTimeSlot])

  /**
   * Actualizar campo del formulario
   */
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value
    }))
    
    // Limpiar error del campo cuando se actualiza
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  /**
   * Validar formulario completo
   */
  const validateForm = useCallback(() => {
    const newErrors = {}

    if (!formData.selectedTime) newErrors.selectedTime = 'Selecciona un horario'
    if (!formData.origin.trim()) newErrors.origin = 'Ingresa la direcci�n de origen'
    if (!formData.destination.trim()) newErrors.destination = 'Ingresa la direcci�n de destino'
    if (!formData.patientName.trim()) newErrors.patientName = 'Ingresa el nombre del paciente'
    if (!formData.reason.trim()) newErrors.reason = 'Selecciona o especifica el motivo'

    if (formData.reason === 'Otro' && !formData.otherReason.trim()) {
      newErrors.otherReason = 'Por favor especifica el motivo del traslado'
    }

    if (formData.reason === 'Alta hospitalaria' && !formData.hospitalizationReason.trim()) {
      newErrors.hospitalizationReason = 'Por favor especifica el motivo de la internaci�n'
    }

    if (formData.transferType === 'other' && !formData.otherTransferType.trim()) {
      newErrors.otherTransferType = 'Por favor describe el tipo de traslado'
    }

    if (formData.transferType === 'medical_appointment' && !formData.appointmentTime) {
      newErrors.appointmentTime = 'Ingresa la hora de la cita m�dica'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formData])

  /**
   * Preparar datos del traslado para env�o
   */
  const prepareTransferData = useCallback(() => {
    if (!selectedDate || !currentUser) return null

    return {
      id: `transfer_${Date.now()}`,
      scheduledDate: new Date(
        `${selectedDate.toDateString()} ${formData.selectedTime}`
      ).toISOString(),
      origin: formData.origin,
      destination: formData.destination,
      patientName: formData.patientName,
      reason: formData.reason === 'Otro' ? formData.otherReason : formData.reason,
      transferType: formData.transferType === 'other' ? formData.otherTransferType : formData.transferType,
      appointmentTime: formData.appointmentTime,
      hospitalizationReason: formData.hospitalizationReason,
      specialRequirements: formData.specialRequirements,
      notes: formData.notes,
      isRoundTrip: formData.isRoundTrip,
      waitingTime: formData.waitingTime,
      waitingType: formData.waitingType,
      status: 'scheduled',
      createdAt: new Date().toISOString(),
      userId: currentUser.id
    }
  }, [formData, selectedDate, currentUser])

  /**
   * Resetear formulario
   */
  const resetForm = useCallback(() => {
    setFormData({
      selectedTime: '',
      origin: '',
      destination: '',
      patientName: '',
      transferType: 'medical_appointment',
      otherTransferType: '',
      reason: '',
      otherReason: '',
      hospitalizationReason: '',
      appointmentTime: '',
      specialRequirements: '',
      notes: '',
      isRoundTrip: false,
      waitingType: 'con_espera',
      waitingTime: '60'
    })
    setErrors({})
  }, [])

  return {
    // Estados
    formData,
    errors,
    transferTypes,
    reasons,
    
    // Acciones
    updateField,
    validateForm,
    prepareTransferData,
    resetForm,
    
    // Estado de validaci�n
    isValid: Object.keys(errors).length === 0
  }
}

export default useTransferForm