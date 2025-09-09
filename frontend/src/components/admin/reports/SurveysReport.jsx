import React, { useState, useEffect, useMemo } from 'react'
import useAppStore from '../../../stores/useAppStore'

const SurveysReport = ({ dateRange }) => {
  const store = useAppStore()
  const surveys = useMemo(() => store.surveyResponses || [], [store.surveyResponses])
  const allUsers = useMemo(() => store.allUsers || {}, [store.allUsers])
  
  
  // Distribución por tipo de usuario
  const [userTypeDistribution, setUserTypeDistribution] = useState([
    { type: 'Plan Familiar', count: 2 },
    { type: 'Plan Corporativo', count: 2 },
    { type: 'Afiliado Externo', count: 2 }
  ])
  
  // Áreas de mejora más mencionadas
  const [improvementAreas, setImprovementAreas] = useState([
    { area: 'Transparencia en costos', icon: 'fas fa-dollar-sign', count: 1, percentage: 16.7, color: 'orange' },
    { area: 'Cobertura de áreas de trabajo', icon: 'fas fa-map-marked-alt', count: 1, percentage: 16.7, color: 'blue' },
    { area: 'Atención del personal', icon: 'fas fa-user-nurse', count: 1, percentage: 16.7, color: 'purple' },
    { area: 'Proceso de verificación', icon: 'fas fa-check-circle', count: 1, percentage: 16.7, color: 'gray' },
    { area: 'Comunicación con la empresa', icon: 'fas fa-phone', count: 1, percentage: 16.7, color: 'red' }
  ])
  
  // Calcular métricas usando useMemo en lugar de useEffect
  const calculatedMetrics = useMemo(() => {
    if (surveys && surveys.length > 0) {
      const total = surveys.length
      const avgRating = surveys.reduce((sum, s) => sum + (s.rating || 0), 0) / total
      const positive = surveys.filter(s => s.rating >= 4).length
      const areas = new Set(surveys.map(s => s.improvementArea).filter(Boolean)).size
      
      return {
        totalSurveys: total,
        averageRating: avgRating.toFixed(1),
        positiveRatings: positive,
        mentionedAreas: areas || 1
      }
    } else {
      return {
        totalSurveys: 6,
        averageRating: 3.8,
        positiveRatings: 4,
        mentionedAreas: 1
      }
    }
  }, [surveys])
  
  const calculatedDistribution = useMemo(() => {
    if (surveys && surveys.length > 0) {
      const total = surveys.length
      const ratingCounts = [0, 0, 0, 0, 0]
      surveys.forEach(s => {
        if (s.rating >= 1 && s.rating <= 5) {
          ratingCounts[s.rating - 1]++
        }
      })
      
      return ratingCounts.map((count, index) => ({
        rating: 5 - index,
        count: ratingCounts[4 - index],
        percentage: total > 0 ? (ratingCounts[4 - index] / total * 100).toFixed(1) : 0
      }))
    } else {
      return [
        { rating: 5, count: 2, percentage: 33.3 },
        { rating: 4, count: 2, percentage: 33.3 },
        { rating: 3, count: 1, percentage: 16.7 },
        { rating: 2, count: 1, percentage: 16.7 },
        { rating: 1, count: 0, percentage: 0 }
      ]
    }
  }, [surveys])
  
  // Función para obtener color de la barra según el rating
  const getRatingColor = (rating) => {
    if (rating === 5) return 'bg-green-500'
    if (rating === 4) return 'bg-green-400'
    if (rating === 3) return 'bg-yellow-500'
    if (rating === 2) return 'bg-orange-500'
    return 'bg-red-500'
  }
  
  // Función para obtener el ancho máximo de la barra
  const getBarWidth = (percentage) => {
    const maxPercentage = Math.max(...calculatedDistribution.map(r => parseFloat(r.percentage)))
    return maxPercentage > 0 ? (percentage / maxPercentage) * 100 : 0
  }

  return (
    <div className="space-y-6">
      {/* Cards de métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total de Encuestas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col">
            <p className="text-3xl font-bold text-blue-600 mb-2">{calculatedMetrics.totalSurveys}</p>
            <p className="text-sm text-gray-600">Total de Encuestas</p>
            <div className="mt-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-poll text-blue-600 text-lg"></i>
              </div>
            </div>
          </div>
        </div>
        
        {/* Calificación Promedio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-2">
              <p className="text-3xl font-bold text-yellow-600">{calculatedMetrics.averageRating}</p>
              <i className="fas fa-star text-yellow-500 text-xl"></i>
            </div>
            <p className="text-sm text-gray-600">Calificación Promedio</p>
            <div className="mt-3">
              <i className="fas fa-star text-yellow-500 text-sm"></i>
            </div>
          </div>
        </div>
        
        {/* Calificaciones Positivas */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col">
            <p className="text-3xl font-bold text-green-600 mb-2">{calculatedMetrics.positiveRatings}</p>
            <p className="text-sm text-gray-600">Calificaciones Positivas</p>
            <p className="text-xs text-gray-500 mt-1">(4-5 estrellas)</p>
            <div className="mt-3">
              <i className="fas fa-thumbs-up text-green-500 text-lg"></i>
            </div>
          </div>
        </div>
        
        {/* Área Más Mencionada */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex flex-col">
            <p className="text-3xl font-bold text-purple-600 mb-2">{calculatedMetrics.mentionedAreas}</p>
            <p className="text-sm text-gray-600">Área Más Mencionada</p>
            <p className="text-xs text-orange-600 mt-1">
              <i className="fas fa-exclamation-triangle mr-1"></i>
              Transparencia en costos
            </p>
            <div className="mt-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <i className="fas fa-list text-purple-600 text-lg"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contenedor principal con dos columnas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Distribución de Calificaciones */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-star text-yellow-500 mr-2"></i>
            Distribución de Calificaciones
          </h3>
          
          <div className="space-y-3">
            {calculatedDistribution.map((item) => (
              <div key={item.rating} className="flex items-center gap-3">
                <div className="flex items-center gap-1 w-12">
                  <span className="text-sm font-medium text-gray-700">{item.rating}</span>
                  <i className="fas fa-star text-yellow-400 text-sm"></i>
                </div>
                <div className="flex-1">
                  <div className="w-full bg-gray-200 rounded-full h-8 relative">
                    <div 
                      className={`${getRatingColor(item.rating)} h-full rounded-full transition-all duration-500`}
                      style={{ width: `${getBarWidth(parseFloat(item.percentage))}%` }}
                    ></div>
                  </div>
                </div>
                <div className="text-right w-16">
                  <span className="text-sm font-medium text-gray-700">{item.count}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Distribución por Tipo de Usuario */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <i className="fas fa-users text-blue-600 mr-2"></i>
            Distribución por Tipo de Usuario
          </h3>
          
          <div className="space-y-4">
            {userTypeDistribution.map((item, index) => (
              <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    item.type === 'Plan Familiar' ? 'bg-green-500' :
                    item.type === 'Plan Corporativo' ? 'bg-blue-500' :
                    'bg-purple-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{item.type}</span>
                </div>
                <span className="text-lg font-semibold text-gray-900">{item.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Áreas de Mejora Más Mencionadas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-list-ul text-purple-600 mr-2"></i>
          Áreas de Mejora Más Mencionadas
        </h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {improvementAreas.map((area, index) => (
            <div key={index} className="flex items-start gap-4 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                area.color === 'orange' ? 'bg-orange-100' :
                area.color === 'blue' ? 'bg-blue-100' :
                area.color === 'purple' ? 'bg-purple-100' :
                area.color === 'red' ? 'bg-red-100' :
                'bg-gray-200'
              }`}>
                <i className={`${area.icon} ${
                  area.color === 'orange' ? 'text-orange-600' :
                  area.color === 'blue' ? 'text-blue-600' :
                  area.color === 'purple' ? 'text-purple-600' :
                  area.color === 'red' ? 'text-red-600' :
                  'text-gray-600'
                } text-lg`}></i>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-800">{area.area}</p>
                <div className="flex items-center gap-4 mt-1">
                  <span className="text-2xl font-bold text-gray-900">{area.count}</span>
                  <span className="text-sm text-gray-500">{area.percentage}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Indicador Online */}
      <div className="flex justify-end">
        <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
          <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
          Online
        </span>
      </div>
    </div>
  )
}

export default SurveysReport