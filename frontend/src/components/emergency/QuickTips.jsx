import React from 'react'

/**
 * Consejos rápidos para emergencias
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Consejos importantes
 */
const QuickTips = () => {
  const tips = [
    'Mantén la calma y proporciona información clara',
    'Ten preparados tus documentos de identificación',
    'Si es posible, permanece en un lugar seguro y accesible',
    'Sigue las instrucciones del personal médico',
    'Asegúrate de tener activada la ubicación en tu dispositivo'
  ]

  return (
    <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
      <h3 className="font-bold text-yellow-800 mb-3 flex items-center font-exo">
        <i className="fas fa-lightbulb mr-2"></i>
        Consejos Importantes
      </h3>
      <ul className="text-yellow-700 space-y-2 text-sm font-roboto">
        {tips.map((tip, index) => (
          <li key={index}>• {tip}</li>
        ))}
      </ul>
    </div>
  )
}

export default QuickTips
