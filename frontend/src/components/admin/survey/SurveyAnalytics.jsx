import React from 'react'

/**
 * Componente para análisis y métricas de encuestas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación, datos calculados en hook
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.metrics - Métricas calculadas de encuestas
 * @param {Array} props.questions - Lista de preguntas de la encuesta
 * @param {String} props.dateFilter - Filtro de fecha actual
 * @param {String} props.planFilter - Filtro de plan actual
 * @param {Function} props.onDateFilterChange - Función para cambiar filtro de fecha
 * @param {Function} props.onPlanFilterChange - Función para cambiar filtro de plan
 * @param {Function} props.getDateFilterText - Función para obtener texto del filtro
 * @param {Function} props.getPlanFilterText - Función para obtener texto del plan
 * @param {Function} props.getNPSLabel - Función para obtener label del NPS
 * @returns {JSX.Element} Vista de análisis de encuestas
 */
const SurveyAnalytics = ({
  metrics,
  questions,
  dateFilter,
  planFilter,
  onDateFilterChange,
  onPlanFilterChange,
  getDateFilterText,
  getPlanFilterText,
  getNPSLabel
}) => {
  const npsLabel = getNPSLabel ? getNPSLabel(metrics?.npsScore || 0) : { label: 'Sin datos', color: 'text-gray-600' }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
          <div>
            <h2 className="text-xl font-exo font-semibold text-gray-800">
              <i className="fas fa-chart-bar text-helpmed-blue mr-2"></i>
              Análisis de Satisfacción
            </h2>
            <p className="text-gray-600 font-roboto mt-1">
              Métricas y tendencias de las encuestas de satisfacción
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <select
              value={dateFilter}
              onChange={(e) => onDateFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="last7days">Últimos 7 días</option>
              <option value="last30days">Últimos 30 días</option>
              <option value="last3months">Últimos 3 meses</option>
              <option value="all">Todo el período</option>
            </select>

            <select
              value={planFilter}
              onChange={(e) => onPlanFilterChange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">Todos los planes</option>
              <option value="familiar">Plan Familiar</option>
              <option value="corporativo">Plan Corporativo</option>
            </select>
          </div>
        </div>

        <div className="text-sm text-gray-600 font-roboto">
          <i className="fas fa-filter mr-1"></i>
          Mostrando: {getDateFilterText()} • {getPlanFilterText()}
        </div>
      </div>

      {/* Métricas Principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 rounded-full p-3 mr-4">
              <i className="fas fa-poll text-2xl text-blue-600"></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Total Respuestas</p>
              <p className="text-2xl font-exo font-bold text-gray-800">{metrics.totalResponses}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <i className="fas fa-star text-2xl text-yellow-600"></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Calificación Promedio</p>
              <p className="text-2xl font-exo font-bold text-gray-800">
                {metrics.averageRating}/5.0
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div
              className={`${npsLabel?.color?.replace('text-', 'bg-')?.replace('-600', '-100') || 'bg-gray-100'} rounded-full p-3 mr-4`}
            >
              <i className={`fas fa-thumbs-up text-2xl ${npsLabel?.color || 'text-gray-600'}`}></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Net Promoter Score</p>
              <p className={`text-2xl font-exo font-bold ${npsLabel?.color || 'text-gray-600'}`}>{metrics?.npsScore || 0}%</p>
              <p className="text-xs text-gray-500 mt-1">{npsLabel?.label || 'Sin datos'}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div
              className={`${
                metrics.satisfactionTrend === 'improving'
                  ? 'bg-green-100'
                  : metrics.satisfactionTrend === 'declining'
                    ? 'bg-red-100'
                    : 'bg-gray-100'
              } rounded-full p-3 mr-4`}
            >
              <i
                className={`fas fa-arrow-${
                  metrics.satisfactionTrend === 'improving'
                    ? 'up'
                    : metrics.satisfactionTrend === 'declining'
                      ? 'down'
                      : 'right'
                } text-2xl ${
                  metrics.satisfactionTrend === 'improving'
                    ? 'text-green-600'
                    : metrics.satisfactionTrend === 'declining'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              ></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Tendencia</p>
              <p
                className={`text-lg font-exo font-bold ${
                  metrics.satisfactionTrend === 'improving'
                    ? 'text-green-600'
                    : metrics.satisfactionTrend === 'declining'
                      ? 'text-red-600'
                      : 'text-gray-600'
                }`}
              >
                {metrics.satisfactionTrend === 'improving'
                  ? 'Mejorando'
                  : metrics.satisfactionTrend === 'declining'
                    ? 'Declinando'
                    : 'Estable'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Análisis por Pregunta */}
      {questions.length > 0 && (
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-question-circle text-helpmed-blue mr-2"></i>
            Calificación Promedio por Pregunta
          </h3>

          <div className="space-y-4">
            {questions
              .filter((q) => q.active)
              .map((question) => {
                const average = metrics.questionAverages[question.id] || 0
                const percentage = (average / 5) * 100

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-start flex-1">
                        <i className={`${question.icon} text-helpmed-blue mr-3 mt-1`}></i>
                        <div className="flex-1">
                          <p className="font-roboto text-gray-800 mb-1">{question.text}</p>
                          <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                            {question.category}
                          </span>
                        </div>
                      </div>

                      <div className="text-right ml-4">
                        <div
                          className={`text-xl font-exo font-bold ${
                            average >= 4.5
                              ? 'text-green-600'
                              : average >= 3.5
                                ? 'text-yellow-600'
                                : average >= 2.5
                                  ? 'text-orange-600'
                                  : 'text-red-600'
                          }`}
                        >
                          {average.toFixed(1)}/5.0
                        </div>
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          average >= 4.5
                            ? 'bg-green-500'
                            : average >= 3.5
                              ? 'bg-yellow-500'
                              : average >= 2.5
                                ? 'bg-orange-500'
                                : 'bg-red-500'
                        }`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Distribución de Calificaciones */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-chart-pie text-helpmed-blue mr-2"></i>
            Distribución de Calificaciones
          </h3>

          <div className="space-y-3">
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = metrics?.distribution?.[rating] || 0
              const percentage =
                metrics?.totalResponses > 0 ? ((count / metrics.totalResponses) * 100).toFixed(1) : 0

              return (
                <div key={rating} className="flex items-center">
                  <div className="flex items-center w-20">
                    <span className="font-roboto text-sm mr-2">{rating}</span>
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <i
                          key={i}
                          className={`fas fa-star text-xs ${
                            i < rating ? 'text-yellow-400' : 'text-gray-300'
                          }`}
                        ></i>
                      ))}
                    </div>
                  </div>

                  <div className="flex-1 mx-3">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className="bg-helpmed-blue h-3 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="w-16 text-right">
                    <span className="font-exo font-semibold text-gray-800">{count}</span>
                    <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-users text-helpmed-blue mr-2"></i>
            Análisis NPS Detallado
          </h3>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-thumbs-up text-green-600 mr-2"></i>
                <span className="font-roboto text-green-800">Promotores (4-5)</span>
              </div>
              <div className="text-right">
                <div className="font-exo font-bold text-green-800">{metrics.promoters}</div>
                <div className="text-xs text-green-600">
                  {metrics.totalResponses > 0
                    ? ((metrics.promoters / metrics.totalResponses) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-minus text-yellow-600 mr-2"></i>
                <span className="font-roboto text-yellow-800">Pasivos (3)</span>
              </div>
              <div className="text-right">
                <div className="font-exo font-bold text-yellow-800">{metrics.passives}</div>
                <div className="text-xs text-yellow-600">
                  {metrics.totalResponses > 0
                    ? ((metrics.passives / metrics.totalResponses) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center">
                <i className="fas fa-thumbs-down text-red-600 mr-2"></i>
                <span className="font-roboto text-red-800">Detractores (1-2)</span>
              </div>
              <div className="text-right">
                <div className="font-exo font-bold text-red-800">{metrics.detractors}</div>
                <div className="text-xs text-red-600">
                  {metrics.totalResponses > 0
                    ? ((metrics.detractors / metrics.totalResponses) * 100).toFixed(1)
                    : 0}
                  %
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <div className="text-center">
                <div className={`text-2xl font-exo font-bold ${npsLabel.color}`}>
                  NPS: {metrics.npsScore}%
                </div>
                <div className={`text-sm font-roboto ${npsLabel.color}`}>{npsLabel.label}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sin datos */}
      {metrics.totalResponses === 0 && (
        <div className="bg-white rounded-xl shadow-medium p-12 text-center">
          <i className="fas fa-chart-bar text-6xl text-gray-300 mb-4"></i>
          <h3 className="text-xl font-exo font-semibold text-gray-700 mb-2">
            Sin respuestas de encuestas
          </h3>
          <p className="text-gray-500 font-roboto">
            No se encontraron respuestas de encuestas con los filtros seleccionados. Ajusta los
            filtros o espera a que se generen más respuestas.
          </p>
        </div>
      )}
    </div>
  )
}

export default SurveyAnalytics
