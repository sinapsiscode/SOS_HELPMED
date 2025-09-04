import React from 'react'

/**
 * Tarjeta de KPI para administradores externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.title - Título del KPI
 * @param {number} props.value - Valor del KPI
 * @param {string} props.icon - Clase de icono FontAwesome
 * @param {string} props.color - Color del tema (blue, green, red, purple)
 * @param {string} props.subtitle - Subtítulo opcional
 * @param {string} props.trend - Tendencia opcional (up, down, stable)
 * @returns {JSX.Element} Tarjeta de KPI
 */
const ExternalAdminKPICard = ({ title, value, icon, color, subtitle, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    indigo: 'bg-indigo-50 border-indigo-200 text-indigo-600'
  }

  const trendIcons = {
    up: 'fas fa-arrow-up text-green-500',
    down: 'fas fa-arrow-down text-red-500',
    stable: 'fas fa-minus text-gray-500'
  }

  return (
    <div
      className={`border rounded-xl p-3 sm:p-6 transition-all duration-200 hover:shadow-lg ${colorClasses[color]}`}
    >
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs sm:text-sm font-medium opacity-75 truncate font-roboto">{title}</p>
          <div className="flex items-baseline space-x-2 mt-1">
            <p className="text-xl sm:text-3xl font-bold font-exo">
              {typeof value === 'number' ? value.toLocaleString('es-CL') : value}
            </p>
            {trend && <i className={`${trendIcons[trend]} text-sm`}></i>}
          </div>
          {subtitle && <p className="text-xs opacity-60 mt-1 font-roboto">{subtitle}</p>}
        </div>
        <div className="flex-shrink-0 ml-2">
          <i className={`${icon} text-lg sm:text-2xl opacity-75`}></i>
        </div>
      </div>
    </div>
  )
}

export default ExternalAdminKPICard
