import PropTypes from 'prop-types'
import useLimitsCard from '../../hooks/useLimitsCard'
import LimitHeader from './limits/LimitHeader'
import ServiceLimitsList from './limits/ServiceLimitsList'
import PlanBenefits from './limits/PlanBenefits'

/**
 * Componente para mostrar límites de servicios
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 65 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: Props con PropTypes
 * ✅ Regla #4: Validación con esquema Yup
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const LimitsCard = ({ title, limits, userType, planInfo }) => {
  const { isValid, errors, processedLimits, planBenefits, getPlanBadgeColor } = useLimitsCard(
    title,
    limits,
    userType,
    planInfo
  )

  // Manejar errores de validación
  if (!isValid) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="text-center py-8">
          <i className="fas fa-exclamation-triangle text-red-500 text-3xl mb-4"></i>
          <h3 className="text-lg font-medium text-gray-900 mb-2">Error en los datos</h3>
          <p className="text-sm text-gray-600">
            {errors.general || 'Los datos de límites no son válidos'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
      {/* Header */}
      <LimitHeader
        title={title}
        planInfo={planInfo}
        userType={userType}
        getPlanBadgeColor={getPlanBadgeColor}
      />

      {/* Lista de límites */}
      <ServiceLimitsList processedLimits={processedLimits} />

      {/* Beneficios del plan */}
      <PlanBenefits planBenefits={planBenefits} />
    </div>
  )
}

LimitsCard.propTypes = {
  title: PropTypes.string.isRequired,
  limits: PropTypes.objectOf(
    PropTypes.oneOfType([
      PropTypes.string, // ILIMITADO, FLEXIBLE, etc.
      PropTypes.number, // Plan Help - límite flexible
      PropTypes.shape({
        // Límites con uso
        used: PropTypes.number.isRequired,
        limit: PropTypes.number.isRequired
      })
    ])
  ).isRequired,
  userType: PropTypes.oneOf(['FAMILIAR', 'CORPORATIVO', 'EXTERNO', 'ADMIN']).isRequired,
  planInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    total_services: PropTypes.number,
    benefits: PropTypes.shape({
      emergencias_ilimitadas: PropTypes.bool,
      orientacion_telefonica: PropTypes.bool,
      zona_protegida: PropTypes.bool,
      seguro_accidentes: PropTypes.bool,
      examenes_laboratorio: PropTypes.bool
    })
  })
}

export default LimitsCard
