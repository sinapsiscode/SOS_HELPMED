import React from 'react'
import PlanBenefits from '../PlanBenefits'

/**
 * Componente de pestaña Beneficios para FamiliarDashboard
 *  Separado del componente principal
 *  Props claramente definidos
 *  Responsabilidad única: Benefits display
 */
const BenefitsTab = ({ user }) => {
  return <PlanBenefits user={user} />
}

export default BenefitsTab