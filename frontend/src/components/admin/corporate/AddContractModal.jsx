import React, { useState } from 'react'
import Swal from 'sweetalert2'

/**
 * Modal para subir contratos PDF corporativos
 * ENFOQUE BALANCEADO: Estructura en componente, lógica de validación local
 *
 * @param {Function} onClose - Función para cerrar modal
 * @param {Function} onSave - Función para guardar contrato
 * @param {boolean} isLoading - Estado de carga del componente padre
 * @param {Array} corporateUsers - Lista de usuarios corporativos
 */
const AddContractModal = ({ onClose, onSave, isLoading: parentIsLoading, corporateUsers }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof onClose !== 'function') {
    console.error('AddContractModal: onClose debe ser una función')
    return null
  }

  if (typeof onSave !== 'function') {
    console.error('AddContractModal: onSave debe ser una función')
    return null
  }

  if (!Array.isArray(corporateUsers)) {
    console.error('AddContractModal: corporateUsers debe ser un array')
    return null
  }

  // ============================================
  // ESTADO LOCAL (Solo para este componente)
  // ============================================
  const [formData, setFormData] = useState({
    clientId: '',
    contractFile: null,
    startDate: '',
    endDate: ''
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // ============================================
  // VALIDACIONES LOCALES (Regla #4)
  // ============================================

  /**
   * Valida el formulario antes del envío
   * Validación simple que puede quedarse en componente
   */
  const validateForm = () => {
    const newErrors = {}

    if (!formData.clientId) {
      newErrors.clientId = 'Debe seleccionar un cliente corporativo'
    }

    if (!formData.contractFile) {
      newErrors.contractFile = 'Debe subir un archivo PDF del contrato'
    } else {
      if (formData.contractFile.type !== 'application/pdf') {
        newErrors.contractFile = 'Solo se permiten archivos PDF'
      } else if (formData.contractFile.size > 10 * 1024 * 1024) {
        // 10MB
        newErrors.contractFile = 'El archivo no puede exceder 10MB'
      }
    }

    if (!formData.startDate) {
      newErrors.startDate = 'Debe seleccionar una fecha de inicio'
    }

    if (!formData.endDate) {
      newErrors.endDate = 'Debe seleccionar una fecha de fin'
    } else if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = 'La fecha de fin debe ser posterior a la fecha de inicio'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  /**
   * Maneja el envío del formulario
   * Lógica de envío que puede quedarse local
   */
  const handleSubmit = async (e) => {
    e.preventDefault()

    if (isLoading) return

    setIsLoading(true)

    try {
      if (!validateForm()) {
        setIsLoading(false)
        return
      }

      const selectedClient = corporateUsers.find((user) => user.id === formData.clientId)

      const contractData = {
        clientId: formData.clientId,
        clientName: selectedClient?.company?.name,
        contractFile: formData.contractFile,
        startDate: formData.startDate,
        endDate: formData.endDate,
        uploadDate: new Date().toISOString()
      }

      // Simular procesamiento (en producción sería una llamada a API)
      await new Promise((resolve) => setTimeout(resolve, 1500))

      onSave(contractData)
    } catch (error) {
      console.error('Error al subir contrato:', error)
      Swal.fire({
        title: 'Error',
        text: 'Ocurrió un error al subir el contrato. Por favor, inténtelo nuevamente.',
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  /**
   * Maneja cambios en los campos del formulario
   * Lógica simple que puede quedarse local
   */
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar errores cuando se hace un cambio
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">Subir Contrato PDF</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Seleccionar Cliente Corporativo */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Seleccionar Cliente</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Cliente Corporativo *
              </label>
              <select
                value={formData.clientId}
                onChange={(e) => handleChange('clientId', e.target.value)}
                className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                  errors.clientId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Seleccionar cliente...</option>
                {corporateUsers.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.company?.name} - {client.company?.rut}
                  </option>
                ))}
              </select>
              {errors.clientId && <p className="text-red-600 text-sm mt-1">{errors.clientId}</p>}
            </div>
          </div>

          {/* Fechas del Contrato */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Vigencia del Contrato</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Inicio *
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleChange('startDate', e.target.value)}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.startDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.startDate && <p className="text-red-600 text-sm mt-1">{errors.startDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha de Fin *
                </label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => handleChange('endDate', e.target.value)}
                  min={formData.startDate || undefined}
                  className={`w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 ${
                    errors.endDate ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.endDate && <p className="text-red-600 text-sm mt-1">{errors.endDate}</p>}
              </div>
            </div>
          </div>

          {/* Subir Contrato PDF */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Documento del Contrato</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contrato PDF *</label>
              <div
                className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                  errors.contractFile
                    ? 'border-red-300 bg-red-50'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={(e) => handleChange('contractFile', e.target.files[0])}
                  className="hidden"
                  id="contractFile"
                />
                <label htmlFor="contractFile" className="cursor-pointer">
                  {formData.contractFile ? (
                    <div className="flex flex-col items-center space-y-3">
                      <div className="flex items-center space-x-3">
                        <i className="fas fa-file-pdf text-red-500 text-3xl"></i>
                        <div className="text-left">
                          <p className="font-medium text-gray-800">{formData.contractFile.name}</p>
                          <p className="text-sm text-gray-600">
                            {(formData.contractFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault()
                          handleChange('contractFile', null)
                        }}
                        className="text-red-500 hover:text-red-700 text-sm underline"
                      >
                        Cambiar archivo
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <i className="fas fa-cloud-upload-alt text-gray-400 text-4xl"></i>
                      <div>
                        <p className="text-lg font-medium text-gray-700">
                          Arrastra y suelta tu archivo PDF aquí
                        </p>
                        <p className="text-gray-500">o haz clic para seleccionar</p>
                      </div>
                      <p className="text-sm text-gray-400">Solo archivos PDF, máximo 10MB</p>
                    </div>
                  )}
                </label>
              </div>
              {errors.contractFile && (
                <p className="text-red-600 text-sm mt-1">{errors.contractFile}</p>
              )}
            </div>
          </div>

          {/* Información del Cliente Seleccionado */}
          {formData.clientId && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Cliente Seleccionado</h4>
              {(() => {
                const client = corporateUsers.find((c) => c.id === formData.clientId)
                return client ? (
                  <div className="text-sm text-blue-700 space-y-1">
                    <p>
                      <strong>Empresa:</strong> {client.company?.name}
                    </p>
                    <p>
                      <strong>RUC:</strong> {client.company?.rut}
                    </p>
                    <p>
                      <strong>Contacto:</strong> {client.company?.contact_person?.name}
                    </p>
                    <p>
                      <strong>Email:</strong> {client.company?.contact_person?.email}
                    </p>
                  </div>
                ) : null
              })()}
            </div>
          )}

          {/* Resumen de Validación */}
          {Object.keys(errors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center mb-2">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <h4 className="text-red-800 font-semibold">Errores de Validación</h4>
              </div>
              <ul className="text-red-700 text-sm space-y-1">
                {Object.entries(errors).map(([field, error]) => (
                  <li key={field}>• {error}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Botones */}
          <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading || Object.keys(errors).length > 0}
              className={`px-6 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                isLoading || Object.keys(errors).length > 0
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
              }`}
            >
              {isLoading && (
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              <span>{isLoading ? 'Subiendo Contrato...' : 'Subir Contrato'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddContractModal
