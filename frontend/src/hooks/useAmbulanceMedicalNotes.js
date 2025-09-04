import { useState, useCallback } from 'react'
import ambulanceService from '../services/ambulanceService'

/**
 * Hook especializado para gestión de notas médicas de ambulancia
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Medical notes management
 * ✅ Manejo de errores incluido
 */
const useAmbulanceMedicalNotes = (userId) => {
  const [patientNotes, setPatientNotes] = useState('')
  const [currentPatient, setCurrentPatient] = useState(null)
  const [showMedicalNotesModal, setShowMedicalNotesModal] = useState(false)
  const [error, setError] = useState(null)

  // Guardar notas médicas
  const saveMedicalNotes = useCallback(async () => {
    try {
      if (!patientNotes.trim()) {
        ambulanceService.showValidationError('Por favor ingrese las notas médicas')
        return
      }

      if (!currentPatient) {
        ambulanceService.showValidationError('No hay paciente seleccionado')
        return
      }

      await ambulanceService.saveMedicalNotes({
        patientId: currentPatient.id,
        notes: patientNotes,
        timestamp: new Date().toISOString(),
        ambulanceId: userId
      })

      ambulanceService.showNotesSuccess()
      setShowMedicalNotesModal(false)
      setPatientNotes('')
    } catch (err) {
      const errorMessage = ambulanceService.handleError(err, 'Error al guardar notas médicas')
      setError(errorMessage)
    }
  }, [patientNotes, currentPatient, userId])

  // Configurar paciente actual para notas
  const setPatientForNotes = useCallback((patient) => {
    setCurrentPatient(patient)
    setShowMedicalNotesModal(true)
  }, [])

  return {
    patientNotes,
    currentPatient,
    showMedicalNotesModal,
    error,
    setPatientNotes,
    setCurrentPatient,
    setShowMedicalNotesModal,
    saveMedicalNotes,
    setPatientForNotes,
    clearError: () => setError(null)
  }
}

export default useAmbulanceMedicalNotes