import React from 'react'

/**
 * Componente para una pregunta individual de la encuesta
 * Siguiendo Regla #2: Solo presentación
 * Siguiendo Regla #3: Componente pequeño y enfocado
 */
const SurveyQuestion = ({
  question,
  index,
  rating,
  hoveredRating,
  onRatingChange,
  onStarHover,
  onStarLeave,
  getRatingLabel,
  getRatingColor
}) => {
  const renderStars = () => {
    const currentHover = hoveredRating || 0

    return (
      <div className="flex justify-center sm:justify-start space-x-1 sm:space-x-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onRatingChange(question.id, star)}
            onMouseEnter={() => onStarHover(question.id, star)}
            onMouseLeave={() => onStarLeave(question.id)}
            className="transition-all duration-200 transform hover:scale-110 p-1 sm:p-0"
          >
            <i
              className={`fas fa-star text-2xl sm:text-3xl ${
                star <= (currentHover || rating) ? 'text-yellow-500' : 'text-gray-300'
              }`}
            />
          </button>
        ))}
        <span className="ml-2 sm:ml-3 text-base sm:text-lg font-medium text-gray-700 self-center">
          {rating > 0 && `${rating}/5`}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 rounded-xl p-5">
      <div className="flex items-start space-x-3 mb-4">
        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
          <span className="text-blue-600 font-bold text-sm">{index + 1}</span>
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-800 mb-3">
            <i className={`${question.icon} text-blue-500 mr-2`} />
            {question.text}
          </h3>
          <div className="flex items-center justify-between">
            {renderStars()}
            {rating > 0 && (
              <span
                className={`text-sm font-medium px-3 py-1 rounded-full bg-${getRatingColor(rating)}-100 text-${getRatingColor(rating)}-700`}
              >
                {getRatingLabel(rating)}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SurveyQuestion
