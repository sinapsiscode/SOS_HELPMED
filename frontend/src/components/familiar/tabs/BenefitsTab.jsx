import React from 'react'
import PlanBenefits from '../PlanBenefits'

/**
 * Componente de pesta�a Beneficios para FamiliarDashboard
 *  Separado del componente principal
 *  Props claramente definidos
 *  Responsabilidad �nica: Benefits display
 */
const BenefitsTab = ({ user }) => {
  return <PlanBenefits user={user} />
}

export default BenefitsTab