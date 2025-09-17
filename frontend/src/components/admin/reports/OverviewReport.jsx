import React from 'react'

const OverviewReport = ({ dateRange }) => {
  // Datos para las métricas principales
  const metrics = {
    totalUsers: 15,
    activeEmergencies: 9,
    totalRevenue: 0,
    satisfaction: null
  }

  // Datos de distribución de usuarios
  const userDistribution = [
    { type: 'Familiar', count: 8, percentage: 25, color: 'bg-blue-500' },
    { type: 'Corporativo', count: 4, percentage: 15, color: 'bg-green-500' },
    { type: 'Externo', count: 8, percentage: 25, color: 'bg-purple-500' },
    { type: 'Admin', count: 3, percentage: 10, color: 'bg-red-500' },
    { type: 'Ambulancia', count: 8, percentage: 25, color: 'bg-orange-500' }
  ]

  // Datos para el resumen por tipo de plan
  const planSummary = [
    {
      plan: 'Plan Help',
      users: 2,
      servicesUsed: 10,
      annualRevenue: 'S/ 5184',
      utilization: 31,
      utilizationColor: 'text-green-600'
    },
    {
      plan: 'Plan Básico',
      users: 1,
      servicesUsed: 3,
      annualRevenue: 'S/ 3360',
      utilization: 43,
      utilizationColor: 'text-green-600'
    },
    {
      plan: 'Plan VIP',
      users: 1,
      servicesUsed: 8,
      annualRevenue: 'S/ 4920',
      utilization: 62,
      utilizationColor: 'text-yellow-600'
    },
    {
      plan: 'Plan Dorado',
      users: 1,
      servicesUsed: 8,
      annualRevenue: 'S/ 7500',
      utilization: 36,
      utilizationColor: 'text-green-600'
    },
    {
      plan: 'Planes Corporativos',
      users: 3,
      servicesUsed: 66,
      annualRevenue: 'S/ 29,940',
      utilization: 73,
      utilizationColor: 'text-yellow-600'
    },
    {
      plan: 'Usuarios Externos',
      users: 5,
      servicesUsed: 4,
      annualRevenue: 'S/ 0',
      utilization: 44,
      utilizationColor: 'text-green-600'
    }
  ]

  // Cálculo de utilización de servicios
  const serviceUtilization = {
    percentage: 57,
    available: 43,
    enUso: 57,
    capacity: 100
  }

  return (
    <div className="space-y-6">
      {/* Cards de métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Usuarios */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-users text-blue-600 text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.totalUsers}</div>
          <div className="text-sm text-gray-600 mt-1">Total Usuarios</div>
        </div>

        {/* Emergencias Activas */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-exclamation-triangle text-red-600 text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">{metrics.activeEmergencies}</div>
          <div className="text-sm text-gray-600 mt-1">Emergencias Activas</div>
        </div>

        {/* Ingresos Totales */}
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-dollar-sign text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">S/ {metrics.totalRevenue}</div>
          <div className="text-sm text-gray-600 mt-1">Ingresos Totales</div>
        </div>

        {/* Satisfacción Cliente */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-3">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-star text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="text-3xl font-bold text-gray-900">
            {metrics.satisfaction || 'Sin datos'}
          </div>
          <div className="text-sm text-gray-600 mt-1">Satisfacción Cliente</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Usuarios */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución de Usuarios</h3>

          <div className="space-y-3">
            {userDistribution.map((item, index) => (
              <div key={index} className="flex items-center">
                <div className="w-20 text-sm font-medium text-gray-700">{item.type}</div>
                <div className="flex-1 mx-3">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div
                      className={`h-6 rounded-full ${item.color} flex items-center justify-end px-2`}
                      style={{ width: `${item.percentage * 4}%` }}
                    >
                      <span className="text-white text-xs font-semibold">{item.count}</span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm text-gray-600">{item.percentage}%</div>
              </div>
            ))}
          </div>

          {/* Totales */}
          <div className="flex justify-between items-center mt-6 pt-4 border-t">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">20</div>
              <div className="text-xs text-gray-600">Total Usuarios</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">5</div>
              <div className="text-xs text-gray-600">Tipos de Usuario</div>
            </div>
          </div>
        </div>

        {/* Utilización de Servicios */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Utilización de Servicios</h3>

          {/* Gráfico circular */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#e5e7eb"
                  strokeWidth="20"
                  fill="none"
                />
                <circle
                  cx="96"
                  cy="96"
                  r="80"
                  stroke="#10b981"
                  strokeWidth="20"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 80 * serviceUtilization.percentage / 100} ${2 * Math.PI * 80}`}
                  className="transition-all duration-500"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-bold text-gray-900">{serviceUtilization.percentage}%</span>
                <span className="text-sm text-gray-600">Utilizado</span>
              </div>
            </div>
          </div>

          <div className="text-center text-sm text-green-600 font-medium mb-4">
            Utilización Normal
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{serviceUtilization.available}%</div>
              <div className="text-xs text-gray-600">Disponible</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{serviceUtilization.enUso}%</div>
              <div className="text-xs text-gray-600">En Uso</div>
            </div>
            <div className="text-center">
              <div className="text-xl font-bold text-gray-800">{serviceUtilization.capacity}%</div>
              <div className="text-xs text-gray-600">Capacidad</div>
            </div>
          </div>
        </div>
      </div>

      {/* Resumen por Tipo de Plan */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Resumen por Tipo de Plan</h3>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 text-sm font-medium text-gray-700">Tipo de Plan</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Usuarios</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Servicios Usados</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Ingresos Anuales</th>
                <th className="text-center py-3 px-4 text-sm font-medium text-gray-700">Utilización</th>
              </tr>
            </thead>
            <tbody>
              {planSummary.map((plan, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4 text-sm font-medium text-gray-900">{plan.plan}</td>
                  <td className="text-center py-3 px-4 text-sm text-gray-700">{plan.users}</td>
                  <td className="text-center py-3 px-4 text-sm text-gray-700">{plan.servicesUsed}</td>
                  <td className="text-center py-3 px-4 text-sm text-gray-700">{plan.annualRevenue}</td>
                  <td className="text-center py-3 px-4">
                    <span className={`text-sm font-medium ${plan.utilizationColor}`}>
                      {plan.utilization}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default OverviewReport