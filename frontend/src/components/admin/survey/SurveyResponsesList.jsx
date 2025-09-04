import React from 'react'

/**
 * Componente para lista detallada de respuestas de encuestas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación, datos del hook
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.responses - Lista de respuestas filtradas
 * @param {Array} props.questions - Lista de preguntas de la encuesta
 * @param {Boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Vista de lista de respuestas
 */
const SurveyResponsesList = ({ responses, questions, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-8 text-center">
        <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
        <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">Cargando...</h3>
        <p className="text-gray-600 font-roboto">Obteniendo respuestas de encuestas</p>
      </div>
    )
  }

  if (!responses || !Array.isArray(responses) || responses.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-12 text-center">
        <i className="fas fa-comments text-6xl text-gray-300 mb-4"></i>
        <h3 className="text-xl font-exo font-semibold text-gray-700 mb-2">
          Sin respuestas disponibles
        </h3>
        <p className="text-gray-500 font-roboto">
          No se encontraron respuestas de encuestas con los filtros seleccionados.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-xl font-exo font-semibold text-gray-800 mb-2">
          <i className="fas fa-list text-helpmed-blue mr-2"></i>
          Respuestas Detalladas ({responses.length})
        </h2>
        <p className="text-gray-600 font-roboto">
          Listado completo de todas las respuestas de encuestas de satisfacción
        </p>
      </div>

      {/* Lista de Respuestas */}
      <div className="space-y-4">
        {responses.map((response, index) => (
          <div
            key={response.serviceId || index}
            className="bg-white rounded-xl shadow-medium overflow-hidden"
          >
            {/* Header de la respuesta */}
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
              <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                <div className="flex items-center mb-2 md:mb-0">
                  <div className="bg-helpmed-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-exo font-bold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <h3 className="font-exo font-semibold text-gray-800">{response.patientName}</h3>
                    <p className="text-sm text-gray-600 font-roboto">
                      {response.serviceType} • ID: {response.serviceId}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center">
                    <i className="fas fa-calendar mr-1 text-gray-500"></i>
                    <span className="text-gray-600 font-roboto">
                      {new Date(response.timestamp).toLocaleDateString('es-PE')}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-user-tag mr-1 text-gray-500"></i>
                    <span className="text-gray-600 font-roboto capitalize">
                      {response.userType}
                    </span>
                  </div>

                  <div className="flex items-center">
                    <i className="fas fa-star mr-1 text-yellow-500"></i>
                    <span
                      className={`font-exo font-bold ${
                        response.average >= 4.5
                          ? 'text-green-600'
                          : response.average >= 3.5
                            ? 'text-yellow-600'
                            : response.average >= 2.5
                              ? 'text-orange-600'
                              : 'text-red-600'
                      }`}
                    >
                      {response.average}/5.0
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Calificaciones por pregunta */}
            <div className="p-6">
              <h4 className="text-lg font-exo font-semibold text-gray-800 mb-4">
                Calificaciones por Pregunta
              </h4>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {questions && response.ratings && questions
                  .filter((q) => response.ratings && response.ratings[q.id] !== undefined)
                  .map((question) => {
                    const rating = response.ratings[question.id]

                    return (
                      <div key={question.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-start flex-1">
                            <i
                              className={`${question.icon} text-helpmed-blue mr-2 mt-1 text-sm`}
                            ></i>
                            <div className="flex-1">
                              <p className="text-sm font-roboto text-gray-800 mb-1">
                                {question.text}
                              </p>
                              <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                                {question.category}
                              </span>
                            </div>
                          </div>

                          <div className="ml-3 text-right">
                            <div
                              className={`text-lg font-exo font-bold ${
                                rating >= 5
                                  ? 'text-green-600'
                                  : rating >= 4
                                    ? 'text-yellow-600'
                                    : rating >= 3
                                      ? 'text-orange-600'
                                      : 'text-red-600'
                              }`}
                            >
                              {rating}/5
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <i
                              key={i}
                              className={`fas fa-star text-sm mr-1 ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            ></i>
                          ))}
                        </div>
                      </div>
                    )
                  })}
              </div>

              {/* Comentarios */}
              {response.comments && response.comments.trim().length > 0 && (
                <div className="border-t pt-4">
                  <h5 className="font-exo font-semibold text-gray-800 mb-2">
                    <i className="fas fa-quote-left text-helpmed-blue mr-2"></i>
                    Comentarios del Usuario
                  </h5>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <p className="text-gray-800 font-roboto italic">"{response.comments}"</p>
                  </div>
                </div>
              )}

              {/* Clasificación NPS */}
              {response.ratings && response.ratings.question5 !== undefined && (
                <div className="border-t pt-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-roboto text-gray-600">Clasificación NPS:</span>
                    <div className="flex items-center">
                      {response.ratings.question5 >= 4 ? (
                        <>
                          <i className="fas fa-thumbs-up text-green-600 mr-1"></i>
                          <span className="text-green-600 font-exo font-semibold">Promotor</span>
                        </>
                      ) : response.ratings.question5 === 3 ? (
                        <>
                          <i className="fas fa-minus text-yellow-600 mr-1"></i>
                          <span className="text-yellow-600 font-exo font-semibold">Pasivo</span>
                        </>
                      ) : (
                        <>
                          <i className="fas fa-thumbs-down text-red-600 mr-1"></i>
                          <span className="text-red-600 font-exo font-semibold">Detractor</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SurveyResponsesList
