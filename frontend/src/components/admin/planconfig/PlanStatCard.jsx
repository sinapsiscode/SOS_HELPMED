import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.planconfig.planStatCard.comments.title}
 * ${LABELS.admin.planconfig.planStatCard.comments.rules.rule3}
 * ${LABELS.admin.planconfig.planStatCard.comments.rules.rule2}
 *
 * @param {Object} props - Propiedades del componente
 * @param {string} props.title - Título de la estadística
 * @param {number} props.count - Número a mostrar
 * @param {string} props.color - Color del tema (blue, green, purple, orange)
 * @param {string} props.icon - Clase del icono Font Awesome
 * @returns {JSX.Element} Tarjeta de estadística
 */
const PlanStatCard = ({ title, count, color, icon }) => {
  // Clases CSS estáticas (Regla #2: presentación en componente)
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600'
  }

  return (
    <div className={`border rounded-lg p-2 sm:p-3 lg:p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">{count}</div>
          <div className="text-xs sm:text-sm font-medium">{title}</div>
        </div>
        <i className={`${icon} text-lg sm:text-xl lg:text-2xl opacity-75`}></i>
      </div>
    </div>
  )
}

export default PlanStatCard
