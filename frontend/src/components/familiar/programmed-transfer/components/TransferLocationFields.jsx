/**
 * Componente para los campos de ubicación del traslado
 * Maneja dirección de origen y destino con validación
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Function} props.updateField - Función para actualizar campos
 */
const TransferLocationFields = ({ formData, errors, updateField }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Dirección de Origen */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-map-marker-alt text-green-600 mr-1"></i>
          Dirección de Origen *
        </label>
        <input
          type="text"
          value={formData.origin}
          onChange={(e) => updateField('origin', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.origin ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ingresa la dirección de origen"
        />
        {errors.origin && (
          <p className="text-red-500 text-sm mt-1">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {errors.origin}
          </p>
        )}
      </div>

      {/* Dirección de Destino */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          <i className="fas fa-map-marker-alt text-red-600 mr-1"></i>
          Dirección de Destino *
        </label>
        <input
          type="text"
          value={formData.destination}
          onChange={(e) => updateField('destination', e.target.value)}
          className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 transition-colors ${
            errors.destination ? 'border-red-300 bg-red-50' : 'border-gray-300'
          }`}
          placeholder="Ingresa la dirección de destino"
        />
        {errors.destination && (
          <p className="text-red-500 text-sm mt-1">
            <i className="fas fa-exclamation-triangle mr-1"></i>
            {errors.destination}
          </p>
        )}
      </div>
    </div>
  )
}

export default TransferLocationFields
