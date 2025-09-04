import React from 'react'

/**
 * Tarjeta de plan ilimitado (Caso 1)
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario externo Caso 1
 * @returns {JSX.Element} Tarjeta de plan ilimitado
 */
const UnlimitedPlanCard = ({ user }) => {
  return (
    <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 sm:p-6">
      <div className="flex items-center space-x-2 sm:space-x-3 mb-3 sm:mb-4">
        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
          <i className="fas fa-infinity text-white text-lg sm:text-xl"></i>
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-bold text-green-800 text-sm sm:text-base font-exo">
            Plan Sin Límites
          </h3>
          <p className="text-xs sm:text-sm text-green-600 font-roboto">Facturación directa</p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        <div className="bg-white bg-opacity-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600 font-exo">∞</div>
          <div className="text-xs text-green-700 font-roboto">Emergencias</div>
        </div>
        <div className="bg-white bg-opacity-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-xl sm:text-2xl font-bold text-green-600 font-exo">∞</div>
          <div className="text-xs text-green-700 font-roboto">Médico a Domicilio</div>
        </div>
      </div>
    </div>
  )
}

export default UnlimitedPlanCard
