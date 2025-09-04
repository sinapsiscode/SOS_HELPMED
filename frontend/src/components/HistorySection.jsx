import useAppStore from '../stores/useAppStore'

const HistorySection = () => {
  const { emergencyHistory } = useAppStore()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Historial de Emergencias</h2>
        <p className="text-gray-600">Registro de tus solicitudes de atención médica</p>
      </div>

      {/* History List */}
      <div className="space-y-4">
        {emergencyHistory.map((emergency) => (
          <HistoryCard key={emergency.id} emergency={emergency} />
        ))}
      </div>

      {/* Empty State */}
      {emergencyHistory.length === 0 && (
        <div className="bg-white rounded-xl shadow-medium p-12 text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <i className="fas fa-history text-gray-400 text-2xl"></i>
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">Sin historial</h3>
          <p className="text-gray-600">No tienes emergencias registradas aún.</p>
        </div>
      )}
    </div>
  )
}

const HistoryCard = ({ emergency }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type) => {
    if (type.includes('Emergencia')) {
      return 'fas fa-ambulance text-red-500'
    }
    return 'fas fa-stethoscope text-blue-500'
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
            <i className={getTypeIcon(emergency.type)}></i>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">{emergency.type}</h3>
            <p className="text-sm text-gray-600">
              {emergency.date} • {emergency.time}
            </p>
          </div>
        </div>

        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(emergency.status)}`}
        >
          {emergency.status === 'completed' ? 'Completada' : emergency.status}
        </span>
      </div>

      <div className="space-y-2 text-sm">
        <div className="flex items-center space-x-2">
          <i className="fas fa-ambulance text-gray-400 w-4"></i>
          <span className="text-gray-600">Unidad:</span>
          <span className="font-medium text-gray-800">{emergency.unit}</span>
        </div>

        <div className="flex items-start space-x-2">
          <i className="fas fa-map-marker-alt text-gray-400 w-4 mt-0.5"></i>
          <span className="text-gray-600">Ubicación:</span>
          <span className="font-medium text-gray-800 flex-1">{emergency.location}</span>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-gray-100">
        <button className="text-primary-red hover:text-red-700 text-sm font-medium transition-colors">
          Ver detalles
          <i className="fas fa-chevron-right ml-1"></i>
        </button>
      </div>
    </div>
  )
}

export default HistorySection
