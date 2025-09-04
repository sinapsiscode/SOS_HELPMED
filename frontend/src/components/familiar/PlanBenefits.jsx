// Componente para mostrar los beneficios del plan familiar

import { useState } from 'react'
import PropTypes from 'prop-types'
import { PLAN_CONFIGURATIONS } from '../../mockdata/plans/plan-config'

const PlanBenefits = ({ user }) => {
  const [expandedBenefit, setExpandedBenefit] = useState(null)

  const getPlanConfig = () => {
    return PLAN_CONFIGURATIONS.FAMILIAR[user.plan.subtype]
  }

  const planConfig = getPlanConfig()

  if (!planConfig) return null

  const renderBenefitCard = (benefitKey, isActive, title, description, icon, details) => {
    const isExpanded = expandedBenefit === benefitKey

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
              <i className={`${icon} text-white text-xl`}></i>
            </div>
            <div>
              <h3 className={`font-bold text-lg ${isActive ? 'text-green-800' : 'text-gray-600'}`}>
                {title}
              </h3>
              <p className={`text-sm ${isActive ? 'text-green-700' : 'text-gray-500'}`}>
                {description}
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

            {details && (
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
        {isExpanded && details && isActive && (
          <div className="mt-4 pt-4 border-t border-green-200">
            <div className="bg-white border border-green-200 rounded-lg p-4">{details}</div>
          </div>
        )}
      </div>
    )
  }

  const renderLaboratorioDetails = () => (
    <div className="space-y-3">
      <div className="text-sm text-green-600">
        <p>• Examen de orina</p>
        <p>• Examen de heces</p>
        <p>• Hemograma completo</p>
      </div>
      <div className="bg-green-100 p-3 rounded-lg mt-3">
        <p className="text-sm text-green-800">
          <i className="fas fa-info-circle mr-2"></i>
          Disponible en laboratorios de la red Help MED
        </p>
      </div>
    </div>
  )

  const renderSeguroDetails = () => (
    <div className="space-y-3 text-sm">
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Proveedor:</span>
        <span className="text-green-600 font-medium">Chubb</span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-gray-700">Edad máxima:</span>
        <span className="text-green-600 font-medium">79 años</span>
      </div>
      <div className="pt-2 border-t border-green-200">
        <p className="text-green-600">• Accidentes personales 24/7</p>
      </div>
    </div>
  )

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
            {user.plan.subtype}
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
          {renderBenefitCard(
            'emergencias_ilimitadas',
            planConfig.benefits.emergencias_ilimitadas,
            'Emergencias Ilimitadas',
            'Atención de emergencias médicas sin límite de servicios',
            'fas fa-ambulance'
          )}

          {renderBenefitCard(
            'orientacion_telefonica',
            planConfig.benefits.orientacion_telefonica,
            'Orientación Médica Telefónica',
            'Consultas telefónicas 24/7 con profesionales médicos',
            'fas fa-phone-alt'
          )}

          {renderBenefitCard(
            'zona_protegida',
            planConfig.benefits.zona_protegida,
            'Zona Protegida',
            'Emergencia/urgencia médica para terceros en tu dirección registrada',
            'fas fa-shield-alt'
          )}

          {renderBenefitCard(
            'examenes_laboratorio',
            planConfig.benefits.examenes_laboratorio,
            'Exámenes de Laboratorio',
            'Análisis clínicos básicos incluidos en el plan',
            'fas fa-flask',
            planConfig.benefits.examenes_laboratorio && renderLaboratorioDetails()
          )}

          {renderBenefitCard(
            'seguro_accidentes',
            true,
            'Seguro contra Accidentes',
            'Cobertura contra accidentes personales 24/7',
            'fas fa-shield-alt',
            renderSeguroDetails()
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
    }).isRequired
  }).isRequired
}

ServiceLimitCard.propTypes = {
  serviceType: PropTypes.string.isRequired,
  limit: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired
}

export default PlanBenefits
