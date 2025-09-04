import { useMemo } from 'react'

/**
 * Hook especializado para cálculos de estado y estadísticas corporativas
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Status calculations
 * ✅ Optimizado con useMemo
 */
const useCorporateCalculations = (corporateUsers) => {
  /**
   * Calcula el estado de un contrato basado en fecha de renovación
   */
  const getContractStatus = (contract) => {
    if (!contract?.plan?.renewal_date) {
      return { status: 'unknown', color: 'gray', text: 'Desconocido' }
    }

    const renewalDate = new Date(contract.plan.renewal_date)
    const now = new Date()
    const daysUntilRenewal = Math.ceil((renewalDate - now) / (1000 * 60 * 60 * 24))

    if (daysUntilRenewal < 0) {
      return { status: 'expired', color: 'red', text: 'Vencido' }
    } else if (daysUntilRenewal <= 30) {
      return { status: 'expiring', color: 'orange', text: `${daysUntilRenewal} días` }
    } else {
      return { status: 'active', color: 'green', text: 'Activo' }
    }
  }

  /**
   * Obtiene estadísticas de contratos
   */
  const contractStats = useMemo(() => {
    const totalContracts = corporateUsers.length
    const activeContracts = corporateUsers.filter(
      (u) => new Date(u.plan.renewal_date) > new Date()
    ).length
    const expiringContracts = corporateUsers.filter((u) => {
      const days = Math.ceil((new Date(u.plan.renewal_date) - new Date()) / (1000 * 60 * 60 * 24))
      return days <= 30 && days >= 0
    }).length
    const monthlyRevenue = corporateUsers.reduce(
      (sum, u) => sum + (u.billing?.monthly_cost || 0),
      0
    )

    return {
      totalContracts,
      activeContracts,
      expiringContracts,
      monthlyRevenue
    }
  }, [corporateUsers])

  return {
    getContractStatus,
    contractStats
  }
}

export default useCorporateCalculations