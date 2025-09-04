import PropTypes from 'prop-types'

/**
 * Sección de beneficios del plan
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const PlanBenefits = ({ planBenefits }) => {
  if (!planBenefits || planBenefits.length === 0) return null

  return (
    <div className="mt-4 sm:mt-6 pt-3 sm:pt-4 border-t border-gray-100">
      <h3 className="font-medium text-gray-800 mb-2 sm:mb-3 text-sm sm:text-base">
        Beneficios incluidos
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {planBenefits.map((benefit) => (
          <div key={benefit.key} className="flex items-center space-x-2 text-sm text-green-600">
            <i className={benefit.icon}></i>
            <span>{benefit.text}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

PlanBenefits.propTypes = {
  planBenefits: PropTypes.arrayOf(
    PropTypes.shape({
      key: PropTypes.string.isRequired,
      text: PropTypes.string.isRequired,
      icon: PropTypes.string.isRequired
    })
  )
}

export default PlanBenefits