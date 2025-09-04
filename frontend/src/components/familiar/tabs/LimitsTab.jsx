import React from 'react'

const LimitsTab = ({ user }) => {
  if (!user) return null

  const usedServices = user.service_usage?.current_period?.used_services || 0
  const totalServices = user.plan?.total_services || 16
  const percentage = Math.round((usedServices / totalServices) * 100)

  return (
    <div className="space-y-6">
      {/* Límites Detallados */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Límites Detallados</h2>
            <p className="text-sm text-gray-600">Plan Help</p>
          </div>
          <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
            FAMILIAR
          </span>
        </div>

        {/* Servicios Disponibles */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-medical-cross text-blue-600 text-sm"></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-sm font-medium text-gray-900">Servicios Disponibles</h3>
                <span className="text-sm font-semibold text-gray-900">{usedServices} / {totalServices}</span>
              </div>
              <p className="text-xs text-gray-600 mb-2">Emergencias, urgencias y médico a domicilio</p>
              
              {/* Barra de progreso */}
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300" 
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Uso de Servicios */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-lg font-semibold text-gray-900">Uso de Servicios</h2>
          <span className="text-sm text-blue-600 font-medium">Período Actual</span>
        </div>

        <div className="mb-4">
          <h3 className="text-sm font-medium text-gray-900 mb-4">Resumen</h3>
        </div>

        {/* Grid de estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Total Usado */}
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{usedServices}</div>
            <div className="text-xs text-blue-600 font-medium">Total Usado</div>
          </div>

          {/* Ilimitados */}
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-600">0</div>
            <div className="text-xs text-green-600 font-medium">Ilimitados</div>
          </div>

          {/* Cerca Límite */}
          <div className="bg-yellow-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-600">0</div>
            <div className="text-xs text-yellow-600 font-medium">Cerca Límite</div>
          </div>

          {/* Agotados */}
          <div className="bg-red-50 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-red-600">0</div>
            <div className="text-xs text-red-600 font-medium">Agotados</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default LimitsTab