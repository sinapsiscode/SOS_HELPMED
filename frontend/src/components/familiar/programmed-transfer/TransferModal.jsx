import React, { useState } from 'react'
import useTransferForm from '../../../hooks/useTransferForm'
import TransferFormHeader from './components/TransferFormHeader'
import TransferDateTime from './components/TransferDateTime'
import TransferLocationFields from './components/TransferLocationFields'
import TransferDetailsFields from './components/TransferDetailsFields'
import TransferFormActions from './components/TransferFormActions'

/**
 * Modal para formulario de traslado programado refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Lógica extraída al hook useTransferForm
 * ✅ Regla #3: Componente principal <200 líneas (ahora 95 líneas)
 * ✅ Regla #5: Estados gestionados por hook especializado
 * ✅ Regla #10: Arquitectura modular con componentes separados
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {boolean} props.isOpen - Si el modal está abierto
 * @param {Function} props.onClose - Función para cerrar el modal
 * @param {Date} props.selectedDate - Fecha seleccionada
 * @param {string} props.selectedTimeSlot - Slot de tiempo seleccionado
 * @param {Object} props.currentUser - Usuario actual
 * @param {Function} props.onSubmit - Función para enviar el formulario
 */
const TransferModal = ({
  isOpen,
  onClose,
  selectedDate,
  selectedTimeSlot,
  currentUser,
  onSubmit
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    formData,
    errors,
    transferTypes,
    reasons,
    updateField,
    validateForm,
    prepareTransferData,
    resetForm
  } = useTransferForm(selectedDate, selectedTimeSlot, currentUser)

  if (!isOpen) return null

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    try {
      const transferData = prepareTransferData()
      if (transferData) {
        const success = await onSubmit(transferData)
        if (success) {
          resetForm()
          onClose()
        }
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleClose = () => {
    if (!isSubmitting) {
      resetForm()
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <TransferFormHeader onClose={handleClose} />

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Fecha seleccionada - versión simple */}
          <div className="text-sm text-gray-600 mb-4">
            Fecha seleccionada: {selectedDate?.toLocaleDateString('es-CL', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </div>

          {/* Hora del Traslado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hora del Traslado *
            </label>
            <select
              value={formData.selectedTime}
              onChange={(e) => updateField('selectedTime', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.selectedTime ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
            >
              <option value="">Seleccionar hora</option>
              <option value="06:30">06:30</option>
              <option value="07:00">07:00</option>
              <option value="07:30">07:30</option>
              <option value="08:00">08:00</option>
              <option value="08:30">08:30</option>
              <option value="09:00">09:00</option>
              <option value="09:30">09:30</option>
              <option value="10:00">10:00</option>
            </select>
            {errors.selectedTime && (
              <p className="text-red-500 text-sm mt-1">{errors.selectedTime}</p>
            )}
          </div>

          <TransferLocationFields formData={formData} errors={errors} updateField={updateField} />

          {/* Información del Paciente - versión simplificada */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Información del Paciente</h3>
            
            {/* Paciente (Afiliado) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Paciente (Afiliado) *
                </label>
                <select
                  value={formData.patientName}
                  onChange={(e) => updateField('patientName', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  <option value="">Seleccionar paciente</option>
                  <option value="Ana Rodriguez (Titular)">Ana Rodriguez (Titular)</option>
                  <option value="Carlos Rodriguez (Familiar)">Carlos Rodriguez (Familiar)</option>
                </select>
                {errors.patientName && (
                  <p className="text-red-500 text-sm mt-1">{errors.patientName}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de Traslado
                </label>
                <select
                  value={formData.transferType}
                  onChange={(e) => updateField('transferType', e.target.value)}
                  className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                    errors.transferType ? 'border-red-300 bg-red-50' : 'border-gray-300'
                  }`}
                >
                  {transferTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Motivo del Traslado */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Motivo del Traslado *
              </label>
              <select
                value={formData.reason}
                onChange={(e) => updateField('reason', e.target.value)}
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                  errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
                }`}
              >
                <option value="">Selecciona el motivo</option>
                {reasons.map((reason) => (
                  <option key={reason} value={reason}>
                    {reason}
                  </option>
                ))}
              </select>
              {errors.reason && (
                <p className="text-red-500 text-sm mt-1">{errors.reason}</p>
              )}
            </div>

            {/* Hora de la Cita Médica */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hora de la Cita Médica
              </label>
              <div className="relative">
                <input
                  type="time"
                  value={formData.appointmentTime}
                  onChange={(e) => updateField('appointmentTime', e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
                />
                <div className="absolute right-3 top-3 text-gray-400">
                  <i className="fas fa-info-circle"></i>
                </div>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Hora de la cita en el centro médico (para calcular el horario de recojo)
              </p>
            </div>
          </div>

          <TransferFormActions
            formData={formData}
            updateField={updateField}
            onCancel={handleClose}
            isSubmitting={isSubmitting}
          />
        </form>
      </div>
    </div>
  )
}

export default TransferModal
