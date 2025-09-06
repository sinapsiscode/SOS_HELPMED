import React, { useCallback } from 'react'
import { RELATIONSHIP_OPTIONS } from '../../../constants/affiliateConstants'
import { useAffiliateForm } from '../../../hooks/useAffiliateForm'
import { FormField, SelectField, ErrorAlert, ModalHeader, FormButtons } from './FormComponents'
import { LABELS } from '../../../config/labels'

/**
 * Modal para editar un afiliado existente
 * Componente UI puro que delega la lógica al hook useAffiliateForm (Regla #2)
 * Optimizado con React.memo para evitar re-renders innecesarios (Regla #13)
 * Dividido en subcomponentes para cumplir con límite de 200 líneas (Regla #3)
 *
 * @param {Object} affiliate - Datos del afiliado a editar
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onSave - Función para guardar los cambios
 * @param {boolean} loading - Estado de carga externo
 */
const EditAffiliateModal = React.memo(({ affiliate, onClose, onSave, loading = false }) => {
  // Toda la lógica del formulario está en el hook personalizado
  const { formData, errors, isSubmitting, handleInputChange, handleSubmit, isFormDisabled } =
    useAffiliateForm(affiliate, true)

  /**
   * Maneja el envío del formulario
   * Delega la lógica al hook y maneja el resultado
   */
  const onFormSubmit = useCallback(
    async (e) => {
      e.preventDefault()

      if (loading) return

      const result = await handleSubmit(onSave)

      if (result && result.success) {
        onClose()
      }
    },
    [loading, handleSubmit, onSave, onClose]
  )

  const isDisabled = isFormDisabled || loading

  // No renderizar si no hay afiliado
  if (!affiliate) {
    return null
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-gray-800">{LABELS.admin.affiliates.edit.title}</h3>
            <button
              onClick={onClose}
              disabled={isDisabled}
              className="text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed"
              aria-label={LABELS.buttons.close}
            >
              ✕
            </button>
          </div>
          <p className="text-sm text-gray-600 mt-1">{LABELS.admin.affiliates.edit.editingLabel}: {affiliate.name}</p>
        </div>

        <form onSubmit={onFormSubmit} className="p-6 space-y-4">
          <ErrorAlert message={errors.general} />

          <FormField
            label={LABELS.admin.affiliates.add.fields.name.label}
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            error={errors.name}
            disabled={isDisabled}
            placeholder={LABELS.admin.affiliates.add.fields.name.placeholder}
            required
          />

          <FormField
            label={LABELS.admin.affiliates.add.fields.dni.label}
            name="dni"
            value={formData.dni}
            onChange={handleInputChange}
            error={errors.dni}
            disabled={isDisabled}
            placeholder={LABELS.admin.affiliates.add.fields.dni.placeholder}
            required
          />

          <FormField
            label={LABELS.admin.affiliates.add.fields.phone.label}
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleInputChange}
            error={errors.phone}
            disabled={isDisabled}
            placeholder={LABELS.admin.affiliates.add.fields.phone.placeholder}
          />

          <SelectField
            label={LABELS.admin.affiliates.add.fields.relationship.label}
            name="relationship"
            value={formData.relationship}
            onChange={handleInputChange}
            error={errors.relationship}
            disabled={isDisabled}
            options={RELATIONSHIP_OPTIONS}
            required
          />

          <FormField
            label={LABELS.admin.affiliates.add.fields.birthDate.label}
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleInputChange}
            error={errors.birthDate}
            disabled={isDisabled}
            maxDate={new Date().toISOString().split('T')[0]}
          />

          <FormButtons
            onCancel={onClose}
            isDisabled={isDisabled}
            isSubmitting={isSubmitting}
            submitText={LABELS.admin.affiliates.edit.submitButton}
            submittingText={LABELS.admin.affiliates.edit.submittingButton}
          />
        </form>
      </div>
    </div>
  )
})

EditAffiliateModal.displayName = 'EditAffiliateModal'

export default EditAffiliateModal
