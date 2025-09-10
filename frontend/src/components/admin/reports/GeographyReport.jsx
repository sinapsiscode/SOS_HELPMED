import useAppStore from '../../../stores/useAppStore'
import { LABELS } from '../../../config/labels'

const GeographyReport = () => {
  const labels = LABELS.admin.reports.geographyReport
  const { allUsers, activeEmergencies, ambulanceUsers } = useAppStore()

  // Calcular KPIs principales para el dashboard
  const calculateKPIs = () => {
    const totalUsers = [
      ...(allUsers?.familiar || []),
      ...(allUsers?.corporativo || []),
      ...(allUsers?.externo || [])
    ].length

    const completedEmergencies = activeEmergencies?.filter((e) => e.status === 'completed') || []
    const averageResponseTime =
      completedEmergencies.length > 0
        ? Math.round(
            completedEmergencies.reduce((sum, e) => sum + (e.responseTimeMinutes || 0), 0) /
              completedEmergencies.length
          )
        : 0

    const activeUnits = ambulanceUsers?.filter((u) => u.status === 'active').length || 0
    const availableUnits =
      ambulanceUsers?.filter((u) => u.currentStatus === 'available').length || 0
    const coveragePercentage =
      activeUnits > 0 ? Math.round((availableUnits / activeUnits) * 100) : 0

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
            <p className="text-blue-100 text-sm">{labels.subtitle}</p>
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
            <span
              className={`text-sm font-medium ${
                kpis.averageResponseTime <= 8 ? 'text-green-600' : 'text-red-600'
              }`}
            >
              {kpis.averageResponseTime <= 8
                ? labels.performance.excellent
                : labels.performance.improvable}
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
              {kpis.availableUnits} de {kpis.activeUnits} disponibles
            </span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 font-medium">{labels.kpis.utilization}</p>
              <p className="text-2xl font-bold text-gray-900">
                {activeEmergencies?.filter((e) => e.status === 'active').length || 0}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <i className="fas fa-chart-line text-purple-600 text-xl"></i>
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-purple-600 font-medium">
              {labels.kpis.activeEmergencies}
            </span>
          </div>
        </div>
      </div>

      {/* Análisis Principal - Grid de componentes */}
      <div className="grid grid-cols-1 gap-6">
        <UnifiedDistrictAnalysis />
      </div>
    </div>
  )
}

const UnifiedDistrictAnalysis = () => {
  const labels = LABELS.admin.reports.geographyReport
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
      Miraflores: { users: 0, emergencies: 0, responseTime: 7 },
      'San Isidro': { users: 0, emergencies: 0, responseTime: 8 },
      Surco: { users: 0, emergencies: 0, responseTime: 12 },
      'San Borja': { users: 0, emergencies: 0, responseTime: 10 },
      'La Molina': { users: 0, emergencies: 0, responseTime: 11 },
      Barranco: { users: 0, emergencies: 0, responseTime: 9 },
      'Jesús María': { users: 0, emergencies: 0, responseTime: 9 },
      Magdalena: { users: 0, emergencies: 0, responseTime: 11 },
      Lince: { users: 0, emergencies: 0, responseTime: 10 }
    }

    // Calcular emergencias completadas por distrito
    activeEmergencies
      ?.filter((e) => e.status === 'completed')
      .forEach((emergency) => {
        const location = emergency.location?.address || ''
        Object.keys(regionStats).forEach((district) => {
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
      Miraflores: Math.floor(allUsersList.length * 0.1),
      'San Isidro': Math.floor(allUsersList.length * 0.12),
      Surco: Math.floor(allUsersList.length * 0.18),
      'San Borja': Math.floor(allUsersList.length * 0.08),
      'La Molina': Math.floor(allUsersList.length * 0.09),
      Barranco: Math.floor(allUsersList.length * 0.05),
      'Jesús María': Math.floor(allUsersList.length * 0.06),
      Magdalena: Math.floor(allUsersList.length * 0.07),
      Lince: Math.floor(allUsersList.length * 0.04)
    }

    Object.keys(userDistribution).forEach((district) => {
      regionStats[district].users = userDistribution[district]
    })

    // Combinar todos los datos
    const unifiedData = servicesData.map((district) => {
      const stats = regionStats[district.name] || { users: 0, emergencies: 0, responseTime: 0 }
      return {
        ...district,
        users: stats.users,
        emergencies: stats.emergencies,
        responseTime: stats.responseTime,
        percentage: Math.round((district.services / servicesData[0].services) * 100)
      }
    })

    return unifiedData.sort((a, b) => b.services - a.services)
  }

  const districtData = getUnifiedDistrictData()
  const totalServices = districtData.reduce((sum, d) => sum + d.services, 0)
  const totalUsers = districtData.reduce((sum, d) => sum + d.users, 0)
  const totalEmergencies = districtData.reduce((sum, d) => sum + d.emergencies, 0)
  const avgResponseTime =
    districtData.length > 0
      ? districtData.reduce((sum, d) => sum + d.responseTime, 0) / districtData.length
      : 0

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-2 sm:space-y-0">
        <div className="min-w-0 flex-1">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 truncate">
            {labels.districtAnalysis.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            <span className="hidden sm:inline">{labels.districtAnalysis.subtitle}</span>
            <span className="sm:hidden">{labels.districtAnalysis.overview}</span>
          </p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <button
            className="text-gray-600 hover:text-gray-800 transition-colors p-2"
            title="Descargar reporte"
          >
            <i className="fas fa-download text-sm sm:text-base"></i>
          </button>
          <button
            className="text-gray-600 hover:text-gray-800 transition-colors p-2"
            title="Expandir vista completa"
          >
            <i className="fas fa-expand text-sm sm:text-base"></i>
          </button>
        </div>
      </div>
      <div className="space-y-2 sm:space-y-3">
        {districtData.slice(0, 8).map((district, index) => {
          const responseColor =
            district.responseTime <= 8
              ? 'text-green-600'
              : district.responseTime <= 12
                ? 'text-yellow-600'
                : 'text-red-600'

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
                    <span className="text-base sm:text-lg font-bold text-gray-500">
                      #{index + 1}
                    </span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm sm:text-base text-gray-800 truncate">
                    {district.name}
                  </h4>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mt-1 sm:mt-2 text-xs">
                    <div className="truncate">
                      <span className="text-gray-600">Servicios: </span>
                      <span className="font-semibold text-blue-600">{district.services}</span>
                      <span className="text-gray-500 hidden sm:inline">
                        {' '}
                        ({district.percentage}%)
                      </span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Usuarios: </span>
                      <span className="font-semibold text-purple-600">{district.users}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Emergencias: </span>
                      <span className="font-semibold text-red-600">{district.emergencies}</span>
                    </div>
                    <div className="truncate">
                      <span className="text-gray-600">Tiempo: </span>
                      <span className={`font-semibold ${responseColor}`}>
                        {district.responseTime}min
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-4 sm:w-auto w-full mt-2 sm:mt-0">
                <div className="text-center">
                  <span
                    className={`text-sm font-semibold ${district.trend.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}
                  >
                    {district.trend}
                  </span>
                  <p className="text-xs text-gray-500 mt-1 hidden sm:block">tendencia</p>
                </div>

                <div className="w-16 sm:w-20">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                      style={{
                        width: `${Math.max((district.services / (districtData[0]?.services || 1)) * 100, 5)}%`
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Resumen */}
      <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-blue-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-blue-600">{totalServices}</div>
          <div className="text-xs text-blue-700">Total Servicios</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-purple-600">{totalUsers}</div>
          <div className="text-xs text-purple-700">Usuarios</div>
        </div>
        <div className="bg-red-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-red-600">{totalEmergencies}</div>
          <div className="text-xs text-red-700">Emergencias</div>
        </div>
        <div className="bg-green-50 rounded-lg p-2 sm:p-3 text-center">
          <div className="text-lg sm:text-xl font-bold text-green-600">
            {Math.round(avgResponseTime)}min
          </div>
          <div className="text-xs text-green-700">Tiempo Promedio</div>
        </div>
      </div>
    </div>
  )
}

export default GeographyReport
