import React from 'react'
import useAppStore from '../../../stores/useAppStore'

const PerformanceReport = ({ dateRange }) => {
  const { activeEmergencies = [], ambulanceUsers = [] } = useAppStore()

  // Datos mock para mostrar la vista exacta
  const responseTimeData = {
    average: '7.6 min',
    target: '&lt; 10 min',
    status: 'Basado en 8 servicios'
  }

  const availabilityData = {
    percentage: '60%',
    target: '&gt; 90%',
    activeUnits: '3/5 unidades activas'
  }

  const satisfactionData = {
    percentage: '—',
    target: '&gt; 90%',
    status: 'Sin encuestas disponibles'
  }

  // Análisis de tiempos de respuesta detallado
  const timeAnalysis = [
    {
      time: '7.5min',
      label: 'Promedio',
      services: [
        { code: 'SOS', location: 'Av. Larco 1500, Mirafl...', time: '4min', type: 'Ambulancia' },
        { code: 'SOS', location: 'Av. Benavides 3500, S...', time: '3min', type: 'Ambulancia' }
      ],
      percentage: 25,
      color: 'green'
    },
    {
      time: '3min',
      label: 'Mínimo',
      services: [],
      percentage: 0,
      color: 'green'
    },
    {
      time: '15min',
      label: 'Máximo',
      services: [],
      percentage: 0,
      color: 'red'
    },
    {
      time: '8',
      label: 'Total',
      services: [],
      percentage: 0,
      color: 'gray'
    }
  ]

  // Tiempos 5-10 min
  const medicalServices = [
    { code: 'MEDICAL', location: 'Av. Industrial 1500, Ca...', time: '7min', type: 'Ambulancia' },
    { code: 'MEDICAL', location: 'Av. Arequipa 1800, Lin...', time: '5min', type: 'Unidad' }
  ]

  // Tiempos 10-15 min
  const urgencyService = [
    { code: 'URGENCY', location: 'Av. Javier Prado 2000...', time: '11min', type: 'Ambulancia' }
  ]

  // Tiempos > 15 min
  const slowService = [
    { code: 'URGENCY', location: 'Plaza de Armas 100, L...', time: '15min', type: 'Ambulancia' }
  ]

  // Utilización de unidades
  const unitUtilization = {
    available: { count: 2, percentage: 40 },
    enRoute: { count: 1, percentage: 20 },
    outOfService: { count: 2, percentage: 40 }
  }

  // Análisis por tipo
  const typeAnalysis = [
    { type: 'SOS', time: '4.3min', count: 3 },
    { type: 'MEDICAL', time: '7min', count: 3 },
    { type: 'URGENCY', time: '13min', count: 2 }
  ]

  return (
    <div className="space-y-6">
      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tiempo Respuesta */}
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Tiempo Respuesta</h3>
          <div className="text-3xl font-bold text-blue-600">{responseTimeData.average}</div>
          <div className="text-sm text-blue-600 mt-1">Objetivo: &lt; 10 min</div>
          <div className="text-xs text-gray-600 mt-1">{responseTimeData.status}</div>
        </div>

        {/* Disponibilidad Unidades */}
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Disponibilidad Unidades</h3>
          <div className="text-3xl font-bold text-red-600">{availabilityData.percentage}</div>
          <div className="text-sm text-red-600 mt-1">Objetivo: &gt; 90%</div>
          <div className="text-xs text-gray-600 mt-1">{availabilityData.activeUnits}</div>
        </div>

        {/* Satisfacción */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
          <h3 className="text-sm font-medium text-gray-700 mb-2">Satisfacción</h3>
          <div className="text-3xl font-bold text-yellow-600">{satisfactionData.percentage}</div>
          <div className="text-sm text-yellow-600 mt-1">Objetivo: &gt; 90%</div>
          <div className="text-xs text-gray-600 mt-1">{satisfactionData.status}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Análisis Tiempos Respuesta */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Análisis Tiempos Respuesta</h3>
            <span className="text-sm text-gray-500">Promedio: 7.6 min</span>
          </div>

          {/* Tiempo cards */}
          <div className="grid grid-cols-4 gap-2 mb-4">
            {timeAnalysis.map((item, idx) => (
              <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                <div className={`text-lg font-bold ${
                  item.color === 'green' ? 'text-green-600' :
                  item.color === 'red' ? 'text-red-600' : 'text-gray-700'
                }`}>
                  {item.time}
                </div>
                <div className="text-xs text-gray-600">{item.label}</div>
              </div>
            ))}
          </div>

          {/* Barras de tiempo */}
          <div className="space-y-3">
            {/* < 5 min */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">&lt; 5 min</span>
                <span className="text-sm text-gray-600">2 (25%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-green-500 h-2 rounded" style={{ width: '25%' }}></div>
              </div>
              {timeAnalysis[0].services.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between mt-2 text-xs">
                  <span className="bg-red-100 text-red-700 px-2 py-1 rounded font-medium">{service.code}</span>
                  <span className="text-gray-600 flex-1 mx-2 truncate">{service.location}</span>
                  <span className="text-gray-700 font-medium">{service.time}</span>
                  <span className="text-gray-500 ml-2">{service.type}</span>
                </div>
              ))}
            </div>

            {/* 5-10 min */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">5-10 min</span>
                <span className="text-sm text-gray-600">4 (50%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-blue-500 h-2 rounded" style={{ width: '50%' }}></div>
              </div>
              {medicalServices.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between mt-2 text-xs">
                  <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded font-medium">{service.code}</span>
                  <span className="text-gray-600 flex-1 mx-2 truncate">{service.location}</span>
                  <span className="text-gray-700 font-medium">{service.time}</span>
                  <span className="text-gray-500 ml-2">{service.type}</span>
                </div>
              ))}
              <div className="text-right text-xs text-gray-500 mt-1">+2 más emergencias</div>
            </div>

            {/* 10-15 min */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">10-15 min</span>
                <span className="text-sm text-gray-600">1 (13%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-yellow-500 h-2 rounded" style={{ width: '13%' }}></div>
              </div>
              {urgencyService.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between mt-2 text-xs">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">{service.code}</span>
                  <span className="text-gray-600 flex-1 mx-2 truncate">{service.location}</span>
                  <span className="text-gray-700 font-medium">{service.time}</span>
                  <span className="text-gray-500 ml-2">{service.type}</span>
                </div>
              ))}
            </div>

            {/* > 15 min */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">&gt; 15 min</span>
                <span className="text-sm text-gray-600">1 (13%)</span>
              </div>
              <div className="w-full bg-gray-200 rounded h-2">
                <div className="bg-red-500 h-2 rounded" style={{ width: '13%' }}></div>
              </div>
              {slowService.map((service, idx) => (
                <div key={idx} className="flex items-center justify-between mt-2 text-xs">
                  <span className="bg-yellow-100 text-yellow-700 px-2 py-1 rounded font-medium">{service.code}</span>
                  <span className="text-gray-600 flex-1 mx-2 truncate">{service.location}</span>
                  <span className="text-gray-700 font-medium">{service.time}</span>
                  <span className="text-gray-500 ml-2">{service.type}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Análisis por Tipo */}
          <div className="mt-6 pt-6 border-t">
            <h4 className="text-sm font-semibold text-gray-700 mb-3">Análisis por Tipo</h4>
            <div className="grid grid-cols-3 gap-4">
              {typeAnalysis.map((item, idx) => (
                <div key={idx} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div className={`text-lg font-bold ${
                    item.type === 'SOS' ? 'text-red-600' :
                    item.type === 'MEDICAL' ? 'text-blue-600' : 'text-yellow-600'
                  }`}>
                    {item.time}
                  </div>
                  <div className="text-xs font-medium text-gray-700">{item.type}</div>
                  <div className="text-xs text-gray-500">({item.count})</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Utilización de Unidades */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Utilización de Unidades</h3>
            <span className="text-sm text-gray-500">Disponibilidad: 60%</span>
          </div>

          <div className="space-y-4">
            {/* Disponible */}
            <div className="flex items-center">
              <div className="flex items-center w-32">
                <i className="fas fa-check-circle text-green-600 mr-2"></i>
                <span className="text-sm font-medium">Disponible</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded h-6">
                  <div className="bg-green-500 h-6 rounded" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">2 unidades</span>
                <div className="text-xs text-gray-500">(40%)</div>
              </div>
            </div>

            {/* En Ruta */}
            <div className="flex items-center">
              <div className="flex items-center w-32">
                <i className="fas fa-route text-blue-600 mr-2"></i>
                <span className="text-sm font-medium">En Ruta</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded h-6">
                  <div className="bg-blue-500 h-6 rounded" style={{ width: '20%' }}></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">1 unidades</span>
                <div className="text-xs text-gray-500">(20%)</div>
              </div>
            </div>

            {/* Fuera de Servicio */}
            <div className="flex items-center">
              <div className="flex items-center w-32">
                <i className="fas fa-times-circle text-gray-600 mr-2"></i>
                <span className="text-sm font-medium">Fuera de Servicio</span>
              </div>
              <div className="flex-1 mx-4">
                <div className="w-full bg-gray-200 rounded h-6">
                  <div className="bg-gray-500 h-6 rounded" style={{ width: '40%' }}></div>
                </div>
              </div>
              <div className="text-right">
                <span className="text-sm font-semibold">2 unidades</span>
                <div className="text-xs text-gray-500">(40%)</div>
              </div>
            </div>
          </div>

          {/* Resumen */}
          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-800">3/5 unidades operativas</p>
                <p className="text-xs text-green-600 mt-1">Utilización actual: 20% (0 ocupadas)</p>
              </div>
              <i className="fas fa-ambulance text-green-500 text-xl"></i>
            </div>
          </div>

          {/* Estadísticas */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-800">5</p>
              <p className="text-xs text-gray-600">Total Unidades</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">3</p>
              <p className="text-xs text-gray-600">Operativas</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">0</p>
              <p className="text-xs text-gray-600">En Servicio</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PerformanceReport