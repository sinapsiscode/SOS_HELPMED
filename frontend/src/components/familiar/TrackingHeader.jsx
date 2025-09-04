import React from 'react'
import { motion } from 'framer-motion'

/**
 * Header del seguimiento de ambulancia
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.trackingMetrics - Métricas del seguimiento
 * @param {string} props.ambulanceId - ID de la ambulancia
 * @returns {JSX.Element} Header de seguimiento
 */
const TrackingHeader = ({ trackingMetrics, ambulanceId }) => {
  const { eta, distance } = trackingMetrics

  return (
    <div className="bg-red-600 text-white p-4">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl font-bold flex items-center font-exo">
          <motion.i
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="fas fa-ambulance mr-3"
          />
          Ambulancia en Camino
        </h2>
        <span className="bg-white bg-opacity-20 px-3 py-1 rounded-full text-sm font-roboto">
          {ambulanceId}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mt-3">
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90 font-roboto">Tiempo estimado</span>
            <motion.span
              key={eta}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold font-exo"
            >
              {eta}
            </motion.span>
          </div>
        </div>
        <div className="bg-white bg-opacity-10 rounded-lg p-3">
          <div className="flex items-center justify-between">
            <span className="text-sm opacity-90 font-roboto">Distancia</span>
            <motion.span
              key={distance}
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="text-2xl font-bold font-exo"
            >
              {distance}
            </motion.span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TrackingHeader
