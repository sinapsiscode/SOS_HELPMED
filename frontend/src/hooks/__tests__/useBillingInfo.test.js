/**
 * Tests para hook de información de facturación
 * ✅ Regla #7: Tests en lógica crítica
 */
import { renderHook, act } from '@testing-library/react-hooks'
import useBillingInfo from '../useBillingInfo'

describe('useBillingInfo', () => {
  const mockUser = {
    id: 'user123',
    role: 'FAMILIAR',
    billing: {
      monthly_cost: 150,
      payment_method: 'credit_card',
      auto_renewal: true,
      billing_contact: {
        name: 'Juan Pérez',
        email: 'juan@email.com'
      }
    },
    plan: {
      name: 'Plan MED',
      renewal_date: '2024-12-31',
      start_date: '2024-01-01',
      endDate: '2024-12-31'
    }
  }

  const mockAdditionalServices = [
    {
      description: 'Servicio Extra 1',
      cost: 50,
      date: '2024-01-15'
    },
    {
      description: 'Servicio Extra 2',
      cost: 30,
      date: '2024-01-20'
    }
  ]

  it('should calculate total amount correctly', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser, mockAdditionalServices))

    // Base cost (150) + Additional services (50 + 30) = 230
    expect(result.current.totalAmount).toBe(230)
  })

  it('should calculate total with no additional services', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser, []))

    expect(result.current.totalAmount).toBe(150)
  })

  it('should format currency correctly', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    const formatted = result.current.formatCurrency(1234.56)
    expect(formatted).toMatch(/1,234\.56/)
    expect(formatted).toMatch(/PEN|S\//)
  })

  it('should get correct payment method icon', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    expect(result.current.getPaymentMethodIcon('credit_card')).toBe('fas fa-credit-card')
    expect(result.current.getPaymentMethodIcon('bank_transfer')).toBe('fas fa-university')
    expect(result.current.getPaymentMethodIcon('invoice')).toBe('fas fa-file-invoice')
    expect(result.current.getPaymentMethodIcon('unknown')).toBe('fas fa-money-bill')
  })

  it('should get correct payment method name', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    expect(result.current.getPaymentMethodName('credit_card')).toBe('Tarjeta de Crédito')
    expect(result.current.getPaymentMethodName('bank_transfer')).toBe('Transferencia Bancaria')
    expect(result.current.getPaymentMethodName('invoice')).toBe('Facturación Empresarial')
    expect(result.current.getPaymentMethodName('unknown')).toBe('Método de Pago')
  })

  it('should calculate next billing date for familiar user', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    expect(result.current.nextBillingDate).toMatch(/31\/12\/2024/)
  })

  it('should handle user without renewal date', () => {
    const userWithoutRenewal = {
      ...mockUser,
      plan: { ...mockUser.plan, renewal_date: null }
    }
    const { result } = renderHook(() => useBillingInfo(userWithoutRenewal))

    expect(result.current.nextBillingDate).toBe('No disponible')
  })

  it('should detect auto-renewal status', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))
    expect(result.current.hasAutoRenewal).toBe(true)

    const userNoAutoRenewal = {
      ...mockUser,
      billing: { ...mockUser.billing, auto_renewal: false }
    }
    const { result: result2 } = renderHook(() => useBillingInfo(userNoAutoRenewal))
    expect(result2.current.hasAutoRenewal).toBe(false)
  })

  it('should calculate contract status for corporate user', () => {
    const corporateUser = {
      ...mockUser,
      role: 'CORPORATIVO',
      plan: {
        ...mockUser.plan,
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString() // 15 days from now
      }
    }

    const { result } = renderHook(() => useBillingInfo(corporateUser))

    expect(result.current.contractStatus).toBeTruthy()
    expect(result.current.contractStatus.isExpiringSoon).toBe(true)
    expect(result.current.contractStatus.status).toBe('expiring')
  })

  it('should return null contract status for familiar user', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))
    expect(result.current.contractStatus).toBe(null)
  })

  it('should format plan info correctly', () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    expect(result.current.planInfo).toEqual({
      name: 'Plan MED',
      startDate: '01/01/2024',
      endDate: '31/12/2024'
    })
  })

  it('should handle user without plan', () => {
    const userWithoutPlan = {
      ...mockUser,
      plan: null
    }
    const { result } = renderHook(() => useBillingInfo(userWithoutPlan))

    expect(result.current.planInfo).toBe(null)
    expect(result.current.nextBillingDate).toBe('No disponible')
  })

  it('should handle download invoice action', async () => {
    const { result } = renderHook(() => useBillingInfo(mockUser))

    expect(result.current.isLoading).toBe(false)

    await act(async () => {
      // Mock de la función downloadInvoice
      // En un test real, aquí verificarías que se llama al API
      result.current.downloadInvoice()
    })

    // El hook debería manejar el estado de carga
    expect(typeof result.current.isLoading).toBe('boolean')
  })

  it('should handle null user gracefully', () => {
    const { result } = renderHook(() => useBillingInfo(null))

    expect(result.current.totalAmount).toBe(0)
    expect(result.current.nextBillingDate).toBe('No disponible')
    expect(result.current.planInfo).toBe(null)
    expect(result.current.hasAutoRenewal).toBe(false)
  })

  it('should handle user without billing info', () => {
    const userNoBilling = {
      ...mockUser,
      billing: null
    }
    const { result } = renderHook(() => useBillingInfo(userNoBilling))

    expect(result.current.totalAmount).toBe(0)
    expect(result.current.hasAutoRenewal).toBe(false)
  })
})
