import React from 'react'

/**
 * Formulario de datos del paciente
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Function} props.onInputChange - Función para cambiar inputs
 * @returns {JSX.Element} Formulario de datos del paciente
 */
const PatientDataForm = ({ formData, errors, onInputChange }) => {
  return (
    <div className="bg-gray-50 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 font-exo">Datos del Paciente</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nombre completo */}
        <TextInput
          label="Nombre Completo *"
          value={formData.patientName}
          onChange={(value) => onInputChange('patientName', value)}
          placeholder="Juan Pérez"
          error={errors.patientName}
        />

        {/* Teléfono */}
        <TextInput
          label="Teléfono *"
          type="tel"
          value={formData.patientPhone}
          onChange={(value) => onInputChange('patientPhone', value)}
          placeholder="987654321"
          error={errors.patientPhone}
        />

        {/* DNI */}
        <TextInput
          label="DNI *"
          value={formData.patientDNI}
          onChange={(value) => onInputChange('patientDNI', value)}
          placeholder="12345678"
          maxLength="8"
          error={errors.patientDNI}
        />

        {/* Nivel de urgencia */}
        <SelectInput
          label="Nivel de Urgencia"
          value={formData.urgencyLevel}
          onChange={(value) => onInputChange('urgencyLevel', value)}
          options={[
            { value: 'normal', label: 'Normal' },
            { value: 'urgent', label: 'Urgente' },
            { value: 'critical', label: 'Crítico' }
          ]}
        />
      </div>

      {/* Dirección completa */}
      <TextInput
        label="Dirección Completa *"
        value={formData.location}
        onChange={(value) => onInputChange('location', value)}
        placeholder="Av. Principal 123, San Isidro"
        error={errors.location}
        fullWidth
      />

      {/* Descripción de síntomas */}
      <TextAreaInput
        label="Descripción de Síntomas *"
        value={formData.symptoms}
        onChange={(value) => onInputChange('symptoms', value)}
        placeholder="Describa los síntomas del paciente..."
        rows={4}
        error={errors.symptoms}
      />
    </div>
  )
}

/**
 * Campo de texto genérico
 */
const TextInput = ({
  label,
  value,
  onChange,
  placeholder,
  error,
  type = 'text',
  maxLength,
  fullWidth = false
}) => {
  return (
    <div className={fullWidth ? 'col-span-full' : ''}>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        maxLength={maxLength}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
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
 * Campo de selección
 */
const SelectInput = ({ label, value, onChange, options }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/**
 * Campo de área de texto
 */
const TextAreaInput = ({ label, value, onChange, placeholder, rows, error }) => {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">{label}</label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors resize-none ${
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

export default PatientDataForm
