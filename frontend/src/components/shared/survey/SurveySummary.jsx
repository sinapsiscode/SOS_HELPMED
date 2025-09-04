import React from 'react'

/**
 * Componente de resumen de la encuesta
 * Siguiendo Regla #2: Solo presentación
 * Siguiendo Regla #3: Componente pequeño y enfocado
 */
const SurveySummary = ({ averageRating, hasRatings }) => {
  if (!hasRatings) return null

  const average = parseFloat(averageRating)

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <div className="flex items-center justify-between">
        <span className="text-blue-700 font-medium">Promedio actual:</span>
        <div className="flex items-center space-x-2">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <i
                key={i}
                className={`fas fa-star text-lg ${
                  i < Math.floor(average) ? 'text-yellow-500' : 'text-gray-300'
                }`}
              />
            ))}
          </div>
          <span className="font-bold text-blue-800">{averageRating}/5.0</span>
        </div>
      </div>
    </div>
  )
}

export default SurveySummary
