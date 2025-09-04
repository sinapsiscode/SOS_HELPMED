import React from 'react'

/**
 * Uso por ubicaciones corporativas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.reportData - Datos de reportes
 * @returns {JSX.Element} Uso por ubicaciones
 */
const LocationUsage = ({ reportData }) => {
  if (!reportData) return null

  const locationData = reportData.locationBreakdown || {}
  const locations = Object.entries(locationData).slice(0, 5) // Top 5 ubicaciones
  const maxValue = Math.max(...Object.values(locationData)) || 10

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-exo">
          <i className="fas fa-map-marker-alt text-green-600 mr-2"></i>
          Uso por Ubicación
        </h3>

        <span className="text-sm text-gray-500 font-roboto">
          Top {locations.length} ubicaciones
        </span>
      </div>

      {locations.length > 0 ? (
        <div className="space-y-4">
          {locations.map(([location, value], index) => {
            const percentage = maxValue > 0 ? (value / maxValue) * 100 : 0

            return (
              <div key={location} className="space-y-2">
                <div className="flex justify-between items-center">
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <div
                        className={`w-3 h-3 rounded-full mr-3 ${
                          index === 0
                            ? 'bg-green-500'
                            : index === 1
                              ? 'bg-blue-500'
                              : index === 2
                                ? 'bg-yellow-500'
                                : index === 3
                                  ? 'bg-purple-500'
                                  : 'bg-gray-500'
                        }`}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-700 font-roboto truncate">
                      {location}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 flex-shrink-0 ml-4">
                    <span className="text-sm font-bold text-gray-900 font-exo">{value}</span>
                    <span className="text-xs text-gray-500">({Math.round(percentage)}%)</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      index === 0
                        ? 'bg-green-500'
                        : index === 1
                          ? 'bg-blue-500'
                          : index === 2
                            ? 'bg-yellow-500'
                            : index === 3
                              ? 'bg-purple-500'
                              : 'bg-gray-500'
                    }`}
                    style={{
                      width: `${Math.max(percentage, 3)}%`,
                      animationDelay: `${index * 100}ms`
                    }}
                  ></div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="text-center py-8">
          <i className="fas fa-map-marker-alt text-4xl text-gray-300 mb-4"></i>
          <p className="text-gray-500 font-roboto">No hay datos de ubicaciones disponibles</p>
        </div>
      )}

      {/* Estadísticas adicionales */}
      {locations.length > 0 && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-bold text-gray-900 font-exo">
                {reportData.locationsCount}
              </div>
              <div className="text-xs text-gray-500 font-roboto">Ubicaciones Totales</div>
            </div>

            <div>
              <div className="text-lg font-bold text-green-600 font-exo">{locations.length}</div>
              <div className="text-xs text-gray-500 font-roboto">Con Actividad</div>
            </div>

            <div>
              <div className="text-lg font-bold text-blue-600 font-exo">
                {Math.round(
                  Object.values(locationData).reduce((a, b) => a + b, 0) / locations.length
                ) || 0}
              </div>
              <div className="text-xs text-gray-500 font-roboto">Promedio/Ubicación</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default LocationUsage
