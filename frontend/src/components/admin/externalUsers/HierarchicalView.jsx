import React from 'react'

/**
 * Vista jerárquica de entidades externas con usuarios
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Array} entities - Lista filtrada de entidades
 * @param {string} expandedEntity - ID de entidad expandida
 * @param {Function} onToggleExpansion - Función para expandir/colapsar entidad
 * @param {Function} onToggleUserStatus - Función para cambiar estado de usuario
 * @param {Function} getEntityIcon - Función para obtener icono de entidad
 * @param {Function} getEntityColor - Función para obtener color de entidad
 * @param {Function} getUserStatusColor - Función para obtener color de estado
 * @param {Function} getUserStatusText - Función para obtener texto de estado
 * @returns {JSX.Element} Vista jerárquica expandible
 */
const HierarchicalView = ({
  entities,
  expandedEntity,
  onToggleExpansion,
  onToggleUserStatus,
  getEntityIcon,
  getEntityColor,
  getUserStatusColor,
  getUserStatusText
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!Array.isArray(entities)) {
    console.error('HierarchicalView: entities debe ser un array')
    return null
  }

  if (typeof expandedEntity !== 'string' && expandedEntity !== null) {
    console.error('HierarchicalView: expandedEntity debe ser string o null')
    return null
  }

  if (typeof onToggleExpansion !== 'function') {
    console.error('HierarchicalView: onToggleExpansion debe ser una función')
    return null
  }

  if (typeof onToggleUserStatus !== 'function') {
    console.error('HierarchicalView: onToggleUserStatus debe ser una función')
    return null
  }

  if (typeof getEntityIcon !== 'function') {
    console.error('HierarchicalView: getEntityIcon debe ser una función')
    return null
  }

  if (typeof getEntityColor !== 'function') {
    console.error('HierarchicalView: getEntityColor debe ser una función')
    return null
  }

  if (typeof getUserStatusColor !== 'function') {
    console.error('HierarchicalView: getUserStatusColor debe ser una función')
    return null
  }

  if (typeof getUserStatusText !== 'function') {
    console.error('HierarchicalView: getUserStatusText debe ser una función')
    return null
  }

  return (
    <div className="space-y-4">
      {entities.map((entity) => (
        <div key={entity.entityCode} className="bg-white rounded-xl shadow-medium overflow-hidden">
          {/* Header de Entidad */}
          <div
            className={`p-4 bg-gradient-to-r from-${getEntityColor(entity.type)}-50 to-white border-b cursor-pointer hover:bg-${getEntityColor(entity.type)}-50 transition-colors`}
            onClick={() => onToggleExpansion(entity.entityCode)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div
                  className={`w-12 h-12 bg-${getEntityColor(entity.type)}-100 rounded-lg flex items-center justify-center`}
                >
                  <i
                    className={`${getEntityIcon(entity.type)} text-${getEntityColor(entity.type)}-600 text-xl`}
                  ></i>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">{entity.entity}</h3>
                  <p className="text-sm text-gray-600">Código: {entity.entityCode}</p>
                </div>
              </div>

              <div className="flex items-center space-x-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-800">{entity.stats.totalUsers}</div>
                  <div className="text-xs text-gray-600">Usuarios</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {entity.stats.activeUsers}
                  </div>
                  <div className="text-xs text-gray-600">Activos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {entity.stats.monthlyServices}
                  </div>
                  <div className="text-xs text-gray-600">Servicios/Mes</div>
                </div>
                <i
                  className={`fas fa-chevron-${expandedEntity === entity.entityCode ? 'up' : 'down'} text-gray-400`}
                ></i>
              </div>
            </div>
          </div>

          {/* Contenido Expandido */}
          {expandedEntity === entity.entityCode && (
            <div className="p-4">
              {/* Administrador */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-user-shield text-orange-600 mr-2"></i>
                    Administrador de Entidad
                  </h4>
                </div>

                {entity.admin ? (
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-orange-200 rounded-full flex items-center justify-center">
                          <i className="fas fa-user text-orange-600"></i>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{entity.admin.name}</p>
                          <p className="text-sm text-gray-600">{entity.admin.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${
                            entity.admin.status === 'active'
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-700'
                          }`}
                        >
                          {entity.admin.status === 'active' ? 'Activo' : 'Inactivo'}
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
                    <i className="fas fa-exclamation-triangle text-red-400 text-2xl mb-2"></i>
                    <p className="text-red-600 font-medium">Error: Entidad sin administrador</p>
                    <p className="text-sm text-red-500 mt-1">
                      Contacte al administrador del sistema
                    </p>
                  </div>
                )}
              </div>

              {/* Usuarios */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h4 className="font-semibold text-gray-800 flex items-center">
                    <i className="fas fa-users text-blue-600 mr-2"></i>
                    Usuarios ({entity.users.length})
                  </h4>
                </div>

                {entity.users.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {entity.users.map((user) => (
                      <div key={user.id} className="border border-gray-200 rounded-lg p-3">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <i className="fas fa-user text-blue-600 text-sm"></i>
                            </div>
                            <div>
                              <p className="font-medium text-gray-800 text-sm">{user.name}</p>
                              <p className="text-xs text-gray-600">{user.employeeCode}</p>
                            </div>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getUserStatusColor(user.status)}`}
                          >
                            {getUserStatusText(user.status)}
                          </span>
                        </div>

                        <div className="space-y-1 text-xs text-gray-600">
                          <p>
                            <i className="fas fa-envelope mr-1"></i>
                            {user.email}
                          </p>
                          <p>
                            <i className="fas fa-calendar mr-1"></i>Último acceso: {user.lastAccess}
                          </p>
                          <p>
                            <i className="fas fa-heartbeat mr-1"></i>Servicios: {user.servicesUsed}
                          </p>
                        </div>

                        <div className="flex space-x-2 mt-2">
                          <button
                            onClick={() => onToggleUserStatus(user, entity)}
                            className={`flex-1 px-2 py-1 rounded text-xs font-medium transition-colors ${
                              user.status === 'active'
                                ? 'bg-red-100 hover:bg-red-200 text-red-700'
                                : 'bg-green-100 hover:bg-green-200 text-green-700'
                            }`}
                          >
                            {user.status === 'active' ? 'Desactivar' : 'Activar'}
                          </button>
                          <button className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-1 rounded text-xs font-medium transition-colors">
                            Editar
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                    <i className="fas fa-users-slash text-gray-400 text-2xl mb-2"></i>
                    <p className="text-gray-600">No hay usuarios registrados</p>
                    {!entity.admin ? (
                      <p className="text-sm text-red-500 mt-1">
                        Error: La entidad no tiene administrador
                      </p>
                    ) : (
                      <p className="text-sm text-blue-600 mt-2">
                        <i className="fas fa-info-circle mr-1"></i>
                        Los usuarios externos se registran directamente desde el aplicativo
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}

export default HierarchicalView
