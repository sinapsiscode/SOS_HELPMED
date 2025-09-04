import { useMemo } from 'react'

/**
 * Hook especializado para benchmarks y evaluación de KPIs
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Benchmarking
 * ✅ Optimizado con useMemo
 */
const usePerformanceBenchmarks = (operationalKPIs) => {
  const benchmarks = useMemo(() => {
    const kpis = operationalKPIs

    // Definir objetivos/benchmarks para cada KPI
    const targets = {
      avgResponseTime: { target: 15, unit: 'min', critical: true },
      systemUptime: { target: 99.5, unit: '%', critical: true },
      firstCallResolutionRate: { target: 85, unit: '%', critical: false },
      ambulanceUtilization: { target: 75, unit: '%', critical: false },
      avgArrivalTime: { target: 20, unit: 'min', critical: true },
      avgSatisfaction: { target: 4.0, unit: '/5.0', critical: false },
      cancellationRate: { target: 5, unit: '%', critical: true },
      avgWorkloadPerOperator: { target: 50, unit: 'servicios/día', critical: false }
    }

    // Evaluar cada KPI contra su objetivo
    const evaluation = Object.entries(targets).map(([key, target]) => {
      const currentValue = kpis[key] || 0
      let status = 'unknown'
      let performance = 0

      if (key === 'cancellationRate') {
        // Menor es mejor
        status =
          currentValue <= target.target
            ? 'good'
            : currentValue <= target.target * 1.2
              ? 'warning'
              : 'critical'
        performance = Math.max(0, 100 - ((currentValue - target.target) / target.target) * 100)
      } else {
        // Mayor es mejor (para la mayoría)
        status =
          currentValue >= target.target
            ? 'good'
            : currentValue >= target.target * 0.8
              ? 'warning'
              : 'critical'
        performance = Math.min(100, (currentValue / target.target) * 100)
      }

      return {
        metric: key,
        current: currentValue,
        target: target.target,
        unit: target.unit,
        status,
        performance: Math.round(performance),
        critical: target.critical
      }
    })

    return {
      targets,
      evaluation,
      criticalIssues: evaluation.filter((item) => item.critical && item.status === 'critical')
        .length
    }
  }, [operationalKPIs])

  return {
    benchmarks
  }
}

export default usePerformanceBenchmarks