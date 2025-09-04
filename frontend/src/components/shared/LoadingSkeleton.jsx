import React from 'react'

/**
 * Componente de esqueleto de carga reutilizable
 * Muestra placeholders animados mientras cargan los datos
 */
const LoadingSkeleton = ({ rows = 3, height = 'h-4' }) => {
  return (
    <div className="animate-pulse">
      <div className="space-y-4">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className={`bg-gray-300 rounded ${height}`}></div>
        ))}
      </div>
    </div>
  )
}

export default LoadingSkeleton
