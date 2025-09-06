import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.registration.requestStats.comments.title}
 * ${LABELS.admin.registration.requestStats.comments.rules.rule3}
 * ${LABELS.admin.registration.requestStats.comments.rules.rule2}
 *
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.requestStats - Estadísticas calculadas de solicitudes
 * @param {number} props.requestStats.pending - Número de solicitudes pendientes
 * @param {number} props.requestStats.approved - Número de solicitudes aprobadas
 * @param {number} props.requestStats.rejected - Número de solicitudes rechazadas
 * @param {number} props.requestStats.total - Total de solicitudes
 * @returns {JSX.Element} Grid de estadísticas
 */
const RequestStats = ({ requestStats }) => {
  const labels = LABELS.admin.registration.requestStats
  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
      {/* Pendientes */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-yellow-600 font-exo">
          {requestStats.pending}
        </div>
        <div className="text-xs sm:text-sm text-yellow-700 font-roboto">{labels.stats.pending}</div>
      </div>

      {/* Aprobadas */}
      <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-green-600 font-exo">
          {requestStats.approved}
        </div>
        <div className="text-xs sm:text-sm text-green-700 font-roboto">{labels.stats.approved}</div>
      </div>

      {/* Rechazadas */}
      <div className="bg-red-50 border border-red-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-red-600 font-exo">
          {requestStats.rejected}
        </div>
        <div className="text-xs sm:text-sm text-red-700 font-roboto">{labels.stats.rejected}</div>
      </div>

      {/* Total */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
        <div className="text-xl sm:text-2xl font-bold text-blue-600 font-exo">
          {requestStats.total}
        </div>
        <div className="text-xs sm:text-sm text-blue-700 font-roboto">{labels.stats.total}</div>
      </div>
    </div>
  )
}

export default RequestStats
