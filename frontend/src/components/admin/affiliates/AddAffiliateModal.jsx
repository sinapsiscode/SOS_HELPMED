import React from 'react'
import { useAddAffiliateModal } from '../../../hooks/useAddAffiliateModal'
import { FormField, SelectField, ErrorAlert, ModalHeader, FormButtons } from './FormComponents'

/**
 * Modal para agregar un nuevo afiliado
 * COMPONENTE UI PURO - Solo presentación, CERO lógica (Regla #2)
 * Toda la lógica está en useAddAffiliateModal
 * Optimizado con React.memo (Regla #13)
 * Menos de 200 líneas (Regla #3)
 *
 * @param {Function} onClose - Función para cerrar el modal
 * @param {Function} onSave - Función para guardar el nuevo afiliado
 * @param {boolean} loading - Estado de carga externo
 */
const AddAffiliateModal = React.memo(({ onClose, onSave, loading = false }) => {
  // ============================================
  // HOOK - Toda la lógica está aquí
  // ============================================
  const {
    fields,
    generalError,
    isDisabled,
    submitButton,
    cancelButton,
    onSubmit,
    onClose: handleClose,
    modalConfig
  } = useAddAffiliateModal(onSave, onClose, loading)

  // ============================================
  // RENDER - Solo template, sin lógica
  // ============================================
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full m-4">
        <ModalHeader title={modalConfig.title} onClose={handleClose} disabled={isDisabled} />

        <form onSubmit={onSubmit} className="p-6 space-y-4">
          <ErrorAlert message={generalError} />

          <FormField {...fields.name} />
          <FormField {...fields.dni} />
          <FormField {...fields.phone} />
          <SelectField {...fields.relationship} />
          <FormField {...fields.birthDate} />

          <FormButtons
            onCancel={handleClose}
            isDisabled={submitButton.disabled}
            isSubmitting={submitButton.isLoading}
            submitText="Agregar"
            submittingText="Agregando..."
          />
        </form>
      </div>
    </div>
  )
})

AddAffiliateModal.displayName = 'AddAffiliateModal'

export default AddAffiliateModal
