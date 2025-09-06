import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.survey.surveyConfiguration.comments.title}
 * ${LABELS.admin.survey.surveyConfiguration.comments.rule3}
 * ${LABELS.admin.survey.surveyConfiguration.comments.rule2}
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.questions - Lista de preguntas actuales
 * @param {Boolean} props.editMode - Si está en modo edición
 * @param {Function} props.onQuestionEdit - Función para editar pregunta
 * @param {Function} props.onAddQuestion - Función para agregar pregunta
 * @param {Function} props.onRemoveQuestion - Función para remover pregunta
 * @param {Function} props.onSave - Función para guardar cambios
 * @param {Function} props.onEnableEdit - Función para habilitar edición
 * @param {Function} props.onCancelEdit - Función para cancelar edición
 * @param {Boolean} props.loading - Estado de carga
 * @param {Boolean} props.canSave - Si se puede guardar
 * @returns {JSX.Element} Vista de configuración de encuestas
 */
const SurveyConfiguration = ({
  questions,
  editMode,
  onQuestionEdit,
  onAddQuestion,
  onRemoveQuestion,
  onSave,
  onEnableEdit,
  onCancelEdit,
  loading,
  canSave
}) => {
  const labels = LABELS.admin.survey.surveyConfiguration
  
  const categoryOptions = [
    { value: 'tiempo', label: labels.categories.tiempo, icon: labels.icons.clock },
    { value: 'personal', label: labels.categories.personal, icon: labels.icons.userMd },
    { value: 'calidad', label: labels.categories.calidad, icon: labels.icons.heart },
    { value: 'comunicacion', label: labels.categories.comunicacion, icon: labels.icons.comments },
    { value: 'recomendacion', label: labels.categories.recomendacion, icon: labels.icons.star },
    { value: 'general', label: labels.categories.general, icon: labels.icons.question }
  ]

  const iconOptions = [
    labels.icons.clock,
    labels.icons.userMd,
    labels.icons.heart,
    labels.icons.comments,
    labels.icons.star,
    labels.icons.question,
    labels.icons.thumbsUp,
    labels.icons.medicalKit,
    labels.icons.stethoscope,
    labels.icons.ambulance
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-xl font-exo font-semibold text-gray-800">
              <i className="fas fa-cog text-helpmed-blue mr-2"></i>
              {labels.header.title}
            </h2>
            <p className="text-gray-600 font-roboto mt-1">
              {labels.header.subtitle}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {!editMode ? (
              <button
                onClick={onEnableEdit}
                disabled={loading}
                className="flex items-center px-4 py-2 bg-helpmed-blue text-white rounded-lg hover:bg-blue-700 transition-colors font-roboto disabled:opacity-50"
              >
                <i className="fas fa-edit mr-2"></i>
                {labels.header.editButton}
              </button>
            ) : (
              <>
                <button
                  onClick={onCancelEdit}
                  disabled={loading}
                  className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 font-roboto transition-colors disabled:opacity-50"
                >
                  {labels.header.cancelButton}
                </button>
                <button
                  onClick={onSave}
                  disabled={loading || !canSave}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-roboto disabled:opacity-50"
                >
                  {loading && <i className="fas fa-spinner fa-spin mr-2"></i>}
                  {labels.header.saveButton}
                </button>
              </>
            )}
          </div>
        </div>

        {editMode && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-info-circle text-blue-600 mr-2"></i>
              <div className="text-sm text-blue-800 font-roboto">
                <strong>{labels.editMode.title}</strong> {labels.editMode.message}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Lista de Preguntas */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-exo font-semibold text-gray-800">
              {labels.questionsList.title.replace('{count}', questions.length)}
            </h3>

            {editMode && (
              <button
                onClick={onAddQuestion}
                disabled={loading || questions.length >= 10}
                className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-roboto text-sm disabled:opacity-50"
              >
                <i className="fas fa-plus mr-1"></i>
                {labels.questionsList.addButton}
              </button>
            )}
          </div>
        </div>

        <div className="divide-y divide-gray-200">
          {questions.map((question, index) => (
            <div key={question.id} className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-4">
                  <div className="flex items-center mb-3">
                    <div className="bg-helpmed-blue text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-exo font-bold mr-3">
                      {index + 1}
                    </div>

                    {editMode ? (
                      <div className="flex items-center space-x-2 flex-1">
                        <select
                          value={question.icon}
                          onChange={(e) => onQuestionEdit(index, 'icon', e.target.value)}
                          className="border border-gray-300 rounded px-2 py-1 text-sm"
                        >
                          {iconOptions.map((icon) => (
                            <option key={icon} value={icon}>
                              {icon.replace('fas fa-', '')}
                            </option>
                          ))}
                        </select>
                        <i className={`${question.icon} text-gray-600`}></i>
                      </div>
                    ) : (
                      <i className={`${question.icon} text-helpmed-blue mr-2`}></i>
                    )}
                  </div>

                  <div className="ml-11">
                    {editMode ? (
                      <div className="space-y-3">
                        <div>
                          <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                            {labels.questionsList.questionLabel}
                          </label>
                          <textarea
                            value={question.text}
                            onChange={(e) => onQuestionEdit(index, 'text', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue resize-none"
                            rows={2}
                            maxLength={200}
                            placeholder={labels.questionsList.placeholder}
                          />
                          <div className="text-xs text-gray-500 mt-1">
                            {labels.questionsList.characterCount.replace('{length}', question.text.length)}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-roboto font-medium text-gray-700 mb-1">
                            {labels.questionsList.categoryLabel}
                          </label>
                          <select
                            value={question.category}
                            onChange={(e) => onQuestionEdit(index, 'category', e.target.value)}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 font-roboto focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue"
                          >
                            {categoryOptions.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="flex items-center">
                          <input
                            type="checkbox"
                            id={`active-${question.id}`}
                            checked={question.active}
                            onChange={(e) => onQuestionEdit(index, 'active', e.target.checked)}
                            className="mr-2"
                          />
                          <label
                            htmlFor={`active-${question.id}`}
                            className="text-sm font-roboto text-gray-700"
                          >
                            {labels.questionsList.activeCheckbox}
                          </label>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p className="text-gray-800 font-roboto mb-2">{question.text}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span className="flex items-center">
                            <i className="fas fa-tag mr-1"></i>
                            {categoryOptions.find((cat) => cat.value === question.category)
                              ?.label || question.category}
                          </span>
                          <span className="flex items-center">
                            <i
                              className={`fas fa-${question.active ? 'eye' : 'eye-slash'} mr-1`}
                            ></i>
                            {question.active ? labels.questionsList.activeStatus : labels.questionsList.inactiveStatus}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="flex items-center space-x-2">
                    {questions.length > 1 && (
                      <button
                        onClick={() => onRemoveQuestion(index)}
                        disabled={loading}
                        className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded transition-colors"
                        title={labels.questionsList.deleteTooltip}
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {questions.length === 0 && (
          <div className="p-12 text-center">
            <i className="fas fa-question-circle text-6xl text-gray-300 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-700 mb-2">{labels.emptyState.title}</h3>
            <p className="text-gray-500 font-roboto">
              {labels.emptyState.message}
            </p>
          </div>
        )}
      </div>

      {/* Información Adicional */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h4 className="text-lg font-exo font-semibold text-gray-800 mb-3">
          <i className="fas fa-lightbulb text-yellow-500 mr-2"></i>
          {labels.tips.title}
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm font-roboto text-gray-600">
          <div className="space-y-2">
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.clear}</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.specific}</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.short}</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.grouped}</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.nps}</span>
            </div>
            <div className="flex items-start">
              <i className="fas fa-check text-green-500 mr-2 mt-1"></i>
              <span>{labels.tips.items.limit}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyConfiguration
