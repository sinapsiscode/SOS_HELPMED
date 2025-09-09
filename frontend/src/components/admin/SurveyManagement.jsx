import React, { useState } from 'react'
import { LABELS } from '../../config/labels'
import Swal from 'sweetalert2'
import useSurveyData from '../../hooks/useSurveyData'
import useAppStore from '../../stores/useAppStore'

const SurveyManagement = () => {
  const labels = LABELS.admin.surveyManagement
  const [activeTab, setActiveTab] = useState('configurar')
  const [editableQuestions, setEditableQuestions] = useState(null)
  
  // Obtener datos del hook personalizado
  const {
    questions,
    metrics,
    questionAverages,
    ratingsDistribution,
    recentResponses,
    planFilter,
    setPlanFilter,
    dateRange,
    setDateRange
  } = useSurveyData()
  
  // Estado local para preview
  const [previewRatings, setPreviewRatings] = useState({})
  
  // Usar las preguntas editables si están en modo edición, sino las del hook
  const displayQuestions = editableQuestions || questions

  const getCategoryColor = (category) => {
    const colors = {
      'calidad': 'bg-blue-100 text-blue-800',
      'personal': 'bg-green-100 text-green-800',
      'comunicación': 'bg-purple-100 text-purple-800',
      'recomendación': 'bg-orange-100 text-orange-800',
      'tiempo': 'bg-yellow-100 text-yellow-800'
    }
    return colors[category] || 'bg-gray-100 text-gray-800'
  }

  const handleEditQuestions = () => {
    Swal.fire({
      title: labels.editModal.title,
      html: `
        <div class="text-left space-y-4 max-h-96 overflow-y-auto">
          ${displayQuestions.map((q, index) => `
            <div class="border rounded-lg p-4">
              <div class="mb-3">
                <label class="block text-sm font-medium text-gray-700 mb-1">Pregunta ${index + 1}</label>
                <textarea 
                  id="question-${q.id}" 
                  class="w-full px-3 py-2 border rounded-lg text-sm" 
                  rows="2"
                >${q.text}</textarea>
              </div>
              <div class="flex items-center justify-between">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Categoría</label>
                  <select id="category-${q.id}" class="px-3 py-1.5 border rounded-lg text-sm">
                    <option value="calidad" ${q.category === 'calidad' ? 'selected' : ''}>Calidad</option>
                    <option value="personal" ${q.category === 'personal' ? 'selected' : ''}>Personal</option>
                    <option value="comunicación" ${q.category === 'comunicación' ? 'selected' : ''}>Comunicación</option>
                    <option value="recomendación" ${q.category === 'recomendación' ? 'selected' : ''}>Recomendación</option>
                    <option value="tiempo" ${q.category === 'tiempo' ? 'selected' : ''}>Tiempo</option>
                  </select>
                </div>
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="active-${q.id}" ${q.active ? 'checked' : ''}>
                  <label for="active-${q.id}" class="text-sm text-gray-700">Activa</label>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `,
      width: '600px',
      showCancelButton: true,
      confirmButtonText: labels.editModal.saveChanges,
      cancelButtonText: labels.editModal.cancel,
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const updatedQuestions = displayQuestions.map(q => ({
          ...q,
          text: document.getElementById(`question-${q.id}`).value,
          category: document.getElementById(`category-${q.id}`).value,
          active: document.getElementById(`active-${q.id}`).checked
        }))
        return updatedQuestions
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setEditableQuestions(result.value)
        // En producción, aquí se guardarían en el backend
        Swal.fire({
          icon: 'success',
          title: labels.editModal.success.title,
          text: labels.editModal.success.message,
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const handleRatingClick = (questionId, rating) => {
    setPreviewRatings(prev => ({
      ...prev,
      [questionId]: rating
    }))
  }

  const handleSubmitSurvey = () => {
    const allRated = displayQuestions.every(q => previewRatings[q.id] > 0)
    
    if (!allRated) {
      Swal.fire({
        icon: 'warning',
        title: labels.survey.incomplete.title,
        text: labels.survey.incomplete.message
      })
      return
    }

    Swal.fire({
      icon: 'success',
      title: labels.survey.submitted.title,
      text: labels.survey.submitted.message,
      confirmButtonColor: '#3b82f6'
    }).then(() => {
      setPreviewRatings({})
    })
  }

  const handleSystemEvaluate = () => {
    const simulatedRatings = {}
    displayQuestions.forEach(q => {
      simulatedRatings[q.id] = Math.floor(Math.random() * 2) + 4 // Random entre 4 y 5
    })
    setPreviewRatings(simulatedRatings)
    
    Swal.fire({
      icon: 'info',
      title: labels.survey.systemEvaluation.title,
      text: labels.survey.systemEvaluation.message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleExport = () => {
    // En producción, aquí se generaría y descargaría el archivo Excel
    Swal.fire({
      icon: 'success',
      title: labels.export.title,
      text: labels.export.message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  // Componentes modulares
  const MetricCard = ({ icon, iconColor, bgColor, value, label, trend, trendColor }) => (
    <div className={`${bgColor} rounded-lg p-4 border border-${bgColor.replace('bg-', '')}-100`}>
      <div className="flex items-center gap-2 mb-2">
        <div className={`w-8 h-8 ${bgColor.replace('50', '100')} rounded flex items-center justify-center`}>
          <i className={`fas ${icon} ${iconColor}`}></i>
        </div>
        {trend && (
          <span className={`text-xs ${trendColor} font-medium`}>{trend}</span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900">{value}</p>
      <p className="text-xs text-gray-600">{label}</p>
    </div>
  )

  const QuestionItem = ({ question, index, showRating = false, average = 0 }) => (
    <div className="flex items-center justify-between">
      <p className="text-sm text-gray-700 flex-1 mr-4">
        P{index + 1}: {question.text.substring(0, 40)}...
      </p>
      {showRating && (
        <div className="flex items-center gap-2">
          <div className="flex gap-0.5">
            {[1, 2, 3, 4, 5].map((star) => (
              <i
                key={star}
                className={`fas fa-star text-xs ${
                  star <= Math.round(average) ? 'text-yellow-400' : 'text-gray-300'
                }`}
              ></i>
            ))}
          </div>
          <span className="text-sm font-semibold text-gray-900 w-8">{average}</span>
        </div>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 mb-1">
              {labels.header.title}
            </h2>
            <p className="text-sm text-gray-600">
              {labels.header.subtitle}
            </p>
          </div>
          <button
            onClick={handleSystemEvaluate}
            className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <i className="fas fa-info-circle"></i>
            {labels.header.systemEvaluation}
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b">
          <button
            onClick={() => setActiveTab('configurar')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'configurar'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-cog"></i>
            {labels.tabs.configure}
          </button>
          <button
            onClick={() => setActiveTab('resultados')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'resultados'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-chart-bar"></i>
            {labels.tabs.results}
          </button>
        </div>
      </div>

      {activeTab === 'configurar' && (
        <>
          {/* Configurar Preguntas de Encuesta */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Configurar Preguntas de Encuesta
              </h3>
              <button
                onClick={handleEditQuestions}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
              >
                <i className="fas fa-edit"></i>
{labels.configure}
              </button>
            </div>
            
            <p className="text-sm text-gray-600 mb-6">
              Personaliza las 5 preguntas de satisfacción del cliente
            </p>

            <div className="space-y-3">
              {displayQuestions.map((question, index) => (
                <div key={question.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-semibold text-blue-600">{index + 1}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-800 mb-2">
                      <i className={`fas fa-star text-yellow-400 mr-2`}></i>
                      {question.text}
                    </p>
                    <div className="flex items-center gap-3">
                      <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getCategoryColor(question.category)}`}>
                        {question.category}
                      </span>
                      {question.active && (
                        <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-green-100 text-green-800">
                          Activa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Vista Previa de la Encuesta */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Vista Previa de la Encuesta
            </h3>

            <div className="max-w-2xl mx-auto">
              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-center mb-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className="fas fa-clipboard-check text-blue-600 text-2xl"></i>
                  </div>
                </div>
                <h4 className="text-xl font-bold text-center text-gray-800 mb-2">
                  Encuesta de Satisfacción
                </h4>
                <p className="text-sm text-center text-gray-600">
                  Así verán los usuarios la encuesta
                </p>
              </div>

              <div className="space-y-6">
                {displayQuestions.filter(q => q.active).map((question, index) => (
                  <div key={question.id} className="border-b border-gray-100 pb-6 last:border-0">
                    <p className="text-gray-800 mb-3">
                      <span className="font-semibold text-gray-900">{index + 1}.</span> {question.text}
                    </p>
                    <div className="flex items-center gap-2">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => handleRatingClick(question.id, star)}
                          className="group relative"
                        >
                          <i
                            className={`fas fa-star text-2xl transition-all ${
                              star <= (previewRatings[question.id] || 0)
                                ? 'text-yellow-400' 
                                : 'text-gray-300 group-hover:text-yellow-200'
                            }`}
                          ></i>
                        </button>
                      ))}
                      {previewRatings[question.id] > 0 && (
                        <span className="ml-3 text-sm text-gray-600">
                          {previewRatings[question.id] === 1 && 'Muy insatisfecho'}
                          {previewRatings[question.id] === 2 && 'Insatisfecho'}
                          {previewRatings[question.id] === 3 && 'Neutral'}
                          {previewRatings[question.id] === 4 && 'Satisfecho'}
                          {previewRatings[question.id] === 5 && 'Muy satisfecho'}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 flex justify-center">
                <button
                  onClick={handleSubmitSurvey}
                  className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-paper-plane"></i>
                  Enviar Encuesta (Simulación)
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {activeTab === 'resultados' && (
        <>
          {/* Sección de Resultados de Encuestas */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Resultados de Encuestas
              </h3>
              <div className="flex items-center gap-3">
                {/* Selector de fecha inicial */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Desde:</label>
                  <input
                    type="date"
                    value={dateRange.startDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      startDate: e.target.value
                    }))}
                    max={dateRange.endDate || new Date().toISOString().split('T')[0]}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Selector de fecha final */}
                <div className="flex items-center gap-2">
                  <label className="text-sm text-gray-600">Hasta:</label>
                  <input
                    type="date"
                    value={dateRange.endDate}
                    onChange={(e) => setDateRange(prev => ({
                      ...prev,
                      endDate: e.target.value
                    }))}
                    min={dateRange.startDate}
                    max={new Date().toISOString().split('T')[0]}
                    className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                
                {/* Selector de plan */}
                <select 
                  value={planFilter}
                  onChange={(e) => setPlanFilter(e.target.value)}
                  className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="all">Todos los planes</option>
                  <option value="familiar">Plan Familiar</option>
                  <option value="corporativo">Plan Corporativo</option>
                  <option value="particular">Plan Particular</option>
                </select>
                
                {/* Botón exportar */}
                <button 
                  onClick={handleExport}
                  className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors flex items-center gap-2"
                >
                  <i className="fas fa-file-excel"></i>
                  {labels.export.reportButton}
                </button>
              </div>
            </div>

            {/* Métricas principales */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
              <MetricCard 
                icon="fa-chart-bar"
                iconColor="text-blue-600"
                bgColor="bg-blue-50"
                value={metrics.totalResponses}
                label={labels.metrics.totalResponses}
                trend={metrics.totalResponses > 0 ? "+12%" : null}
                trendColor="text-blue-600"
              />
              <MetricCard 
                icon="fa-star"
                iconColor="text-yellow-600"
                bgColor="bg-yellow-50"
                value={`${metrics.averageRating}/5`}
                label={labels.metrics.averageRating}
                trend={metrics.averageRating > 0 ? "+0.3" : null}
                trendColor="text-green-600"
              />
              <MetricCard 
                icon="fa-heart"
                iconColor="text-green-600"
                bgColor="bg-green-50"
                value={metrics.npsScore}
                label={labels.metrics.npsScore}
                trend={metrics.npsScore > 0 ? "+5" : null}
                trendColor="text-green-600"
              />
              <MetricCard 
                icon="fa-calendar-day"
                iconColor="text-purple-600"
                bgColor="bg-purple-50"
                value={metrics.todayResponses}
                label={labels.metrics.todayResponses}
                trend={metrics.todayResponses > 0 ? "+2" : null}
                trendColor="text-purple-600"
              />
              <MetricCard 
                icon="fa-percentage"
                iconColor="text-indigo-600"
                bgColor="bg-indigo-50"
                value={`${metrics.responseRate}%`}
                label={labels.metrics.responseRate}
                trend={metrics.responseRate > 0 ? "+2%" : null}
                trendColor="text-indigo-600"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Promedio por Pregunta */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Promedio por Pregunta</h4>
                <div className="space-y-3">
                  {questionAverages.slice(0, 5).map((question, index) => (
                    <QuestionItem 
                      key={question.id}
                      question={question}
                      index={index}
                      showRating={true}
                      average={question.average}
                    />
                  ))}
                </div>
              </div>

              {/* Distribución de Calificaciones */}
              <div>
                <h4 className="font-medium text-gray-800 mb-4">Distribución de Calificaciones</h4>
                <div className="space-y-3">
                  {ratingsDistribution.map(({ rating, percentage }) => (
                    <div key={rating} className="flex items-center gap-3">
                      <div className="flex gap-0.5 w-16">
                        {[...Array(rating)].map((_, i) => (
                          <i key={i} className="fas fa-star text-yellow-400 text-xs"></i>
                        ))}
                      </div>
                      <div className="flex-1 bg-gray-200 rounded h-6">
                        <div 
                          className={`h-6 rounded ${
                            rating === 5 ? 'bg-green-500' : 
                            rating === 4 ? 'bg-blue-500' : 
                            rating === 3 ? 'bg-yellow-500' : 
                            rating === 2 ? 'bg-orange-500' : 
                            'bg-red-500'
                          }`}
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 w-8 text-right">{percentage}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sección de Respuestas Recientes */}
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">
              Respuestas Recientes
            </h3>

            {/* Tabla de respuestas */}
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">FECHA</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">PACIENTE</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">SERVICIO</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">PLAN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">CALIFICACIÓN</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">COMENTARIOS</th>
                    <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">ACCIONES</th>
                  </tr>
                </thead>
                <tbody>
                  {recentResponses.length > 0 ? (
                    recentResponses.map((response, index) => (
                      <tr key={response.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {new Date(response.date).toLocaleDateString('es-PE')}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-800">
                          {response.patientName || 'Anónimo'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {response.service || 'Emergencia'}
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {response.plan || 'Familiar'}
                        </td>
                        <td className="py-3 px-4 text-sm">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`fas fa-star text-xs ${
                                  i < Math.round(response.averageRating) 
                                    ? 'text-yellow-400' 
                                    : 'text-gray-300'
                                }`}
                              ></i>
                            ))}
                            <span className="ml-2 text-gray-700">{response.averageRating}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600 max-w-xs truncate">
                          {response.comments || '-'}
                        </td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-blue-600 hover:text-blue-800 text-sm">
                            <i className="fas fa-eye"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-12">
                        <div className="flex flex-col items-center">
                          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                            <i className="fas fa-inbox text-gray-400 text-2xl"></i>
                          </div>
                          <p className="text-gray-500 text-sm">No hay respuestas de encuestas para mostrar</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default SurveyManagement