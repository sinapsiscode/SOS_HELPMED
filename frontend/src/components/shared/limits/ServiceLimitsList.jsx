import PropTypes from 'prop-types'
import UnlimitedServiceItem from './UnlimitedServiceItem'
import TrackedServiceItem from './TrackedServiceItem'
import FlexibleServiceItem from './FlexibleServiceItem'

/**
 * Lista de límites de servicios
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ServiceLimitsList = ({ processedLimits }) => {
  const renderLimitItem = (limit) => {
    switch (limit.type) {
      case 'unlimited':
        return <UnlimitedServiceItem key={limit.serviceType} limit={limit} />
      case 'tracked':
        return <TrackedServiceItem key={limit.serviceType} limit={limit} />
      case 'flexible':
        return <FlexibleServiceItem key={limit.serviceType} limit={limit} />
      default:
        return null
    }
  }

  return (
    <div className="space-y-3 sm:space-y-4">
      {processedLimits.map(renderLimitItem)}
    </div>
  )
}

ServiceLimitsList.propTypes = {
  processedLimits: PropTypes.arrayOf(
    PropTypes.shape({
      serviceType: PropTypes.string.isRequired,
      type: PropTypes.oneOf(['unlimited', 'tracked', 'flexible']).isRequired
    })
  ).isRequired
}

export default ServiceLimitsList