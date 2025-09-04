import React from 'react'

/**
 * Gráfico de uso de servicios corporativos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.reportData - Datos de reportes
 * @returns {JSX.Element} Gráfico de uso de servicios
 */
const UsageChart = ({ reportData }) => {
  if (!reportData) return null

  const monthlyData = reportData.monthlyBreakdown || {}
  const months = Object.keys(monthlyData).slice(-6) // Últimos 6 meses
  const maxValue = Math.max(...Object.values(monthlyData)) || 10

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-exo">
          <i className="fas fa-chart-line text-blue-600 mr-2"></i>
          Uso de Servicios (Últimos 6 Meses)
        </h3>

        <div className="flex items-center space-x-4 text-sm">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-gray-600 font-roboto">Servicios Utilizados</span>
          </div>
        </div>
      </div>

      {months.length > 0 ? (
        <div className="space-y-4">
          {months.map((month, index) => {
            const value = monthlyData[month] || 0
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

            return (
              <div key={month} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700 font-roboto">{month}</span>
                  <span className="text-sm font-bold text-gray-900 font-exo">
                    {value} servicios
                  </span>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-3">
                  <div
                    className="bg-gradient-to-r from-blue-500 to-purple-600 h-3 rounded-full transition-all duration-500 flex items-center justify-end pr-2"
                    style={{
                      width: `${Math.max(percentage, 5)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {percentage > 20 && (
                      <span className="text-xs text-white font-bold">{value}</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-chart-line text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 font-roboto">No hay datos de uso disponibles</p>
        </div>
      )}

      {/* Resumen estadístico */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600 font-exo">
              {reportData.usedServices}
            </div>
            <div className="text-sm text-gray-500 font-roboto">Total Usado</div>
          </div>

          <div className="text-center">
            <div className="text-2xl font-bold text-green-600 font-exo">
              {reportData.remainingServices}
            </div>
            <div className="text-sm text-gray-500 font-roboto">Disponible</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default UsageChart
