import { useState } from 'react'
import useAppStore from '../../../stores/useAppStore'
import { LABELS } from '../../../config/labels'

const GeographyReport = ({ dateRange }) => {
  const labels = LABELS.admin.reports.geographyReport
  const { allUsers, activeEmergencies, ambulanceUsers } = useAppStore()
  const [selectedDistrict, setSelectedDistrict] = useState(null)
  
  // Calcular KPIs principales para el dashboard
  const calculateKPIs = () => {
    const totalUsers = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ].length
    
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    const averageResponseTime = completedEmergencies.length > 0
      ? Math.round(completedEmergencies.reduce((sum, e) => sum + (e.responseTimeMinutes || 0), 0) / completedEmergencies.length)
      : 0
    
    const activeUnits = ambulanceUsers?.filter(u => u.status === 'active').length || 0
    const availableUnits = ambulanceUsers?.filter(u => u.currentStatus === 'available').length || 0
    const coveragePercentage = activeUnits > 0 ? Math.round((availableUnits / activeUnits) * 100) : 0
    
    return {
      totalUsers,
      totalEmergencies: completedEmergencies.length,
      averageResponseTime,
      coveragePercentage,
      activeUnits,
      availableUnits
    }
  }
  
  const kpis = calculateKPIs()
  
  return (
    <div className="space-y-6">
      {/* Header con contexto y navegación */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-2">{labels.title}</h2>
            <p className="text-blue-100 text-sm">
              {labels.subtitle}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <i className="fas fa-map-marked-alt text-3xl text-blue-200"></i>
            <div className="text-right">
              <div className="text-2xl font-bold">{kpis.totalUsers.toLocaleString()}</div>
              <div className="text-sm text-blue-200">{labels.kpis.totalUsers}</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* KPIs Dashboard */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{labels.kpis.emergencies}</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.totalEmergencies}</p>
            </div>
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-ambulance text-red-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 font-medium">
              {labels.kpis.vsLastMonth.replace('{percentage}', '12')}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{labels.kpis.averageTime}</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.averageResponseTime}min</p>
            </div>
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-clock text-yellow-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className={`text-sm font-medium ${
              kpis.averageResponseTime <= 8 ? 'text-green-600' : 'text-red-600'
            }`}>
              {kpis.averageResponseTime <= 8 ? labels.performance.excellent : labels.performance.improvable}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{labels.kpis.coverage}</p>
              <p className="text-2xl font-bold text-gray-900">{kpis.coveragePercentage}%</p>
            </div>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-shield-alt text-green-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-gray-600">
              {labels.kpis.units.replace('{available}', kpis.availableUnits).replace('{total}', kpis.activeUnits)}
            </span>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{labels.kpis.coveredZones}</p>
              <p className="text-2xl font-bold text-gray-900">9</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-map text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600 font-medium">
              {labels.kpis.limaMetro}
            </span>
          </div>
        </div>
      </div>
      
      
      {/* Contenido unificado de geografía */}
      <div className="space-y-6">
        {/* Resumen ejecutivo */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-blue-600"></i>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{labels.executive.title}</h3>
              <p className="text-sm text-gray-600">{labels.executive.subtitle}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-green-50 to-green-100 rounded-lg border border-green-200">
              <i className="fas fa-trophy text-green-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-green-800 text-sm sm:text-base">{labels.executive.cards.leader.title}</h4>
              <p className="text-xs sm:text-sm text-green-700">{labels.executive.cards.leader.description.replace('{district}', 'Surco').replace('{count}', Math.floor(kpis.totalUsers * 0.18))}</p>
              <p className="text-xs text-green-600 mt-1">{labels.executive.cards.leader.percentage.replace('{percentage}', '18')}</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-blue-50 to-blue-100 rounded-lg border border-blue-200">
              <i className="fas fa-zap text-blue-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-blue-800 text-sm sm:text-base">{labels.executive.cards.fastest.title}</h4>
              <p className="text-xs sm:text-sm text-blue-700">{labels.executive.cards.fastest.description.replace('{district}', 'Miraflores').replace('{time}', '7')}</p>
              <p className="text-xs text-blue-600 mt-1">{labels.executive.cards.fastest.percentage.replace('{percentage}', '25')}</p>
            </div>
            
            <div className="text-center p-3 sm:p-4 bg-gradient-to-b from-purple-50 to-purple-100 rounded-lg border border-purple-200">
              <i className="fas fa-bullseye text-purple-600 text-xl sm:text-2xl mb-2"></i>
              <h4 className="font-semibold text-purple-800 text-sm sm:text-base">{labels.executive.cards.opportunity.title}</h4>
              <p className="text-xs sm:text-sm text-purple-700">{labels.executive.cards.opportunity.description.replace('{district}', 'Callao')}</p>
              <p className="text-xs text-purple-600 mt-1">{labels.executive.cards.opportunity.average.replace('{time}', '18')}
            </div>
          </div>
        </div>
        
        {/* Análisis unificado por distrito */}
        <UnifiedDistrictAnalysis dateRange={dateRange} />
      </div>
      
    </div>
  )
}

// Componentes auxiliares
const KPICard = ({ title, value, change, icon, color }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600'
  }

  return (
    <div className={`border rounded-xl p-6 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <i className={`${icon} text-2xl opacity-75`}></i>
        <span className="text-sm font-medium text-green-600">{change}</span>
      </div>
      <h3 className="text-2xl font-bold text-gray-800 mb-1">{value}</h3>
      <p className="text-sm opacity-75">{title}</p>
    </div>
  )
}

const ServicesTrendChart = ({ dateRange }) => {
  // Datos mock para los últimos 6 meses
  const servicesData = {
    last30days: [
      { period: labels.serviceTrend.periods.days30, emergencias: 45, urgencias: 32, domicilio: 28, traslados: 12 },
      { period: labels.serviceTrend.periods.days25, emergencias: 52, urgencias: 38, domicilio: 31, traslados: 15 },
      { period: labels.serviceTrend.periods.days20, emergencias: 48, urgencias: 35, domicilio: 29, traslados: 14 },
      { period: labels.serviceTrend.periods.days15, emergencias: 58, urgencias: 42, domicilio: 35, traslados: 18 },
      { period: labels.serviceTrend.periods.days10, emergencias: 61, urgencias: 45, domicilio: 38, traslados: 20 },
      { period: labels.serviceTrend.periods.days5, emergencias: 65, urgencias: 48, domicilio: 41, traslados: 22 },
      { period: labels.serviceTrend.periods.today, emergencias: 70, urgencias: 52, domicilio: 45, traslados: 25 }
    ],
    last3months: [
      { period: labels.serviceTrend.periods.months3, emergencias: 420, urgencias: 310, domicilio: 280, traslados: 95 },
      { period: labels.serviceTrend.periods.months2, emergencias: 465, urgencias: 340, domicilio: 315, traslados: 110 },
      { period: labels.serviceTrend.periods.lastMonth, emergencias: 510, urgencias: 375, domicilio: 350, traslados: 125 },
      { period: labels.serviceTrend.periods.thisMonth, emergencias: 580, urgencias: 420, domicilio: 385, traslados: 145 }
    ]
  }
  
  const data = servicesData[dateRange] || servicesData.last30days
  const maxValue = Math.max(...data.flatMap(d => [d.emergencias, d.urgencias, d.domicilio, d.traslados]))
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.serviceTrend.title}</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>{labels.serviceTrend.legend.emergencies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>{labels.serviceTrend.legend.urgencies}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>{labels.serviceTrend.legend.homeVisits}</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>{labels.serviceTrend.legend.transfers}</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 relative mb-4">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Área del gráfico */}
        <div className="ml-10 mr-4 h-full pb-8 relative">
          {/* Líneas de cuadrícula */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 w-full"></div>
            ))}
          </div>
          
          {/* Datos del gráfico */}
          <div className="relative h-full flex items-end justify-between px-2">
            {data.map((point, index) => {
              const total = point.emergencias + point.urgencias + point.domicilio + point.traslados
              const totalHeight = Math.min((total / maxValue) * 240, 240) // Altura máxima 240px
              
              // Calcular alturas proporcionales dentro de la barra total
              const emergenciaHeight = (point.emergencias / total) * totalHeight
              const urgenciaHeight = (point.urgencias / total) * totalHeight
              const domicilioHeight = (point.domicilio / total) * totalHeight
              const trasladoHeight = (point.traslados / total) * totalHeight
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  {/* Barra apilada */}
                  <div className="relative w-12 flex flex-col-reverse" style={{ height: `${totalHeight}px` }}>
                    {/* Traslados (verde) - abajo */}
                    <div 
                      className="bg-green-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${trasladoHeight}px` }}
                      title={labels.serviceTrend.tooltips.transfers.replace('{count}', point.traslados)}
                    ></div>
                    {/* Domicilio (azul) */}
                    <div 
                      className="bg-blue-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${domicilioHeight}px` }}
                      title={labels.serviceTrend.tooltips.homeVisits.replace('{count}', point.domicilio)}
                    ></div>
                    {/* Urgencias (amarillo) */}
                    <div 
                      className="bg-yellow-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${urgenciaHeight}px` }}
                      title={labels.serviceTrend.tooltips.urgencies.replace('{count}', point.urgencias)}
                    ></div>
                    {/* Emergencias (rojo) - arriba */}
                    <div 
                      className="bg-red-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${emergenciaHeight}px` }}
                      title={labels.serviceTrend.tooltips.emergencies.replace('{count}', point.emergencias)}
                    ></div>
                  </div>
                  
                  {/* Valor total arriba de la barra */}
                  <div className="absolute -top-6 text-xs font-semibold text-gray-700">
                    {total}
                  </div>
                  
                  {/* Tooltip en hover */}
                  <div className="invisible group-hover:visible absolute -top-28 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg">
                    <div className="font-semibold mb-2 text-center">{point.period}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-red-500 rounded mr-2"></div>{labels.serviceTrend.legend.emergencies}:</span>
                        <span className="font-semibold ml-2">{point.emergencias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-yellow-500 rounded mr-2"></div>{labels.serviceTrend.legend.urgencies}:</span>
                        <span className="font-semibold ml-2">{point.urgencias}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>{labels.serviceTrend.legend.homeVisits}:</span>
                        <span className="font-semibold ml-2">{point.domicilio}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded mr-2"></div>{labels.serviceTrend.legend.transfers}:</span>
                        <span className="font-semibold ml-2">{point.traslados}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Eje X */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data.map((point, index) => (
              <div key={index} className="text-center flex-1">
                <span className="block transform -rotate-45 origin-center">
                  {point.period.replace('Hace ', '').replace(' días', 'd').replace(' meses', 'm').replace('Este mes', 'Actual')}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Resumen */}
      <div className="mt-4 grid grid-cols-4 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-red-600">{data[data.length - 1]?.emergencias || 0}</div>
          <div className="text-xs text-gray-500">Emergencias hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">{data[data.length - 1]?.urgencias || 0}</div>
          <div className="text-xs text-gray-500">Urgencias hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data[data.length - 1]?.domicilio || 0}</div>
          <div className="text-xs text-gray-500">Domicilio hoy</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{data[data.length - 1]?.traslados || 0}</div>
          <div className="text-xs text-gray-500">Traslados hoy</div>
        </div>
      </div>
    </div>
  )
}

const UserGrowthChart = ({ dateRange }) => {
  // Datos mock para crecimiento de usuarios
  const usersData = {
    last30days: [
      { period: 'Sem 1', familiar: 15, corporativo: 2, externo: 1, total: 18 },
      { period: 'Sem 2', familiar: 22, corporativo: 3, externo: 1, total: 26 },
      { period: 'Sem 3', familiar: 18, corporativo: 4, externo: 2, total: 24 },
      { period: 'Sem 4', familiar: 28, corporativo: 5, externo: 1, total: 34 }
    ],
    last3months: [
      { period: 'Hace 3m', familiar: 180, corporativo: 25, externo: 8, total: 213 },
      { period: 'Hace 2m', familiar: 205, corporativo: 32, externo: 12, total: 249 },
      { period: 'Mes pasado', familiar: 245, corporativo: 41, externo: 15, total: 301 },
      { period: 'Este mes', familiar: 285, corporativo: 48, externo: 18, total: 351 }
    ],
    lastyear: [
      { period: 'Ene', familiar: 45, corporativo: 5, externo: 2, total: 52 },
      { period: 'Feb', familiar: 52, corporativo: 8, externo: 3, total: 63 },
      { period: 'Mar', familiar: 48, corporativo: 12, externo: 4, total: 64 },
      { period: 'Abr', familiar: 65, corporativo: 15, externo: 5, total: 85 },
      { period: 'May', familiar: 72, corporativo: 18, externo: 6, total: 96 },
      { period: 'Jun', familiar: 68, corporativo: 22, externo: 7, total: 97 },
      { period: 'Jul', familiar: 85, corporativo: 28, externo: 8, total: 121 },
      { period: 'Ago', familiar: 92, corporativo: 35, externo: 10, total: 137 },
      { period: 'Sep', familiar: 88, corporativo: 42, externo: 12, total: 142 },
      { period: 'Oct', familiar: 105, corporativo: 48, externo: 15, total: 168 },
      { period: 'Nov', familiar: 115, corporativo: 52, externo: 18, total: 185 },
      { period: 'Dic', familiar: 125, corporativo: 58, externo: 22, total: 205 }
    ]
  }
  
  const data = usersData[dateRange] || usersData.last30days
  const maxValue = Math.max(...data.map(d => d.total))
  const totalUsers = data.reduce((sum, d) => sum + d.total, 0)
  const avgGrowth = data.length > 1 ? ((data[data.length - 1].total / data[0].total - 1) * 100).toFixed(1) : 0
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.userGrowth.title}</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Familiar</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Corporativo</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
            <span>Externo</span>
          </div>
        </div>
      </div>
      
      <div className="h-80 relative mb-4">
        {/* Eje Y */}
        <div className="absolute left-0 top-0 bottom-8 w-8 flex flex-col justify-between text-xs text-gray-500">
          <span>{maxValue}</span>
          <span>{Math.round(maxValue * 0.75)}</span>
          <span>{Math.round(maxValue * 0.5)}</span>
          <span>{Math.round(maxValue * 0.25)}</span>
          <span>0</span>
        </div>
        
        {/* Área del gráfico */}
        <div className="ml-10 mr-4 h-full pb-8 relative">
          {/* Líneas de cuadrícula */}
          <div className="absolute inset-0 flex flex-col justify-between">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="border-t border-gray-200 w-full"></div>
            ))}
          </div>
          
          {/* Gráfico de barras */}
          <div className="relative h-full flex items-end justify-between px-2">
            {data.map((point, index) => {
              const totalHeight = Math.min((point.total / maxValue) * 240, 240) // Altura máxima 240px
              
              // Calcular alturas proporcionales dentro de la barra total
              const familiarHeight = (point.familiar / point.total) * totalHeight
              const corporativoHeight = (point.corporativo / point.total) * totalHeight  
              const externoHeight = (point.externo / point.total) * totalHeight
              
              return (
                <div key={index} className="flex-1 flex flex-col items-center group relative">
                  <div className="relative w-14 flex flex-col-reverse" style={{ height: `${totalHeight}px` }}>
                    {/* Barra apilada de abajo hacia arriba */}
                    {/* Externo (morado) - abajo */}
                    <div 
                      className="bg-purple-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${externoHeight}px` }}
                      title={`Externo: ${point.externo}`}
                    ></div>
                    {/* Corporativo (verde) - medio */}
                    <div 
                      className="bg-green-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${corporativoHeight}px` }}
                      title={`Corporativo: ${point.corporativo}`}
                    ></div>
                    {/* Familiar (azul) - arriba */}
                    <div 
                      className="bg-blue-500 w-full transition-opacity hover:opacity-80"
                      style={{ height: `${familiarHeight}px` }}
                      title={`Familiar: ${point.familiar}`}
                    ></div>
                  </div>
                  
                  {/* Valor total encima de la barra */}
                  <div className="absolute -top-6 text-xs font-semibold text-gray-700">
                    {point.total}
                  </div>
                  
                  {/* Tooltip */}
                  <div className="invisible group-hover:visible absolute -top-32 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white p-3 rounded-lg text-xs whitespace-nowrap z-20 shadow-lg">
                    <div className="font-semibold mb-2 text-center">{point.period}</div>
                    <div className="space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-blue-500 rounded mr-2"></div>Familiar:</span>
                        <span className="font-semibold ml-2">{point.familiar}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-green-500 rounded mr-2"></div>Corporativo:</span>
                        <span className="font-semibold ml-2">{point.corporativo}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="flex items-center"><div className="w-2 h-2 bg-purple-500 rounded mr-2"></div>Externo:</span>
                        <span className="font-semibold ml-2">{point.externo}</span>
                      </div>
                      <div className="border-t pt-1 mt-1 flex justify-between">
                        <span>Total:</span>
                        <span className="font-bold">{point.total}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Línea de tendencia simplificada */}
          <div className="absolute inset-0 pointer-events-none">
            {data.map((point, index) => {
              if (index === data.length - 1) return null
              const currentHeight = (point.total / maxValue) * 240
              const nextHeight = (data[index + 1].total / maxValue) * 240
              const isGrowing = nextHeight > currentHeight
              
              return (
                <div
                  key={index}
                  className={`absolute w-1 ${isGrowing ? 'bg-green-400' : 'bg-red-400'} opacity-60`}
                  style={{
                    left: `${(index / (data.length - 1)) * 100}%`,
                    bottom: `${currentHeight}px`,
                    height: `${Math.abs(nextHeight - currentHeight)}px`
                  }}
                ></div>
              )
            })}
          </div>
          
          {/* Eje X */}
          <div className="absolute -bottom-8 left-0 right-0 flex justify-between text-xs text-gray-500 px-2">
            {data.map((point, index) => (
              <div key={index} className="text-center flex-1">
                <span className="block">
                  {point.period}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Estadísticas */}
      <div className="mt-4 grid grid-cols-3 gap-4 pt-4 border-t">
        <div className="text-center">
          <div className="text-2xl font-bold text-gray-800">{totalUsers.toLocaleString()}</div>
          <div className="text-xs text-gray-500">Total registrados</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">+{avgGrowth}%</div>
          <div className="text-xs text-gray-500">Crecimiento</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{data[data.length - 1]?.total || 0}</div>
          <div className="text-xs text-gray-500">Últimos registros</div>
        </div>
      </div>
    </div>
  )
}

const SummaryTable = ({ dateRange }) => {
  const { allUsers } = useAppStore()
  
  // Calcular datos reales por tipo de plan
  const planSummary = calculatePlanSummary(allUsers)
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.planAnalysis.summary}</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3">{labels.planAnalysis.headers.planType}</th>
              <th className="text-center py-3">{labels.planAnalysis.headers.users}</th>
              <th className="text-center py-3">{labels.planAnalysis.headers.servicesUsed}</th>
              <th className="text-center py-3">{labels.planAnalysis.headers.annualRevenue}</th>
              <th className="text-center py-3">{labels.planAnalysis.headers.utilization}</th>
            </tr>
          </thead>
          <tbody>
            {planSummary.map((plan, index) => (
              <tr key={index} className={index < planSummary.length - 1 ? "border-b" : ""}>
                <td className="py-3 font-medium">{plan.type}</td>
                <td className="text-center py-3">{plan.users}</td>
                <td className="text-center py-3">{plan.servicesUsed.toLocaleString()}</td>
                <td className="text-center py-3">S/ {plan.revenue.toLocaleString()}</td>
                <td className="text-center py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.utilizationRate > 80 ? 'bg-red-100 text-red-800' :
                    plan.utilizationRate > 60 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {plan.utilizationRate}%
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {planSummary.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-info-circle text-4xl mb-2"></i>
          <p>No hay datos de planes disponibles</p>
        </div>
      )}
    </div>
  )
}

// Componentes placeholder para los reportes específicos
const UserTypeCard = ({ type, stats }) => (
  <div className="bg-gray-50 rounded-lg p-4">
    <h4 className="font-medium text-gray-800 capitalize mb-2">{type}</h4>
    <div className="text-2xl font-bold text-gray-900">{stats.count}</div>
    <div className="flex justify-between items-center mt-2">
      <span className="text-sm text-gray-600">{stats.percentage}%</span>
      <span className="text-sm text-green-600">{stats.growth}</span>
    </div>
  </div>
)

const UserRegistrationChart = ({ dateRange }) => {
  const { allUsers, registrationRequests } = useAppStore()
  
  // ✅ ANÁLISIS ESPECIALIZADO DE ESTADO DE REGISTROS
  const calculateRegistrationAnalysis = () => {
    // Analizar estado de usuarios
    const usersByStatus = {
      active: 0,
      inactive: 0,
      pending: 0
    }
    
    // Contar usuarios activos/inactivos
    Object.values(allUsers).forEach(userGroup => {
      if (Array.isArray(userGroup)) {
        userGroup.forEach(user => {
          const status = user.plan?.status || user.status || 'active'
          if (status === 'active') {
            usersByStatus.active++
          } else {
            usersByStatus.inactive++
          }
        })
      }
    })
    
    // Contar solicitudes por estado
    const requestsByStatus = {
      pending: registrationRequests?.filter(req => req.status === 'pending').length || 0,
      approved: registrationRequests?.filter(req => req.status === 'approved').length || 0,
      rejected: registrationRequests?.filter(req => req.status === 'rejected').length || 0
    }
    
    // Análisis por tipo de plan solicitado
    const requestsByType = {
      familiar: registrationRequests?.filter(req => req.planType === 'familiar').length || 0,
      corporativo: registrationRequests?.filter(req => req.planType === 'corporativo').length || 0,
      externo: registrationRequests?.filter(req => req.planType === 'externo').length || 0
    }
    
    return {
      usersByStatus,
      requestsByStatus,
      requestsByType,
      totalUsers: usersByStatus.active + usersByStatus.inactive,
      totalRequests: requestsByStatus.pending + requestsByStatus.approved + requestsByStatus.rejected
    }
  }
  
  const analysis = calculateRegistrationAnalysis()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-bold text-gray-800">{labels.registrationAnalysis.title}</h3>
        <div className="text-sm text-gray-600">
          Estado actual del sistema
        </div>
      </div>
      
      <div className="space-y-8">
        {/* ✅ ESTADO DE USUARIOS REGISTRADOS */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">{labels.registrationAnalysis.userStatus.title}</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Usuarios Activos */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{analysis.usersByStatus.active}</div>
                  <div className="text-sm text-green-700">{labels.activeUsers.status.active}</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {analysis.totalUsers > 0 ? Math.round((analysis.usersByStatus.active / analysis.totalUsers) * 100) : 0}% del total
              </div>
            </div>
            
            {/* Usuarios Inactivos */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{analysis.usersByStatus.inactive}</div>
                  <div className="text-sm text-gray-700">{labels.activeUsers.status.inactive}</div>
                </div>
                <div className="text-gray-500">
                  <i className="fas fa-pause-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-gray-600">
                {analysis.totalUsers > 0 ? Math.round((analysis.usersByStatus.inactive / analysis.totalUsers) * 100) : 0}% del total
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ ESTADO DE SOLICITUDES DE REGISTRO */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">{labels.registrationAnalysis.requestStatus.title}</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            {/* Pendientes */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{analysis.requestsByStatus.pending}</div>
                  <div className="text-xs sm:text-sm text-yellow-700">{labels.registrationAnalysis.requestStatus.pending}</div>
                </div>
                <div className="text-yellow-500">
                  <i className="fas fa-clock text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-yellow-600">
                {labels.registrationAnalysis.requestStatus.requireReview}
              </div>
            </div>
            
            {/* Aprobadas */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{analysis.requestsByStatus.approved}</div>
                  <div className="text-xs sm:text-sm text-green-700">{labels.registrationAnalysis.requestStatus.approved}</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {labels.registrationAnalysis.requestStatus.created}
              </div>
            </div>
            
            {/* Rechazadas */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{analysis.requestsByStatus.rejected}</div>
                  <div className="text-sm text-red-700">{labels.registrationAnalysis.requestStatus.rejected}</div>
                </div>
                <div className="text-red-500">
                  <i className="fas fa-times text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600">
                {labels.registrationAnalysis.requestStatus.notProcessed}
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ DISTRIBUCIÓN POR TIPO DE PLAN SOLICITADO */}
        <div>
          <h4 className="font-medium text-gray-800 mb-4">{labels.registrationAnalysis.planRequests.title}</h4>
          <div className="space-y-3">
            {/* Planes Familiares */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">{labels.registrationAnalysis.planRequests.familiar}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-blue-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.familiar / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.familiar}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.familiar / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
            
            {/* Planes Corporativos */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">{labels.registrationAnalysis.planRequests.corporate}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-green-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.corporativo / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.corporativo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.corporativo / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
            
            {/* Planes Externos */}
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">{labels.registrationAnalysis.planRequests.external}</div>
              <div className="flex-1 relative">
                <div className="w-full bg-gray-200 rounded-full h-6">
                  <div 
                    className="h-6 rounded-full bg-purple-500 flex items-center justify-end px-2 transition-all duration-500"
                    style={{ 
                      width: `${analysis.totalRequests > 0 ? Math.max((analysis.requestsByType.externo / analysis.totalRequests) * 100, 5) : 0}%` 
                    }}
                  >
                    <span className="text-white text-xs font-semibold">
                      {analysis.requestsByType.externo}
                    </span>
                  </div>
                </div>
              </div>
              <div className="w-12 text-right text-sm font-semibold text-gray-600">
                {analysis.totalRequests > 0 ? Math.round((analysis.requestsByType.externo / analysis.totalRequests) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>
        
        {/* ✅ ALERTAS Y RECOMENDACIONES */}
        {analysis.requestsByStatus.pending > 0 && (
          <div className="bg-amber-50 border-l-4 border-amber-400 rounded-r-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-amber-600 mr-3"></i>
              <div>
                <h5 className="font-medium text-amber-800">Acción Requerida</h5>
                <p className="text-sm text-amber-700 mt-1">
                  Hay {analysis.requestsByStatus.pending} solicitud(es) de registro pendiente(s) que requieren revisión.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// UserActivityChart eliminado por solicitud del usuario

const ActiveUsersTable = ({ dateRange, filterType }) => {
  const { allUsers, transactions } = useAppStore()
  
  // ✅ CALCULAR USUARIOS MÁS ACTIVOS DESDE DATOS REALES
  const getActiveUsers = () => {
    let usersData = []
    
    // Analizar usuarios familiares
    if (allUsers.familiar && filterType !== 'corporativo') {
      allUsers.familiar.forEach(user => {
        const serviceUsage = calculateUserActivity(user, 'familiar')
        if (serviceUsage.totalUsed > 0 || filterType === 'all') {
          usersData.push({
            id: user.id,
            name: user.profile?.name || user.name || 'Usuario',
            type: 'Familiar',
            plan: user.plan?.name || user.plan?.subtype || labels.activeUsers.noPlan,
            servicesUsed: serviceUsage.totalUsed,
            servicesRemaining: serviceUsage.totalRemaining,
            utilizationRate: serviceUsage.utilizationRate,
            lastActivity: serviceUsage.lastActivity || 'Sin actividad',
            status: user.plan?.status || 'active',
            memberSince: user.profile?.memberSince || user.memberSince || new Date().toISOString()
          })
        }
      })
    }
    
    // Analizar usuarios corporativos
    if (allUsers.corporativo && filterType !== 'familiar') {
      allUsers.corporativo.forEach(user => {
        const serviceUsage = calculateUserActivity(user, 'corporativo')
        if (serviceUsage.totalUsed > 0 || filterType === 'all') {
          usersData.push({
            id: user.id,
            name: user.company?.name || user.profile?.name || 'Empresa',
            type: 'Corporativo',
            plan: 'Área Protegida',
            servicesUsed: serviceUsage.totalUsed,
            servicesRemaining: serviceUsage.totalRemaining,
            utilizationRate: serviceUsage.utilizationRate,
            lastActivity: serviceUsage.lastActivity || 'Sin actividad',
            status: user.plan?.status || 'active',
            memberSince: user.plan?.start_date || new Date().toISOString(),
            employees: user.company?.employees_count || 0
          })
        }
      })
    }
    
    // Ordenar por servicios usados (más activos primero)
    return usersData
      .sort((a, b) => b.servicesUsed - a.servicesUsed)
      .slice(0, 20) // Top 20 usuarios más activos
  }
  
  const activeUsers = getActiveUsers()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.activeUsers.title}</h3>
        <div className="text-sm text-gray-600">
          {labels.districtAnalysis.filters.label} <span className="font-medium">{filterType === 'all' ? labels.districtAnalysis.filters.all : filterType}</span>
        </div>
      </div>
      
      {activeUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">{labels.activeUsers.headers.user}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{labels.activeUsers.headers.type}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{labels.activeUsers.headers.plan}</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">{labels.planAnalysis.headers.servicesUsed}</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">{labels.planAnalysis.headers.utilization}</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">{labels.activeUsers.headers.status}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">{labels.activeUsers.headers.memberSince}</th>
              </tr>
            </thead>
            <tbody>
              {activeUsers.map((user, index) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-semibold ${
                        user.type === 'Familiar' ? 'bg-blue-500' : 'bg-green-500'
                      }`}>
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium text-gray-800">{user.name}</div>
                        {user.employees > 0 && (
                          <div className="text-xs text-gray-500">{labels.planAnalysis.stats.employees.replace('{count}', user.employees)}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.type === 'Familiar' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'
                    }`}>
                      {user.type}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">{user.plan}</td>
                  <td className="py-3 px-4 text-center">
                    <div className="font-semibold text-gray-800">{user.servicesUsed}</div>
                    <div className="text-xs text-gray-500">de {user.servicesUsed + user.servicesRemaining}</div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                        <div 
                          className={`h-2 rounded-full ${
                            user.utilizationRate >= 80 ? 'bg-red-500' :
                            user.utilizationRate >= 60 ? 'bg-yellow-500' :
                            'bg-green-500'
                          }`}
                          style={{ width: `${Math.min(user.utilizationRate, 100)}%` }}
                        ></div>
                      </div>
                      <span className="text-xs font-semibold">{user.utilizationRate}%</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.status === 'active' ? labels.activeUsers.status.active : labels.activeUsers.status.inactive}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-600">
                    {new Date(user.memberSince).toLocaleDateString('es-ES')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-user-clock text-4xl mb-2"></i>
          <h4 className="text-lg font-medium mb-2">No hay usuarios activos</h4>
          <p className="text-sm">{labels.activeUsers.empty}</p>
        </div>
      )}
      
      {activeUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {activeUsers.reduce((sum, user) => sum + user.servicesUsed, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{labels.serviceUtilization.distribution}</div>
          </div>
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-green-600">
              {Math.round(activeUsers.reduce((sum, user) => sum + user.utilizationRate, 0) / activeUsers.length)}%
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Utilización Promedio</div>
          </div>
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-gray-800">
              {activeUsers.filter(user => user.status === 'active').length}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">{labels.activeUsers.status.active}</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Más componentes placeholder simplificados
const ServiceMetricCard = ({ title, total, completed, inProgress, icon, color }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <div className="flex items-center justify-between mb-4">
      <i className={`${icon} text-2xl text-${color}-600`}></i>
      <span className="text-sm text-gray-500">{title}</span>
    </div>
    <div className="space-y-2">
      <div className="flex justify-between">
        <span>Total:</span>
        <span className="font-bold">{total}</span>
      </div>
      <div className="flex justify-between">
        <span>Completados:</span>
        <span className="font-bold text-green-600">{completed}</span>
      </div>
      <div className="flex justify-between">
        <span>En progreso:</span>
        <span className="font-bold text-blue-600">{inProgress}</span>
      </div>
    </div>
  </div>
)

const ServiceTypeDistribution = () => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución por Tipo</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Gráfico circular de distribución</span>
    </div>
  </div>
)

const ResponseTimeChart = ({ dateRange }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.responseTime.times}</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Gráfico de tiempos de respuesta</span>
    </div>
  </div>
)

const HourlyServiceAnalysis = ({ dateRange }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis por Horarios</h3>
    <div className="h-48 flex items-center justify-center bg-gray-50 rounded-lg">
      <span className="text-gray-500">Análisis de servicios por hora del día</span>
    </div>
  </div>
)

// FinancialCard eliminado - ahora en RevenueManagement

// Componentes financieros eliminados - funcionalidad fusionada en RevenueManagement

const PerformanceMetric = ({ title, value, target, status, subtitle }) => {
  const statusColors = {
    excellent: 'bg-green-50 border-green-200 text-green-600',
    good: 'bg-blue-50 border-blue-200 text-blue-600',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    critical: 'bg-red-50 border-red-200 text-red-600'
  }

  return (
    <div className={`border rounded-xl p-4 sm:p-6 ${statusColors[status]}`}>
      <h4 className="font-medium text-gray-800 mb-2 text-sm sm:text-base">{title}</h4>
      <div className="text-xl sm:text-2xl font-bold mb-1">{value}</div>
      <div className="text-xs sm:text-sm opacity-75 mb-1">Objetivo: {target}</div>
      {subtitle && (
        <div className="text-xs opacity-60">{subtitle}</div>
      )}
    </div>
  )
}

const ResponseTimeAnalysis = ({ dateRange, responseTime, activeEmergencies }) => {
  // Calcular distribución de tiempos de respuesta usando datos reales
  const calculateTimeDistribution = () => {
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    
    if (completedEmergencies.length === 0) {
      return {
        ranges: [],
        summary: 'Sin datos de emergencias completadas',
        stats: { total: 0, avgTime: 0, minTime: 0, maxTime: 0 }
      }
    }
    
    const ranges = [
      { label: '< 5 min', min: 0, max: 5, count: 0, color: 'bg-green-500', emergencies: [] },
      { label: '5-10 min', min: 5, max: 10, count: 0, color: 'bg-blue-500', emergencies: [] },
      { label: '10-15 min', min: 10, max: 15, count: 0, color: 'bg-yellow-500', emergencies: [] },
      { label: '> 15 min', min: 15, max: 100, count: 0, color: 'bg-red-500', emergencies: [] }
    ]
    
    // Usar tiempos reales de respuesta del mockdata
    const responseTimes = []
    completedEmergencies.forEach(emergency => {
      const responseTime = emergency.responseTimeMinutes
      if (responseTime !== undefined && responseTime !== null) {
        responseTimes.push(responseTime)
        
        // Clasificar en rangos
        for (const range of ranges) {
          if (responseTime >= range.min && (range.max === 100 || responseTime < range.max)) {
            range.count++
            range.emergencies.push({
              id: emergency.id,
              type: emergency.type,
              location: emergency.location?.address || 'Ubicación no disponible',
              time: responseTime,
              unit: emergency.assignedUnit?.name || 'Unidad no especificada'
            })
            break
          }
        }
      }
    })
    
    const total = completedEmergencies.length
    const fastResponses = ranges[0].count + ranges[1].count
    const averageTime = responseTimes.length > 0 
      ? Math.round(responseTimes.reduce((sum, time) => sum + time, 0) / responseTimes.length * 10) / 10
      : 0
    const minTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
    const maxTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0
    
    const summary = total > 0 
      ? labels.responseTime.percentage.replace('{percentage}', Math.round((fastResponses / total) * 100))
      : 'No hay datos disponibles'
    
    return { 
      ranges, 
      summary, 
      total,
      stats: { avgTime: averageTime, minTime, maxTime, responseTimes }
    }
  }
  
  const distribution = calculateTimeDistribution()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.responseTime.title}</h3>
        <div className="text-sm text-gray-600">
          {labels.responseTime.average}: {responseTime.value}
        </div>
      </div>
      
      {distribution.ranges.length > 0 ? (
        <div className="space-y-4">
          {/* Estadísticas principales */}
          <div className="grid grid-cols-4 gap-3 mb-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-lg font-bold text-blue-600">{distribution.stats.avgTime}min</div>
              <div className="text-xs text-blue-700">{labels.responseTime.average}</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg border border-green-200">
              <div className="text-lg font-bold text-green-600">{distribution.stats.minTime}min</div>
              <div className="text-xs text-green-700">{labels.responseTime.minimum}</div>
            </div>
            <div className="text-center p-3 bg-red-50 rounded-lg border border-red-200">
              <div className="text-lg font-bold text-red-600">{distribution.stats.maxTime}min</div>
              <div className="text-xs text-red-700">{labels.responseTime.maximum}</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg border border-purple-200">
              <div className="text-lg font-bold text-purple-600">{distribution.total}</div>
              <div className="text-xs text-purple-700">{labels.responseTime.total}</div>
            </div>
          </div>

          {/* Distribución visual */}
          <div className="space-y-3">
            {distribution.ranges.map((range, index) => {
              const percentage = distribution.total > 0 ? (range.count / distribution.total) * 100 : 0
              return (
                <div key={index} className="bg-gray-50 rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <div className={`w-4 h-4 rounded ${range.color}`}></div>
                      <span className="text-sm font-medium text-gray-800">{range.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-sm font-semibold text-gray-800">{range.count}</span>
                      <span className="text-xs text-gray-500 ml-1">({Math.round(percentage)}%)</span>
                    </div>
                  </div>
                  
                  {/* Barra de progreso */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`${range.color} h-2 rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(percentage, 2)}%` }}
                    ></div>
                  </div>
                  
                  {/* Detalles de emergencias */}
                  {range.emergencies.length > 0 && (
                    <div className="space-y-1">
                      {range.emergencies.slice(0, 2).map((emergency, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs text-gray-600">
                          <div className="flex items-center space-x-2">
                            <span className={`px-1 py-0.5 rounded text-xs font-medium ${
                              emergency.type === 'sos' ? 'bg-red-100 text-red-700' :
                              emergency.type === 'medical' ? 'bg-blue-100 text-blue-700' :
                              'bg-yellow-100 text-yellow-700'
                            }`}>
                              {emergency.type.toUpperCase()}
                            </span>
                            <span className="truncate max-w-32">{emergency.location}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{emergency.time}min</span>
                            <span className="text-gray-500">{emergency.unit.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))}
                      {range.emergencies.length > 2 && (
                        <div className="text-xs text-gray-500 text-center">
                          +{range.emergencies.length - 2} más emergencias
                        </div>
                      )}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
          
          {/* Análisis por tipo de emergencia */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border border-blue-200">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-blue-800">Análisis por Tipo</h4>
              <i className="fas fa-chart-pie text-blue-600"></i>
            </div>
            
            <div className="grid grid-cols-3 gap-3 text-center">
              {['sos', 'medical', 'urgency'].map(type => {
                const typeEmergencies = activeEmergencies?.filter(e => e.type === type && e.status === 'completed') || []
                const avgTimeForType = typeEmergencies.length > 0 
                  ? Math.round(typeEmergencies.reduce((sum, e) => sum + (e.responseTimeMinutes || 0), 0) / typeEmergencies.length * 10) / 10
                  : 0
                
                const typeColor = type === 'sos' ? 'text-red-600' : type === 'medical' ? 'text-blue-600' : 'text-yellow-600'
                
                return (
                  <div key={type} className="bg-white rounded-lg p-2 border border-blue-100">
                    <div className={`text-lg font-bold ${typeColor}`}>{avgTimeForType}min</div>
                    <div className="text-xs text-gray-600 uppercase">{type}</div>
                    <div className="text-xs text-gray-500">({typeEmergencies.length})</div>
                  </div>
                )
              })}
            </div>
          </div>
          
          {/* Resumen */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">{distribution.summary}</p>
                <p className="text-xs text-green-700 mt-1">
                  Basado en {distribution.total} emergencias completadas
                  {distribution.stats.responseTimes.length > 0 && (
                    <span> • {labels.emergencyDensity.averageTime.replace('{time}', distribution.stats.avgTime)}</span>
                  )}
                </p>
              </div>
              <i className="fas fa-check-circle text-green-500 text-xl"></i>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <i className="fas fa-clock text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 text-sm">{distribution.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const UnitUtilizationChart = ({ dateRange, ambulanceUsers, utilization }) => {
  // Calcular estado detallado de unidades
  const calculateDetailedUtilization = () => {
    if (!ambulanceUsers || ambulanceUsers.length === 0) {
      return {
        statusBreakdown: [],
        summary: 'No hay unidades registradas'
      }
    }
    
    const statusCounts = {
      available: { count: 0, label: 'Disponible', color: 'bg-green-500', icon: 'fas fa-check-circle' },
      en_route: { count: 0, label: 'En Ruta', color: 'bg-blue-500', icon: 'fas fa-route' },
      busy: { count: 0, label: 'Ocupada', color: 'bg-yellow-500', icon: 'fas fa-ambulance' },
      off_duty: { count: 0, label: 'Fuera de Servicio', color: 'bg-gray-500', icon: 'fas fa-pause-circle' },
      maintenance: { count: 0, label: 'Mantenimiento', color: 'bg-red-500', icon: 'fas fa-tools' }
    }
    
    ambulanceUsers.forEach(unit => {
      const status = unit.currentStatus || 'off_duty'
      if (statusCounts[status]) {
        statusCounts[status].count++
      } else {
        statusCounts.off_duty.count++
      }
    })
    
    const statusBreakdown = Object.entries(statusCounts)
      .map(([key, data]) => ({ ...data, status: key }))
      .filter(item => item.count > 0)
    
    const totalUnits = ambulanceUsers.length
    const activeUnits = statusCounts.available.count + statusCounts.en_route.count + statusCounts.busy.count
    const summary = `${activeUnits}/${totalUnits} unidades operativas`
    
    return { statusBreakdown, summary, totalUnits }
  }
  
  const details = calculateDetailedUtilization()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Utilización de Unidades</h3>
        <div className="text-sm text-gray-600">
          Disponibilidad: {utilization.value}
        </div>
      </div>
      
      {details.statusBreakdown.length > 0 ? (
        <div className="space-y-4">
          {/* Estado de unidades */}
          <div className="space-y-3">
            {details.statusBreakdown.map((status, index) => {
              const percentage = details.totalUnits > 0 ? (status.count / details.totalUnits) * 100 : 0
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <i className={`${status.icon} text-gray-600 w-4`}></i>
                    <span className="text-sm font-medium w-32">{status.label}</span>
                  </div>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`${status.color} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div className="w-20 text-right">
                    <span className="text-sm font-semibold">{status.count} unidades</span>
                    <div className="text-xs text-gray-500">({Math.round(percentage)}%)</div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {/* Resumen operativo */}
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">{details.summary}</p>
                <p className="text-xs text-green-600 mt-1">
                  Utilización actual: {utilization.utilization}% ({details.statusBreakdown.find(s => s.status === 'busy')?.count || 0} ocupadas)
                </p>
              </div>
              <i className="fas fa-ambulance text-green-500 text-xl"></i>
            </div>
          </div>
          
          {/* Detalles adicionales */}
          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{details.totalUnits}</p>
              <p className="text-xs text-gray-600">Total Unidades</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{utilization.activeUnits}</p>
              <p className="text-xs text-gray-600">Operativas</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">{details.statusBreakdown.find(s => s.status === 'busy')?.count || 0}</p>
              <p className="text-xs text-gray-600">En Servicio</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-32 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <i className="fas fa-ambulance text-gray-400 text-2xl mb-2"></i>
            <p className="text-gray-500 text-sm">{details.summary}</p>
          </div>
        </div>
      )}
    </div>
  )
}

const PerformanceAlerts = ({ responseTime, satisfaction, unitUtilization }) => {
  // Generar alertas dinámicas basadas en métricas reales
  const generateAlerts = () => {
    const alerts = []
    
    // Alerta de tiempo de respuesta
    if (responseTime.status === 'critical') {
      alerts.push({
        level: 'critical',
        icon: 'fas fa-exclamation-triangle',
        title: labels.alerts.responseTimeCritical.title,
        message: labels.alerts.responseTimeCritical.description.replace('{district}', `Promedio actual: ${responseTime.value}`),
        color: 'red'
      })
    } else if (responseTime.status === 'warning') {
      alerts.push({
        level: 'warning', 
        icon: 'fas fa-clock',
        title: labels.alerts.responseTimeHigh.title,
        message: labels.alerts.responseTimeHigh.description.replace('{district}', `Promedio actual: ${responseTime.value}`),
        color: 'yellow'
      })
    }
    
    // Alerta de satisfacción
    if (satisfaction.status === 'critical' || satisfaction.status === 'warning') {
      alerts.push({
        level: satisfaction.status,
        icon: 'fas fa-thumbs-down',
        title: 'Satisfacción por debajo del objetivo',
        message: satisfaction.count > 0 
          ? `${satisfaction.value} (${satisfaction.stars}⭐) basado en ${satisfaction.count} encuestas`
          : 'No hay suficientes encuestas para evaluar',
        color: satisfaction.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    // Alerta de disponibilidad de unidades
    if (unitUtilization.status === 'critical' || unitUtilization.status === 'warning') {
      alerts.push({
        level: unitUtilization.status,
        icon: 'fas fa-ambulance',
        title: labels.alerts.unitsLow.title,
        message: labels.alerts.unitsLow.description.replace('{active}', unitUtilization.activeUnits).replace('{total}', unitUtilization.totalUnits),
        color: unitUtilization.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    
    return alerts
  }
  
  const alerts = generateAlerts()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.alerts.title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            alerts.length === 0 ? 'bg-green-100 text-green-800' :
            alerts.some(a => a.level === 'critical') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {alerts.length === 0 ? labels.alerts.allGood.title : 
             alerts.some(a => a.level === 'critical') ? labels.alerts.critical : labels.alerts.warning}
          </span>
        </div>
      </div>
      
      <div className="space-y-3">
        {alerts.length > 0 ? (
          alerts.map((alert, index) => (
            <div 
              key={index} 
              className={`bg-${alert.color}-50 border-l-4 border-${alert.color}-400 p-4`}
            >
              <div className="flex">
                <i className={`${alert.icon} text-${alert.color}-400 mr-3 mt-1`}></i>
                <div>
                  <h4 className={`font-medium text-${alert.color}-800`}>{alert.title}</h4>
                  <p className={`text-${alert.color}-700 text-sm`}>{alert.message}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-green-50 border-l-4 border-green-400 p-4">
            <div className="flex">
              <i className="fas fa-check-circle text-green-400 mr-3 mt-1"></i>
              <div>
                <h4 className="font-medium text-green-800">{labels.alerts.allGood.message}</h4>
                <p className="text-green-700 text-sm">
                  {labels.alerts.allGood.description}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
      {/* Resumen de estado */}
      <div className="mt-4 pt-4 border-t">
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              responseTime.status === 'excellent' || responseTime.status === 'good' ? 'bg-green-100 text-green-800' :
              responseTime.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-clock mr-1"></i>
              {responseTime.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">{labels.responseTime.times}</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              satisfaction.status === 'excellent' || satisfaction.status === 'good' ? 'bg-green-100 text-green-800' :
              satisfaction.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-star mr-1"></i>
              {satisfaction.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">Satisfacción</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              unitUtilization.status === 'excellent' || unitUtilization.status === 'good' ? 'bg-green-100 text-green-800' :
              unitUtilization.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-ambulance mr-1"></i>
              {unitUtilization.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">Disponibilidad</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const UnifiedDistrictAnalysis = ({ dateRange }) => {
  const { allUsers, activeEmergencies } = useAppStore()
  
  // Combinar datos de servicios solicitados y estadísticas por región
  const getUnifiedDistrictData = () => {
    // Datos base de servicios (mock)
    const servicesData = [
      { name: 'Miraflores', services: 487, trend: '+8%', icon: 'fas fa-trophy text-yellow-500' },
      { name: 'San Isidro', services: 423, trend: '+15%', icon: 'fas fa-medal text-gray-400' },
      { name: 'Surco', services: 398, trend: '+5%', icon: 'fas fa-award text-orange-500' },
      { name: 'San Borja', services: 342, trend: '+12%', icon: '' },
      { name: 'La Molina', services: 289, trend: '+3%', icon: '' },
      { name: 'Barranco', services: 245, trend: '+10%', icon: '' },
      { name: 'Jesús María', services: 198, trend: '-2%', icon: '' },
      { name: 'Magdalena', services: 176, trend: '+7%', icon: '' },
      { name: 'Lince', services: 143, trend: '+6%', icon: '' }
    ]
    
    // Datos de estadísticas dinámicas
    const regionStats = {
      'Miraflores': { users: 0, emergencies: 0, responseTime: 7 },
      'San Isidro': { users: 0, emergencies: 0, responseTime: 8 },
      'Surco': { users: 0, emergencies: 0, responseTime: 12 },
      'San Borja': { users: 0, emergencies: 0, responseTime: 10 },
      'La Molina': { users: 0, emergencies: 0, responseTime: 11 },
      'Barranco': { users: 0, emergencies: 0, responseTime: 9 },
      'Jesús María': { users: 0, emergencies: 0, responseTime: 9 },
      'Magdalena': { users: 0, emergencies: 0, responseTime: 11 },
      'Lince': { users: 0, emergencies: 0, responseTime: 10 }
    }
    
    // Calcular emergencias completadas por distrito
    activeEmergencies?.filter(e => e.status === 'completed').forEach(emergency => {
      const location = emergency.location?.address || ''
      Object.keys(regionStats).forEach(district => {
        if (location.includes(district)) {
          regionStats[district].emergencies++
        }
      })
    })
    
    // Calcular distribución de usuarios
    const allUsersList = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ]
    
    const userDistribution = {
      'Miraflores': Math.floor(allUsersList.length * 0.10),
      'San Isidro': Math.floor(allUsersList.length * 0.12),
      'Surco': Math.floor(allUsersList.length * 0.18),
      'San Borja': Math.floor(allUsersList.length * 0.08),
      'La Molina': Math.floor(allUsersList.length * 0.09),
      'Barranco': Math.floor(allUsersList.length * 0.05),
      'Jesús María': Math.floor(allUsersList.length * 0.15),
      'Magdalena': Math.floor(allUsersList.length * 0.06),
      'Lince': Math.floor(allUsersList.length * 0.07)
    }
    
    Object.keys(regionStats).forEach(district => {
      regionStats[district].users = userDistribution[district] || 0
    })
    
    // Combinar datos
    const unifiedData = servicesData.map(service => {
      const stats = regionStats[service.name] || { users: 0, emergencies: 0, responseTime: 10 }
      return {
        ...service,
        ...stats,
        percentage: 0 // Se calculará después
      }
    })
    
    // Calcular porcentajes de servicios
    const totalServices = unifiedData.reduce((sum, d) => sum + d.services, 0)
    unifiedData.forEach(district => {
      district.percentage = totalServices > 0 ? Math.round((district.services / totalServices) * 100 * 10) / 10 : 0
    })
    
    return unifiedData.sort((a, b) => b.services - a.services)
  }
  
  const districtData = getUnifiedDistrictData()
  const totalServices = districtData.reduce((sum, d) => sum + d.services, 0)
  const totalUsers = districtData.reduce((sum, d) => sum + d.users, 0)
  const totalEmergencies = districtData.reduce((sum, d) => sum + d.emergencies, 0)
  const avgResponseTime = districtData.reduce((sum, d) => sum + d.responseTime, 0) / districtData.length

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">{labels.districtAnalysis.title}</h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            <span className="hidden sm:inline">{labels.districtAnalysis.subtitle}</span>
            <span className="sm:hidden">{labels.districtAnalysis.overview}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2" title="Descargar">
            <i className="fas fa-download text-sm sm:text-base"></i>
          </button>
          <button className="text-gray-600 hover:text-gray-800 transition-colors p-2" title="Expandir">
            <i className="fas fa-expand text-sm sm:text-base"></i>
          </button>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3">
        {districtData.slice(0, 8).map((district, index) => {
          const responseColor = district.responseTime <= 8 ? 'text-green-600' : 
                               district.responseTime <= 12 ? 'text-yellow-600' : 'text-red-600'
          
          return (
            <div 
              key={district.name} 
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer space-y-2 sm:space-y-0"
            >
              <div className="flex items-center space-x-3 sm:space-x-4 flex-1 min-w-0">
                <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center flex-shrink-0">
                  {district.icon ? (
                    <i className={`${district.icon} text-sm sm:text-base`}></i>
                  ) : (
                    <span className="text-base sm:text-lg font-bold text-gray-500">#{index + 1}</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">{district.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs">
                    <div className="truncate">
                      <span className="text-gray-600">Servicios: </span>
                      <span className="font-semibold text-blue-600">{district.services}</span>
                      <span className="text-gray-500 hidden sm:inline"> ({district.percentage}%)</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Usuarios: </span>
                      <span className="font-semibold text-purple-600">{district.users}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Emergencias: </span>
                      <span className="font-semibold text-orange-600">{district.emergencies}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600 hidden sm:inline">T. Respuesta: </span>
                      <span className="text-gray-600 sm:hidden">Resp: </span>
                      <span className={`font-semibold ${responseColor}`}>{district.responseTime}min</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between sm:justify-start sm:space-x-4 sm:ml-4">
                <div className="text-left sm:text-right">
                  <span className={`text-xs sm:text-sm font-medium ${
                    district.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'
                  }`}>
                    <i className={`fas fa-arrow-${district.trend.startsWith('+') ? 'up' : 'down'} mr-1`}></i>
                    {district.trend}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">tendencia</p>
                </div>
                
                <div className="w-16 sm:w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max((district.services / districtData[0].services) * 100, 5)}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-200">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-blue-600">{totalServices.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600">{labels.districtAnalysis.cards.totalServices}</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-purple-600">{totalUsers.toLocaleString()}</p>
            <p className="text-xs sm:text-sm text-gray-600">{labels.districtAnalysis.cards.totalUsers}</p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-orange-600">{totalEmergencies}</p>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Total Emergencias</span>
              <span className="sm:hidden">Emergencias</span>
            </p>
          </div>
          <div className="text-center">
            <p className="text-xl sm:text-2xl font-bold text-green-600">{Math.round(avgResponseTime)}min</p>
            <p className="text-xs sm:text-sm text-gray-600">
              <span className="hidden sm:inline">Promedio Respuesta</span>
              <span className="sm:hidden">Prom. Resp.</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}



// ========== FUNCIONES DE CÁLCULO DINÁMICAS ==========

// Calcular satisfacción promedio desde encuestas reales
const calculateSatisfactionRating = (surveyResponses) => {
  if (!surveyResponses || surveyResponses.length === 0) return 0
  
  const totalRating = surveyResponses.reduce((sum, response) => {
    // response.average contiene el promedio de estrellas de cada encuesta
    return sum + parseFloat(response.average || 0)
  }, 0)
  
  return (totalRating / surveyResponses.length).toFixed(1)
}

// Calcular utilización de servicios desde datos reales
const calculateServiceUtilization = (familiarUsers, corporateUsers) => {
  let totalUsed = 0
  let totalAvailable = 0
  let activePlans = 0
  
  // Analizar usuarios familiares
  familiarUsers.forEach(user => {
    if (user.plan?.status === 'active' || !user.plan?.status) {
      activePlans++
      
      if (user.plan?.subtype === 'HELP') {
        const total = user.plan.total_services || 10
        const remaining = user.service_usage?.current_period?.remaining_services || 0
        totalUsed += (total - remaining)
        totalAvailable += total
      } else if (user.service_usage?.current_period?.breakdown) {
        // Otros planes familiares con breakdown por servicio
        const breakdown = user.service_usage.current_period.breakdown
        Object.values(breakdown).forEach(service => {
          if (typeof service === 'object' && service.limit) {
            if (service.limit === 'ILIMITADO') {
              // Para servicios ilimitados, no contar en disponibilidad
              totalUsed += service.used || 0
            } else {
              totalUsed += service.used || 0
              totalAvailable += service.limit
            }
          }
        })
      }
    }
  })
  
  // Analizar usuarios corporativos
  corporateUsers.forEach(user => {
    if (user.plan?.status === 'active' || !user.plan?.status) {
      activePlans++
      const used = user.service_usage?.current_period?.used_services || 0
      const total = user.plan?.contract_services || user.company?.contracted_services || 50
      totalUsed += used
      totalAvailable += total
    }
  })
  
  return {
    activePlans,
    utilizationRate: totalAvailable > 0 ? Math.round((totalUsed / totalAvailable) * 100) : 0,
    totalUsed,
    totalAvailable
  }
}

// Calcular distribución de usuarios por tipo
const calculateUserDistribution = (allUsers, includeAmbulance = false) => {
  const distribution = {
    familiar: allUsers.familiar?.length || 0,
    corporativo: allUsers.corporativo?.length || 0,
    externo: allUsers.externo?.length || 0,
    admin: allUsers.admin?.length || 0
  }
  
  // Incluir ambulancias si se especifica
  if (includeAmbulance) {
    distribution.ambulancia = allUsers.ambulancia?.length || 0
  }
  
  return distribution
}

// Calcular ingresos por tipo de plan
const calculateRevenueByPlan = (allUsers) => {
  const revenueByPlan = {}
  
  // Analizar usuarios familiares
  if (allUsers.familiar) {
    allUsers.familiar.forEach(user => {
      const planName = user.plan?.name || labels.planAnalysis.plans.unknown
      const monthlyCost = user.billing?.monthly_cost || 0
      const annualRevenue = monthlyCost * 12
      
      if (!revenueByPlan[planName]) {
        revenueByPlan[planName] = 0
      }
      revenueByPlan[planName] += annualRevenue
    })
  }
  
  // Analizar usuarios corporativos
  if (allUsers.corporativo) {
    allUsers.corporativo.forEach(user => {
      const planName = user.plan?.name || 'Plan Corporativo'
      const monthlyCost = user.billing?.monthly_cost || 0
      const annualRevenue = monthlyCost * 12
      
      if (!revenueByPlan[planName]) {
        revenueByPlan[planName] = 0
      }
      revenueByPlan[planName] += annualRevenue
    })
  }
  
  return revenueByPlan
}

// Calcular resumen de planes para la tabla
const calculatePlanSummary = (allUsers) => {
  const summary = []
  
  // Analizar usuarios familiares agrupados por plan
  const familiarPlans = {}
  if (allUsers.familiar) {
    allUsers.familiar.forEach(user => {
      const planType = user.plan?.subtype || 'UNKNOWN'
      const planName = user.plan?.name || `Plan ${planType}`
      
      if (!familiarPlans[planName]) {
        familiarPlans[planName] = {
          users: 0,
          totalServices: 0,
          usedServices: 0,
          revenue: 0
        }
      }
      
      familiarPlans[planName].users++
      familiarPlans[planName].revenue += (user.billing?.monthly_cost || 0) * 12
      
      // Calcular servicios usados según el tipo de plan
      if (user.plan?.subtype === 'HELP') {
        const total = user.plan.total_services || 10
        const remaining = user.service_usage?.current_period?.remaining_services || 0
        familiarPlans[planName].totalServices += total
        familiarPlans[planName].usedServices += (total - remaining)
      } else if (user.service_usage?.current_period?.breakdown) {
        const breakdown = user.service_usage.current_period.breakdown
        Object.values(breakdown).forEach(service => {
          if (typeof service === 'object' && service.used) {
            familiarPlans[planName].usedServices += service.used
            if (service.limit && service.limit !== 'ILIMITADO') {
              familiarPlans[planName].totalServices += service.limit
            }
          }
        })
      }
    })
  }
  
  // Agregar planes familiares al resumen
  Object.entries(familiarPlans).forEach(([planName, data]) => {
    summary.push({
      type: planName,
      users: data.users,
      servicesUsed: data.usedServices,
      revenue: data.revenue,
      utilizationRate: data.totalServices > 0 ? Math.round((data.usedServices / data.totalServices) * 100) : 0
    })
  })
  
  // Analizar usuarios corporativos
  if (allUsers.corporativo && allUsers.corporativo.length > 0) {
    let corporateData = {
      users: 0,
      totalServices: 0,
      usedServices: 0,
      revenue: 0
    }
    
    allUsers.corporativo.forEach(user => {
      corporateData.users++
      corporateData.revenue += (user.billing?.monthly_cost || 0) * 12
      
      const used = user.service_usage?.current_period?.used_services || 0
      const total = user.plan?.contract_services || user.company?.contracted_services || 50
      
      corporateData.usedServices += used
      corporateData.totalServices += total
    })
    
    summary.push({
      type: 'Planes Corporativos',
      users: corporateData.users,
      servicesUsed: corporateData.usedServices,
      revenue: corporateData.revenue,
      utilizationRate: corporateData.totalServices > 0 ? Math.round((corporateData.usedServices / corporateData.totalServices) * 100) : 0
    })
  }
  
  // Analizar usuarios externos
  if (allUsers.externo && allUsers.externo.length > 0) {
    let externalData = {
      users: 0,
      totalServices: 0,
      usedServices: 0,
      revenue: 0
    }
    
    allUsers.externo.forEach(user => {
      externalData.users++
      // Los usuarios externos no tienen costos fijos regulares, son por servicio
      
      if (user.plan?.subtype === 'CASO_2') {
        const individual = 3 - (user.service_usage?.current_period?.individual_remaining || 0)
        externalData.usedServices += individual
        externalData.totalServices += 3
      }
      // CASO_1 no tiene límites, no se cuenta en servicios
    })
    
    summary.push({
      type: 'Usuarios Externos',
      users: externalData.users,
      servicesUsed: externalData.usedServices,
      revenue: externalData.revenue,
      utilizationRate: externalData.totalServices > 0 ? Math.round((externalData.usedServices / externalData.totalServices) * 100) : 0
    })
  }
  
  return summary.filter(item => item.users > 0) // Solo mostrar tipos con usuarios
}

// ========== COMPONENTES DE GRÁFICOS REALES ==========

// Gráfico de distribución de usuarios por tipo
const UserDistributionChart = ({ allUsers }) => {
  const { ambulanceUsers } = useAppStore()
  
  // Incluir usuarios ambulancia en allUsers para el cálculo
  const allUsersWithAmbulance = {
    ...allUsers,
    ambulancia: ambulanceUsers || []
  }
  
  const distribution = calculateUserDistribution(allUsersWithAmbulance, true)
  const total = Object.values(distribution).reduce((sum, count) => sum + count, 0)
  
  const chartData = Object.entries(distribution)
    .filter(([_, count]) => count > 0)
    .map(([type, count]) => ({
      type: type.charAt(0).toUpperCase() + type.slice(1),
      count,
      percentage: total > 0 ? Math.round((count / total) * 100) : 0,
      color: {
        familiar: 'bg-blue-500',
        corporativo: 'bg-green-500', 
        externo: 'bg-purple-500',
        admin: 'bg-red-500',
        ambulancia: 'bg-orange-500'
      }[type] || 'bg-gray-500'
    }))
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.userDistribution.title}</h3>
      
      {chartData.length > 0 ? (
        <>
          {/* Gráfico de barras simple */}
          <div className="space-y-4">
            {chartData.map((item, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-20 text-sm font-medium text-gray-700">
                  {item.type}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${item.color} flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ width: `${Math.max(item.percentage, 5)}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {item.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-600">
                  {item.percentage}%
                </div>
              </div>
            ))}
          </div>
          
          {/* Estadísticas */}
          <div className="mt-6 pt-4 border-t grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{total}</div>
              <div className="text-sm text-gray-600">{labels.districtAnalysis.cards.totalUsers}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">
                {chartData.length}
              </div>
              <div className="text-sm text-gray-600">{labels.userDistribution.byType}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-users text-4xl mb-2"></i>
          <p>No hay usuarios registrados</p>
        </div>
      )}
    </div>
  )
}

// Gráfico de utilización de servicios
const ServiceUtilizationChart = ({ utilization }) => {
  const getUtilizationColor = (rate) => {
    if (rate >= 90) return 'text-red-600 bg-red-100'
    if (rate >= 70) return 'text-yellow-600 bg-yellow-100' 
    if (rate >= 40) return 'text-green-600 bg-green-100'
    return 'text-blue-600 bg-blue-100'
  }
  
  const getUtilizationStatus = (rate) => {
    if (rate >= 90) return 'Crítica'
    if (rate >= 70) return 'Alta'
    if (rate >= 40) return 'Normal'
    return 'Baja'
  }
  
  const circumference = 2 * Math.PI * 45 // Radio de 45
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (utilization / 100) * circumference
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.serviceUtilization.title}</h3>
      
      <div className="flex items-center justify-center">
        {/* Gráfico circular */}
        <div className="relative">
          <svg className="transform -rotate-90 w-32 h-32">
            {/* Círculo de fondo */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200"
            />
            {/* Círculo de progreso */}
            <circle
              cx="64"
              cy="64"
              r="45"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={
                utilization >= 90 ? 'text-red-500' :
                utilization >= 70 ? 'text-yellow-500' :
                utilization >= 40 ? 'text-green-500' :
                'text-blue-500'
              }
              style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
            />
          </svg>
          {/* Porcentaje en el centro */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-gray-800">{utilization}%</div>
              <div className="text-xs text-gray-600">Utilizado</div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Estado y detalles */}
      <div className="mt-6 space-y-4">
        <div className="text-center">
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getUtilizationColor(utilization)}`}>
            Utilización {getUtilizationStatus(utilization)}
          </span>
        </div>
        
        <div className="grid grid-cols-3 gap-4 pt-4 border-t text-center">
          <div>
            <div className="text-lg font-bold text-green-600">{Math.max(0, 100 - utilization)}%</div>
            <div className="text-xs text-gray-600">Disponible</div>
          </div>
          <div>
            <div className="text-lg font-bold text-gray-800">{utilization}%</div>
            <div className="text-xs text-gray-600">En Uso</div>
          </div>
          <div>
            <div className="text-lg font-bold text-blue-600">100%</div>
            <div className="text-xs text-gray-600">Capacidad</div>
          </div>
        </div>
        
        {utilization >= 80 && (
          <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-center">
              <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
              <span className="text-sm text-yellow-800">
                Alta utilización de servicios. Considere ampliar capacidad.
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Calcular actividad de usuario individual
const calculateUserActivity = (user, userType) => {
  let totalUsed = 0
  let totalRemaining = 0
  let utilizationRate = 0
  let lastActivity = null
  
  if (userType === 'familiar') {
    if (user.plan?.subtype === 'HELP') {
      const total = user.plan.total_services || 10
      const remaining = user.service_usage?.current_period?.remaining_services || 0
      totalUsed = total - remaining
      totalRemaining = remaining
      utilizationRate = total > 0 ? Math.round((totalUsed / total) * 100) : 0
    } else if (user.service_usage?.current_period?.breakdown) {
      const breakdown = user.service_usage.current_period.breakdown
      Object.values(breakdown).forEach(service => {
        if (typeof service === 'object' && service.used) {
          totalUsed += service.used || 0
          if (service.limit && service.limit !== 'ILIMITADO') {
            totalRemaining += (service.limit - service.used) || 0
          }
        }
      })
      const totalLimit = totalUsed + totalRemaining
      utilizationRate = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
    }
  } else if (userType === 'corporativo') {
    totalUsed = user.service_usage?.current_period?.used_services || 0
    totalRemaining = user.service_usage?.current_period?.remaining_services || 0
    const totalLimit = user.plan?.contract_services || user.company?.contracted_services || 50
    utilizationRate = totalLimit > 0 ? Math.round((totalUsed / totalLimit) * 100) : 0
  }
  
  return {
    totalUsed,
    totalRemaining,
    utilizationRate,
    lastActivity
  }
}

// ========== COMPONENTES DE ANÁLISIS DE SERVICIOS REALES ==========

// Distribución de tipos de servicios con datos reales
const ServiceTypeDistributionReal = ({ serviceMetrics }) => {
  const totalServices = Object.values(serviceMetrics).reduce((sum, metric) => sum + (metric.total || 0), 0)
  
  const serviceData = Object.entries(serviceMetrics)
    .filter(([_, metric]) => metric.total > 0)
    .map(([type, metric]) => ({
      type: {
        emergencias: 'Emergencias',
        domicilio: 'Médico Domicilio',
        urgencias: 'Urgencias', 
        traslados: 'Traslados'
      }[type] || type,
      count: metric.total,
      percentage: totalServices > 0 ? Math.round((metric.total / totalServices) * 100) : 0,
      color: {
        emergencias: 'bg-red-500',
        domicilio: 'bg-blue-500',
        urgencias: 'bg-orange-500',
        traslados: 'bg-green-500'
      }[type] || 'bg-gray-500'
    }))

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.serviceUtilization.distribution}</h3>
      
      {serviceData.length > 0 ? (
        <>
          <div className="space-y-4">
            {serviceData.map((service, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-24 text-sm font-medium text-gray-700">
                  {service.type}
                </div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${service.color} flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ width: `${Math.max(service.percentage, 5)}%` }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {service.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-600">
                  {service.percentage}%
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 pt-4 border-t text-center">
            <div className="text-2xl font-bold text-gray-800">{totalServices}</div>
            <div className="text-sm text-gray-600">{labels.serviceUtilization.distribution}</div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-pie text-4xl mb-2"></i>
          <p>No hay servicios registrados</p>
        </div>
      )}
    </div>
  )
}

// Utilización de servicios por tipo de plan
const ServiceUtilizationByPlan = ({ allUsers }) => {
  const calculatePlanUtilization = () => {
    const planData = {}

    // Analizar usuarios familiares
    if (allUsers.familiar) {
      allUsers.familiar.forEach(user => {
        const planName = user.plan?.name || user.plan?.subtype || labels.planAnalysis.plans.unknown
        
        if (!planData[planName]) {
          planData[planName] = {
            users: 0,
            totalServices: 0,
            usedServices: 0,
            color: 'bg-blue-500'
          }
        }
        
        planData[planName].users++
        
        if (user.plan?.subtype === 'HELP') {
          const total = user.plan.total_services || 16
          const remaining = user.service_usage?.current_period?.remaining_services || 0
          planData[planName].totalServices += total
          planData[planName].usedServices += (total - remaining)
        } else if (user.service_usage?.current_period?.breakdown) {
          const breakdown = user.service_usage.current_period.breakdown
          Object.values(breakdown).forEach(service => {
            if (typeof service === 'object') {
              planData[planName].usedServices += service.used || 0
              if (service.limit && service.limit !== 'ILIMITADO') {
                planData[planName].totalServices += service.limit
              }
            }
          })
        }
      })
    }

    // Analizar usuarios corporativos
    if (allUsers.corporativo) {
      allUsers.corporativo.forEach(user => {
        const planName = 'Área Protegida'
        
        if (!planData[planName]) {
          planData[planName] = {
            users: 0,
            totalServices: 0,
            usedServices: 0,
            color: 'bg-green-500'
          }
        }
        
        planData[planName].users++
        planData[planName].usedServices += user.service_usage?.current_period?.used_services || 0
        planData[planName].totalServices += user.plan?.contract_services || user.company?.contracted_services || 50
      })
    }

    // Calcular utilización
    return Object.entries(planData).map(([name, data]) => ({
      name,
      users: data.users,
      utilizationRate: data.totalServices > 0 ? Math.round((data.usedServices / data.totalServices) * 100) : 0,
      usedServices: data.usedServices,
      totalServices: data.totalServices,
      color: data.color
    }))
  }

  const planUtilization = calculatePlanUtilization()

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.serviceUtilization.byPlan}</h3>
      
      {planUtilization.length > 0 ? (
        <div className="space-y-4">
          {planUtilization.map((plan, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="font-medium text-gray-800">{plan.name}</h4>
                  <div className="text-sm text-gray-600">{plan.users} usuario(s)</div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-gray-800">{plan.utilizationRate}%</div>
                  <div className="text-xs text-gray-600">Utilización</div>
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                <div 
                  className={`h-3 rounded-full ${
                    plan.utilizationRate >= 80 ? 'bg-red-500' :
                    plan.utilizationRate >= 60 ? 'bg-yellow-500' :
                    'bg-green-500'
                  } transition-all duration-500`}
                  style={{ width: `${Math.min(plan.utilizationRate, 100)}%` }}
                ></div>
              </div>
              
              <div className="flex justify-between text-xs text-gray-600">
                <span>{plan.usedServices} usados</span>
                <span>{plan.totalServices} total</span>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-chart-bar text-4xl mb-2"></i>
          <p>No hay datos de planes disponibles</p>
        </div>
      )}
    </div>
  )
}

// Análisis detallado de servicios por plan
const ServicesByPlanAnalysis = ({ allUsers }) => {
  // Función helper para determinar qué servicios están disponibles por plan
  const getAvailableServicesByPlan = (planName, planType) => {
    const availableServices = []
    
    if (planType === 'Familiar') {
      if (planName.includes('Help')) {
        // Plan Help solo usa servicios generales (mostrados como Emergencias)
        availableServices.push('EMERGENCIA')
      } else {
        // Otros planes familiares tienen servicios específicos
        availableServices.push('EMERGENCIA', 'URGENCIA', 'MEDICO_DOMICILIO', 'TRASLADO_PROGRAMADO')
      }
    } else if (planType === 'Corporativo') {
      // Planes corporativos solo emergencias
      availableServices.push('EMERGENCIA')
    }
    
    return availableServices
  }

  const calculateDetailedAnalysis = () => {
    const analysis = []

    // Analizar planes familiares
    if (allUsers.familiar) {
      const familiarPlans = {}
      
      allUsers.familiar.forEach(user => {
        const planType = user.plan?.subtype || 'UNKNOWN'
        const planName = user.plan?.name || `Plan ${planType}`
        
        if (!familiarPlans[planName]) {
          familiarPlans[planName] = {
            users: 0,
            services: {
              EMERGENCIA: { used: 0, limit: 0 },
              URGENCIA: { used: 0, limit: 0 },
              MEDICO_DOMICILIO: { used: 0, limit: 0 },
              TRASLADO_PROGRAMADO: { used: 0, limit: 0 }
            }
          }
        }
        
        familiarPlans[planName].users++
        
        if (user.plan?.subtype === 'HELP') {
          const total = user.plan.total_services || 16
          const remaining = user.service_usage?.current_period?.remaining_services || 0
          familiarPlans[planName].services.EMERGENCIA.used += (total - remaining)
          familiarPlans[planName].services.EMERGENCIA.limit += total
        } else if (user.service_usage?.current_period?.breakdown) {
          const breakdown = user.service_usage.current_period.breakdown
          Object.entries(breakdown).forEach(([serviceType, service]) => {
            if (typeof service === 'object' && familiarPlans[planName].services[serviceType]) {
              familiarPlans[planName].services[serviceType].used += service.used || 0
              if (service.limit && service.limit !== 'ILIMITADO') {
                familiarPlans[planName].services[serviceType].limit += service.limit
              }
            }
          })
        }
      })
      
      Object.entries(familiarPlans).forEach(([name, data]) => {
        analysis.push({
          planName: name,
          users: data.users,
          type: 'Familiar',
          services: data.services,
          availableServices: getAvailableServicesByPlan(name, 'Familiar')
        })
      })
    }

    // Analizar planes corporativos
    if (allUsers.corporativo && allUsers.corporativo.length > 0) {
      const corporateData = {
        users: allUsers.corporativo.length,
        services: {
          EMERGENCIA: { 
            used: allUsers.corporativo.reduce((sum, user) => sum + (user.service_usage?.current_period?.used_services || 0), 0),
            limit: allUsers.corporativo.reduce((sum, user) => sum + (user.plan?.contract_services || user.company?.contracted_services || 50), 0)
          }
        }
      }
      
      analysis.push({
        planName: 'Área Protegida',
        users: corporateData.users,
        type: 'Corporativo',
        services: corporateData.services,
        availableServices: getAvailableServicesByPlan('Área Protegida', 'Corporativo')
      })
    }

    return analysis
  }

  const detailedAnalysis = calculateDetailedAnalysis()

  // Obtener todas las columnas de servicios que se deben mostrar
  const getAllServiceColumns = () => {
    const allServices = new Set()
    detailedAnalysis.forEach(plan => {
      plan.availableServices.forEach(service => allServices.add(service))
    })
    return Array.from(allServices)
  }

  const serviceColumns = getAllServiceColumns()
  
  // Mapear nombres de servicios a headers legibles
  const serviceHeaders = {
    'EMERGENCIA': 'Emergencias',
    'URGENCIA': 'Urgencias', 
    'MEDICO_DOMICILIO': 'Domicilio',
    'TRASLADO_PROGRAMADO': 'Traslados'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.planAnalysis.title}</h3>
      
      {detailedAnalysis.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Usuarios</th>
                {serviceColumns.map(service => (
                  <th key={service} className="text-center py-3 px-4 font-medium text-gray-700">
                    {serviceHeaders[service]}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {detailedAnalysis.map((plan, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div>
                      <div className="font-medium text-gray-800">{plan.planName}</div>
                      <div className="text-xs text-gray-500">{plan.type}</div>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="font-semibold">{plan.users}</span>
                  </td>
                  {serviceColumns.map(service => {
                    // Solo mostrar la celda si el plan tiene este servicio disponible
                    if (plan.availableServices.includes(service)) {
                      const serviceData = plan.services[service]
                      const used = serviceData?.used || 0
                      const limit = serviceData?.limit || 0
                      
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <div className="text-sm">
                            <div className="font-semibold">{used}</div>
                            <div className="text-xs text-gray-500">
                              de {limit === 'ILIMITADO' ? '∞' : limit}
                            </div>
                          </div>
                        </td>
                      )
                    } else {
                      // Celda vacía para servicios no disponibles en este plan
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <div className="text-sm text-gray-400">
                            —
                          </div>
                        </td>
                      )
                    }
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-table text-4xl mb-2"></i>
          <p>No hay datos de servicios disponibles</p>
        </div>
      )}
    </div>
  )
}


const UnitDistributionMap = () => {
  const { ambulanceUsers } = useAppStore()
  
  const getZoneUnits = () => {
    const zones = {
      'Norte': { districts: ['Callao', 'San Miguel', 'Magdalena'], units: [], color: 'blue' },
      'Centro': { districts: ['Lima Centro', 'Lince', 'Jesús María'], units: [], color: 'green' },
      'Sur': { districts: ['San Isidro', 'Miraflores', 'Surco'], units: [], color: 'purple' }
    }
    
    ambulanceUsers?.forEach((unit, index) => {
      const unitId = unit.ambulance?.unit_id || unit.id
      const zoneNames = Object.keys(zones)
      const targetZone = zoneNames[index % zoneNames.length]
      zones[targetZone].units.push(unit)
    })
    
    return zones
  }
  
  const zoneData = getZoneUnits()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Unidades</h3>
      
      <div className="space-y-4">
        {Object.entries(zoneData).map(([zone, data]) => {
          const available = data.units.filter(u => u.currentStatus === 'available').length
          const total = data.units.length
          const percentage = total > 0 ? Math.round((available / total) * 100) : 0
          
          return (
            <div key={zone} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    data.color === 'blue' ? 'bg-blue-500' :
                    data.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}></div>
                  <h4 className="font-semibold text-gray-800">Zona {zone}</h4>
                </div>
                <div className="text-sm text-gray-600">
                  {available}/{total} disponibles
                </div>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-500 ${
                    data.color === 'blue' ? 'bg-blue-500' :
                    data.color === 'green' ? 'bg-green-500' : 'bg-purple-500'
                  }`}
                  style={{ width: `${Math.max(percentage, 5)}%` }}
                ></div>
              </div>
              
              <div className="text-xs text-gray-600">
                Cobertura: {data.districts.join(', ')}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

const ServiceCoverageMetrics = () => {
  const { allUsers, ambulanceUsers } = useAppStore()
  
  const calculateMetrics = () => {
    const totalUsers = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ].length
    
    const activeUnits = ambulanceUsers?.filter(u => u.status === 'active').length || 0
    const usersPerUnit = activeUnits > 0 ? Math.round(totalUsers / activeUnits) : 0
    
    return {
      usersPerUnit,
      totalUsers,
      activeUnits,
      recommendedUnits: Math.ceil(totalUsers / 800), // 1 unidad por 800 usuarios
      coverageGap: Math.max(0, Math.ceil(totalUsers / 800) - activeUnits)
    }
  }
  
  const metrics = calculateMetrics()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Métricas de Cobertura</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-200">
          <div>
            <div className="text-sm text-blue-700 font-medium">Usuarios por Unidad</div>
            <div className="text-2xl font-bold text-blue-900">{metrics.usersPerUnit}</div>
          </div>
          <i className="fas fa-users text-blue-600 text-xl"></i>
        </div>
        
        <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
          <div>
            <div className="text-sm text-green-700 font-medium">Unidades Recomendadas</div>
            <div className="text-2xl font-bold text-green-900">{metrics.recommendedUnits}</div>
          </div>
          <i className="fas fa-calculator text-green-600 text-xl"></i>
        </div>
        
        {metrics.coverageGap > 0 && (
          <div className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
            <div>
              <div className="text-sm text-orange-700 font-medium">Brecha de Cobertura</div>
              <div className="text-2xl font-bold text-orange-900">+{metrics.coverageGap}</div>
              <div className="text-xs text-orange-600">unidades necesarias</div>
            </div>
            <i className="fas fa-exclamation-triangle text-orange-600 text-xl"></i>
          </div>
        )}
        
        <div className="p-3 bg-gray-50 rounded-lg">
          <div className="text-sm font-medium text-gray-800 mb-2">Estatus de Cobertura</div>
          <div className="text-xs text-gray-600">
            {metrics.coverageGap === 0 
              ? '✓ Cobertura óptima alcanzada'
              : `⚠ Se requieren ${metrics.coverageGap} unidades adicionales para cobertura óptima`
            }
          </div>
        </div>
      </div>
    </div>
  )
}

const EmergencyDensityAnalysis = () => {
  const { activeEmergencies } = useAppStore()
  
  const analyzeDensity = () => {
    const timeSlots = {
      'Madrugada (00-06)': 0,
      'Mañana (06-12)': 0,
      'Tarde (12-18)': 0,
      'Noche (18-24)': 0
    }
    
    activeEmergencies?.filter(e => e.status === 'completed').forEach(emergency => {
      const hour = new Date(emergency.timestamp).getHours()
      if (hour >= 0 && hour < 6) timeSlots['Madrugada (00-06)']++
      else if (hour >= 6 && hour < 12) timeSlots['Mañana (06-12)']++
      else if (hour >= 12 && hour < 18) timeSlots['Tarde (12-18)']++
      else timeSlots['Noche (18-24)']++
    })
    
    const total = Object.values(timeSlots).reduce((sum, count) => sum + count, 0)
    
    return { timeSlots, total }
  }
  
  const densityData = analyzeDensity()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Densidad de Emergencias por Horario</h3>
      
      <div className="space-y-3">
        {Object.entries(densityData.timeSlots).map(([timeSlot, count], index) => {
          const percentage = densityData.total > 0 ? Math.round((count / densityData.total) * 100) : 0
          const colors = ['bg-purple-500', 'bg-blue-500', 'bg-orange-500', 'bg-red-500']
          
          return (
            <div key={timeSlot} className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <div className={`w-3 h-3 rounded ${colors[index]}`}></div>
                <span className="text-sm font-medium text-gray-700">{timeSlot}</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-24 bg-gray-200 rounded-full h-2">
                  <div 
                    className={`${colors[index]} h-2 rounded-full transition-all duration-500`}
                    style={{ width: `${Math.max(percentage, 5)}%` }}
                  ></div>
                </div>
                <div className="w-16 text-right text-sm">
                  <span className="font-semibold text-gray-800">{count}</span>
                  <span className="text-xs text-gray-500 ml-1">({percentage}%)</span>
                </div>
              </div>
            </div>
          )
        })}
      </div>
      
      <div className="mt-4 p-3 bg-yellow-50 rounded-lg border border-yellow-200">
        <div className="flex items-center space-x-2">
          <i className="fas fa-lightbulb text-yellow-600"></i>
          <span className="text-sm font-medium text-yellow-800">Insight</span>
        </div>
        <p className="text-xs text-yellow-700 mt-1">
          {Object.entries(densityData.timeSlots)
            .reduce((max, [slot, count]) => count > max.count ? { slot, count } : max, { slot: '', count: 0 })
            .slot} es el período de mayor actividad
        </p>
      </div>
    </div>
  )
}


export default GeographyReport
