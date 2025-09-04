import React from 'react'

/**
 * Banners informativos para usuarios externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario externo
 * @param {Object} props.bannerAlerts - Alertas de banner calculadas
 * @returns {JSX.Element} Banners informativos
 */
const ExternalBanners = ({ user, bannerAlerts }) => {
  if (user.plan.subtype !== 'CASO_2') return null

  return (
    <>
      {/* Banner para Caso 2 con servicios gratuitos agotados - Responsive */}
      {bannerAlerts.showExhausted && (
        <div className="bg-orange-500 text-white py-3 sm:py-4">
          <div className="px-3 sm:px-4">
            <div className="flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3">
              <i className="fas fa-exclamation-triangle text-xl sm:text-2xl flex-shrink-0"></i>
              <div className="text-center sm:text-left">
                <p className="font-bold text-sm sm:text-lg font-exo">
                  Servicios Gratuitos Agotados
                </p>
                <p className="text-orange-100 text-xs sm:text-sm font-roboto">
                  Has usado tus 3 servicios anuales incluidos. Los próximos servicios costarán
                  $45.000 cada uno.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Banner informativo cuando quedan pocos servicios gratuitos - Responsive */}
      {bannerAlerts.showWarning && (
        <div className="bg-yellow-500 text-white py-3 sm:py-4">
          <div className="px-3 sm:px-4 text-center">
            <p className="font-medium text-xs sm:text-base font-roboto">
              <i className="fas fa-info-circle mr-1 sm:mr-2"></i>
              Te queda 1 servicio gratuito este año. Después tendrán costo adicional de $45.000.
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default ExternalBanners
