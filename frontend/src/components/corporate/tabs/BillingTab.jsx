import React from 'react'
import BillingInfo from '../../shared/BillingInfo'

/**
 * Tab de facturación del dashboard corporativo
 * Muestra información de facturación y pagos
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario corporativo
 */
const BillingTab = ({ user }) => {
  return (
    <div className="space-y-6">
      {/* Componente principal de facturación */}
      <BillingInfo user={user} />

    </div>
  )
}

export default BillingTab
