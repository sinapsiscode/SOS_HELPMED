/**
 * Componente para acciones del formulario de traslado
 * Incluye campos adicionales y botones de acción
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario
 * @param {Function} props.updateField - Función para actualizar campos
 * @param {Function} props.onCancel - Función para cancelar
 * @param {boolean} props.isSubmitting - Estado de envío del formulario
 */
const TransferFormActions = ({ formData, updateField, onCancel, isSubmitting = false }) => {
  return (
    <div className="space-y-6">
      {/* Requerimientos Especiales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-plus-circle text-purple-600 mr-1"></i>
          Requerimientos Especiales
        </label>
        <textarea
          value={formData.specialRequirements}
          onChange={(e) => updateField('specialRequirements', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
          rows="3"
          placeholder="Detalles adicionales sobre equipamiento médico, movilidad, etc."
        />
      </div>

      {/* Notas Adicionales */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-sticky-note text-yellow-600 mr-1"></i>
          Notas Adicionales
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => updateField('notes', e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors"
          rows="3"
          placeholder="Información adicional que consideres importante"
        />
      </div>

      {/* Botones de Acción */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <i className="fas fa-times mr-2"></i>
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          {isSubmitting ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Programando...
            </>
          ) : (
            <>
              <i className="fas fa-calendar-plus mr-2"></i>
              Programar Traslado
            </>
          )}
        </button>
      </div>
    </div>
  )
}

export default TransferFormActions
