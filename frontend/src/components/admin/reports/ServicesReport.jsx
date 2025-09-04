import React, { useState, useEffect } from 'react'
import useAppStore from '../../../stores/useAppStore'

// Componente de tarjeta de métrica de servicio
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

// Distribución de tipos de servicios con datos reales
const ServiceTypeDistribution = ({ serviceMetrics }) => {
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
      <h3 className="text-lg font-bold text-gray-800 mb-4">Distribución de Servicios</h3>
      
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
            <div className="text-sm text-gray-600">Total Servicios Utilizados</div>
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
        const planName = user.plan?.name || user.plan?.subtype || 'Plan Desconocido'
        
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
      <h3 className="text-lg font-bold text-gray-800 mb-4">Utilización por Plan</h3>
      
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
  const getAvailableServicesByPlan = (planName, planType) => {
    const availableServices = []
    
    if (planType === 'Familiar') {
      if (planName.includes('Help')) {
        availableServices.push('EMERGENCIA')
      } else {
        availableServices.push('EMERGENCIA', 'URGENCIA', 'MEDICO_DOMICILIO', 'TRASLADO_PROGRAMADO')
      }
    } else if (planType === 'Corporativo') {
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

  const getAllServiceColumns = () => {
    const allServices = new Set()
    detailedAnalysis.forEach(plan => {
      plan.availableServices.forEach(service => allServices.add(service))
    })
    return Array.from(allServices)
  }

  const serviceColumns = getAllServiceColumns()
  
  const serviceHeaders = {
    'EMERGENCIA': 'Emergencias',
    'URGENCIA': 'Urgencias', 
    'MEDICO_DOMICILIO': 'Domicilio',
    'TRASLADO_PROGRAMADO': 'Traslados'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">Análisis Detallado por Plan</h3>
      
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
                    <span className="font-semibold text-gray-800">{plan.users}</span>
                  </td>
                  {serviceColumns.map(service => {
                    const serviceData = plan.services[service]
                    const isAvailable = plan.availableServices.includes(service)
                    
                    if (!isAvailable) {
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <span className="text-gray-400">-</span>
                        </td>
                      )
                    }
                    
                    if (!serviceData || serviceData.limit === 0) {
                      return (
                        <td key={service} className="py-3 px-4 text-center">
                          <span className="text-gray-500">N/A</span>
                        </td>
                      )
                    }
                    
                    const utilization = Math.round((serviceData.used / serviceData.limit) * 100)
                    
                    return (
                      <td key={service} className="py-3 px-4">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-gray-800">
                            {serviceData.used}/{serviceData.limit}
                          </div>
                          <div className="mt-1">
                            <div className="w-full bg-gray-200 rounded-full h-1.5">
                              <div 
                                className={`h-1.5 rounded-full ${
                                  utilization >= 80 ? 'bg-red-500' :
                                  utilization >= 60 ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                                style={{ width: `${Math.min(utilization, 100)}%` }}
                              ></div>
                            </div>
                            <div className="text-xs text-gray-500 mt-1">{utilization}%</div>
                          </div>
                        </div>
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-table text-4xl mb-2"></i>
          <p>No hay datos para analizar</p>
        </div>
      )}
    </div>
  )
}

const ServicesReport = ({ baseMetrics }) => {
  const { allUsers, activeEmergencies } = useAppStore()
  const [serviceMetrics, setServiceMetrics] = useState({})
  
  useEffect(() => {
    const calculateServiceMetrics = () => {
      const metrics = {
        emergencias: { total: 0, completed: 0, inProgress: 0 },
        domicilio: { total: 0, completed: 0, inProgress: 0 },
        urgencias: { total: 0, completed: 0, inProgress: 0 },
        traslados: { total: 0, completed: 0, inProgress: 0 }
      }
      
      // Contar servicios usados desde todos los usuarios
      if (allUsers.familiar) {
        allUsers.familiar.forEach(user => {
          if (user.service_usage?.current_period?.breakdown) {
            const breakdown = user.service_usage.current_period.breakdown
            Object.entries(breakdown).forEach(([serviceType, service]) => {
              if (typeof service === 'object' && service.used) {
                const used = service.used || 0
                switch (serviceType) {
                  case 'EMERGENCIA':
                    metrics.emergencias.completed += used
                    metrics.emergencias.total += used
                    break
                  case 'MEDICO_DOMICILIO':
                    metrics.domicilio.completed += used
                    metrics.domicilio.total += used
                    break
                  case 'URGENCIA':
                    metrics.urgencias.completed += used
                    metrics.urgencias.total += used
                    break
                  case 'TRASLADO_PROGRAMADO':
                    metrics.traslados.completed += used
                    metrics.traslados.total += used
                    break
                }
              }
            })
          }
        })
      }
      
      // Contar emergencias activas
      if (activeEmergencies) {
        activeEmergencies.forEach(emergency => {
          if (emergency.status === 'active' || emergency.status === 'in_progress') {
            metrics.emergencias.inProgress++
            metrics.emergencias.total++
          }
        })
      }
      
      return metrics
    }
    
    setServiceMetrics(calculateServiceMetrics())
  }, [allUsers, activeEmergencies])
  
  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ServiceMetricCard
          title="Emergencias"
          total={serviceMetrics.emergencias?.total || 0}
          completed={serviceMetrics.emergencias?.completed || 0}
          inProgress={serviceMetrics.emergencias?.inProgress || 0}
          icon="fas fa-ambulance"
          color="red"
        />
        <ServiceMetricCard
          title="Médico a Domicilio"
          total={serviceMetrics.domicilio?.total || 0}
          completed={serviceMetrics.domicilio?.completed || 0}
          inProgress={serviceMetrics.domicilio?.inProgress || 0}
          icon="fas fa-house-medical"
          color="blue"
        />
        <ServiceMetricCard
          title="Urgencias"
          total={serviceMetrics.urgencias?.total || 0}
          completed={serviceMetrics.urgencias?.completed || 0}
          inProgress={serviceMetrics.urgencias?.inProgress || 0}
          icon="fas fa-hospital"
          color="orange"
        />
        <ServiceMetricCard
          title="Traslados"
          total={serviceMetrics.traslados?.total || 0}
          completed={serviceMetrics.traslados?.completed || 0}
          inProgress={serviceMetrics.traslados?.inProgress || 0}
          icon="fas fa-van-shuttle"
          color="green"
        />
      </div>
      
      {/* Análisis de distribución */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ServiceTypeDistribution serviceMetrics={serviceMetrics} />
        <ServiceUtilizationByPlan allUsers={allUsers} />
      </div>
      
      {/* Tabla de análisis detallado */}
      <ServicesByPlanAnalysis allUsers={allUsers} />
    </div>
  )
}

export default ServicesReport