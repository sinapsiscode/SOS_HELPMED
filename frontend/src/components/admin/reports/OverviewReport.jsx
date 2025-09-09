import React from 'react'
import useOverviewReport from '../../../hooks/useOverviewReport'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.reports.overviewReport.comments.title}
 * ${LABELS.admin.reports.overviewReport.comments.rules.rule3}
 * ${LABELS.admin.reports.overviewReport.comments.rules.rule2}
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.baseMetrics - Métricas base del sistema
 * @returns {JSX.Element} Vista del reporte overview
 */
const OverviewReport = ({ baseMetrics }) => {
  const labels = LABELS.admin.reports.overviewReport
  
  // Debug: log baseMetrics para verificar que llega correctamente
  console.log('OverviewReport baseMetrics:', baseMetrics)
  
  const { overviewMetrics, chartData, loading, hasData, exportReport } =
    useOverviewReport(baseMetrics)

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <i className="fas fa-spinner fa-spin text-4xl text-helpmed-blue mr-4"></i>
        <span className="text-lg text-gray-600 font-roboto">{labels.loading}</span>
      </div>
    )
  }

  if (!hasData) {
    return (
      <div className="text-center py-12">
        <i className="fas fa-chart-pie text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-exo font-semibold text-gray-700 mb-2">{labels.noData.title}</h3>
        <p className="text-gray-500 font-roboto">
          {labels.noData.message}
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-roboto">{labels.metrics.totalUsers}</p>
              <p className="text-3xl font-exo font-bold">
                {overviewMetrics.users.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <i
                  className={`fas fa-arrow-${overviewMetrics.users.growth >= 0 ? 'up' : 'down'} mr-1`}
                ></i>
                <span className="text-sm font-roboto">
                  {labels.metrics.vsPreviousPeriod
                    .replace('{sign}', overviewMetrics.users.growth >= 0 ? '+' : '')
                    .replace('{value}', overviewMetrics.users.growth)}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <i className="fas fa-users text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm font-roboto">{labels.metrics.servicesProvided}</p>
              <p className="text-3xl font-exo font-bold">
                {overviewMetrics.services.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <i
                  className={`fas fa-arrow-${overviewMetrics.services.growth >= 0 ? 'up' : 'down'} mr-1`}
                ></i>
                <span className="text-sm font-roboto">
                  {labels.metrics.vsPreviousPeriod
                    .replace('{sign}', overviewMetrics.services.growth >= 0 ? '+' : '')
                    .replace('{value}', overviewMetrics.services.growth)}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <i className="fas fa-ambulance text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-roboto">{labels.metrics.totalRevenue}</p>
              <p className="text-3xl font-exo font-bold">
                S/ {overviewMetrics.revenue.total.toLocaleString()}
              </p>
              <div className="flex items-center mt-2">
                <i
                  className={`fas fa-arrow-${overviewMetrics.revenue.growth >= 0 ? 'up' : 'down'} mr-1`}
                ></i>
                <span className="text-sm font-roboto">
                  {labels.metrics.vsPreviousPeriod
                    .replace('{sign}', overviewMetrics.revenue.growth >= 0 ? '+' : '')
                    .replace('{value}', overviewMetrics.revenue.growth)}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <i className="fas fa-dollar-sign text-2xl"></i>
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-yellow-100 text-sm font-roboto">{labels.metrics.satisfaction}</p>
              <p className="text-3xl font-exo font-bold">
                {overviewMetrics.satisfaction.average}/5.0
              </p>
              <div className="flex items-center mt-2">
                <i className="fas fa-star mr-1"></i>
                <span className="text-sm font-roboto">
                  {labels.metrics.surveys.replace('{count}', overviewMetrics.satisfaction.total)}
                </span>
              </div>
            </div>
            <div className="bg-white bg-opacity-20 rounded-full p-3">
              <i className="fas fa-smile text-2xl"></i>
            </div>
          </div>
        </div>
      </div>

      {/* KPIs Operacionales */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-xl font-exo font-semibold text-gray-800 mb-6">
          <i className="fas fa-tachometer-alt text-helpmed-blue mr-2"></i>
          {labels.kpis.title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 border rounded-lg">
            <div
              className={`text-3xl font-exo font-bold mb-2 ${
                overviewMetrics.performance.avgResponseTime < 15 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {labels.kpis.responseTime.unit.replace('{time}', overviewMetrics.performance.avgResponseTime)}
            </div>
            <p className="text-gray-600 font-roboto">{labels.kpis.responseTime.label}</p>
            <p className="text-sm text-gray-500 mt-1">{labels.kpis.responseTime.objective}</p>
            <div className="mt-2">
              {overviewMetrics.performance.avgResponseTime < 15 ? (
                <span className="text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>{labels.kpis.status.achieved}
                </span>
              ) : (
                <span className="text-red-600">
                  <i className="fas fa-exclamation-circle mr-1"></i>{labels.kpis.status.notAchieved}
                </span>
              )}
            </div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div
              className={`text-3xl font-exo font-bold mb-2 ${
                overviewMetrics.performance.successRate > 95 ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {labels.kpis.successRate.unit.replace('{percentage}', overviewMetrics.performance.successRate)}
            </div>
            <p className="text-gray-600 font-roboto">{labels.kpis.successRate.label}</p>
            <p className="text-sm text-gray-500 mt-1">{labels.kpis.successRate.objective}</p>
            <div className="mt-2">
              {overviewMetrics.performance.successRate > 95 ? (
                <span className="text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>{labels.kpis.status.achieved}
                </span>
              ) : (
                <span className="text-yellow-600">
                  <i className="fas fa-exclamation-triangle mr-1"></i>{labels.kpis.status.monitoring}
                </span>
              )}
            </div>
          </div>

          <div className="text-center p-4 border rounded-lg">
            <div
              className={`text-3xl font-exo font-bold mb-2 ${
                overviewMetrics.satisfaction.average > 4.0 ? 'text-green-600' : 'text-yellow-600'
              }`}
            >
              {labels.kpis.customerSatisfaction.unit.replace('{rating}', overviewMetrics.satisfaction.average)}
            </div>
            <p className="text-gray-600 font-roboto">{labels.kpis.customerSatisfaction.label}</p>
            <p className="text-sm text-gray-500 mt-1">{labels.kpis.customerSatisfaction.objective}</p>
            <div className="mt-2">
              {overviewMetrics.satisfaction.average > 4.0 ? (
                <span className="text-green-600">
                  <i className="fas fa-check-circle mr-1"></i>{labels.kpis.status.achieved}
                </span>
              ) : (
                <span className="text-yellow-600">
                  <i className="fas fa-exclamation-triangle mr-1"></i>{labels.kpis.status.monitoring}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Distribución de Servicios */}
      {chartData.serviceTypes && Object.keys(chartData.serviceTypes).length > 0 && (
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-xl font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-chart-pie text-helpmed-blue mr-2"></i>
            {labels.serviceDistribution.title}
          </h3>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div>
              <div className="space-y-3">
                {Object.entries(chartData.serviceTypes).map(([type, count]) => {
                  const percentage = ((count / overviewMetrics.services.total) * 100).toFixed(1)
                  const typeName =
                    {
                      emergency: labels.serviceDistribution.types.emergency,
                      scheduled: labels.serviceDistribution.types.scheduled,
                      transfer: labels.serviceDistribution.types.transfer,
                      consultation: labels.serviceDistribution.types.consultation
                    }[type] || type

                  return (
                    <div
                      key={type}
                      className="flex items-center justify-between p-3 border rounded-lg"
                    >
                      <div className="flex items-center">
                        <div
                          className={`w-4 h-4 rounded-full mr-3 ${
                            type === 'emergency'
                              ? 'bg-red-500'
                              : type === 'scheduled'
                                ? 'bg-blue-500'
                                : type === 'transfer'
                                  ? 'bg-green-500'
                                  : 'bg-purple-500'
                          }`}
                        ></div>
                        <span className="font-roboto">{typeName}</span>
                      </div>
                      <div className="text-right">
                        <div className="font-exo font-semibold">{count}</div>
                        <div className="text-sm text-gray-500">{percentage}%</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl text-gray-300 mb-4">📊</div>
                <p className="text-gray-600 font-roboto">
                  {labels.serviceDistribution.chartPlaceholder}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Acciones de Exportación */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
          <i className="fas fa-download text-helpmed-blue mr-2"></i>
          {labels.export.title}
        </h3>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => exportReport('pdf')}
            className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-roboto"
          >
            <i className="fas fa-file-pdf mr-2"></i>
            {labels.export.pdf}
          </button>

          <button
            onClick={() => exportReport('excel')}
            className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-roboto"
          >
            <i className="fas fa-file-excel mr-2"></i>
            {labels.export.excel}
          </button>
        </div>
      </div>
    </div>
  )
}

export default OverviewReport
