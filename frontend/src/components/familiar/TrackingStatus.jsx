import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'

/**
 * Estado de seguimiento en tiempo real
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.currentStatus - Estado actual de la emergencia
 * @param {Object} props.trackingMetrics - Métricas de seguimiento
 * @returns {JSX.Element} Estado de seguimiento
 */
const TrackingStatus = ({ currentStatus, trackingMetrics }) => {
  const { lastUpdate, isActive } = trackingMetrics

  const getStatusColor = (color) => {
    const colorClasses = {
      green: 'bg-green-500',
      blue: 'bg-blue-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      orange: 'bg-orange-500',
      gray: 'bg-gray-500'
    }
    return colorClasses[color] || 'bg-gray-500'
  }

  return (
    <div className="p-4 bg-gray-50">
      <h3 className="font-semibold text-gray-800 mb-3 font-exo">Estado Actual</h3>

      <div className="space-y-3">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStatus?.text}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex items-center justify-between p-3 bg-white rounded-lg shadow-sm"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${getStatusColor(currentStatus?.color)} ${isActive ? 'animate-pulse' : ''}`}
              ></div>
              <div>
                <span className="text-sm font-medium text-gray-700 font-exo">
                  {currentStatus?.text}
                </span>
                {currentStatus?.description && (
                  <p className="text-xs text-gray-500 font-roboto">{currentStatus.description}</p>
                )}
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {currentStatus?.icon && <i className={`${currentStatus.icon} text-gray-400`}></i>}
              <span className="text-xs text-gray-500 font-roboto">{lastUpdate}</span>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Información adicional de seguimiento */}
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-white rounded-lg p-3 border border-gray-200"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700 font-exo">
                <i className="fas fa-satellite-dish mr-2 text-green-500"></i>
                Seguimiento GPS Activo
              </span>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <i className="fas fa-clock text-blue-500"></i>
                <span className="font-roboto">Última actualización: {lastUpdate}</span>
              </div>
              <div className="flex items-center space-x-2">
                <i className="fas fa-signal text-green-500"></i>
                <span className="font-roboto">Señal: Fuerte</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Línea de tiempo de estados */}
        <div className="bg-white rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-700 mb-3 font-exo">
            <i className="fas fa-history mr-2"></i>
            Historial de Estados
          </h4>

          <div className="space-y-2">
            {[
              { time: '14:23', status: 'Emergencia reportada', completed: true },
              { time: '14:25', status: 'Ambulancia asignada', completed: true },
              { time: '14:26', status: 'Ambulancia en camino', completed: true },
              { time: '14:35', status: 'Ambulancia en el lugar', completed: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    item.completed ? 'bg-green-500' : 'bg-gray-300'
                  }`}
                ></div>
                <span
                  className={`text-xs ${
                    item.completed ? 'text-gray-700' : 'text-gray-400'
                  } font-roboto`}
                >
                  {item.time} - {item.status}
                </span>
                {item.completed && <i className="fas fa-check text-green-500 text-xs"></i>}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackingStatus
