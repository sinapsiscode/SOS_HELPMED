// Sistema de seguimiento de emergencias activas en tiempo real

import { useState, useEffect } from 'react'
import useAppStore from '../../stores/useAppStore'
import Swal from 'sweetalert2'

const EmergencyTracking = () => {
  const { activeEmergencies, setEstimatedArrivalTime, updateEmergencyStatus } = useAppStore()
  const [selectedEmergency, setSelectedEmergency] = useState(null)
  const [viewMode, setViewMode] = useState('timeline') // timeline, map, grid
  const [filterPriority, setFilterPriority] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [filterTimeRange, setFilterTimeRange] = useState('today')
  const [showArrivalTimeModal, setShowArrivalTimeModal] = useState(false)
  const [selectedEmergencyForTime, setSelectedEmergencyForTime] = useState(null)
  const [manualArrivalTime, setManualArrivalTime] = useState('')

  // Mock data de emergencias activas
  const [emergencies, setEmergencies] = useState([
    {
      id: 'EMG-2024-001',
      priority: 'CRITICA',
      status: 'EN_PROGRESO',
      type: 'INFARTO_AGUDO',
      patient: {
        name: 'Juan Carlos Mendoza',
        age: 58,
        gender: 'M',
        phone: '+51 9 8765 4321',
        medicalHistory: ['Hipertensión', 'Diabetes tipo 2']
      },
      location: {
        address: 'Av. San Isidro 11049, San Isidro',
        coordinates: { lat: -12.0147, lng: -77.0122 },
        landmark: 'Centro Comercial Parque Arauco'
      },
      caller: {
        name: 'María Mendoza',
        relationship: 'Esposa',
        phone: '+51 9 1234 5678'
      },
      timeline: [
        {
          time: '2024-01-15T14:23:00',
          event: 'Llamada recibida',
          operator: 'Ana García',
          details: 'Paciente con dolor torácico severo'
        },
        {
          time: '2024-01-15T14:24:30',
          event: 'Emergencia clasificada',
          operator: 'Sistema',
          details: 'Prioridad CRÍTICA - Posible infarto'
        },
        {
          time: '2024-01-15T14:25:00',
          event: 'Unidad despachada',
          operator: 'Carlos López',
          details: 'Ambulancia AMB-002 asignada'
        },
        {
          time: '2024-01-15T14:26:00',
          event: 'Unidad en ruta',
          operator: 'Sistema',
          details: 'ETA: 8 minutos'
        },
        {
          time: '2024-01-15T14:32:00',
          event: 'Unidad en escena',
          operator: 'Dr. María López',
          details: 'Paciente consciente, signos vitales estables'
        }
      ],
      assignedUnit: {
        id: 'AMB-002',
        name: 'Ambulancia 002',
        crew: ['Dr. María López', 'Carlos Ruiz', 'Luis Morales'],
        eta: '2 min',
        distance: '0.8 km'
      },
      vital_signs: {
        timestamp: '2024-01-15T14:32:00',
        heartRate: 95,
        bloodPressure: '140/90',
        oxygenSaturation: 92,
        temperature: 36.8,
        consciousness: 'Consciente y orientado'
      },
      startTime: '2024-01-15T14:23:00',
      estimatedDuration: 45,
      destination: 'Hospital Nacional Dos de Mayo',
      severity_score: 8.5
    },
    {
      id: 'EMG-2024-002',
      priority: 'ALTA',
      status: 'COMPLETADA',
      type: 'ACCIDENTE_TRAFICO',
      patient: {
        name: 'Sofia Ramirez',
        age: 24,
        gender: 'F',
        phone: '+51 9 5555 1234',
        medicalHistory: []
      },
      location: {
        address: 'Av. Miraflores con Manuel Montt',
        coordinates: { lat: -12.0372, lng: -77.0506 },
        landmark: 'Metro Manuel Montt'
      },
      caller: {
        name: 'Testigo',
        relationship: 'Testigo presencial',
        phone: '+51 9 9876 5432'
      },
      timeline: [
        {
          time: '2024-01-15T13:45:00',
          event: 'Llamada recibida',
          operator: 'Pedro Silva',
          details: 'Colisión menor, paciente consciente'
        },
        {
          time: '2024-01-15T13:46:00',
          event: 'Unidad despachada',
          operator: 'Pedro Silva',
          details: 'Ambulancia AMB-001 asignada'
        },
        {
          time: '2024-01-15T13:52:00',
          event: 'Unidad en escena',
          operator: 'Dr. Juan Pérez',
          details: 'Evaluación inicial completada'
        },
        {
          time: '2024-01-15T14:15:00',
          event: 'Traslado iniciado',
          operator: 'Dr. Juan Pérez',
          details: 'Paciente estable, trasladando a hospital'
        },
        {
          time: '2024-01-15T14:35:00',
          event: 'Llegada a hospital',
          operator: 'Dr. Juan Pérez',
          details: 'Paciente entregado a urgencias'
        },
        {
          time: '2024-01-15T14:45:00',
          event: 'Servicio completado',
          operator: 'Sistema',
          details: 'Unidad disponible nuevamente'
        }
      ],
      assignedUnit: {
        id: 'AMB-001',
        name: 'Ambulancia 001',
        crew: ['Dr. Juan Pérez', 'Ana García'],
        eta: 'Completado',
        distance: '15.2 km total'
      },
      vital_signs: {
        timestamp: '2024-01-15T13:52:00',
        heartRate: 88,
        bloodPressure: '120/80',
        oxygenSaturation: 98,
        temperature: 36.5,
        consciousness: 'Consciente y orientado'
      },
      startTime: '2024-01-15T13:45:00',
      completedTime: '2024-01-15T14:45:00',
      estimatedDuration: 60,
      actualDuration: 60,
      destination: 'Hospital Salvador',
      severity_score: 4.2
    },
    {
      id: 'EMG-2024-003',
      priority: 'MEDIA',
      status: 'PENDIENTE',
      type: 'DOLOR_ABDOMINAL',
      patient: {
        name: 'Roberto González',
        age: 42,
        gender: 'M',
        phone: '+51 9 3333 7777',
        medicalHistory: ['Gastritis crónica']
      },
      location: {
        address: 'Calle Los Laureles 1234, Ñuñoa',
        coordinates: { lat: -12.0569, lng: -77.0483 },
        landmark: 'Cerca del Metro Ñuñoa'
      },
      caller: {
        name: 'Roberto González',
        relationship: 'Paciente',
        phone: '+51 9 3333 7777'
      },
      timeline: [
        {
          time: '2024-01-15T14:40:00',
          event: 'Llamada recibida',
          operator: 'Luis Torres',
          details: 'Dolor abdominal intenso, náuseas'
        },
        {
          time: '2024-01-15T14:41:00',
          event: 'Emergencia en cola',
          operator: 'Sistema',
          details: 'Esperando disponibilidad de unidad'
        }
      ],
      assignedUnit: null,
      vital_signs: null,
      startTime: '2024-01-15T14:40:00',
      estimatedDuration: 30,
      destination: 'Por determinar',
      severity_score: 5.1,
      waitTime: 8 // minutos esperando
    },
    {
      id: 'EMG-2024-004',
      priority: 'ALTA',
      status: 'EN_RUTA',
      type: 'DIFICULTAD_RESPIRATORIA',
      patient: {
        name: 'Elena Morales',
        age: 76,
        gender: 'F',
        phone: '+51 9 8888 4444',
        medicalHistory: ['EPOC', 'Insuficiencia cardíaca']
      },
      location: {
        address: 'Av. Apoquindo 4501, San Isidro',
        coordinates: { lat: -12.0248, lng: -77.012 },
        landmark: 'Edificio residencial Torre del Sol'
      },
      caller: {
        name: 'Carmen Morales',
        relationship: 'Hija',
        phone: '+51 9 7777 3333'
      },
      timeline: [
        {
          time: '2024-01-15T14:35:00',
          event: 'Llamada recibida',
          operator: 'Ana García',
          details: 'Paciente con disnea severa'
        },
        {
          time: '2024-01-15T14:36:00',
          event: 'Unidad despachada',
          operator: 'Ana García',
          details: 'Unidad Móvil MOV-001 asignada'
        },
        {
          time: '2024-01-15T14:38:00',
          event: 'Unidad en ruta',
          operator: 'Sistema',
          details: 'ETA: 12 minutos'
        }
      ],
      assignedUnit: {
        id: 'MOV-001',
        name: 'Unidad Móvil 001',
        crew: ['Dr. Roberto Silva', 'Patricia Vega'],
        eta: '9 min',
        distance: '3.2 km'
      },
      vital_signs: null,
      startTime: '2024-01-15T14:35:00',
      estimatedDuration: 40,
      destination: 'Clínica San Isidro',
      severity_score: 7.2
    }
  ])

  // Funciones de manejo eliminadas - se encuentran más abajo con mejoras
  // incluyendo el manejo de tiempo de llegada manual

  const filteredEmergencies = emergencies.filter((emergency) => {
    const priorityMatch = filterPriority === 'all' || emergency.priority === filterPriority
    const statusMatch = filterStatus === 'all' || emergency.status === filterStatus

    let timeMatch = true
    if (filterTimeRange !== 'all') {
      const emergencyDate = new Date(emergency.startTime)
      const now = new Date()

      switch (filterTimeRange) {
        case 'today':
          timeMatch = emergencyDate.toDateString() === now.toDateString()
          break
        case 'last24h':
          timeMatch = now - emergencyDate <= 24 * 60 * 60 * 1000
          break
        case 'last7days':
          timeMatch = now - emergencyDate <= 7 * 24 * 60 * 60 * 1000
          break
      }
    }

    return priorityMatch && statusMatch && timeMatch
  })

  const getEmergencyStats = () => {
    return {
      total: emergencies.length,
      active: emergencies.filter((e) => e.status === 'EN_PROGRESO' || e.status === 'EN_RUTA')
        .length,
      pending: emergencies.filter((e) => e.status === 'PENDIENTE').length,
      completed: emergencies.filter((e) => e.status === 'COMPLETADA').length,
      avgResponseTime: 8.5,
      criticalCount: emergencies.filter((e) => e.priority === 'CRITICA').length
    }
  }

  const stats = getEmergencyStats()

  // Handlers
  const handleSetArrivalTime = (emergency) => {
    setSelectedEmergencyForTime(emergency)

    Swal.fire({
      title: 'Establecer Tiempo de Llegada',
      html: `
        <div class="text-left">
          <p class="mb-2 text-gray-600">Emergencia: <strong>${emergency.id}</strong></p>
          <p class="mb-4 text-gray-600">Paciente: <strong>${emergency.patient.name}</strong></p>
          <div class="mb-2">
            <label class="block text-sm font-medium text-gray-700 mb-1">Tiempo estimado de llegada (minutos)</label>
            <input 
              type="number" 
              id="arrival-time-input" 
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Ej: 15"
              min="1"
              max="120"
            />
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: 'Establecer',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3B82F6',
      preConfirm: () => {
        const input = document.getElementById('arrival-time-input')
        const value = input.value

        if (!value || value <= 0) {
          Swal.showValidationMessage('Por favor ingrese un tiempo válido')
          return false
        }

        if (value > 120) {
          Swal.showValidationMessage('El tiempo no puede ser mayor a 120 minutos')
          return false
        }

        return value
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Actualizar el tiempo en el store
        setEstimatedArrivalTime(emergency.id, parseInt(result.value))

        // Actualizar la emergencia local
        setEmergencies((prev) =>
          prev.map((emg) =>
            emg.id === emergency.id ? { ...emg, estimatedArrivalTime: parseInt(result.value) } : emg
          )
        )

        Swal.fire({
          icon: 'success',
          title: 'Tiempo Establecido',
          text: `Tiempo de llegada: ${result.value} minutos`,
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const handleAssignUnit = (emergency) => {
    Swal.fire({
      title: 'Asignar Unidad',
      text: `¿Asignar unidad a emergencia ${emergency.id}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6',
      confirmButtonText: 'Asignar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Lógica para asignar unidad
        Swal.fire('Asignada', 'Unidad asignada correctamente', 'success')
      }
    })
  }

  const handleUpdateStatus = (emergency, status) => {
    updateEmergencyStatus(emergency.id, status)
    setEmergencies((prev) =>
      prev.map((emg) => (emg.id === emergency.id ? { ...emg, status } : emg))
    )
  }

  const handleAddNote = (emergency) => {
    Swal.fire({
      title: 'Agregar Nota',
      input: 'textarea',
      inputPlaceholder: 'Escriba su nota aquí...',
      showCancelButton: true,
      confirmButtonColor: '#3B82F6'
    }).then((result) => {
      if (result.isConfirmed && result.value) {
        Swal.fire('Guardada', 'Nota agregada correctamente', 'success')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Header y Estadísticas */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Seguimiento de Emergencias</h1>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm text-gray-600">Monitoreo en tiempo real</span>
          </div>
        </div>

        {/* Estadísticas rápidas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <EmergencyStatCard title="Total" count={stats.total} color="blue" icon="fas fa-list" />
          <EmergencyStatCard
            title="Activas"
            count={stats.active}
            color="yellow"
            icon="fas fa-exclamation-triangle"
          />
          <EmergencyStatCard
            title="Pendientes"
            count={stats.pending}
            color="orange"
            icon="fas fa-clock"
          />
          <EmergencyStatCard
            title="Completadas"
            count={stats.completed}
            color="green"
            icon="fas fa-check-circle"
          />
          <EmergencyStatCard
            title="Críticas"
            count={stats.criticalCount}
            color="red"
            icon="fas fa-heartbeat"
          />
          <EmergencyStatCard
            title="Tiempo Prom."
            count={`${stats.avgResponseTime}min`}
            color="purple"
            icon="fas fa-stopwatch"
          />
        </div>

        {/* Controles */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Filtros */}
          <div className="flex space-x-2">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todas las prioridades</option>
              <option value="CRITICA">Crítica</option>
              <option value="ALTA">Alta</option>
              <option value="MEDIA">Media</option>
              <option value="BAJA">Baja</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="all">Todos los estados</option>
              <option value="PENDIENTE">Pendientes</option>
              <option value="EN_PROGRESO">En Progreso</option>
              <option value="EN_RUTA">En Ruta</option>
              <option value="COMPLETADA">Completadas</option>
            </select>

            <select
              value={filterTimeRange}
              onChange={(e) => setFilterTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            >
              <option value="today">Hoy</option>
              <option value="last24h">Últimas 24h</option>
              <option value="last7days">Últimos 7 días</option>
              <option value="all">Todas</option>
            </select>
          </div>

          {/* Vista */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('timeline')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'timeline' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <i className="fas fa-list-ul"></i>
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'grid' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <i className="fas fa-th"></i>
            </button>
            <button
              onClick={() => setViewMode('map')}
              className={`px-3 py-1 rounded transition-colors ${
                viewMode === 'map' ? 'bg-white shadow-sm' : ''
              }`}
            >
              <i className="fas fa-map"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      {viewMode === 'map' ? (
        <EmergencyMapView
          emergencies={filteredEmergencies}
          onSelectEmergency={setSelectedEmergency}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Lista de Emergencias */}
          <div className={`${selectedEmergency ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            <div className="bg-white rounded-xl shadow-medium">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">
                  Emergencias ({filteredEmergencies.length})
                </h2>
              </div>

              <div className={viewMode === 'grid' ? 'p-6' : ''}>
                {viewMode === 'grid' ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {filteredEmergencies.map((emergency) => (
                      <EmergencyCard
                        key={emergency.id}
                        emergency={emergency}
                        onSelect={() => setSelectedEmergency(emergency)}
                        onAssignUnit={() => handleAssignUnit(emergency)}
                        onUpdateStatus={(status) => handleUpdateStatus(emergency, status)}
                        onAddNote={() => handleAddNote(emergency)}
                        onSetArrivalTime={() => handleSetArrivalTime(emergency)}
                        isSelected={selectedEmergency?.id === emergency.id}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="divide-y divide-gray-100">
                    {filteredEmergencies.map((emergency) => (
                      <EmergencyTimelineItem
                        key={emergency.id}
                        emergency={emergency}
                        onSelect={() => setSelectedEmergency(emergency)}
                        onAssignUnit={() => handleAssignUnit(emergency)}
                        onUpdateStatus={(status) => handleUpdateStatus(emergency, status)}
                        onAddNote={() => handleAddNote(emergency)}
                        isSelected={selectedEmergency?.id === emergency.id}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Panel de Detalles */}
          {selectedEmergency && (
            <div className="lg:col-span-1">
              <EmergencyDetailPanel
                emergency={selectedEmergency}
                onClose={() => setSelectedEmergency(null)}
                onAssignUnit={() => handleAssignUnit(selectedEmergency)}
                onUpdateStatus={(status) => handleUpdateStatus(selectedEmergency, status)}
                onAddNote={() => handleAddNote(selectedEmergency)}
              />
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Componentes auxiliares
const EmergencyStatCard = ({ title, count, color, icon }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    yellow: 'bg-yellow-50 border-yellow-200 text-yellow-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    red: 'bg-red-50 border-red-200 text-red-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600'
  }

  return (
    <div className={`border rounded-lg p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-xl font-bold">{count}</div>
          <div className="text-xs font-medium">{title}</div>
        </div>
        <i className={`${icon} text-lg opacity-75`}></i>
      </div>
    </div>
  )
}

const EmergencyCard = ({
  emergency,
  onSelect,
  onAssignUnit,
  onUpdateStatus,
  onAddNote,
  onSetArrivalTime,
  isSelected
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICA':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'ALTA':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'MEDIA':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'BAJA':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-red-100 text-red-800'
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-800'
      case 'EN_RUTA':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getElapsedTime = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMinutes = Math.floor((now - start) / (1000 * 60))
    return diffMinutes
  }

  return (
    <div
      className={`border rounded-lg p-4 cursor-pointer transition-all ${
        isSelected ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="font-semibold text-gray-800">{emergency.id}</h3>
          <p className="text-sm text-gray-600">{emergency.type.replace(/_/g, ' ')}</p>
        </div>
        <div className="flex flex-col items-end space-y-1">
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium border ${getPriorityColor(emergency.priority)}`}
          >
            {emergency.priority}
          </span>
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}
          >
            {emergency.status.replace('_', ' ')}
          </span>
        </div>
      </div>

      <div className="space-y-2 text-sm text-gray-600 mb-3">
        <div className="flex items-center">
          <i className="fas fa-user w-4 mr-2"></i>
          <span>
            {emergency.patient.name}, {emergency.patient.age} años
          </span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-map-marker-alt w-4 mr-2"></i>
          <span className="truncate">{emergency.location.address}</span>
        </div>
        <div className="flex items-center">
          <i className="fas fa-clock w-4 mr-2"></i>
          <span>Hace {getElapsedTime(emergency.startTime)} min</span>
        </div>
        {emergency.assignedUnit && (
          <div className="flex items-center">
            <i className="fas fa-ambulance w-4 mr-2 text-blue-600"></i>
            <span className="text-blue-700">{emergency.assignedUnit.name}</span>
          </div>
        )}
        {emergency.estimatedArrivalTime && (
          <div className="flex items-center">
            <i className="fas fa-route w-4 mr-2 text-green-600"></i>
            <span className="text-green-700">Llegada: {emergency.estimatedArrivalTime} min</span>
          </div>
        )}
        {emergency.waitTime && (
          <div className="flex items-center">
            <i className="fas fa-hourglass-half w-4 mr-2 text-red-600"></i>
            <span className="text-red-700">Esperando {emergency.waitTime} min</span>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex flex-wrap gap-2" onClick={(e) => e.stopPropagation()}>
        {!emergency.assignedUnit && emergency.status === 'PENDIENTE' && (
          <button
            onClick={onAssignUnit}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-ambulance mr-1"></i>Asignar
          </button>
        )}
        {emergency.assignedUnit && emergency.status !== 'COMPLETADA' && (
          <button
            onClick={onSetArrivalTime}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-clock mr-1"></i>Tiempo Llegada
          </button>
        )}
        {emergency.status !== 'COMPLETADA' && (
          <button
            onClick={() => onUpdateStatus('COMPLETADA')}
            className="flex-1 bg-green-600 hover:bg-green-700 text-white py-1 px-2 rounded text-xs"
          >
            <i className="fas fa-check mr-1"></i>Completar
          </button>
        )}
        <button
          onClick={onAddNote}
          className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-1 px-2 rounded text-xs"
        >
          <i className="fas fa-note-sticky mr-1"></i>Nota
        </button>
      </div>
    </div>
  )
}

const EmergencyTimelineItem = ({
  emergency,
  onSelect,
  onAssignUnit,
  onUpdateStatus,
  onAddNote,
  isSelected
}) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICA':
        return 'text-red-600'
      case 'ALTA':
        return 'text-orange-600'
      case 'MEDIA':
        return 'text-yellow-600'
      case 'BAJA':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDIENTE':
        return 'bg-red-100 text-red-800'
      case 'EN_PROGRESO':
        return 'bg-blue-100 text-blue-800'
      case 'EN_RUTA':
        return 'bg-yellow-100 text-yellow-800'
      case 'COMPLETADA':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getElapsedTime = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMinutes = Math.floor((now - start) / (1000 * 60))
    return diffMinutes
  }

  return (
    <div
      className={`p-4 cursor-pointer transition-colors border-l-4 ${
        isSelected ? 'bg-blue-50 border-l-blue-500' : 'hover:bg-gray-50 border-l-transparent'
      }`}
      onClick={onSelect}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            <i
              className={`fas fa-exclamation-triangle text-xl ${getPriorityColor(emergency.priority)}`}
            ></i>
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="font-semibold text-gray-800">{emergency.id}</h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(emergency.status)}`}
              >
                {emergency.status.replace('_', ' ')}
              </span>
              <span className={`text-sm font-medium ${getPriorityColor(emergency.priority)}`}>
                {emergency.priority}
              </span>
            </div>
            <div className="flex items-center space-x-4 mt-1 text-sm text-gray-600">
              <span>
                <i className="fas fa-user mr-1"></i>
                {emergency.patient.name}
              </span>
              <span>
                <i className="fas fa-map-marker-alt mr-1"></i>
                {emergency.location.landmark}
              </span>
              <span>
                <i className="fas fa-clock mr-1"></i>Hace {getElapsedTime(emergency.startTime)} min
              </span>
              {emergency.assignedUnit && (
                <span className="text-blue-600">
                  <i className="fas fa-ambulance mr-1"></i>
                  {emergency.assignedUnit.name}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
          {!emergency.assignedUnit && emergency.status === 'PENDIENTE' && (
            <button
              onClick={onAssignUnit}
              className="bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded text-sm"
            >
              Asignar Unidad
            </button>
          )}
          {emergency.status !== 'COMPLETADA' && (
            <button
              onClick={() => onUpdateStatus('COMPLETADA')}
              className="bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded text-sm"
            >
              Completar
            </button>
          )}
          <button
            onClick={onAddNote}
            className="bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded text-sm"
          >
            + Nota
          </button>
        </div>
      </div>
    </div>
  )
}

const EmergencyDetailPanel = ({ emergency, onClose, onAssignUnit, onUpdateStatus, onAddNote }) => {
  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICA':
        return 'text-red-600'
      case 'ALTA':
        return 'text-orange-600'
      case 'MEDIA':
        return 'text-yellow-600'
      case 'BAJA':
        return 'text-green-600'
      default:
        return 'text-gray-600'
    }
  }

  const getElapsedTime = (startTime) => {
    const start = new Date(startTime)
    const now = new Date()
    const diffMinutes = Math.floor((now - start) / (1000 * 60))
    const hours = Math.floor(diffMinutes / 60)
    const minutes = diffMinutes % 60
    return hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`
  }

  return (
    <div className="bg-white rounded-xl shadow-medium">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold text-gray-800">Detalles de Emergencia</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>

      <div className="p-6 space-y-6 max-h-[calc(100vh-200px)] overflow-y-auto">
        {/* Información Básica */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Información General</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">ID:</span>
              <span className="font-medium">{emergency.id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tipo:</span>
              <span className="font-medium">{emergency.type.replace(/_/g, ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Prioridad:</span>
              <span className={`font-medium ${getPriorityColor(emergency.priority)}`}>
                {emergency.priority}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Estado:</span>
              <span className="font-medium">{emergency.status.replace('_', ' ')}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Tiempo transcurrido:</span>
              <span className="font-medium">{getElapsedTime(emergency.startTime)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Severidad:</span>
              <span className="font-medium">{emergency.severity_score}/10</span>
            </div>
          </div>
        </div>

        {/* Paciente */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Información del Paciente</h3>
          <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-sm">
            <div>
              <strong>Nombre:</strong> {emergency.patient.name}
            </div>
            <div>
              <strong>Edad:</strong> {emergency.patient.age} años
            </div>
            <div>
              <strong>Género:</strong> {emergency.patient.gender === 'M' ? 'Masculino' : 'Femenino'}
            </div>
            <div>
              <strong>Teléfono:</strong> {emergency.patient.phone}
            </div>
            {emergency.patient.medicalHistory.length > 0 && (
              <div>
                <strong>Historial médico:</strong>
                <ul className="list-disc list-inside ml-2 mt-1">
                  {emergency.patient.medicalHistory.map((condition, index) => (
                    <li key={index}>{condition}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Ubicación */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Ubicación</h3>
          <div className="bg-gray-50 rounded-lg p-3 text-sm">
            <div className="flex items-start space-x-2">
              <i className="fas fa-map-marker-alt text-red-600 mt-1"></i>
              <div>
                <div className="font-medium">{emergency.location.address}</div>
                <div className="text-gray-600">{emergency.location.landmark}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Signos Vitales */}
        {emergency.vital_signs && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Signos Vitales</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="text-xs text-blue-600 mb-2">
                Última medición: {new Date(emergency.vital_signs.timestamp).toLocaleString()}
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <strong>FC:</strong> {emergency.vital_signs.heartRate} bpm
                </div>
                <div>
                  <strong>PA:</strong> {emergency.vital_signs.bloodPressure} mmHg
                </div>
                <div>
                  <strong>SatO2:</strong> {emergency.vital_signs.oxygenSaturation}%
                </div>
                <div>
                  <strong>Temp:</strong> {emergency.vital_signs.temperature}°C
                </div>
              </div>
              <div className="mt-2 text-sm">
                <strong>Consciencia:</strong> {emergency.vital_signs.consciousness}
              </div>
            </div>
          </div>
        )}

        {/* Unidad Asignada */}
        {emergency.assignedUnit && (
          <div>
            <h3 className="font-semibold text-gray-800 mb-3">Unidad Asignada</h3>
            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="font-medium text-green-800">{emergency.assignedUnit.name}</div>
              <div className="text-sm text-green-700">
                <div>ETA: {emergency.assignedUnit.eta}</div>
                <div>Distancia: {emergency.assignedUnit.distance}</div>
                <div>Tripulación: {emergency.assignedUnit.crew.join(', ')}</div>
              </div>
            </div>
          </div>
        )}

        {/* Timeline */}
        <div>
          <h3 className="font-semibold text-gray-800 mb-3">Cronología</h3>
          <div className="space-y-3">
            {emergency.timeline.map((event, index) => (
              <div key={index} className="flex space-x-3">
                <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="font-medium text-gray-800">{event.event}</div>
                      <div className="text-sm text-gray-600">{event.details}</div>
                      <div className="text-xs text-gray-500">por {event.operator}</div>
                    </div>
                    <div className="text-xs text-gray-500">
                      {new Date(event.time).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="pt-4 border-t border-gray-100">
          <div className="space-y-2">
            {!emergency.assignedUnit && emergency.status === 'PENDIENTE' && (
              <button
                onClick={onAssignUnit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg"
              >
                <i className="fas fa-ambulance mr-2"></i>Asignar Unidad
              </button>
            )}
            {emergency.status !== 'COMPLETADA' && (
              <button
                onClick={() => onUpdateStatus('COMPLETADA')}
                className="w-full bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg"
              >
                <i className="fas fa-check mr-2"></i>Marcar como Completada
              </button>
            )}
            <button
              onClick={onAddNote}
              className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded-lg"
            >
              <i className="fas fa-note-sticky mr-2"></i>Agregar Nota
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

const EmergencyMapView = ({ emergencies, onSelectEmergency }) => {
  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h2 className="text-lg font-bold text-gray-800 mb-4">Mapa de Emergencias</h2>
      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center text-gray-500">
          <i className="fas fa-map text-4xl mb-4"></i>
          <p className="mb-2">Mapa interactivo de emergencias activas</p>
          <p className="text-sm">Mostraría la ubicación en tiempo real de todas las emergencias</p>
          <div className="mt-4 grid grid-cols-2 gap-2 max-w-md">
            {emergencies.map((emergency) => (
              <button
                key={emergency.id}
                onClick={() => onSelectEmergency(emergency)}
                className="text-left p-2 bg-white rounded border hover:border-red-500 text-xs"
              >
                <div className="font-medium">{emergency.id}</div>
                <div className="text-gray-600">{emergency.location.landmark}</div>
                <div
                  className={`text-xs ${emergency.priority === 'CRITICA' ? 'text-red-600' : 'text-yellow-600'}`}
                >
                  {emergency.priority}
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default EmergencyTracking
