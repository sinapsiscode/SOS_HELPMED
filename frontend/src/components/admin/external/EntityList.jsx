import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.external.entityList.comments.title}
 * ${LABELS.admin.external.entityList.comments.approach}
 *
 * @param {Array} entities - Lista de entidades
 * @param {Function} onToggleStatus - Función para cambiar estado de entidad
 * @param {Function} onOpenAddAdmin - Función para abrir modal de admin
 * @param {Function} getEntityTypeIcon - Función para obtener icono del tipo
 * @param {Function} getEntityTypeColor - Función para obtener color del tipo
 * @param {Function} getUsagePercentage - Función para calcular porcentaje de uso
 * @param {Function} getUsageColorClass - Función para obtener clase de color de uso
 * @returns {JSX.Element} Lista de entidades con responsive design
 */
const EntityList = ({
  entities,
  onToggleStatus,
  onOpenAddAdmin,
  getEntityTypeIcon,
  getEntityTypeColor,
  getUsagePercentage,
  getUsageColorClass
}) => {
  const labels = LABELS.admin.external.entityList

  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(entities)) {
    console.error(labels.errors.entitiesRequired)
    return null
  }

  if (typeof onToggleStatus !== 'function') {
    console.error(labels.errors.onToggleStatusRequired)
    return null
  }

  if (typeof onOpenAddAdmin !== 'function') {
    console.error(labels.errors.onOpenAddAdminRequired)
    return null
  }

  if (typeof getEntityTypeIcon !== 'function') {
    console.error(labels.errors.getEntityTypeIconRequired)
    return null
  }

  if (typeof getEntityTypeColor !== 'function') {
    console.error(labels.errors.getEntityTypeColorRequired)
    return null
  }

  if (typeof getUsagePercentage !== 'function') {
    console.error(labels.errors.getUsagePercentageRequired)
    return null
  }

  if (typeof getUsageColorClass !== 'function') {
    console.error(labels.errors.getUsageColorClassRequired)
    return null
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-3 sm:mb-4">
        {labels.title}
      </h3>

      {/* Vista de escritorio */}
      <div className="hidden md:block">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
          {entities.map((entity) => (
            <div
              key={entity.id}
              className={`border rounded-xl p-4 transition-all hover:shadow-md ${
                entity.active ? 'border-gray-200 hover:border-gray-300' : 'border-red-200 bg-red-50'
              }`}
            >
              <div className="flex items-start justify-between mb-3">
                <div
                  className={`w-12 h-12 bg-${getEntityTypeColor(entity.type)}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                >
                  <i
                    className={`${getEntityTypeIcon(entity.type)} text-${getEntityTypeColor(entity.type)}-600 text-xl`}
                  ></i>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                    entity.active
                      ? 'bg-green-100 text-green-700 border border-green-200'
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}
                >
                  {entity.active ? labels.status.active : labels.status.inactive}
                </span>
              </div>

              <h4 className="font-bold text-gray-800 mb-1 text-sm md:text-base leading-tight">
                {entity.name}
              </h4>
              <p className="text-xs md:text-sm text-gray-600 mb-3 line-clamp-2">
                {entity.description}
              </p>

              <div className="space-y-2 text-xs md:text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{labels.fields.code}</span>
                  <span className="font-medium text-gray-800 font-mono">{entity.code}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{labels.fields.users}</span>
                  <span className="font-medium text-gray-800">
                    {labels.usersFormat.replace('{active}', entity.activeUsers).replace('{max}', entity.maxUsers)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">{labels.fields.admin}</span>
                  <span className="font-medium text-gray-800 truncate ml-2">
                    {entity.admin ? (
                      <span className="text-green-700">{entity.admin.name}</span>
                    ) : (
                      <span className="text-red-600">{labels.fields.noAdmin}</span>
                    )}
                  </span>
                </div>
              </div>

              <div className="flex flex-col space-y-2 mt-4">
                <button
                  onClick={() => onToggleStatus(entity)}
                  className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    entity.active
                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  <i className={`fas fa-${entity.active ? 'times' : 'check'} mr-1`}></i>
                  {entity.active ? labels.buttons.deactivate : labels.buttons.activate}
                </button>
                {!entity.admin && (
                  <button
                    onClick={() => onOpenAddAdmin(entity)}
                    className="w-full bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors"
                  >
                    <i className="fas fa-user-plus mr-1"></i>
                    {labels.buttons.createAdmin}
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vista móvil y tablet - Compacta */}
      <div className="block md:hidden space-y-3">
        {entities.map((entity) => {
          const usagePercentage = getUsagePercentage(entity.activeUsers, entity.maxUsers)
          const usageColorClass = getUsageColorClass(usagePercentage)

          return (
            <div
              key={entity.id}
              className={`bg-white border rounded-xl p-3 sm:p-4 shadow-sm transition-all ${
                entity.active ? 'border-gray-200' : 'border-red-200'
              }`}
            >
              {/* Header de la entidad - Responsive */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3 min-w-0 flex-1">
                  <div
                    className={`w-10 h-10 sm:w-12 sm:h-12 bg-${getEntityTypeColor(entity.type)}-100 rounded-lg flex items-center justify-center flex-shrink-0`}
                  >
                    <i
                      className={`${getEntityTypeIcon(entity.type)} text-${getEntityTypeColor(entity.type)}-600 text-sm sm:text-base`}
                    ></i>
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-gray-800 text-sm sm:text-base truncate">
                      {entity.name}
                    </h4>
                    <p className="text-xs text-gray-500 capitalize">{entity.type}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-1 flex-shrink-0">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${
                      entity.active
                        ? 'bg-green-100 text-green-700 border border-green-200'
                        : 'bg-red-100 text-red-700 border border-red-200'
                    }`}
                  >
                    {entity.active ? labels.status.active : labels.status.inactive}
                  </span>
                  <span className="text-xs text-gray-500">
                    {entity.admin ? entity.admin.name.split(' ')[0] : labels.fields.noAdmin}
                  </span>
                </div>
              </div>

              {/* Información clave - Compacta */}
              <div className="grid grid-cols-2 gap-3 mb-3 text-xs sm:text-sm">
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{labels.fields.code}</span>
                    <span className="font-mono font-medium">{entity.code}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{labels.fields.users}</span>
                    <span className="font-medium">
                      {entity.activeUsers}/{entity.maxUsers}
                    </span>
                  </div>
                </div>
                <div className="space-y-1">
                  <div className="flex justify-between">
                    <span className="text-gray-500">{labels.fields.type}</span>
                    <span className="font-medium capitalize">{entity.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">{labels.fields.admin}</span>
                    <span
                      className={`font-medium ${entity.admin ? 'text-green-700' : 'text-red-600'}`}
                    >
                      {entity.admin ? '✓' : '✗'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Progress bar de uso */}
              <div className="mb-3">
                <div className="flex items-center justify-between text-xs mb-1">
                  <span className="text-gray-500">{labels.fields.usageLabel}</span>
                  <span className="font-medium">{usagePercentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${usageColorClass}`}
                    style={{ width: `${Math.min(usagePercentage, 100)}%` }}
                  ></div>
                </div>
              </div>

              {/* Botones de acción - Responsive */}
              <div className="flex flex-col sm:flex-row gap-2">
                <button
                  onClick={() => onToggleStatus(entity)}
                  className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2 ${
                    entity.active
                      ? 'bg-red-100 hover:bg-red-200 text-red-700'
                      : 'bg-green-100 hover:bg-green-200 text-green-700'
                  }`}
                >
                  <i className={`fas fa-${entity.active ? 'times' : 'check'}`}></i>
                  <span>{entity.active ? 'Desactivar' : 'Activar'}</span>
                </button>

                {!entity.admin && (
                  <button
                    onClick={() => onOpenAddAdmin(entity)}
                    className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center space-x-2"
                  >
                    <i className="fas fa-user-plus"></i>
                    <span>Crear Admin</span>
                  </button>
                )}

                {entity.active && (
                  <div className="flex items-center justify-center sm:justify-end">
                    <div className="bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1">
                      <i className="fas fa-circle text-xs animate-pulse"></i>
                      <span>{labels.online}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default EntityList
