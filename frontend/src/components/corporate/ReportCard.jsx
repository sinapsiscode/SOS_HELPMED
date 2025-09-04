import React from 'react'

/**
 * Tarjeta de reporte corporativo
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.reportData - Datos de reportes
 * @returns {JSX.Element} Tarjeta de reporte
 */
const ReportCard = ({ reportData }) => {
  if (!reportData) return null

  const utilizationRate =
    reportData.usedServices > 0
      ? Math.round(
          (reportData.usedServices / (reportData.usedServices + reportData.remainingServices)) * 100
        )
      : 0

  const getUtilizationColor = (rate) => {
    if (rate >= 80) return 'text-red-600 bg-red-50'
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50'
    if (rate >= 40) return 'text-blue-600 bg-blue-50'
    return 'text-green-600 bg-green-50'
  }

  const getUtilizationIcon = (rate) => {
    if (rate >= 80) return 'fas fa-exclamation-triangle'
    if (rate >= 60) return 'fas fa-exclamation-circle'
    if (rate >= 40) return 'fas fa-info-circle'
    return 'fas fa-check-circle'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800 font-exo">
          <i className="fas fa-chart-bar text-purple-600 mr-2"></i>
          Reporte de Uso
        </h3>

        <div
          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getUtilizationColor(utilizationRate)}`}
        >
          <i className={`${getUtilizationIcon(utilizationRate)} mr-1`}></i>
          {utilizationRate}% Utilizado
        </div>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-600 font-exo mb-1">
            {reportData.usedServices}
          </div>
          <div className="text-sm text-gray-500 font-roboto">Servicios Utilizados</div>
        </div>

        <div className="text-center">
          <div className="text-3xl font-bold text-green-600 font-exo mb-1">
            {reportData.remainingServices}
          </div>
          <div className="text-sm text-gray-500 font-roboto">Servicios Disponibles</div>
        </div>
      </div>

      {/* Barra de progreso visual */}
      <div className="mb-6">
        <div className="flex justify-between text-sm text-gray-600 mb-2 font-roboto">
          <span>Progreso del Plan</span>
          <span>{utilizationRate}%</span>
        </div>

        <div className="w-full bg-gray-200 rounded-full h-3">
          <div
            className={`h-3 rounded-full transition-all duration-500 ${
              utilizationRate >= 80
                ? 'bg-gradient-to-r from-red-500 to-red-600'
                : utilizationRate >= 60
                  ? 'bg-gradient-to-r from-yellow-500 to-yellow-600'
                  : utilizationRate >= 40
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600'
                    : 'bg-gradient-to-r from-green-500 to-green-600'
            }`}
            style={{ width: `${Math.min(utilizationRate, 100)}%` }}
          ></div>
        </div>
      </div>

      {/* Información del plan */}
      <div className="bg-gray-50 rounded-lg p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-600 font-roboto">Plan:</span>
            <span className="font-semibold text-gray-900 font-roboto">{reportData.planInfo}</span>
          </div>

          <div className="flex justify-between">
            <span className="text-gray-600 font-roboto">Ubicaciones:</span>
            <span className="font-semibold text-gray-900 font-roboto">
              {reportData.locationsCount}
            </span>
          </div>
        </div>
      </div>

      {/* Recomendación basada en el uso */}
      {utilizationRate >= 80 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <div className="flex items-start">
            <i className="fas fa-lightbulb text-red-600 mr-2 mt-0.5"></i>
            <div className="text-sm">
              <p className="font-medium text-red-800 mb-1">Recomendación</p>
              <p className="text-red-700">
                Has utilizado el {utilizationRate}% de tus servicios. Considera comprar servicios
                adicionales para evitar interrupciones.
              </p>
            </div>
          </div>
        </div>
      )}

      {utilizationRate < 30 && (
        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start">
            <i className="fas fa-info-circle text-blue-600 mr-2 mt-0.5"></i>
            <div className="text-sm">
              <p className="font-medium text-blue-800 mb-1">Información</p>
              <p className="text-blue-700">
                Excelente gestión de recursos. Solo has utilizado el {utilizationRate}% de tu plan.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ReportCard
