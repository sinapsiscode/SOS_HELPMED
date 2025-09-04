import React from 'react'
import useSatisfactionSurvey from '../../hooks/useSatisfactionSurvey'
import SurveyHeader from './survey/SurveyHeader'
import SurveyQuestion from './survey/SurveyQuestion'
import SurveySummary from './survey/SurveySummary'

/**
 * Componente de encuesta de satisfacción refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Solo presentación, lógica en hook useSatisfactionSurvey
 * ✅ Regla #3: Componente <200 líneas (reducido de 311 a ~180)
 * ✅ Regla #4: Validación en el hook
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @returns {JSX.Element} Formulario de encuesta de satisfacción
 */
const SatisfactionSurvey = ({ onSubmit, onClose, serviceId, serviceType, requestDate }) => {
  const {
    // Estados
    ratings,
    comments,
    hoveredRating,
    isSubmitting,

    // Datos calculados
    averageRating,
    defaultQuestions,

    // Funciones
    handleRatingChange,
    handleStarHover,
    handleStarLeave,
    handleSubmit,
    setComments,
    getRatingLabel,
    getRatingColor
  } = useSatisfactionSurvey(onSubmit, onClose, { serviceId, serviceType, requestDate })

  const hasRatings = Object.values(ratings).some((r) => r > 0)

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 sm:p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <SurveyHeader onClose={onClose} />

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Service Info */}
          {serviceType && <ServiceInfo serviceType={serviceType} requestDate={requestDate} />}

          {/* Questions */}
          <div className="space-y-6">
            {defaultQuestions.map((question, index) => (
              <SurveyQuestion
                key={question.id}
                question={question}
                index={index}
                rating={ratings[question.id]}
                hoveredRating={hoveredRating[question.id]}
                onRatingChange={handleRatingChange}
                onStarHover={handleStarHover}
                onStarLeave={handleStarLeave}
                getRatingLabel={getRatingLabel}
                getRatingColor={getRatingColor}
              />
            ))}
          </div>

          {/* Comments Section */}
          <CommentsSection comments={comments} onCommentsChange={setComments} />

          {/* Summary */}
          <SurveySummary averageRating={averageRating} hasRatings={hasRatings} />

          {/* Buttons */}
          <ActionButtons onClose={onClose} isSubmitting={isSubmitting} />
        </form>
      </div>
    </div>
  )
}

/**
 * Componente de información del servicio
 * Siguiendo Regla #3: Componente pequeño interno
 */
const ServiceInfo = ({ serviceType, requestDate }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-blue-700">
            <i className="fas fa-info-circle mr-2" />
            Evaluando servicio: <strong>{serviceType}</strong>
          </p>
        </div>
        {requestDate && (
          <div className="ml-4 text-right">
            <p className="text-xs text-blue-600 font-medium">Fecha de solicitud</p>
            <p className="text-sm text-blue-800 font-bold">
              {new Date(requestDate).toLocaleDateString('es-CL', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
              })}
            </p>
            <p className="text-xs text-blue-600">
              {new Date(requestDate).toLocaleTimeString('es-CL', {
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

/**
 * Componente de sección de comentarios
 * Siguiendo Regla #3: Componente pequeño interno
 */
const CommentsSection = ({ comments, onCommentsChange }) => {
  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <label className="block text-gray-700 font-medium mb-3">
        <i className="fas fa-comment-alt text-blue-500 mr-2" />
        Comentarios adicionales (opcional)
      </label>
      <textarea
        value={comments}
        onChange={(e) => onCommentsChange(e.target.value)}
        rows={4}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
        placeholder="Comparte cualquier comentario adicional sobre tu experiencia..."
      />
    </div>
  )
}

/**
 * Componente de botones de acción
 * Siguiendo Regla #3: Componente pequeño interno
 */
const ActionButtons = ({ onClose, isSubmitting }) => {
  return (
    <div className="flex space-x-4">
      <button
        type="button"
        onClick={onClose}
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50"
      >
        Cancelar
      </button>
      <button
        type="submit"
        disabled={isSubmitting}
        className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition-all font-medium shadow-lg disabled:opacity-50"
      >
        {isSubmitting ? (
          <span className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
            Enviando...
          </span>
        ) : (
          <>
            <i className="fas fa-paper-plane mr-2" />
            Enviar Encuesta
          </>
        )}
      </button>
    </div>
  )
}

export default SatisfactionSurvey
