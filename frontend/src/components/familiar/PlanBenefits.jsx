// Componente para mostrar los beneficios del plan familiar

import { useState } from 'react'
import PropTypes from 'prop-types'
import { PLAN_CONFIGURATIONS } from '../../mockdata/plans/plan-config'

const PlanBenefits = ({ user }) => {
  const [expandedBenefit, setExpandedBenefit] = useState(null)

  const getPlanConfig = () => {
    return user?.plan?.subtype ? PLAN_CONFIGURATIONS.FAMILIAR[user.plan.subtype] : null
  }

  const planConfig = getPlanConfig()

  if (!planConfig) {
    return (
      <div className="space-y-6">
        <div className="bg-white rounded-xl shadow-medium p-6">
          <div className="text-center py-12">
            <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
              <i className="text-2xl text-gray-400 fas fa-info-circle"></i>
            </div>
            <h3 className="mb-2 text-lg font-semibold text-gray-800">
              Información de Plan No Disponible
            </h3>
            <p className="mb-6 text-gray-600">
              No se pudo cargar la información de tu plan. Por favor, contacta con soporte.
            </p>
            <div className="flex flex-col space-y-3 sm:space-y-0 sm:flex-row sm:items-center sm:justify-center sm:space-x-4">
              <button className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 transition-colors">
                <i className="fas fa-phone mr-2"></i>
                Contactar Soporte
              </button>
              <button className="px-6 py-2 text-blue-600 border border-blue-600 rounded-lg hover:bg-blue-50 transition-colors">
                <i className="fas fa-refresh mr-2"></i>
                Recargar Página
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderBenefitCard = (benefitKey, benefitConfig) => {
    const isExpanded = expandedBenefit === benefitKey
    const isActive = benefitConfig.active

    return (
      <div
        key={benefitKey}
        className={`border rounded-xl p-6 transition-all duration-300 ${
          isActive ? 'border-green-500 bg-green-50' : 'border-gray-200 bg-gray-50'
        }`}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-4">
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center ${
                isActive ? 'bg-green-500' : 'bg-gray-400'
              }`}
            >
              <i className={`${benefitConfig.icon} text-white text-xl`}></i>
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isActive ? 'text-green-800' : 'text-gray-600'}`}>
                {benefitConfig.title}
              </h3>
              <p className={`text-sm ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                {benefitConfig.description}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {isActive ? (
              <span className="bg-green-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Incluido
              </span>
            ) : (
              <span className="bg-gray-300 text-gray-600 px-3 py-1 rounded-full text-sm font-medium">
                No incluido
              </span>
            )}

            {benefitConfig.details && (
              <button
                onClick={() => setExpandedBenefit(isExpanded ? null : benefitKey)}
                className={`p-2 rounded-full transition-colors ${
                  isActive ? 'text-green-600 hover:bg-green-100' : 'text-gray-400 hover:bg-gray-100'
                }`}
              >
                <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'}`}></i>
              </button>
            )}
          </div>
        </div>

        {/* Detalles expandibles */}
        {isExpanded && benefitConfig.details && isActive && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="bg-white border border-green-200 rounded-lg p-4">
              {renderBenefitDetails(benefitKey, benefitConfig.details)}
            </div>
          </div>
        )}
      </div>
    )
  }

  const renderBenefitDetails = (benefitKey, details) => {
    if (benefitKey === 'examenes_laboratorio' && details.tests) {
      return (
        <div className="space-y-3">
          <div className="text-sm text-green-600">
            {details.tests.map((test, index) => (
              <p key={index}>• {test}</p>
            ))}
          </div>
          {details.network && (
            <div className="bg-green-100 p-3 rounded-lg mt-3">
              <p className="text-sm text-green-800">
                <i className="fas fa-info-circle mr-2"></i>
                {details.network}
              </p>
            </div>
          )}
        </div>
      )
    }

    if (benefitKey === 'seguro_accidentes') {
      return (
        <div className="space-y-3 text-sm">
          {details.provider && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Proveedor:</span>
              <span className="text-green-600 font-medium">{details.provider}</span>
            </div>
          )}
          {details.maxAge && (
            <div className="flex justify-between items-center">
              <span className="text-gray-700">Edad máxima:</span>
              <span className="text-green-600 font-medium">{details.maxAge} años</span>
            </div>
          )}
          {details.coverage && (
            <div className="pt-2 border-t border-green-200">
              {details.coverage.map((item, index) => (
                <p key={index} className="text-green-600">• {item}</p>
              ))}
            </div>
          )}
          {details.validity && (
            <div className="mt-3 pt-3 border-t border-green-200">
              <div className="text-xs sm:text-sm">
                <span className="font-medium text-green-700">Vigencia:</span>
                <p className="text-green-600">{details.validity}</p>
              </div>
            </div>
          )}
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Beneficios de tu Plan</h1>
            <p className="text-gray-600">{planConfig.name}</p>
          </div>
          <div
            className={`px-4 py-2 rounded-full font-medium text-white bg-${planConfig.color}-500`}
          >
            {user?.plan?.subtype || 'Plan'}
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-blue-800">{planConfig.description}</p>
        </div>
      </div>

      {/* Servicios Incluidos */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Servicios Incluidos</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(planConfig.limits).map(([serviceType, limit]) => (
            <ServiceLimitCard key={serviceType} serviceType={serviceType} limit={limit} />
          ))}
        </div>
      </div>

      {/* Beneficios Adicionales */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Beneficios Adicionales</h2>

        <div className="space-y-4">
          {Object.entries(planConfig.benefits).map(([benefitKey, benefitConfig]) => 
            renderBenefitCard(benefitKey, benefitConfig)
          )}
        </div>
      </div>

      {/* Contacto para Upgrades */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white">
        <h3 className="text-xl font-bold mb-4">¿Quieres más beneficios?</h3>
        <p className="mb-4">
          Actualiza tu plan y obtén acceso a más servicios y beneficios exclusivos.
        </p>
        <div className="flex flex-wrap gap-3">
          <button className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors">
            <i className="fas fa-phone mr-2"></i>
            Llamar Ahora
          </button>
          <button className="bg-white bg-opacity-20 text-white px-4 py-2 rounded-lg font-medium hover:bg-opacity-30 transition-colors">
            <i className="fas fa-envelope mr-2"></i>
            Solicitar Información
          </button>
        </div>
      </div>
    </div>
  )
}

const ServiceLimitCard = ({ serviceType, limit }) => {
  const getServiceInfo = (type) => {
    const info = {
      EMERGENCIA: { name: 'Emergencias', icon: 'fas fa-ambulance', color: 'red' },
      URGENCIA: { name: 'Urgencias', icon: 'fas fa-clock', color: 'orange' },
      MEDICO_DOMICILIO: { name: 'Médico a Domicilio', icon: 'fas fa-user-md', color: 'blue' },
      TRASLADO_PROGRAMADO: { name: 'Traslado Programado', icon: 'fas fa-route', color: 'purple' },
      ZONA_PROTEGIDA: { name: 'Zona Protegida', icon: 'fas fa-shield-alt', color: 'green' },
      ORIENTACION_TELEFONICA: {
        name: 'Orientación Telefónica',
        icon: 'fas fa-phone',
        color: 'indigo'
      },
      EXAMENES_LABORATORIO: { name: 'Exámenes de Laboratorio', icon: 'fas fa-flask', color: 'pink' }
    }
    return info[type] || { name: type, icon: 'fas fa-medical-cross', color: 'gray' }
  }

  const serviceInfo = getServiceInfo(serviceType)
  const isUnlimited = limit === 'ILIMITADO'
  const isVariable = limit === 'VARIABLE'
  const isFlexible = limit === 'FLEXIBLE'

  const getLimitDisplay = () => {
    if (isUnlimited) return '∞'
    if (isVariable) return 'Variable'
    if (isFlexible) return 'Flexible'
    return limit
  }

  const getLimitText = () => {
    if (isUnlimited) return 'Sin límite'
    if (isVariable) return 'Según contrato'
    if (isFlexible) return 'Del total del plan'
    return `${limit} por período`
  }

  return (
    <div className={`border-l-4 border-${serviceInfo.color}-500 bg-gray-50 p-4 rounded-r-lg`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <i className={`${serviceInfo.icon} text-${serviceInfo.color}-600`}></i>
          <div>
            <h4 className="font-medium text-gray-800">{serviceInfo.name}</h4>
            <p className="text-sm text-gray-600">{getLimitText()}</p>
          </div>
        </div>
        <div className={`text-2xl font-bold text-${serviceInfo.color}-600`}>
          {getLimitDisplay()}
        </div>
      </div>
    </div>
  )
}

// PropTypes
PlanBenefits.propTypes = {
  user: PropTypes.shape({
    plan: PropTypes.shape({
      subtype: PropTypes.string.isRequired
    })
  }).isRequired
}

ServiceLimitCard.propTypes = {
  serviceType: PropTypes.string.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default PlanBenefits
