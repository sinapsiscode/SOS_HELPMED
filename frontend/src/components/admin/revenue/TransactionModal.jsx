import React, { useState, useEffect } from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.revenue.transactionModal.comments.title}
 * ${LABELS.admin.revenue.transactionModal.comments.rules.rule3}
 * ${LABELS.admin.revenue.transactionModal.comments.rules.rule4}
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
  const labels = LABELS.admin.revenue.transactionModal
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
      newErrors.concept = labels.errors.conceptRequired
    } else if (formData.concept.trim().length < 3) {
      newErrors.concept = labels.errors.conceptMinLength
    }

    if (!formData.amount) {
      newErrors.amount = labels.errors.amountRequired
    } else if (parseFloat(formData.amount) <= 0) {
      newErrors.amount = labels.errors.amountMinValue
    } else if (parseFloat(formData.amount) > 50000) {
      newErrors.amount = labels.errors.amountMaxValue
    }

    if (!formData.type) {
      newErrors.type = labels.errors.typeRequired
    }

    if (!formData.userName.trim() && !formData.companyName.trim()) {
      newErrors.client = labels.errors.clientRequired
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
            {transaction ? labels.title.edit : labels.title.new}
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
                {labels.fields.concept.label}
              </label>
              <input
                type="text"
                value={formData.concept}
                onChange={(e) => handleChange('concept', e.target.value)}
                placeholder={labels.fields.concept.placeholder}
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
                  {labels.fields.amount.label}
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  max="50000"
                  value={formData.amount}
                  onChange={(e) => handleChange('amount', e.target.value)}
                  placeholder={labels.fields.amount.placeholder}
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
                  {labels.fields.transactionType.label}
                </label>
                <select
                  value={formData.type}
                  onChange={(e) => handleChange('type', e.target.value)}
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.type ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                >
                  <option value="service_payment">{labels.transactionTypes.service_payment}</option>
                  <option value="plan_payment">{labels.transactionTypes.plan_payment}</option>
                  <option value="additional_fee">{labels.transactionTypes.additional_fee}</option>
                  <option value="consultation_fee">{labels.transactionTypes.consultation_fee}</option>
                  <option value="emergency_fee">{labels.transactionTypes.emergency_fee}</option>
                  <option value="transfer_fee">{labels.transactionTypes.transfer_fee}</option>
                  <option value="insurance_payment">{labels.transactionTypes.insurance_payment}</option>
                  <option value="refund">{labels.transactionTypes.refund}</option>
                  <option value="adjustment">{labels.transactionTypes.adjustment}</option>
                  <option value="other">{labels.transactionTypes.other}</option>
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
                  {labels.fields.clientName.label}
                </label>
                <input
                  type="text"
                  value={formData.userName}
                  onChange={(e) => handleChange('userName', e.target.value)}
                  placeholder={labels.fields.clientName.placeholder}
                  className={`w-full border rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue ${
                    errors.client ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={loading}
                />
              </div>

              <div>
                <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                  {labels.fields.companyName.label}
                </label>
                <input
                  type="text"
                  value={formData.companyName}
                  onChange={(e) => handleChange('companyName', e.target.value)}
                  placeholder={labels.fields.companyName.placeholder}
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
                {labels.fields.paymentMethod.label}
              </label>
              <select
                value={formData.paymentMethod}
                onChange={(e) => handleChange('paymentMethod', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue"
                disabled={loading}
              >
                <option value="cash">{labels.paymentMethods.cash}</option>
                <option value="card">{labels.paymentMethods.card}</option>
                <option value="transfer">{labels.paymentMethods.transfer}</option>
                <option value="check">{labels.paymentMethods.check}</option>
                <option value="digital">{labels.paymentMethods.digital}</option>
                <option value="insurance">{labels.paymentMethods.insurance}</option>
                <option value="other">{labels.paymentMethods.other}</option>
              </select>
            </div>

            {/* Notas */}
            <div>
              <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
                {labels.fields.notes.label}
              </label>
              <textarea
                value={formData.notes}
                onChange={(e) => handleChange('notes', e.target.value)}
                placeholder={labels.fields.notes.placeholder}
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
              {labels.buttons.cancel}
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 font-roboto transition-colors disabled:opacity-50 flex items-center"
            >
              {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
              {transaction ? labels.buttons.update : labels.buttons.register} {labels.buttons.transaction}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default TransactionModal
