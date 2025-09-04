import React, { useState, useEffect } from 'react'
import useAppStore from '../../../stores/useAppStore'

// Componente para tarjeta de tipo de usuario
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

// Componente de gráfico de registro de usuarios
const UserRegistrationChart = ({ dateRange }) => {
  const { allUsers, registrationRequests } = useAppStore()
  
  const calculateRegistrationAnalysis = () => {
    const usersByStatus = {
      active: 0,
      inactive: 0,
      pending: 0
    }
    
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
    
    const requestsByStatus = {
      pending: registrationRequests?.filter(req => req.status === 'pending').length || 0,
      approved: registrationRequests?.filter(req => req.status === 'approved').length || 0,
      rejected: registrationRequests?.filter(req => req.status === 'rejected').length || 0
    }
    
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
        <h3 className="text-lg font-bold text-gray-800">Análisis de Registros y Solicitudes</h3>
        <div className="text-sm text-gray-600">Estado actual del sistema</div>
      </div>
      
      <div className="space-y-8">
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Estado de Usuarios Registrados</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-green-600">{analysis.usersByStatus.active}</div>
                  <div className="text-sm text-green-700">Usuarios Activos</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check-circle text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">
                {analysis.totalUsers > 0 ? Math.round((analysis.usersByStatus.active / analysis.totalUsers) * 100) : 0}% del total
              </div>
            </div>
            
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-gray-600">{analysis.usersByStatus.inactive}</div>
                  <div className="text-sm text-gray-700">Usuarios Inactivos</div>
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
        
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Estado de Solicitudes de Registro</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-yellow-600">{analysis.requestsByStatus.pending}</div>
                  <div className="text-xs sm:text-sm text-yellow-700">Pendientes</div>
                </div>
                <div className="text-yellow-500">
                  <i className="fas fa-clock text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-yellow-600">Requieren revisión</div>
            </div>
            
            <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-xl sm:text-2xl font-bold text-green-600">{analysis.requestsByStatus.approved}</div>
                  <div className="text-xs sm:text-sm text-green-700">Aprobadas</div>
                </div>
                <div className="text-green-500">
                  <i className="fas fa-check text-xl sm:text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-green-600">Usuarios creados</div>
            </div>
            
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold text-red-600">{analysis.requestsByStatus.rejected}</div>
                  <div className="text-sm text-red-700">Rechazadas</div>
                </div>
                <div className="text-red-500">
                  <i className="fas fa-times text-2xl"></i>
                </div>
              </div>
              <div className="mt-2 text-xs text-red-600">No procesadas</div>
            </div>
          </div>
        </div>
        
        <div>
          <h4 className="font-medium text-gray-800 mb-4">Solicitudes por Tipo de Plan</h4>
          <div className="space-y-3">
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Familiar</div>
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
            
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Corporativo</div>
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
            
            <div className="flex items-center space-x-4">
              <div className="w-24 text-sm font-medium text-gray-700">Externo</div>
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

// Función auxiliar para calcular actividad de usuario
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

// Tabla de usuarios activos
const ActiveUsersTable = ({ dateRange, filterType }) => {
  const { allUsers } = useAppStore()
  
  const getActiveUsers = () => {
    let usersData = []
    
    if (allUsers.familiar && filterType !== 'corporativo') {
      allUsers.familiar.forEach(user => {
        const serviceUsage = calculateUserActivity(user, 'familiar')
        if (serviceUsage.totalUsed > 0 || filterType === 'all') {
          usersData.push({
            id: user.id,
            name: user.profile?.name || user.name || 'Usuario',
            type: 'Familiar',
            plan: user.plan?.name || user.plan?.subtype || 'Sin plan',
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
    
    return usersData
      .sort((a, b) => b.servicesUsed - a.servicesUsed)
      .slice(0, 20)
  }
  
  const activeUsers = getActiveUsers()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">Usuarios Más Activos</h3>
        <div className="text-sm text-gray-600">
          Filtro: <span className="font-medium">{filterType === 'all' ? 'Todos' : filterType}</span>
        </div>
      </div>
      
      {activeUsers.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b bg-gray-50">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Usuario</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Tipo</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Plan</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Servicios Usados</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Utilización</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700">Estado</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Miembro desde</th>
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
                          <div className="text-xs text-gray-500">{user.employees} empleados</div>
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
                      {user.status === 'active' ? 'Activo' : 'Inactivo'}
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
          <p className="text-sm">No se encontraron usuarios con actividad en el período seleccionado.</p>
        </div>
      )}
      
      {activeUsers.length > 0 && (
        <div className="mt-4 pt-4 border-t grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="text-center p-2">
            <div className="text-xl sm:text-2xl font-bold text-blue-600">
              {activeUsers.reduce((sum, user) => sum + user.servicesUsed, 0)}
            </div>
            <div className="text-xs sm:text-sm text-gray-600">Servicios Totales Usados</div>
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
            <div className="text-xs sm:text-sm text-gray-600">Usuarios Activos</div>
          </div>
        </div>
      )}
    </div>
  )
}

// Función auxiliar para calcular distribución de usuarios
const calculateUserDistribution = (allUsers, includeAmbulance = false) => {
  const distribution = {
    familiar: allUsers.familiar?.length || 0,
    corporativo: allUsers.corporativo?.length || 0,
    externo: allUsers.externo?.length || 0,
    admin: allUsers.admin?.length || 0
  }
  
  if (includeAmbulance) {
    distribution.ambulancia = allUsers.ambulancia?.length || 0
  }
  
  return distribution
}

const UsersReport = ({ baseMetrics }) => {
  const { allUsers } = useAppStore()
  const [filterType, setFilterType] = useState('all')
  const [userStats, setUserStats] = useState({})
  
  useEffect(() => {
    const calculateUserStats = () => {
      const distribution = calculateUserDistribution(allUsers, false)
      const totalUsers = Object.values(distribution).reduce((sum, count) => sum + count, 0)
      
      const stats = {}
      Object.entries(distribution).forEach(([type, count]) => {
        if (count > 0 && type !== 'ambulancia') {
          stats[type] = {
            count,
            percentage: totalUsers > 0 ? Math.round((count / totalUsers) * 100) : 0,
            growth: ''
          }
        }
      })
      
      return stats
    }
    
    setUserStats(calculateUserStats())
  }, [allUsers])
  
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center space-x-4 mb-4">
          <h3 className="text-lg font-bold text-gray-800">Filtros de Usuario</h3>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="border border-gray-300 rounded-lg px-3 py-2"
          >
            <option value="all">Todos los tipos</option>
            <option value="familiar">Solo Familiares</option>
            <option value="corporativo">Solo Corporativos</option>
          </select>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(userStats).map(([type, stats]) => (
            <UserTypeCard key={type} type={type} stats={stats} />
          ))}
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-6">
        <UserRegistrationChart dateRange={baseMetrics?.dateRange} />
      </div>
      
      <ActiveUsersTable dateRange={baseMetrics?.dateRange} filterType={filterType} />
    </div>
  )
}

export default UsersReport