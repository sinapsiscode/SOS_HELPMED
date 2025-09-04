import React, { useState, useEffect } from 'react'

/**
 * Modal para agregar/editar transacciones
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #4: Validación completa de inputs
 *
 * @param {Object} props - Props del componente
 * @param {Boolean} props.isOpen - Si el modal está abierto
 * @param {Object} props.transaction - Transacción a editar (null para nueva)
 * @param {Function} props.onClose - Función para cerrar modal
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @param {Boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Modal de transacción
 */
const TransactionModal = ({ isOpen, transaction, onClose, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    concept: '',
    amount: '',
    type: 'service_payment',
    paymentMethod: 'cash',
    userName: '',
    companyName: '',
    notes: ''
  })
  const [errors, setErrors] = useState({})

  // Resetear formulario cuando el modal se abre/cierra o cambia la transacción
  useEffect(() => {
    if (isOpen) {
      if (transaction) {
        setFormData({
          concept: transaction.concept || '',
          amount: transaction.amount || '',
          type: transaction.type || 'service_payment',
          paymentMethod: transaction.paymentMethod || 'cash',
          userName: transaction.userName || '',
          companyName: transaction.companyName || '',
          notes: transaction.notes || ''
        })
      } else {
        setFormData({
          concept: '',
          amount: '',
          type: 'service_payment',
          paymentMethod: 'cash',
          userName: '',
          companyName: '',
          notes: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, transaction])

  // Validar formulario
  const validateForm = () => {
    const newErrors = {}

    if (!formData.concept.trim()) {
      newErrors.concept = 'El concepto es requerido'
    } else if (formData.concept.trim().length < 3) {
      newErrors.concept = 'El concepto debe tener al menos 3 caracteres'
    }

    if (!formData.amount) {
      newErrors.amount = 'El monto es requerido'
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = 'El monto debe ser mayor a 0'
    } else if (parseFloat(formData.amount) > 50000) {
      newErrors.amount = 'El monto no puede exceder S/ 50,000'
    }

    if (!formData.type) {
      newErrors.type = 'El tipo de transacción es requerido'
    }

    if (!formData.userName.trim() && !formData.companyName.trim()) {
      newErrors.client = 'Debe especificar un cliente o empresa'
    }

    return newErrors
  }

  // Manejar envío del formulario
  const handleSubmit = (e) => {
    e.preventDefault()

    const newErrors = validateForm()
    setErrors(newErrors)

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        ...formData,
        amount: parseFloat(formData.amount)
      })
    }
  }

  // Manejar cambios en el formulario
  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Limpiar error específico cuando se corrige
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }))
    }
    if (field === 'userName' || field === 'companyName') {
      setErrors((prev) => ({ ...prev, client: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-screen overflow-y-auto">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-exo font-semibold text-gray-800">
            <i className="fas fa-receipt text-helpmed-blue mr-2"></i>
            {transaction ? 'Editar Transacción' : 'Nueva Transacción'}
          </h2>
          <button
            onClick={onClose}
            disabled={loading}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="px-6 py-4">
          <div className="space-y-6">
            {/* Concepto */}
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                Concepto *
              </label>
              <input
                type="text"
                value={formData.concept}
                onChange={(e) => handleChange('concept', e.target.value)}
                placeholder="Descripción de la transacción"
                className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                  errors.concept ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={loading}
              />
              {errors.concept && (
                <p className="text-red-500 text-sm mt-1 font-roboto">{errors.concept}</p>
              )}
            </div>

            {/* Monto y Tipo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                  Monto (S/) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50000"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder="0.00"
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.amount ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
                {errors.amount && (
                  <p className="text-red-500 text-sm mt-1 font-roboto">{errors.amount}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                  Tipo de Transacción *
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="service_payment">Pago de Servicio</option>
                  <option value="plan_payment">Pago de Plan</option>
                  <option value="additional_fee">Tarifa Adicional</option>
                  <option value="consultation_fee">Consulta Médica</option>
                  <option value="emergency_fee">Servicio de Emergencia</option>
                  <option value="transfer_fee">Traslado</option>
                  <option value="insurance_payment">Pago de Seguro</option>
                  <option value="refund">Reembolso</option>
                  <option value="adjustment">Ajuste</option>
                  <option value="other">Otro</option>
                </select>
                {errors.type && (
                  <p className="text-red-500 text-sm mt-1 font-roboto">{errors.type}</p>
                )}
              </div>
            </div>

            {/* Cliente/Empresa */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                  Nombre del Cliente
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                  placeholder="Nombre completo del cliente"
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.client ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                  Nombre de la Empresa
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder="Razón social o empresa"
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.client ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>
            </div>
            {errors.client && <p className="text-red-500 text-sm font-roboto">{errors.client}</p>}

            {/* Método de Pago */}
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                Método de Pago
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue"
                disabled={loading}
              >
                <option value="cash">Efectivo</option>
                <option value="card">Tarjeta</option>
                <option value="transfer">Transferencia</option>
                <option value="check">Cheque</option>
                <option value="digital">Pago Digital</option>
                <option value="insurance">Seguro</option>
                <option value="other">Otro</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                Notas Adicionales
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder="Información adicional sobre la transacción (opcional)"
                rows={3}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue resize-none"
                disabled={loading}
              />
            </div>
          </div>

          {/* Botones */}
          <div className="flex items-center justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-roboto transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 font-roboto transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
              {transaction ? 'Actualizar' : 'Registrar'} Transacción
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal
