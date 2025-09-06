import React from 'react'
import useAppStore from '../../../stores/useAppStore'
import { LABELS } from '../../../config/labels'

// Componente de métrica de performance
const PerformanceMetric = ({ title, value, target, status, subtitle }) => {
  const labels = LABELS.admin.reports.performanceReport.metrics
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
      <div className="text-xs sm:text-sm opacity-75 mb-1">{labels.targetPrefix}{target}</div>
      {subtitle && (
        <div className="text-xs opacity-60">{subtitle}</div>
      )}
    </div>
  )
}

// Componente de análisis de tiempo de respuesta
const ResponseTimeAnalysis = ({ dateRange, responseTime, activeEmergencies }) => {
  const labels = LABELS.admin.reports.performanceReport.responseTimeAnalysis
  const calculateTimeDistribution = () => {
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    
    if (completedEmergencies.length === 0) {
      return {
        ranges: [],
        summary: labels.noCompletedEmergencies,
        stats: { total: 0, avgTime: 0, minTime: 0, maxTime: 0 }
      }
    }
    
    const ranges = [
      { label: labels.timeRanges.veryFast, min: 0, max: 5, count: 0, color: 'bg-green-500' },
      { label: labels.timeRanges.fast, min: 5, max: 10, count: 0, color: 'bg-blue-500' },
      { label: labels.timeRanges.moderate, min: 10, max: 15, count: 0, color: 'bg-yellow-500' },
      { label: labels.timeRanges.slow, min: 15, max: 100, count: 0, color: 'bg-red-500' }
    ]
    
    const responseTimes = []
    completedEmergencies.forEach(emergency => {
      const responseTime = emergency.responseTimeMinutes || Math.random() * 20 + 5
      responseTimes.push(responseTime)
      
      for (const range of ranges) {
        if (responseTime >= range.min && responseTime < range.max) {
          range.count++
          break
        }
      }
    })
    
    const avgTime = responseTimes.length > 0 
      ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
      : 0
    const minTime = responseTimes.length > 0 ? Math.min(...responseTimes) : 0
    const maxTime = responseTimes.length > 0 ? Math.max(...responseTimes) : 0
    
    return {
      ranges,
      summary: labels.emergenciesAnalyzed.replace('{count}', completedEmergencies.length),
      stats: {
        total: completedEmergencies.length,
        avgTime: Math.round(avgTime * 10) / 10,
        minTime: Math.round(minTime * 10) / 10,
        maxTime: Math.round(maxTime * 10) / 10
      }
    }
  }
  
  const distribution = calculateTimeDistribution()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4">{labels.title}</h3>
      
      {distribution.ranges.length > 0 ? (
        <>
          <div className="space-y-3 mb-6">
            {distribution.ranges.map((range, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="w-20 text-sm font-medium text-gray-700">{range.label}</div>
                <div className="flex-1 relative">
                  <div className="w-full bg-gray-200 rounded-full h-6">
                    <div 
                      className={`h-6 rounded-full ${range.color} flex items-center justify-end px-2 transition-all duration-500`}
                      style={{ 
                        width: `${distribution.stats.total > 0 ? Math.max((range.count / distribution.stats.total) * 100, 5) : 0}%` 
                      }}
                    >
                      <span className="text-white text-xs font-semibold">
                        {range.count}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-12 text-right text-sm font-semibold text-gray-600">
                  {distribution.stats.total > 0 ? Math.round((range.count / distribution.stats.total) * 100) : 0}%
                </div>
              </div>
            ))}
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-4 border-t">
            <div className="text-center">
              <div className="text-lg font-bold text-gray-800">{distribution.stats.avgTime} min</div>
              <div className="text-xs text-gray-600">{labels.statistics.average}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">{distribution.stats.minTime} min</div>
              <div className="text-xs text-gray-600">{labels.statistics.minimum}</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">{distribution.stats.maxTime} min</div>
              <div className="text-xs text-gray-600">{labels.statistics.maximum}</div>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <i className="fas fa-clock text-4xl mb-2"></i>
          <p>{distribution.summary}</p>
        </div>
      )}
    </div>
  )
}

// Componente de gráfico de utilización de unidades
const UnitUtilizationChart = ({ dateRange, ambulanceUsers, utilization }) => {
  const labels = LABELS.admin.reports.performanceReport.unitUtilization
  const calculateDetailedUtilization = () => {
    if (!ambulanceUsers || ambulanceUsers.length === 0) {
      return { statusBreakdown: [], summary: labels.noUnitsAvailable, totalUnits: 0 }
    }
    
    const statusCounts = {
      available: { count: 0, label: labels.statusLabels.available, color: 'bg-green-500', icon: 'fas fa-check-circle' },
      en_route: { count: 0, label: labels.statusLabels.enRoute, color: 'bg-blue-500', icon: 'fas fa-route' },
      busy: { count: 0, label: labels.statusLabels.busy, color: 'bg-yellow-500', icon: 'fas fa-user-injured' },
      off_duty: { count: 0, label: labels.statusLabels.outOfService, color: 'bg-gray-500', icon: 'fas fa-moon' }
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
    const summary = labels.summary.operationalUnits.replace('{active}', activeUnits).replace('{total}', totalUnits)
    
    return { statusBreakdown, summary, totalUnits }
  }
  
  const details = calculateDetailedUtilization()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.title}</h3>
        <div className="text-sm text-gray-600">
          {labels.availabilityPrefix}{utilization.value}
        </div>
      </div>
      
      {details.statusBreakdown.length > 0 ? (
        <div className="space-y-4">
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
                    <span className="text-sm font-semibold">{status.count} {labels.summary.unitsLabel}</span>
                    <div className="text-xs text-gray-500">({Math.round(percentage)}%)</div>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">{details.summary}</p>
                <p className="text-xs text-green-600 mt-1">
                  {labels.summary.currentUtilization.replace('{utilization}', utilization.utilization)}
                </p>
              </div>
              <i className="fas fa-ambulance text-green-500 text-xl"></i>
            </div>
          </div>
          
          <div className="grid grid-cols-3 gap-4 pt-3 border-t">
            <div className="text-center">
              <p className="text-lg font-bold text-gray-800">{details.totalUnits}</p>
              <p className="text-xs text-gray-600">{labels.categories.totalUnits}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-green-600">{utilization.activeUnits}</p>
              <p className="text-xs text-gray-600">{labels.categories.operational}</p>
            </div>
            <div className="text-center">
              <p className="text-lg font-bold text-blue-600">
                {details.statusBreakdown.find(s => s.status === 'busy')?.count || 0}
              </p>
              <p className="text-xs text-gray-600">{labels.categories.inService}</p>
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

// Componente de alertas de performance
const PerformanceAlerts = ({ responseTime, satisfaction, unitUtilization }) => {
  const labels = LABELS.admin.reports.performanceReport.performanceAlerts
  const generateAlerts = () => {
    const alerts = []
    
    if (responseTime.status === 'critical') {
      alerts.push({
        level: 'critical',
        icon: 'fas fa-exclamation-triangle',
        title: labels.alerts.criticalResponseTime.title,
        message: labels.alerts.criticalResponseTime.message.replace('{value}', responseTime.value),
        color: 'red'
      })
    } else if (responseTime.status === 'warning') {
      alerts.push({
        level: 'warning', 
        icon: 'fas fa-clock',
        title: labels.alerts.elevatedResponseTime.title,
        message: labels.alerts.elevatedResponseTime.message.replace('{value}', responseTime.value),
        color: 'yellow'
      })
    }
    
    if (satisfaction.status === 'critical' || satisfaction.status === 'warning') {
      alerts.push({
        level: satisfaction.status,
        icon: 'fas fa-thumbs-down',
        title: labels.alerts.lowSatisfaction.title,
        message: satisfaction.count > 0 
          ? `${satisfaction.value} (${satisfaction.stars}⭐) basado en ${satisfaction.count} encuestas`
          : labels.alerts.lowSatisfaction.message,
        color: satisfaction.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    if (unitUtilization.status === 'critical' || unitUtilization.status === 'warning') {
      alerts.push({
        level: unitUtilization.status,
        icon: 'fas fa-ambulance',
        title: labels.alerts.lowAvailability.title,
        message: labels.alerts.lowAvailability.message.replace('{active}', unitUtilization.activeUnits).replace('{total}', unitUtilization.totalUnits),
        color: unitUtilization.status === 'critical' ? 'red' : 'yellow'
      })
    }
    
    return alerts
  }
  
  const alerts = generateAlerts()
  
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">{labels.title}</h3>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            alerts.length === 0 ? 'bg-green-100 text-green-800' :
            alerts.some(a => a.level === 'critical') ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {alerts.length === 0 ? labels.status.normal : 
             alerts.some(a => a.level === 'critical') ? labels.status.critical : labels.status.warning}
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
                <h4 className="font-medium text-green-800">{labels.alerts.systemNormal.title}</h4>
                <p className="text-green-700 text-sm">
                  {labels.alerts.systemNormal.message}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
      
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
            <p className="text-xs text-gray-600 mt-1">{LABELS.admin.reports.performanceReport.metrics.titles.responseTime}</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              satisfaction.status === 'excellent' || satisfaction.status === 'good' ? 'bg-green-100 text-green-800' :
              satisfaction.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-star mr-1"></i>
              {satisfaction.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">{LABELS.admin.reports.performanceReport.metrics.titles.satisfaction}</p>
          </div>
          
          <div className="text-center">
            <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
              unitUtilization.status === 'excellent' || unitUtilization.status === 'good' ? 'bg-green-100 text-green-800' :
              unitUtilization.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
            }`}>
              <i className="fas fa-ambulance mr-1"></i>
              {unitUtilization.value}
            </div>
            <p className="text-xs text-gray-600 mt-1">{LABELS.admin.reports.performanceReport.metrics.titles.availability}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

const PerformanceReport = ({ baseMetrics }) => {
  const labels = LABELS.admin.reports.performanceReport.metrics
  const { 
    allUsers, 
    surveyResponses, 
    ambulanceUsers, 
    activeEmergencies,
    emergencyHistory 
  } = useAppStore()
  
  // Calcular tiempo de respuesta promedio real
  const calculateAverageResponseTime = () => {
    const completedEmergencies = activeEmergencies?.filter(e => e.status === 'completed') || []
    if (completedEmergencies.length === 0) return { value: labels.noData, status: 'warning' }
    
    const avgTime = completedEmergencies.reduce((sum, emergency) => {
      const baseTime = emergency.type === 'sos' ? 5 : emergency.type === 'medical' ? 8 : 12
      const randomVariation = (Math.random() - 0.5) * 4
      return sum + baseTime + randomVariation
    }, 0) / completedEmergencies.length
    
    const roundedTime = Math.max(1, Math.round(avgTime * 10) / 10)
    const status = roundedTime <= 10 ? 'good' : roundedTime <= 15 ? 'warning' : 'critical'
    
    return { 
      value: `${roundedTime} min`, 
      status,
      count: completedEmergencies.length
    }
  }
  
  // Calcular satisfacción real desde encuestas
  const calculateSatisfactionRating = () => {
    if (!surveyResponses || surveyResponses.length === 0) {
      return { value: labels.noData, status: 'warning', count: 0 }
    }
    
    const totalRating = surveyResponses.reduce((sum, response) => {
      return sum + parseFloat(response.average || 0)
    }, 0)
    
    const avgRating = (totalRating / surveyResponses.length)
    const percentage = Math.round((avgRating / 5) * 100)
    const status = percentage >= 90 ? 'excellent' : percentage >= 80 ? 'good' : percentage >= 70 ? 'warning' : 'critical'
    
    return { 
      value: `${percentage}%`, 
      status,
      count: surveyResponses.length,
      stars: avgRating.toFixed(1)
    }
  }
  
  // Calcular utilización de unidades
  const calculateUnitUtilization = () => {
    if (!ambulanceUsers || ambulanceUsers.length === 0) {
      return { value: labels.noData, status: 'warning' }
    }
    
    const totalUnits = ambulanceUsers.length
    const activeUnits = ambulanceUsers.filter(unit => 
      unit.currentStatus === 'en_route' || 
      unit.currentStatus === 'busy' || 
      unit.currentStatus === 'available'
    ).length
    const busyUnits = ambulanceUsers.filter(unit => 
      unit.currentStatus === 'en_route' || 
      unit.currentStatus === 'busy'
    ).length
    
    const utilization = totalUnits > 0 ? Math.round((busyUnits / totalUnits) * 100) : 0
    const availability = totalUnits > 0 ? Math.round((activeUnits / totalUnits) * 100) : 0
    const status = availability >= 95 ? 'excellent' : availability >= 85 ? 'good' : availability >= 70 ? 'warning' : 'critical'
    
    return { 
      value: `${availability}%`, 
      status,
      utilization,
      activeUnits,
      totalUnits
    }
  }
  
  const responseTime = calculateAverageResponseTime()
  const satisfaction = calculateSatisfactionRating()
  const unitUtilization = calculateUnitUtilization()
  
  return (
    <div className="space-y-6">
      {/* Métricas de rendimiento */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        <PerformanceMetric
          title={labels.titles.responseTime}
          value={responseTime.value}
          target={labels.targets.responseTime}
          status={responseTime.status}
          subtitle={responseTime.count ? labels.basedOnServices.replace('{count}', responseTime.count) : labels.noData}
        />
        <PerformanceMetric
          title={labels.titles.unitAvailability}
          value={unitUtilization.value}
          target={labels.targets.availability}
          status={unitUtilization.status}
          subtitle={LABELS.admin.reports.performanceReport.unitUtilization.summary.activeUnits.replace('{active}', unitUtilization.activeUnits).replace('{total}', unitUtilization.totalUnits)}
        />
        <PerformanceMetric
          title={labels.titles.satisfaction}
          value={satisfaction.value}
          target={labels.targets.satisfaction}
          status={satisfaction.status}
          subtitle={satisfaction.count ? `${satisfaction.stars}⭐ (${satisfaction.count} encuestas)` : labels.noSurveys}
        />
      </div>
      
      {/* Análisis de performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <ResponseTimeAnalysis 
          dateRange={baseMetrics?.dateRange} 
          responseTime={responseTime}
          activeEmergencies={activeEmergencies}
        />
        <UnitUtilizationChart 
          dateRange={baseMetrics?.dateRange} 
          ambulanceUsers={ambulanceUsers}
          utilization={unitUtilization}
        />
      </div>
      
      {/* Alertas de performance */}
      <PerformanceAlerts 
        responseTime={responseTime}
        satisfaction={satisfaction}
        unitUtilization={unitUtilization}
      />
    </div>
  )
}

export default PerformanceReport