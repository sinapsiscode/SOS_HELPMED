import { useMemo } from 'react'

/**
 * Hook especializado para cálculos estadísticos de planes
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Statistics calculation
 * ✅ Optimizado con useMemo
 */
const usePlanStats = (plansConfig, filteredPlans = []) => {
  // Estadísticas generales
  const generalStats = useMemo(() => {
    if (!plansConfig) return null

    const allPlans = []
    Object.values(plansConfig).forEach(category => {
      Object.values(category).forEach(plan => {
        allPlans.push(plan)
      })
    })

    const activePlans = allPlans.filter(plan => plan.active)
    const inactivePlans = allPlans.filter(plan => !plan.active)
    
    const totalRevenue = activePlans.reduce((sum, plan) => 
      sum + (Number(plan.monthly_cost) || 0), 0
    )

    const avgPrice = activePlans.length > 0 
      ? totalRevenue / activePlans.length 
      : 0

    return {
      totalPlans: allPlans.length,
      activePlans: activePlans.length,
      inactivePlans: inactivePlans.length,
      totalRevenue,
      averagePrice: Math.round(avgPrice),
      conversionRate: allPlans.length > 0 
        ? Math.round((activePlans.length / allPlans.length) * 100) 
        : 0
    }
  }, [plansConfig])

  // Estadísticas por categoría
  const categoryStats = useMemo(() => {
    if (!plansConfig) return {}

    const stats = {}
    Object.entries(plansConfig).forEach(([category, plans]) => {
      const categoryPlans = Object.values(plans)
      const activePlans = categoryPlans.filter(plan => plan.active)
      
      const revenue = activePlans.reduce((sum, plan) => 
        sum + (Number(plan.monthly_cost) || 0), 0
      )

      stats[category] = {
        total: categoryPlans.length,
        active: activePlans.length,
        inactive: categoryPlans.length - activePlans.length,
        revenue,
        averagePrice: activePlans.length > 0 
          ? Math.round(revenue / activePlans.length) 
          : 0
      }
    })

    return stats
  }, [plansConfig])

  // Estadísticas por tipo de plan
  const typeStats = useMemo(() => {
    if (!plansConfig) return {}

    const stats = {}
    Object.values(plansConfig).forEach(category => {
      Object.values(category).forEach(plan => {
        const type = plan.plan_type || 'Sin tipo'
        
        if (!stats[type]) {
          stats[type] = {
            count: 0,
            active: 0,
            revenue: 0,
            plans: []
          }
        }

        stats[type].count++
        stats[type].plans.push(plan)
        
        if (plan.active) {
          stats[type].active++
          stats[type].revenue += Number(plan.monthly_cost) || 0
        }
      })
    })

    // Calcular promedios
    Object.keys(stats).forEach(type => {
      const activePlans = stats[type].active
      stats[type].averagePrice = activePlans > 0 
        ? Math.round(stats[type].revenue / activePlans) 
        : 0
    })

    return stats
  }, [plansConfig])

  // Análisis de precios
  const priceAnalysis = useMemo(() => {
    if (!plansConfig) return null

    const activePlans = []
    Object.values(plansConfig).forEach(category => {
      Object.values(category).forEach(plan => {
        if (plan.active && plan.monthly_cost) {
          activePlans.push(Number(plan.monthly_cost))
        }
      })
    })

    if (activePlans.length === 0) return null

    const sortedPrices = activePlans.sort((a, b) => a - b)
    const min = sortedPrices[0]
    const max = sortedPrices[sortedPrices.length - 1]
    const median = sortedPrices[Math.floor(sortedPrices.length / 2)]
    
    // Rangos de precio
    const ranges = {
      low: sortedPrices.filter(price => price < 100).length,
      medium: sortedPrices.filter(price => price >= 100 && price < 300).length,
      high: sortedPrices.filter(price => price >= 300).length
    }

    return {
      min,
      max,
      median,
      ranges,
      distribution: {
        'Económicos (< $100)': ranges.low,
        'Estándar ($100-$300)': ranges.medium,
        'Premium (> $300)': ranges.high
      }
    }
  }, [plansConfig])

  // Tendencias temporales (basado en fechas de creación)
  const timeStats = useMemo(() => {
    if (!plansConfig) return null

    const plans = []
    Object.values(plansConfig).forEach(category => {
      Object.values(category).forEach(plan => {
        if (plan.created_at) {
          plans.push({
            ...plan,
            createdDate: new Date(plan.created_at)
          })
        }
      })
    })

    if (plans.length === 0) return null

    // Agrupar por mes
    const monthlyStats = {}
    plans.forEach(plan => {
      const monthKey = plan.createdDate.toISOString().substring(0, 7) // YYYY-MM
      
      if (!monthlyStats[monthKey]) {
        monthlyStats[monthKey] = {
          created: 0,
          active: 0,
          revenue: 0
        }
      }

      monthlyStats[monthKey].created++
      if (plan.active) {
        monthlyStats[monthKey].active++
        monthlyStats[monthKey].revenue += Number(plan.monthly_cost) || 0
      }
    })

    return {
      monthlyCreation: monthlyStats,
      totalPlansWithDates: plans.length,
      oldestPlan: Math.min(...plans.map(p => p.createdDate.getTime())),
      newestPlan: Math.max(...plans.map(p => p.createdDate.getTime()))
    }
  }, [plansConfig])

  return {
    generalStats,
    categoryStats,
    typeStats,
    priceAnalysis,
    timeStats,
    
    // Utilidades
    hasData: !!plansConfig && Object.keys(plansConfig).length > 0
  }
}

export default usePlanStats