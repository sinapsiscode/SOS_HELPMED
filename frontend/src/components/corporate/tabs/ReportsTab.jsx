import React from 'react'

/**
 * Tab de reportes del dashboard corporativo
 * Muestra estadísticas y gráficos de uso de servicios según diseño específico
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.reportData - Datos de reportes y estadísticas
 */
const ReportsTab = ({ reportData }) => {
  return (
    <div className="space-y-6">
      {/* Estadísticas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Servicios Usados */}
        <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
          <div className="flex items-center">
            <div className="p-3 bg-blue-100 rounded-lg mr-4">
              <i className="fas fa-ambulance text-blue-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Usados</p>
              <p className="text-3xl font-bold text-blue-900">50</p>
            </div>
          </div>
        </div>

        {/* Servicios Restantes */}
        <div className="bg-green-50 rounded-xl p-6 border border-green-200">
          <div className="flex items-center">
            <div className="p-3 bg-green-100 rounded-lg mr-4">
              <i className="fas fa-check-circle text-green-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Servicios Restantes</p>
              <p className="text-3xl font-bold text-green-900">0</p>
            </div>
          </div>
        </div>

        {/* Plan Anual */}
        <div className="bg-purple-50 rounded-xl p-6 border border-purple-200">
          <div className="flex items-center">
            <div className="p-3 bg-purple-100 rounded-lg mr-4">
              <i className="fas fa-calendar text-purple-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Plan Anual</p>
              <p className="text-2xl font-bold text-purple-900">50/año</p>
            </div>
          </div>
        </div>

        {/* Ubicaciones */}
        <div className="bg-orange-50 rounded-xl p-6 border border-orange-200">
          <div className="flex items-center">
            <div className="p-3 bg-orange-100 rounded-lg mr-4">
              <i className="fas fa-map-marker-alt text-orange-600 text-xl"></i>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-600">Ubicaciones</p>
              <p className="text-3xl font-bold text-orange-900">2</p>
            </div>
          </div>
        </div>
      </div>

      {/* Uso de Servicios por Mes */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Uso de Servicios por Mes</h3>
        <div className="space-y-4">
          {[
            { month: 'Enero', value: 8, max: 8 },
            { month: 'Febrero', value: 6, max: 8 },
            { month: 'Marzo', value: 4, max: 8 },
            { month: 'Abril', value: 7, max: 8 },
            { month: 'Mayo', value: 3, max: 8 },
            { month: 'Junio', value: 2, max: 8 },
            { month: 'Julio', value: 5, max: 8 }
          ].map((item, index) => {
            const percentage = (item.value / item.max) * 100
            return (
              <div key={item.month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">{item.month}</span>
                  <span className="text-sm font-bold text-gray-900">{item.value}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-purple-600 h-4 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Servicios por Ubicación */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6">Servicios por Ubicación</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Oficina Central */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">Oficina Central</h4>
                <p className="text-sm text-blue-600">Av. Industrial 1500, Callao</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">12</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Servicios Utilizados</div>
            <div className="text-sm text-gray-600 mb-2">
              <div className="flex justify-between">
                <span>Tiempo Promedio</span>
                <span className="text-blue-600">🔵 15 min</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Máximo</span>
                <span className="text-orange-600">🔵 22 min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">Rendimiento</div>
              <div className="text-sm font-bold text-gray-800">Bueno</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '60%' }}></div>
            </div>
          </div>

          {/* Obra Norte */}
          <div className="p-4 border border-gray-200 rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h4 className="font-semibold text-gray-800">Obra Norte</h4>
                <p className="text-sm text-blue-600">Carretera Central Km 15, Lima</p>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-purple-600">23</div>
              </div>
            </div>
            <div className="text-sm text-gray-600 mb-2">Servicios Utilizados</div>
            <div className="text-sm text-gray-600 mb-2">
              <div className="flex justify-between">
                <span>Tiempo Promedio</span>
                <span className="text-blue-600">🔵 14 min</span>
              </div>
              <div className="flex justify-between">
                <span>Tiempo Máximo</span>
                <span className="text-orange-600">🔵 19 min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-600">Rendimiento</div>
              <div className="text-sm font-bold text-gray-800">Bueno</div>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
              <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '75%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReportsTab
