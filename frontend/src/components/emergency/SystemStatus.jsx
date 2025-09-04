import React from 'react'

/**
 * Estado del sistema de emergencias
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @returns {JSX.Element} Estado del sistema
 */
const SystemStatus = () => {
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-gray-800 font-exo">Estado del Sistema</h2>
        <SystemIndicator />
      </div>

      <div className="grid grid-cols-2 gap-4 text-center">
        <StatusCard value="24/7" label="Disponibilidad" color="green" />
        <StatusCard value="<5min" label="Tiempo Respuesta" color="blue" />
      </div>
    </div>
  )
}

/**
 * Indicador del estado del sistema
 */
const SystemIndicator = () => {
  return (
    <div className="flex items-center space-x-2 text-green-600">
      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
      <span className="font-semibold font-roboto">Operativo</span>
    </div>
  )
}

/**
 * Tarjeta de estado individual
 */
const StatusCard = ({ value, label, color }) => {
  return (
    <div className={`bg-${color}-50 border border-${color}-200 rounded-lg p-4`}>
      <div className={`text-2xl font-bold text-${color}-600 font-exo`}>{value}</div>
      <div className={`text-sm text-${color}-700 font-roboto`}>{label}</div>
    </div>
  )
}

export default SystemStatus
