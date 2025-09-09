import React from 'react'
import useAppStore from '../../stores/useAppStore'
import { SurveyConfiguration, SurveyAnalytics, SurveyResponsesList } from './survey'
import ErrorMessage from '../shared/ErrorMessage'
import useSurveyManagementComplete from '../../hooks/useSurveyManagementComplete'
import { LABELS } from '../../config/labels'

/**
 * Componente principal para gestión de encuestas de satisfacción - VERSIÓN CORREGIDA
 */
const SurveyManagementFixed = () => {
  const labels = LABELS.admin.surveyManagement
  
  // Obtener usuario actual del store
  const { currentUser } = useAppStore()
  
  // Hook que maneja toda la lógica compleja
  const surveyData = useSurveyManagementComplete(currentUser)
  
  // Validación de que el hook retorne datos
  if (!surveyData) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={labels.errors.loadModule} />
      </div>
    )
  }
  
  const {
    activeTab,
    editMode,
    questions,
    dateFilter,
    planFilter,
    loading,
    error,
    filteredResponses,
    surveyMetrics,
    handleTabChange,
    handleDateFilterChange,
    handlePlanFilterChange,
    handleQuestionEdit,
    handleAddQuestion,
    handleRemoveQuestion,
    handleSaveQuestions,
    enableEditMode,
    cancelEditMode,
    handleExportReport,
    getDateFilterText,
    getPlanFilterText,
    getNPSLabel,
    clearError,
    hasResponses,
    hasQuestions,
    canSave
  } = surveyData

  // Manejo de errores
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={labels.errors.loadModule.replace('{error}', error)} onRetry={clearError} />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header Principal */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-exo font-bold text-gray-900">
              <i className="fas fa-poll text-helpmed-blue mr-3"></i>
              Gestión de Encuestas de Satisfacción
            </h1>
            <p className="text-gray-600 font-roboto mt-2">
              Configura y analiza las encuestas de satisfacción del servicio
            </p>
          </div>

          <div className="mt-4 md:mt-0">
            <button
              onClick={() => handleExportReport('pdf')}
              className="px-4 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto"
              disabled={!hasResponses}
            >
              <i className="fas fa-download mr-2"></i>
{labels.export.reportButton}
            </button>
          </div>
        </div>
      </div>

      {/* Navegación de Tabs */}
      <div className="bg-white rounded-xl shadow-medium">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => handleTabChange && handleTabChange('configure')}
              className={`px-6 py-4 text-sm font-roboto font-medium transition-colors ${
                activeTab === 'configure'
                  ? 'text-helpmed-blue border-b-2 border-helpmed-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className="fas fa-cog mr-2"></i>
              Configuración
            </button>

            <button
              onClick={() => handleTabChange && handleTabChange('analytics')}
              className={`px-6 py-4 text-sm font-roboto font-medium transition-colors ${
                activeTab === 'analytics'
                  ? 'text-helpmed-blue border-b-2 border-helpmed-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={!hasQuestions}
            >
              <i className="fas fa-chart-bar mr-2"></i>
              Análisis
            </button>

            <button
              onClick={() => handleTabChange && handleTabChange('responses')}
              className={`px-6 py-4 text-sm font-roboto font-medium transition-colors ${
                activeTab === 'responses'
                  ? 'text-helpmed-blue border-b-2 border-helpmed-blue'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              disabled={!hasResponses}
            >
              <i className="fas fa-list mr-2"></i>
              Respuestas ({filteredResponses?.length || 0})
            </button>
          </nav>
        </div>
      </div>

      {/* Contenido Principal */}
      {!hasQuestions && activeTab !== 'configure' ? (
        <div className="bg-white rounded-xl shadow-medium p-12 text-center">
          <i className="fas fa-cog text-6xl text-gray-300 mb-6"></i>
          <h3 className="text-2xl font-exo font-semibold text-gray-700 mb-4">
            Configura tu Primera Encuesta
          </h3>
          <p className="text-gray-600 font-roboto mb-8 max-w-md mx-auto">
            Antes de poder analizar respuestas, necesitas configurar las preguntas de la encuesta.
          </p>
          <button
            onClick={() => handleTabChange && handleTabChange('configure')}
            className="flex items-center mx-auto px-6 py-3 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto"
          >
            <i className="fas fa-cog mr-2"></i>
            Configurar Encuesta
          </button>
        </div>
      ) : (
        <div className="min-h-[600px]">
          {activeTab === 'configure' && (
            <SurveyConfiguration
              questions={questions}
              editMode={editMode}
              onQuestionEdit={handleQuestionEdit}
              onAddQuestion={handleAddQuestion}
              onRemoveQuestion={handleRemoveQuestion}
              onSave={handleSaveQuestions}
              onEnableEdit={enableEditMode}
              onCancelEdit={cancelEditMode}
              loading={loading}
              canSave={canSave}
            />
          )}

          {activeTab === 'analytics' && (
            <SurveyAnalytics
              metrics={surveyMetrics}
              questions={questions}
              dateFilter={dateFilter}
              planFilter={planFilter}
              onDateFilterChange={handleDateFilterChange}
              onPlanFilterChange={handlePlanFilterChange}
              getDateFilterText={getDateFilterText}
              getPlanFilterText={getPlanFilterText}
              getNPSLabel={getNPSLabel}
            />
          )}

          {activeTab === 'responses' && (
            <SurveyResponsesList
              responses={filteredResponses}
              questions={questions}
              dateFilter={dateFilter}
              planFilter={planFilter}
              onDateFilterChange={handleDateFilterChange}
              onPlanFilterChange={handlePlanFilterChange}
              getDateFilterText={getDateFilterText}
              getPlanFilterText={getPlanFilterText}
              loading={loading}
            />
          )}
        </div>
      )}
    </div>
  )
}

export default SurveyManagementFixed