import React from 'react'

/**
 * Componentes de gráficos para administradores externos
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 * Siguiendo Regla #10: Componentes modulares especializados
 */

/**
 * Gráfico de distribución de servicios
 * @param {Object} props - Props del componente
 * @param {Object} props.data - Datos de servicios por tipo
 * @returns {JSX.Element} Gráfico de distribución
 */
export const ServiceDistributionChart = ({ data }) => {
  if (!data) return null

  const total = Object.values(data).reduce((sum, val) => sum + val, 0)

  if (total === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
          Distribución de Servicios
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <i className="fas fa-chart-pie text-3xl mb-2"></i>
            <p className="text-sm font-roboto">Sin datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
        Distribución de Servicios
      </h3>

      <div className="space-y-3 sm:space-y-4">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-roboto">Emergencias</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium font-exo">{data.emergencias || 0}</span>
              <span className="text-xs text-gray-500 font-roboto">
                ({Math.round(((data.emergencias || 0) / total) * 100)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-red-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((data.emergencias || 0) / total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-roboto">Médico a Domicilio</span>
            <div className="flex items-center space-x-2">
              <span className="font-medium font-exo">{data.medico_domicilio || 0}</span>
              <span className="text-xs text-gray-500 font-roboto">
                ({Math.round(((data.medico_domicilio || 0) / total) * 100)}%)
              </span>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${((data.medico_domicilio || 0) / total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-gray-700 font-roboto">Total</span>
          <span className="text-lg font-bold text-gray-800 font-exo">{total}</span>
        </div>
      </div>
    </div>
  )
}

/**
 * Gráfico de tendencia mensual
 * @param {Object} props - Props del componente
 * @param {Array} props.data - Datos mensuales
 * @returns {JSX.Element} Gráfico de tendencia
 */
export const MonthlyTrendChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
          Tendencia Mensual
        </h3>
        <div className="flex items-center justify-center h-32 text-gray-500">
          <div className="text-center">
            <i className="fas fa-chart-line text-3xl mb-2"></i>
            <p className="text-sm font-roboto">Sin datos disponibles</p>
          </div>
        </div>
      </div>
    )
  }

  const maxValue = Math.max(...data.map((m) => m.total))

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
        Tendencia Mensual
      </h3>

      <div className="flex items-end justify-between h-32 sm:h-40 space-x-1 sm:space-x-2">
        {data.map((month, index) => (
          <div key={index} className="flex-1 flex flex-col items-center">
            <div
              className="w-full bg-gradient-to-t from-green-500 to-green-400 rounded-t transition-all duration-500 hover:from-green-600 hover:to-green-500"
              style={{
                height: `${maxValue > 0 ? (month.total / maxValue) * 100 : 0}%`,
                minHeight: month.total > 0 ? '8px' : '2px'
              }}
              title={`${month.name}: ${month.total} servicios`}
            ></div>
            <div className="text-xs text-gray-600 mt-1 sm:mt-2 font-roboto">{month.name}</div>
            <div className="text-xs font-medium font-exo">{month.total}</div>
          </div>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="flex justify-between items-center text-xs text-gray-600">
          <span className="font-roboto">Promedio mensual:</span>
          <span className="font-medium font-exo">
            {Math.round(data.reduce((sum, m) => sum + m.total, 0) / data.length)}
          </span>
        </div>
      </div>
    </div>
  )
}

/**
 * Gráfico de utilización de empleados
 * @param {Object} props - Props del componente
 * @param {Array} props.employeesData - Datos de empleados
 * @returns {JSX.Element} Gráfico de utilización
 */
export const EmployeeUtilizationChart = ({ employeesData }) => {
  if (!employeesData || employeesData.length === 0) return null

  const utilizationLevels = {
    high: employeesData.filter((emp) => emp.totalServices >= 5).length,
    medium: employeesData.filter((emp) => emp.totalServices >= 2 && emp.totalServices < 5).length,
    low: employeesData.filter((emp) => emp.totalServices < 2).length
  }

  const total = employeesData.length

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
        Nivel de Utilización
      </h3>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-roboto">Alta (5+ servicios)</span>
            <span className="font-medium font-exo">{utilizationLevels.high}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(utilizationLevels.high / total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-roboto">Media (2-4 servicios)</span>
            <span className="font-medium font-exo">{utilizationLevels.medium}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-yellow-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(utilizationLevels.medium / total) * 100}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600 font-roboto">Baja (0-1 servicios)</span>
            <span className="font-medium font-exo">{utilizationLevels.low}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full transition-all duration-500"
              style={{ width: `${(utilizationLevels.low / total) * 100}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  )
}
