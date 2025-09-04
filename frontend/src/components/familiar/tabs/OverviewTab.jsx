import React, { useState } from 'react'
import AmbulanceTracking from '../AmbulanceTracking'
import EmergencyRequestForm from '../EmergencyRequestForm'
import ServiceExpansionModal from '../ServiceExpansionModal'

/**
 * Componente de pestaña Resumen para FamiliarDashboard
 * ✅ Separado del componente principal
 * ✅ Props claramente definidos
 * ✅ Responsabilidad única: Overview display
 */
const OverviewTab = ({ user, onEmergencyRequest, currentEmergency }) => {
  const [showServiceExpansionModal, setShowServiceExpansionModal] = useState(false)
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Columna izquierda - Solicitar servicios */}
      <div className="lg:col-span-2 space-y-6">
        {/* Show ambulance tracking if there's an active emergency */}
        {currentEmergency && currentEmergency.status === 'EN_PROGRESO' && (
          <AmbulanceTracking
            emergency={currentEmergency}
            onCancel={() => {
              console.log('Tracking cancelled')
            }}
          />
        )}

        {/* Show emergency form only if no active emergency */}
        {!currentEmergency && <EmergencyRequestForm user={user} onSubmit={onEmergencyRequest} />}

        <SimpleServiceCounter user={user} />
      </div>

      {/* Columna derecha - Información del plan */}
      <div className="space-y-6">
        <SimplePlanCard user={user} />

        <QuickStats user={user} onAmpliarServicios={() => setShowServiceExpansionModal(true)} />
      </div>
      </div>

      {/* Modal de Ampliación de Servicios */}
      <ServiceExpansionModal 
        isOpen={showServiceExpansionModal}
        onClose={() => setShowServiceExpansionModal(false)}
        user={user}
      />
    </>
  )
}

const QuickStats = ({ user, onAmpliarServicios }) => {
  const getServicesUsedThisMonth = () => {
    if (!user.service_usage?.current_period) return 0
    
    if (user.plan?.subtype === 'HELP') {
      return user.service_usage.current_period.used_services || 0
    }

    const breakdown = user.service_usage.current_period.breakdown || {}
    return Object.values(breakdown).reduce((acc, data) => {
      if (typeof data === 'object' && data.used !== undefined) {
        return acc + data.used
      }
      return acc
    }, 0)
  }

  // Verificar si el plan tiene servicios ilimitados
  const hasUnlimitedServices = () => {
    return user.plan?.limits?.monthly_emergencies === 'ILIMITADO' || 
           user.plan?.benefits?.emergencias_ilimitadas
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-lg">
        Estadísticas Rápidas
      </h3>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <div className="text-center p-4 bg-blue-50 rounded-lg">
          <div className="text-3xl font-bold text-blue-600">
            {getServicesUsedThisMonth()}
          </div>
          <div className="text-sm text-blue-700 font-medium">Servicios Usados</div>
        </div>

        <div className="text-center p-4 bg-green-50 rounded-lg">
          <div className="text-3xl font-bold text-green-600">
            {hasUnlimitedServices() ? '∞' : user.plan?.total_services || 0}
          </div>
          <div className="text-sm text-green-700 font-medium">Disponibles</div>
        </div>
      </div>

      <div className="text-center mb-4">
        <p className="text-sm text-gray-600">
          Renovación: {new Date(user.plan?.renewal_date || '2024-12-31').toLocaleDateString('es-ES')}
        </p>
      </div>

      <div className="text-center">
        <button 
          onClick={onAmpliarServicios}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 mx-auto"
        >
          <i className="fas fa-plus"></i>
          Ampliar Servicios
        </button>
      </div>
    </div>
  )
}

// Simple Service Counter - sin validación compleja
const SimpleServiceCounter = ({ user }) => {
  const usedServices = user.service_usage?.current_period?.used_services || 0
  const totalServices = user.plan?.total_services || 16

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <h3 className="font-bold text-gray-800 mb-4 text-lg flex items-center">
        <i className="fas fa-chart-bar mr-2 text-blue-600"></i>
        Uso de Servicios
      </h3>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{usedServices}</div>
          <div className="text-xs text-blue-600 font-medium">Total Usado</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">0</div>
          <div className="text-xs text-green-600 font-medium">Ilimitados</div>
        </div>
        <div className="bg-yellow-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-yellow-600">0</div>
          <div className="text-xs text-yellow-600 font-medium">Cerca Límite</div>
        </div>
        <div className="bg-red-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-red-600">0</div>
          <div className="text-xs text-red-600 font-medium">Agotados</div>
        </div>
      </div>
    </div>
  )
}

// Simple Plan Card - con datos reales del plan
const SimplePlanCard = ({ user }) => {
  // Servicios específicos por plan
  const getServiceData = () => {
    const breakdown = user.service_usage?.current_period?.breakdown || {}
    
    const services = [
      {
        name: 'Emergencias',
        description: 'Situaciones críticas 24/7',
        icon: 'fas fa-ambulance',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        used: breakdown.emergencies?.used || 0,
        limit: user.plan?.limits?.monthly_emergencies || 'ILIMITADO',
        isUnlimited: user.plan?.limits?.monthly_emergencies === 'ILIMITADO'
      },
      {
        name: 'Urgencias',
        description: 'Atención médica prioritaria',
        icon: 'fas fa-clock',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        used: breakdown.urgencies?.used || 0,
        limit: user.plan?.limits?.monthly_urgencies || 3,
        isUnlimited: false
      },
      {
        name: 'Médico a Domicilio',
        description: 'Consultas en tu hogar',
        icon: 'fas fa-user-md',
        iconColor: 'text-purple-600',
        bgColor: 'bg-purple-100',
        used: breakdown.medical_consultations?.used || 0,
        limit: user.plan?.limits?.monthly_consultations || 4,
        isUnlimited: false
      },
      {
        name: 'Traslado Programado',
        description: 'Traslados médicos planificados',
        icon: 'fas fa-route',
        iconColor: 'text-indigo-600',
        bgColor: 'bg-indigo-100',
        used: breakdown.programmed_transfers?.used || 0,
        limit: user.plan?.limits?.monthly_transfers || 1,
        isUnlimited: false
      },
      {
        name: 'Zona Protegida',
        description: 'Emergencia/urgencia para terceros en tu dirección',
        icon: 'fas fa-shield-alt',
        iconColor: 'text-blue-600',
        bgColor: 'bg-blue-100',
        used: breakdown.protected_zone?.used || 1,
        limit: user.plan?.limits?.monthly_protected_zone || 2,
        isUnlimited: false
      },
      {
        name: 'Orientación Telefónica',
        description: 'Consultas telefónicas',
        icon: 'fas fa-phone',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        used: 0,
        limit: 'ILIMITADO',
        isUnlimited: true
      },
      {
        name: 'Exámenes de Laboratorio',
        description: 'Análisis clínicos',
        icon: 'fas fa-flask',
        iconColor: 'text-green-600',
        bgColor: 'bg-green-100',
        used: 0,
        limit: 'ILIMITADO',
        isUnlimited: true
      }
    ]

    return services
  }

  const services = getServiceData()

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="font-bold text-gray-800 text-lg">Tu Plan Actual</h3>
          <p className="text-sm text-gray-600">{user.plan?.name}</p>
        </div>
        <span className="px-3 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
          FAMILIAR
        </span>
      </div>

      <div className="space-y-4">
        {services.map((service, index) => (
          <div key={index} className="flex items-center gap-3">
            <div className={`w-8 h-8 ${service.bgColor} rounded-lg flex items-center justify-center`}>
              <i className={`${service.icon} ${service.iconColor} text-sm`}></i>
            </div>
            <div className="flex-1">
              <div className="flex justify-between items-center mb-1">
                <div>
                  <h4 className="text-sm font-medium text-gray-900">{service.name}</h4>
                  <p className="text-xs text-gray-600">{service.description}</p>
                </div>
                <span className={`text-sm font-semibold ${service.isUnlimited ? 'text-green-600' : 'text-gray-900'}`}>
                  {service.isUnlimited ? 'ILIMITADO' : `${service.used} / ${service.limit}`}
                </span>
              </div>
              {!service.isUnlimited && (
                <div className="w-full bg-gray-200 rounded-full h-1.5">
                  <div 
                    className={`${service.iconColor.replace('text-', 'bg-')} h-1.5 rounded-full transition-all duration-300`}
                    style={{ width: `${Math.min((service.used / service.limit) * 100, 100)}%` }}
                  ></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default OverviewTab