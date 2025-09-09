import React from 'react'

/**
 * Formulario para reportar emergencias corporativas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario corporativo
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Function} props.onUpdateData - Función para actualizar datos
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @param {boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Formulario de emergencia corporativa
 */
const CorporateEmergencyForm = ({ user, formData, errors, onUpdateData, onSubmit, loading }) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 font-exo">Reportar Emergencia</h2>
        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
          Solo Emergencias
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información del Paciente */}
        <div className="border border-gray-200 rounded-lg p-4 bg-blue-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-exo">
            <i className="fas fa-user-injured text-blue-600 mr-2"></i>
            Información del Paciente
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Paciente *
              </label>
              <input
                type="text"
                value={formData.patientName}
                onChange={(e) => onUpdateData('patientName', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
                  errors.patientName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Nombre completo del empleado"
                disabled={loading}
              />
              {errors.patientName && (
                <p className="text-red-600 text-sm mt-1">{errors.patientName}</p>
              )}
            </div>

            {/* Edad del Paciente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Edad del Paciente *
              </label>
              <input
                type="number"
                min="0"
                max="120"
                value={formData.patientAge}
                onChange={(e) => onUpdateData('patientAge', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
                  errors.patientAge ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Edad en años"
                disabled={loading}
              />
              {errors.patientAge && (
                <p className="text-red-600 text-sm mt-1">{errors.patientAge}</p>
              )}
            </div>
          </div>

          {/* Tipo de Emergencia */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Emergencia *
            </label>
            <input
              type="text"
              value={formData.emergencyType}
              onChange={(e) => onUpdateData('emergencyType', e.target.value)}
              className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
                errors.emergencyType ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ej: Accidente laboral, emergencia médica, caída, etc."
              disabled={loading}
            />
            {errors.emergencyType && (
              <p className="text-red-600 text-sm mt-1">{errors.emergencyType}</p>
            )}
          </div>
        </div>

        {/* Información del Solicitante */}
        <div className="border border-gray-200 rounded-lg p-4 bg-green-50">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 font-exo">
            <i className="fas fa-user-tie text-green-600 mr-2"></i>
            Información del Solicitante
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre del Solicitante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tu Nombre *</label>
              <input
                type="text"
                value={formData.requesterName}
                onChange={(e) => onUpdateData('requesterName', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
                  errors.requesterName ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Tu nombre completo"
                disabled={loading}
              />
              {errors.requesterName && (
                <p className="text-red-600 text-sm mt-1">{errors.requesterName}</p>
              )}
            </div>

            {/* Cargo del Solicitante */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tu Cargo en la Empresa *
              </label>
              <input
                type="text"
                value={formData.requesterPosition}
                onChange={(e) => onUpdateData('requesterPosition', e.target.value)}
                className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
                  errors.requesterPosition ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Ej: Supervisor, Gerente, Coordinador"
                disabled={loading}
              />
              {errors.requesterPosition && (
                <p className="text-red-600 text-sm mt-1">{errors.requesterPosition}</p>
              )}
            </div>
          </div>
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción de la Emergencia *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateData('description', e.target.value)}
            rows={3}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe la situación de emergencia..."
            disabled={loading}
          />
          {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
        </div>

        {/* Ubicación */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ubicación *</label>
          <select
            value={formData.location}
            onChange={(e) => onUpdateData('location', e.target.value)}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 font-roboto ${
              errors.location ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={loading}
          >
            <option value="">Seleccionar ubicación...</option>
            {user?.company?.locations?.map((loc) => (
              <option key={loc.id} value={loc.address}>
                {loc.name} - {loc.address}
              </option>
            )) || <option value="">No hay ubicaciones disponibles</option>}
          </select>
          {errors.location && <p className="text-red-600 text-sm mt-1">{errors.location}</p>}
        </div>

        {/* Información adicional */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-yellow-600 mr-3 mt-0.5"></i>
            <div>
              <p className="text-sm font-medium text-yellow-800 mb-1">Información Importante</p>
              <ul className="text-sm text-yellow-700 space-y-1">
                <li>• Este servicio es exclusivo para emergencias médicas reales</li>
                <li>• El tiempo de respuesta promedio es de 8-15 minutos</li>
                <li>• Se notificará automáticamente a los contactos de emergencia</li>
                <li>• Mantenga la calma y proporcione información precisa</li>
              </ul>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg font-semibold transition-colors font-roboto disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <i className="fas fa-spinner fa-spin mr-2"></i>
              Procesando...
            </>
          ) : (
            <>
              <i className="fas fa-ambulance mr-2"></i>
              Reportar Emergencia
            </>
          )}
        </button>
      </form>
    </div>
  )
}

export default CorporateEmergencyForm
