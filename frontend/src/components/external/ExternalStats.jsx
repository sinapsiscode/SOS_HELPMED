import React from 'react'

/**
 * Estadísticas de usuario externo
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.stats - Estadísticas del usuario externo
 * @param {Object} props.user - Usuario externo
 * @returns {JSX.Element} Estadísticas de usuario externo
 */
const ExternalStats = ({ stats, user }) => {
  if (!stats) return null

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="font-bold text-gray-800 mb-3 sm:mb-4 text-sm sm:text-base font-exo">
        Tus Estadísticas
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm sm:text-base font-roboto">Servicios usados:</span>
          <span className="font-bold text-xl sm:text-2xl text-teal-600 font-exo">
            {stats.totalUsed}
          </span>
        </div>

        {user.plan.subtype === 'CASO_2' && (
          <>
            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base font-roboto">
                <span className="hidden sm:inline">Restantes este año:</span>
                <span className="sm:hidden">Restantes:</span>
              </span>
              <span className="font-bold text-lg sm:text-xl text-blue-600 font-exo">
                {stats.individualRemaining}
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-600 text-sm sm:text-base font-roboto">
                Última atención:
              </span>
              <span className="text-xs sm:text-sm text-gray-800 font-roboto">
                {stats.lastServiceDate}
              </span>
            </div>
          </>
        )}

        {user.plan.subtype === 'CASO_1' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-blue-700 font-roboto">
              <i className="fas fa-info-circle mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">
                Todos los servicios se facturan directamente a {user.client_company?.name}
              </span>
              <span className="sm:hidden">Facturación directa a empresa</span>
            </p>
          </div>
        )}

        {stats.referralSource === 'BCR_FONDO_EMPLEADOS' && (
          <div className="mt-2 sm:mt-3 bg-green-50 border border-green-200 rounded-lg p-2 sm:p-3">
            <p className="text-xs sm:text-sm text-green-700 font-roboto">
              <i className="fas fa-check-circle mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Afiliado a través del Fondo de Empleados BCR</span>
              <span className="sm:hidden">Afiliado Fondo BCR</span>
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ExternalStats
