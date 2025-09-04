import React from 'react'

/**
 * Componente reutilizable para mostrar estadísticas
 * Siguiendo Regla #3: Componente específico <50 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título de la estadística
 * @param {number} props.count - Número a mostrar
 * @param {string} props.color - Color del tema
 * @returns {JSX.Element} Tarjeta de estadística
 */
const StatCard = ({ title, count, color }) => {
  const colorClasses = {
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    red: 'bg-red-50 border-red-200 text-red-600'
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="text-2xl font-bold">{count}</div>
      <div className="text-sm font-medium">{title}</div>
    </div>
  )
}

export default StatCard
