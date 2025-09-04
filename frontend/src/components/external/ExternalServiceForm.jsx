import React from 'react'

/**
 * Formulario para solicitar servicios externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario externo
 * @param {Object} props.formData - Datos del formulario
 * @param {Object} props.errors - Errores de validación
 * @param {Object} props.coordinates - Coordenadas GPS actuales
 * @param {boolean} props.isGettingLocation - Estado de obtención de ubicación
 * @param {Function} props.onUpdateData - Función para actualizar datos
 * @param {Function} props.onGetLocation - Función para obtener ubicación GPS
 * @param {Function} props.onUseAddress - Función para usar dirección registrada
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @param {Function} props.canUseService - Función para verificar disponibilidad
 * @param {Function} props.hasAdditionalCost - Función para verificar costo adicional
 * @returns {JSX.Element} Formulario de servicios externos
 */
const ExternalServiceForm = ({
  user,
  formData,
  errors,
  coordinates,
  isGettingLocation,
  onUpdateData,
  onGetLocation,
  onUseAddress,
  onSubmit,
  canUseService,
  hasAdditionalCost
}) => {
  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit()
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 font-exo">Solicitar Servicio</h2>
        {user.plan.subtype === 'CASO_1' && (
          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs sm:text-sm font-medium self-start sm:self-auto">
            Facturación Directa
          </span>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
        {/* Tipo de servicio - Responsive */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 sm:mb-3 font-roboto">
            Tipo de Servicio
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ServiceTypeOption
              type="EMERGENCIA"
              name="Emergencia Médica"
              icon="fas fa-ambulance"
              color="red"
              isSelected={formData.serviceType === 'EMERGENCIA'}
              onSelect={() => onUpdateData('serviceType', 'EMERGENCIA')}
              canUse={canUseService('EMERGENCIA')}
              hasAdditionalCost={hasAdditionalCost('EMERGENCIA')}
              user={user}
            />
            <ServiceTypeOption
              type="MEDICO_DOMICILIO"
              name="Médico a Domicilio"
              icon="fas fa-user-md"
              color="blue"
              isSelected={formData.serviceType === 'MEDICO_DOMICILIO'}
              onSelect={() => onUpdateData('serviceType', 'MEDICO_DOMICILIO')}
              canUse={canUseService('MEDICO_DOMICILIO')}
              hasAdditionalCost={hasAdditionalCost('MEDICO_DOMICILIO')}
              user={user}
            />
          </div>
          {errors.serviceType && (
            <p className="text-red-600 text-sm mt-1 font-roboto">{errors.serviceType}</p>
          )}
        </div>

        {/* Descripción - Responsive */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => onUpdateData('description', e.target.value)}
            rows={3}
            className={`w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base font-roboto ${
              errors.description ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Describe la situación médica..."
          />
          {errors.description && (
            <p className="text-red-600 text-sm mt-1 font-roboto">{errors.description}</p>
          )}
        </div>

        {/* Ubicación - Responsive */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2 font-roboto">
            Ubicación
          </label>
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <input
              type="text"
              value={formData.location}
              onChange={(e) => onUpdateData('location', e.target.value)}
              className={`flex-1 border rounded-lg px-3 py-2 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base font-roboto ${
                errors.location ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Dirección completa o coordenadas GPS..."
            />
            <div className="flex space-x-2">
              <button
                type="button"
                className="flex-1 sm:flex-none bg-teal-500 hover:bg-teal-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm font-roboto"
                onClick={onGetLocation}
                disabled={isGettingLocation}
                title="Obtener ubicación GPS de alta precisión"
              >
                {isGettingLocation ? (
                  <i className="fas fa-spinner fa-spin"></i>
                ) : (
                  <i className="fas fa-map-marker-alt"></i>
                )}
                <span className="sm:hidden">GPS</span>
              </button>
              <button
                type="button"
                className="flex-1 sm:flex-none bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-1 text-sm font-roboto"
                onClick={onUseAddress}
                title="Usar dirección registrada"
              >
                <i className="fas fa-home"></i>
                <span className="sm:hidden">Casa</span>
              </button>
            </div>
          </div>

          {errors.location && (
            <p className="text-red-600 text-sm mt-1 font-roboto">{errors.location}</p>
          )}

          {/* Indicador de ubicación GPS - Responsive */}
          {coordinates && (
            <div className="mt-2 p-2 sm:p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-1 sm:space-y-0">
                <div className="flex items-center space-x-2 text-green-700">
                  <i className="fas fa-check-circle"></i>
                  <span className="font-medium text-sm font-roboto">Ubicación GPS registrada</span>
                </div>
                <span className="text-green-600 text-xs sm:text-sm font-roboto">
                  Precisión: {coordinates.accuracy?.toFixed(1)}m
                </span>
              </div>
            </div>
          )}

          <p className="text-xs text-gray-500 mt-1 font-roboto">
            Dirección registrada: {user.profile.address}
          </p>
          {(formData.serviceType === 'EMERGENCIA' ||
            formData.serviceType === 'MEDICO_DOMICILIO') && (
            <p className="text-xs text-teal-600 mt-1 font-roboto">
              💡 Recomendado: Usa el botón GPS 📍 para máxima precisión en{' '}
              {formData.serviceType === 'EMERGENCIA' ? 'emergencias' : 'atención domiciliaria'}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-teal-600 hover:bg-teal-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors text-sm sm:text-base font-roboto"
        >
          Solicitar Servicio
        </button>
      </form>
    </div>
  )
}

const ServiceTypeOption = ({
  type,
  name,
  icon,
  color,
  isSelected,
  onSelect,
  canUse,
  hasAdditionalCost,
  user
}) => {
  const getColorClasses = (color) => {
    const classes = {
      red: isSelected
        ? 'bg-red-500 text-white border-red-500'
        : canUse
          ? 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100'
          : 'bg-gray-100 text-gray-400 border-gray-200',
      blue: isSelected
        ? 'bg-blue-500 text-white border-blue-500'
        : canUse
          ? 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100'
          : 'bg-gray-100 text-gray-400 border-gray-200'
    }
    return classes[color] || classes.blue
  }

  return (
    <button
      type="button"
      onClick={canUse ? onSelect : undefined}
      disabled={!canUse}
      className={`p-3 sm:p-4 border rounded-lg transition-all duration-200 text-left ${getColorClasses(color)} ${!canUse ? 'cursor-not-allowed' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
          <i className={`${icon} text-lg sm:text-xl flex-shrink-0`}></i>
          <span className="font-medium text-sm sm:text-base truncate font-roboto">{name}</span>
        </div>
        {hasAdditionalCost && (
          <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium border border-orange-200 ml-2 flex-shrink-0">
            <i className="fas fa-dollar-sign mr-1"></i>
            <span className="hidden sm:inline">Costo Adicional</span>
            <span className="sm:hidden">$</span>
          </span>
        )}
      </div>

      {user.plan.subtype === 'CASO_1' && (
        <div className="text-xs sm:text-sm opacity-90 font-roboto">
          Facturación directa a la empresa
        </div>
      )}

      {user.plan.subtype === 'CASO_2' && !hasAdditionalCost && (
        <div className="text-xs sm:text-sm opacity-90 font-roboto">
          <i className="fas fa-gift text-green-600 mr-1"></i>
          <span className="hidden sm:inline">
            {user.service_usage.current_period.individual_remaining} servicios gratuitos restantes
          </span>
          <span className="sm:hidden">
            {user.service_usage.current_period.individual_remaining} restantes
          </span>
        </div>
      )}

      {hasAdditionalCost && (
        <div className="text-xs sm:text-sm opacity-90 font-roboto">
          <i className="fas fa-exclamation-triangle text-orange-600 mr-1"></i>
          <span className="hidden sm:inline">$45.000 - Servicios gratuitos agotados</span>
          <span className="sm:hidden">$45.000</span>
        </div>
      )}

      {!canUse && (
        <div className="text-xs sm:text-sm opacity-90 text-red-600 font-roboto">
          <i className="fas fa-ban mr-1"></i>
          <span className="hidden sm:inline">Límite empresarial agotado</span>
          <span className="sm:hidden">Agotado</span>
        </div>
      )}
    </button>
  )
}

export default ExternalServiceForm
