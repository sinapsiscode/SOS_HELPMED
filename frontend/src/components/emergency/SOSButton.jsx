import React from 'react'

/**
 * Botón SOS para emergencias críticas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onSOSPress - Función para activar SOS
 * @returns {JSX.Element} Botón SOS
 */
const SOSButton = ({ onSOSPress }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h2 className="text-xl font-bold text-gray-800 mb-4 font-exo">Emergencia Crítica</h2>
      <p className="text-gray-600 mb-6 font-roboto">
        Presiona el botón SOS solo en caso de emergencias que pongan en riesgo la vida.
      </p>

      <button
        onClick={onSOSPress}
        className="w-full p-8 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-xl shadow-heavy hover:shadow-xl transform hover:scale-105 transition-all duration-200 relative overflow-hidden"
      >
        <div className="relative z-10">
          <div className="text-4xl mb-2">🚨</div>
          <div className="text-2xl font-bold mb-1 font-exo">SOS</div>
          <div className="text-red-100 font-roboto">Emergencia Crítica</div>
        </div>

        <div className="absolute inset-0 bg-gradient-to-r from-red-700 to-red-800 opacity-0 hover:opacity-100 transition-opacity"></div>
      </button>
    </div>
  )
}

export default SOSButton
