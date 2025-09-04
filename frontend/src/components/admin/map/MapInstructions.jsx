import React from 'react'

/**
 * Componente de instrucciones del mapa
 * ENFOQUE BALANCEADO: Solo presentación con contenido estático
 */
const MapInstructions = () => {
  return (
    <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
      <h4 className="font-exo font-semibold text-blue-800 mb-2">
        <i className="fas fa-info-circle mr-2"></i>
        Instrucciones
      </h4>
      <div className="text-sm text-blue-700 space-y-1">
        <p>1. Haga clic en una emergencia (rojo/amarillo/verde)</p>
        <p>2. Haga clic en una unidad disponible (verde)</p>
        <p>3. Confirme la asignación en el panel superior</p>
        <p>4. La unidad cambiará a estado "En Camino"</p>
      </div>
    </div>
  )
}

export default MapInstructions
