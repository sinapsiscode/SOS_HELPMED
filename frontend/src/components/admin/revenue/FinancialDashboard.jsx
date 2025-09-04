import React from 'react'

/**
 * Componente para el dashboard financiero con KPIs principales
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación, datos del hook
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.metrics - Métricas financieras calculadas
 * @param {Function} props.formatCurrency - Función para formatear moneda
 * @returns {JSX.Element} Vista del dashboard financiero
 */
const FinancialDashboard = ({ metrics, formatCurrency }) => {
  // Componente KPI Card reutilizable
  const KPICard = ({ title, value, icon, color, subtitle, trend }) => (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-roboto text-gray-600 mb-1">{title}</p>
          <p className="text-xl sm:text-2xl font-exo font-bold text-gray-800">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div
              className={`flex items-center mt-2 text-sm ${
                trend > 0 ? 'text-green-600' : trend < 0 ? 'text-red-600' : 'text-gray-600'
              }`}
            >
              <i
                className={`fas fa-arrow-${trend > 0 ? 'up' : trend < 0 ? 'down' : 'right'} mr-1`}
              ></i>
              <span>{Math.abs(trend).toFixed(1)}%</span>
            </div>
          )}
        </div>
        <div className={`p-3 rounded-full bg-${color}-100`}>
          <i className={`${icon} text-xl text-${color}-600`}></i>
        </div>
      </div>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* KPIs principales - Responsive */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          title="Ingresos Totales"
          value={formatCurrency(metrics.totalRevenue)}
          icon="fas fa-dollar-sign"
          color="green"
          subtitle="Acumulado total"
        />

        <KPICard
          title="Ingresos del Mes"
          value={formatCurrency(metrics.monthlyRevenue)}
          icon="fas fa-calendar"
          color="blue"
          subtitle="Mes actual"
          trend={metrics.monthlyGrowth}
        />

        <KPICard
          title="Ingresos Hoy"
          value={formatCurrency(metrics.dailyRevenue)}
          icon="fas fa-clock"
          color="purple"
          subtitle="Día actual"
        />

        <KPICard
          title="Transacción Promedio"
          value={formatCurrency(metrics.averageTransaction)}
          icon="fas fa-calculator"
          color="orange"
          subtitle="Por transacción"
        />
      </div>

      {/* Desglose por tipo de transacción */}
      {Object.keys(metrics.byType).length > 0 && (
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-chart-pie text-helpmed-blue mr-2"></i>
            Ingresos por Tipo de Transacción
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metrics.byType)
              .sort(([, a], [, b]) => b - a) // Ordenar por monto descendente
              .map(([type, amount]) => {
                const percentage = ((amount / metrics.totalRevenue) * 100).toFixed(1)
                const typeName = getTypeDisplayName(type)

                return (
                  <div
                    key={type}
                    className="border rounded-lg p-4 hover:shadow-sm transition-shadow"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-roboto font-medium text-gray-700">{typeName}</h4>
                      <span className="text-sm text-gray-500">{percentage}%</span>
                    </div>
                    <div className="text-xl font-exo font-bold text-gray-800 mb-2">
                      {formatCurrency(amount)}
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-helpmed-blue h-2 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                )
              })}
          </div>
        </div>
      )}

      {/* Tendencias mensuales */}
      {metrics.trends && metrics.trends.length > 0 && (
        <div className="bg-white rounded-xl shadow-medium p-6">
          <h3 className="text-lg font-exo font-semibold text-gray-800 mb-6">
            <i className="fas fa-chart-line text-helpmed-blue mr-2"></i>
            Tendencia de Ingresos (Últimos 6 Meses)
          </h3>

          <div className="overflow-x-auto">
            <div className="flex space-x-4 pb-2" style={{ minWidth: '600px' }}>
              {metrics.trends.map((trend, index) => {
                const maxRevenue = Math.max(...metrics.trends.map((t) => t.revenue))
                const heightPercent = maxRevenue > 0 ? (trend.revenue / maxRevenue) * 100 : 0

                return (
                  <div key={index} className="flex-1 text-center">
                    <div className="mb-4 flex items-end justify-center" style={{ height: '120px' }}>
                      <div
                        className="bg-gradient-to-t from-helpmed-blue to-blue-400 rounded-t-md transition-all duration-700 flex items-end justify-center min-w-[40px]"
                        style={{ height: `${Math.max(heightPercent, 5)}%` }}
                      >
                        {trend.revenue > 0 && (
                          <span className="text-white text-xs font-bold mb-1 transform -rotate-90 whitespace-nowrap">
                            {formatCurrency(trend.revenue)}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-sm font-roboto font-medium text-gray-700">
                      {trend.month}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">{trend.transactions} trans.</div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Estado de transacciones */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div className="bg-green-100 rounded-full p-3 mr-4">
              <i className="fas fa-check-circle text-2xl text-green-600"></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Completadas</p>
              <p className="text-2xl font-exo font-bold text-gray-800">
                {metrics.byStatus?.COMPLETED || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 rounded-full p-3 mr-4">
              <i className="fas fa-clock text-2xl text-yellow-600"></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Pendientes</p>
              <p className="text-2xl font-exo font-bold text-gray-800">
                {metrics.byStatus?.PENDING || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="flex items-center">
            <div className="bg-red-100 rounded-full p-3 mr-4">
              <i className="fas fa-times-circle text-2xl text-red-600"></i>
            </div>
            <div>
              <p className="text-gray-600 text-sm font-roboto">Fallidas</p>
              <p className="text-2xl font-exo font-bold text-gray-800">
                {metrics.byStatus?.FAILED || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Función utilitaria para nombres de tipos
const getTypeDisplayName = (type) => {
  const typeNames = {
    service_payment: 'Pago de Servicio',
    plan_payment: 'Pago de Plan',
    additional_fee: 'Tarifa Adicional',
    refund: 'Reembolso',
    adjustment: 'Ajuste',
    consultation_fee: 'Consulta Médica',
    emergency_fee: 'Emergencia',
    transfer_fee: 'Traslado',
    insurance_payment: 'Seguro',
    other: 'Otro'
  }
  return typeNames[type] || type
}

export default FinancialDashboard
