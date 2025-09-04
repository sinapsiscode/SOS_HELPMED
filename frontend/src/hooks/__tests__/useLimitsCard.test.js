/**
 * Tests para hook de límites de servicios
 * ✅ Regla #7: Tests en lógica crítica
 */
import { renderHook } from '@testing-library/react-hooks'
import useLimitsCard from '../useLimitsCard'

describe('useLimitsCard', () => {
  const mockLimitsWithUsage = {
    EMERGENCIA: { used: 5, limit: 10 },
    URGENCIA: { used: 8, limit: 10 },
    MEDICO_DOMICILIO: { used: 3, limit: 5 }
  }

  const mockLimitsUnlimited = {
    EMERGENCIA: 'ILIMITADO',
    URGENCIA: 'FLEXIBLE',
    ORIENTACION_TELEFONICA: 'ILIMITADO'
  }

  const mockLimitsFlexible = {
    GENERAL: 8 // 8 servicios restantes
  }

  const mockPlanInfo = {
    name: 'Plan MED',
    total_services: 12,
    benefits: {
      emergencias_ilimitadas: true,
      orientacion_telefonica: true,
      zona_protegida: false,
      seguro_accidentes: true,
      examenes_laboratorio: false
    }
  }

  it('should process limits with usage correctly', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Mis Límites', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.isValid).toBe(true)
    expect(result.current.processedLimits).toHaveLength(3)

    const emergencyLimit = result.current.processedLimits.find(
      (l) => l.serviceType === 'EMERGENCIA'
    )
    expect(emergencyLimit.type).toBe('tracked')
    expect(emergencyLimit.used).toBe(5)
    expect(emergencyLimit.limit).toBe(10)
    expect(emergencyLimit.percentage).toBe(50)
    expect(emergencyLimit.isNearLimit).toBe(false)
    expect(emergencyLimit.isAtLimit).toBe(false)
  })

  it('should identify near limit and at limit services', () => {
    const limitsNearExhausted = {
      URGENCIA: { used: 9, limit: 10 }, // 90% - near limit
      MEDICO_DOMICILIO: { used: 5, limit: 5 } // 100% - at limit
    }

    const { result } = renderHook(() =>
      useLimitsCard('Límites', limitsNearExhausted, 'FAMILIAR', mockPlanInfo)
    )

    const urgencyLimit = result.current.processedLimits.find((l) => l.serviceType === 'URGENCIA')
    expect(urgencyLimit.isNearLimit).toBe(true)
    expect(urgencyLimit.isAtLimit).toBe(false)
    expect(urgencyLimit.status).toBe('warning')

    const medicoLimit = result.current.processedLimits.find(
      (l) => l.serviceType === 'MEDICO_DOMICILIO'
    )
    expect(medicoLimit.isAtLimit).toBe(true)
    expect(medicoLimit.status).toBe('exhausted')
  })

  it('should process unlimited limits correctly', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Límites', mockLimitsUnlimited, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.processedLimits).toHaveLength(3)

    const emergencyLimit = result.current.processedLimits.find(
      (l) => l.serviceType === 'EMERGENCIA'
    )
    expect(emergencyLimit.type).toBe('unlimited')
    expect(emergencyLimit.value).toBe('ILIMITADO')
  })

  it('should process flexible limits (Plan Help) correctly', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Plan Help', mockLimitsFlexible, 'FAMILIAR', mockPlanInfo)
    )

    const flexibleLimit = result.current.processedLimits[0]
    expect(flexibleLimit.type).toBe('flexible')
    expect(flexibleLimit.remaining).toBe(8)
    expect(flexibleLimit.total).toBe(12)
    expect(flexibleLimit.used).toBe(4)
    expect(flexibleLimit.percentage).toBe(33) // 4/12 * 100 rounded
  })

  it('should get correct service icons', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.getServiceIcon('EMERGENCIA')).toBe('fas fa-ambulance')
    expect(result.current.getServiceIcon('URGENCIA')).toBe('fas fa-clock')
    expect(result.current.getServiceIcon('MEDICO_DOMICILIO')).toBe('fas fa-user-md')
    expect(result.current.getServiceIcon('UNKNOWN')).toBe('fas fa-medical-cross')
  })

  it('should get correct service names', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.getServiceName('EMERGENCIA')).toBe('Emergencias')
    expect(result.current.getServiceName('URGENCIA')).toBe('Urgencias')
    expect(result.current.getServiceName('MEDICO_DOMICILIO')).toBe('Médico a Domicilio')
  })

  it('should get correct service descriptions', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.getServiceDescription('EMERGENCIA')).toBe('Situaciones críticas 24/7')
    expect(result.current.getServiceDescription('URGENCIA')).toBe('Atención médica prioritaria')
    expect(result.current.getServiceDescription('MEDICO_DOMICILIO')).toBe('Consultas en tu hogar')
  })

  it('should get correct plan badge colors', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.getPlanBadgeColor('FAMILIAR')).toBe('bg-green-100 text-green-800')
    expect(result.current.getPlanBadgeColor('CORPORATIVO')).toBe('bg-purple-100 text-purple-800')
    expect(result.current.getPlanBadgeColor('EXTERNO')).toBe('bg-blue-100 text-blue-800')
    expect(result.current.getPlanBadgeColor('ADMIN')).toBe('bg-red-100 text-red-800')
  })

  it('should process plan benefits correctly', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.planBenefits).toHaveLength(3) // solo los que están en true
    expect(result.current.planBenefits).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ key: 'emergencias_ilimitadas', text: 'Emergencias ilimitadas' }),
        expect.objectContaining({ key: 'orientacion_telefonica', text: 'Orientación telefónica' }),
        expect.objectContaining({ key: 'seguro_accidentes', text: 'Seguro de accidentes' })
      ])
    )
  })

  it('should calculate statistics correctly', () => {
    const mixedLimits = {
      EMERGENCIA: 'ILIMITADO',
      URGENCIA: { used: 9, limit: 10 }, // warning
      MEDICO_DOMICILIO: { used: 5, limit: 5 } // exhausted
    }

    const { result } = renderHook(() =>
      useLimitsCard('Test', mixedLimits, 'FAMILIAR', mockPlanInfo)
    )

    expect(result.current.statistics.totalServices).toBe(3)
    expect(result.current.statistics.exhaustedServices).toBe(1)
    expect(result.current.statistics.warningServices).toBe(1)
    expect(result.current.statistics.unlimitedServices).toBe(1)
  })

  it('should handle invalid data gracefully', () => {
    const { result } = renderHook(() => useLimitsCard('', {}, 'INVALID_TYPE', null))

    expect(result.current.isValid).toBe(false)
    expect(result.current.errors).toBeDefined()
  })

  it('should handle empty limits', () => {
    const { result } = renderHook(() => useLimitsCard('Test', {}, 'FAMILIAR', mockPlanInfo))

    expect(result.current.isValid).toBe(false)
    expect(result.current.errors).toBeDefined()
  })

  it('should calculate limit status correctly', () => {
    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', mockPlanInfo)
    )

    const status50 = result.current.calculateLimitStatus({ used: 5, limit: 10 })
    expect(status50.percentage).toBe(50)
    expect(status50.status).toBe('normal')

    const status90 = result.current.calculateLimitStatus({ used: 9, limit: 10 })
    expect(status90.percentage).toBe(90)
    expect(status90.status).toBe('warning')

    const status100 = result.current.calculateLimitStatus({ used: 10, limit: 10 })
    expect(status100.percentage).toBe(100)
    expect(status100.status).toBe('exhausted')
  })

  it('should handle plan without benefits', () => {
    const planWithoutBenefits = { name: 'Plan Basic' }

    const { result } = renderHook(() =>
      useLimitsCard('Test', mockLimitsWithUsage, 'FAMILIAR', planWithoutBenefits)
    )

    expect(result.current.planBenefits).toHaveLength(0)
  })
})
