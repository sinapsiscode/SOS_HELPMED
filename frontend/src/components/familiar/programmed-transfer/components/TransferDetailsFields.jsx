/**
 * Componente para los campos de detalles del traslado
 * Incluye información del paciente, tipo de traslado, motivo y opciones adicionales
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Array} props.transferTypes - Tipos de traslado disponibles
 * @param {Array} props.reasons - Motivos disponibles
 * @param {Function} props.updateField - Función para actualizar campos
 */
const TransferDetailsFields = ({ formData, errors, transferTypes, reasons, updateField }) => {
  return (
    <div className="space-y-6">
      {/* Información del Paciente */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-user text-blue-600 mr-1"></i>
          Nombre del Paciente *
        </label>
        <input
          type="text"
          value={formData.patientName}
          onChange={(e) => updateField('patientName', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.patientName ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Nombre completo del paciente"
        />
        {errors.patientName && (
          <p className="text-red-500 text-sm mt-1">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {errors.patientName}
          </p>
        )}
      </div>

      {/* Tipo de Traslado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-ambulance text-red-600 mr-1"></i>
          Tipo de Traslado *
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

        {formData.transferType === 'other' && (
          <div className="mt-3">
            <input
              type="text"
              value={formData.otherTransferType}
              onChange={(e) => updateField('otherTransferType', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.otherTransferType ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              placeholder="Especifica el tipo de traslado"
            />
            {errors.otherTransferType && (
              <p className="text-red-500 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {errors.otherTransferType}
              </p>
            )}
          </div>
        )}

        {errors.transferType && (
          <p className="text-red-500 text-sm mt-1">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {errors.transferType}
          </p>
        )}
      </div>

      {/* Motivo del Traslado */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-clipboard-list text-green-600 mr-1"></i>
          Motivo del Traslado *
        </label>
        <select
          value={formData.reason}
          onChange={(e) => updateField('reason', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.reason ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
        >
          <option value="">Selecciona un motivo</option>
          {reasons.map((reason) => (
            <option key={reason} value={reason}>
              {reason}
            </option>
          ))}
        </select>
        {errors.reason && (
          <p className="text-red-500 text-sm mt-1">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {errors.reason}
          </p>
        )}

        {formData.reason === 'Otro' && (
          <div className="mt-3">
            <textarea
              value={formData.otherReason}
              onChange={(e) => updateField('otherReason', e.target.value)}
              className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
                errors.otherReason ? 'border-red-300 bg-red-50' : 'border-gray-300'
              }`}
              rows="3"
              placeholder="Especifica el motivo del traslado"
            />
            {errors.otherReason && (
              <p className="text-red-500 text-sm mt-1">
                <i className="fas fa-exclamation-triangle mr-1"></i>
                {errors.otherReason}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Opciones Adicionales */}
      <div className="bg-gray-50 p-4 rounded-lg">
        <h4 className="font-medium text-gray-700 mb-3">
          <i className="fas fa-cog text-gray-600 mr-1"></i>
          Opciones Adicionales
        </h4>
        <div className="space-y-3">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="wheelchair"
              checked={formData.requiresWheelchair}
              onChange={(e) => updateField('requiresWheelchair', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="wheelchair" className="ml-2 text-sm text-gray-700">
              Requiere silla de ruedas
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="oxygen"
              checked={formData.requiresOxygen}
              onChange={(e) => updateField('requiresOxygen', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="oxygen" className="ml-2 text-sm text-gray-700">
              Requiere oxígeno
            </label>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="stretcher"
              checked={formData.requiresStretcher}
              onChange={(e) => updateField('requiresStretcher', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="stretcher" className="ml-2 text-sm text-gray-700">
              Requiere camilla
            </label>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TransferDetailsFields
