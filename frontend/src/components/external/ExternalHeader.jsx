import React from 'react'
import useAppStore from '../../stores/useAppStore'

/**
 * Encabezado del dashboard de usuarios externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario externo
 * @returns {JSX.Element} Encabezado de usuario externo
 */
const ExternalHeader = ({ user }) => {
  const { logout } = useAppStore()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 sm:space-x-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-r from-teal-500 to-teal-600 rounded-full flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-base sm:text-lg font-exo">
                {user.profile.name.charAt(0)}
              </span>
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-base sm:text-xl font-bold text-gray-800 truncate font-exo">
                {user.profile.name}
              </h1>
              <p className="text-sm sm:text-base text-gray-600 truncate font-roboto">
                {user.plan.name}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 flex-shrink-0">
            {/* Badge de estado - responsive */}
            <div
              className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                user.plan.subtype === 'CASO_1'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800'
              }`}
            >
              <span className="hidden sm:inline">
                {user.plan.subtype === 'CASO_1' ? 'Sin Límites' : 'Con Límites'}
              </span>
              <span className="sm:hidden">{user.plan.subtype === 'CASO_1' ? '∞' : '3/año'}</span>
            </div>

            {/* Servicios restantes - solo visible en móvil para Caso 2 */}
            {user.plan.subtype === 'CASO_2' && (
              <div className="sm:hidden bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-medium">
                {user.service_usage.current_period.individual_remaining} rest.
              </div>
            )}

            {/* Notificaciones */}
            <button className="relative p-2 text-gray-600 hover:text-teal-600 transition-colors rounded-lg hover:bg-teal-50">
              <i className="fas fa-bell text-lg sm:text-xl"></i>
              {user.plan.subtype === 'CASO_2' &&
                user.service_usage.current_period.individual_remaining <= 1 && (
                  <div className="absolute -top-1 -right-1 w-3 h-3 sm:w-4 sm:h-4 bg-orange-500 rounded-full animate-pulse"></div>
                )}
            </button>

            {/* Logout */}
            <button
              onClick={logout}
              className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50"
              title="Cerrar sesión"
            >
              <i className="fas fa-sign-out-alt text-lg sm:text-xl"></i>
            </button>
          </div>
        </div>

        {/* Información adicional en móvil */}
        <div className="sm:hidden mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600 font-roboto">
                <i className="fas fa-building mr-1"></i>
                {user.client_company?.name || 'Externo'}
              </span>
              {user.plan.subtype === 'CASO_2' && (
                <span className="text-gray-600 font-roboto">
                  <i className="fas fa-calendar mr-1"></i>
                  {user.service_usage.current_period.individual_remaining}/3 servicios restantes
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default ExternalHeader
