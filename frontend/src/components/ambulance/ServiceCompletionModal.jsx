import React, { useState } from 'react'
import PropTypes from 'prop-types'

/**
 * Modal para completar y clasificar un servicio médico
 * ARQUITECTURA MODULAR:
 * - Componente independiente y reutilizable
 * - Separación de presentación y lógica
 * - Props bien definidas con PropTypes
 * 
 * @component
 */
const ServiceCompletionModal = ({ 
  isOpen, 
  onClose, 
  onComplete, 
  patientInfo,
  emergencyCode 
}) => {
  const [formData, setFormData] = useState({
    serviceClassification: '',
    medicalDiagnosis: '',
    classificationJustification: '',
    treatmentApplied: '',
    additionalObservations: ''
  })

  const [errors, setErrors] = useState({})

  // Opciones de clasificación del servicio
  const serviceClassifications = [
    { value: 'emergency_real', label: 'Emergencia Real (Riesgo vital)', icon: '🚨', color: 'red' },
    { value: 'medical_urgency', label: 'Urgencia Médica (Atención prioritaria)', icon: '⚡', color: 'orange' },
    { value: 'home_doctor', label: 'Médico a Domicilio (Consulta regular)', icon: '👨‍⚕️', color: 'blue' },
    { value: 'scheduled_transfer', label: 'Traslado Programado', icon: '🚑', color: 'purple' },
    { value: 'false_alarm', label: 'Falsa Alarma (No requería servicio)', icon: '❌', color: 'gray' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Limpiar error del campo cuando se modifica
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.serviceClassification) {
      newErrors.serviceClassification = 'Debe seleccionar una clasificación del servicio'
    }
    
    if (!formData.medicalDiagnosis) {
      newErrors.medicalDiagnosis = 'El diagnóstico médico es obligatorio'
    }
    
    if (!formData.classificationJustification) {
      newErrors.classificationJustification = 'La justificación de la clasificación es obligatoria'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    const completionData = {
      ...formData,
      completedAt: new Date().toISOString(),
      emergencyCode,
      patientInfo
    }

    onComplete(completionData)
    
    // Resetear formulario
    setFormData({
      serviceClassification: '',
      medicalDiagnosis: '',
      classificationJustification: '',
      treatmentApplied: '',
      additionalObservations: ''
    })
    setErrors({})
  }

  const handleCancel = () => {
    // Resetear formulario al cancelar
    setFormData({
      serviceClassification: '',
      medicalDiagnosis: '',
      classificationJustification: '',
      treatmentApplied: '',
      additionalObservations: ''
    })
    setErrors({})
    onClose()
  }

  if (!isOpen) return null

  const selectedClassification = serviceClassifications.find(
    sc => sc.value === formData.serviceClassification
  )

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6 rounded-t-xl">
          <h2 className="text-2xl font-bold font-exo">Completar y Clasificar Servicio</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del Paciente */}
          <PatientInfoSection patientInfo={patientInfo} emergencyCode={emergencyCode} />

          {/* Clasificación del Servicio */}
          <ServiceClassificationSection
            value={formData.serviceClassification}
            onChange={(value) => handleInputChange('serviceClassification', value)}
            options={serviceClassifications}
            error={errors.serviceClassification}
            selectedClassification={selectedClassification}
          />

          {/* Diagnóstico Médico */}
          <DiagnosisSection
            value={formData.medicalDiagnosis}
            onChange={(value) => handleInputChange('medicalDiagnosis', value)}
            error={errors.medicalDiagnosis}
          />

          {/* Justificación de la Clasificación */}
          <JustificationSection
            value={formData.classificationJustification}
            onChange={(value) => handleInputChange('classificationJustification', value)}
            error={errors.classificationJustification}
          />

          {/* Tratamiento Aplicado */}
          <TreatmentSection
            value={formData.treatmentApplied}
            onChange={(value) => handleInputChange('treatmentApplied', value)}
          />

          {/* Observaciones Adicionales y Funciones Vitales */}
          <ObservationsSection
            value={formData.additionalObservations}
            onChange={(value) => handleInputChange('additionalObservations', value)}
          />

          {/* Acciones */}
          <FormActions onCancel={handleCancel} />
        </form>
      </div>
    </div>
  )
}

/**
 * Sección de información del paciente
 */
const PatientInfoSection = ({ patientInfo, emergencyCode }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h3 className="font-semibold text-blue-900 mb-3 font-exo">
        <i className="fas fa-user-injured mr-2"></i>
        Información del Paciente
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
        <div>
          <span className="font-medium text-blue-800">Nombre:</span>{' '}
          <span className="text-blue-700">{patientInfo?.name || 'No especificado'}</span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Edad:</span>{' '}
          <span className="text-blue-700">{patientInfo?.age || 'No especificada'} años</span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Síntomas:</span>{' '}
          <span className="text-blue-700">{patientInfo?.symptoms || 'No especificados'}</span>
        </div>
        <div>
          <span className="font-medium text-blue-800">Servicio Solicitado:</span>{' '}
          <span className="text-blue-700">{patientInfo?.requestedService || 'médical'}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Sección de clasificación del servicio
 */
const ServiceClassificationSection = ({ value, onChange, options, error, selectedClassification }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
        Clasificación del Servicio
      </label>
      <p className="text-xs text-gray-600 mb-3 font-roboto">
        Después de evaluar al paciente, ¿qué tipo de servicio fue realmente? *
      </p>
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto appearance-none ${
            error ? 'border-red-500 bg-red-50' : 'border-gray-300'
          } ${value ? 'text-gray-900' : 'text-gray-500'}`}
        >
          <option value="">-- Seleccione el tipo de servicio real --</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <i className="fas fa-chevron-down text-gray-400"></i>
        </div>
      </div>

      {/* Mensaje de advertencia */}
      <div className="mt-2 p-2 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start space-x-2">
        <i className="fas fa-exclamation-circle text-yellow-600 mt-0.5"></i>
        <p className="text-xs text-yellow-800">
          Si el servicio real difiere del solicitado, se ajustarán los contadores del plan del cliente.
        </p>
      </div>

      {/* Vista previa de la selección */}
      {selectedClassification && (
        <div className={`mt-3 p-3 rounded-lg border bg-${selectedClassification.color}-50 border-${selectedClassification.color}-200`}>
          <div className="flex items-center space-x-2">
            <span className="text-2xl">{selectedClassification.icon}</span>
            <div className="flex-1">
              <p className={`font-medium text-${selectedClassification.color}-800`}>
                {selectedClassification.label}
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <p className="mt-2 text-sm text-red-600 flex items-center font-roboto">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Sección de diagnóstico médico
 */
const DiagnosisSection = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        <i className="fas fa-stethoscope text-red-500 mr-2"></i>
        Diagnóstico Médico *
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="3"
        placeholder="Ingrese el diagnóstico médico del paciente..."
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Sección de justificación de la clasificación
 */
const JustificationSection = ({ value, onChange, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        <i className="fas fa-comment-medical text-yellow-500 mr-2"></i>
        Justificación de la Clasificación *
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="3"
        placeholder="Explique por qué clasificó el servicio de esta manera..."
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto ${
          error ? 'border-red-500 bg-red-50' : 'border-gray-300'
        }`}
      />
      {error && (
        <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
          <i className="fas fa-exclamation-circle mr-1"></i>
          {error}
        </p>
      )}
    </div>
  )
}

/**
 * Sección de tratamiento aplicado
 */
const TreatmentSection = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        <i className="fas fa-notes-medical text-green-500 mr-2"></i>
        Tratamiento Aplicado
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="3"
        placeholder="Describa el tratamiento aplicado (opcional)..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto"
      />
      <p className="mt-1 text-xs text-gray-500 font-roboto">
        Medicamentos administrados, procedimientos realizados, etc.
      </p>
    </div>
  )
}

/**
 * Sección de observaciones adicionales y funciones vitales
 */
const ObservationsSection = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
        <i className="fas fa-clipboard text-blue-500 mr-2"></i>
        Observaciones adicionales y funciones vitales
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows="3"
        placeholder="Observaciones adicionales y funciones vitales (opcional)..."
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto"
      />
      <p className="mt-1 text-xs text-gray-500 font-roboto">
        Estado final del paciente, signos vitales, recomendaciones, seguimiento necesario, etc.
      </p>
    </div>
  )
}

/**
 * Acciones del formulario
 */
const FormActions = ({ onCancel }) => {
  return (
    <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
      <button
        type="button"
        onClick={onCancel}
        className="px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition-colors font-roboto"
      >
        Cancelar
      </button>
      <button
        type="submit"
        className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium shadow-lg hover:shadow-xl transition-all font-roboto"
      >
        <i className="fas fa-check mr-2"></i>
        Completar Servicio
      </button>
    </div>
  )
}

// PropTypes
ServiceCompletionModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onComplete: PropTypes.func.isRequired,
  patientInfo: PropTypes.shape({
    name: PropTypes.string,
    age: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    symptoms: PropTypes.string,
    requestedService: PropTypes.string
  }),
  emergencyCode: PropTypes.string
}

PatientInfoSection.propTypes = {
  patientInfo: PropTypes.object,
  emergencyCode: PropTypes.string
}

ServiceClassificationSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  options: PropTypes.array.isRequired,
  error: PropTypes.string,
  selectedClassification: PropTypes.object
}

DiagnosisSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
}

JustificationSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  error: PropTypes.string
}

TreatmentSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

ObservationsSection.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

FormActions.propTypes = {
  onCancel: PropTypes.func.isRequired
}

export default ServiceCompletionModal