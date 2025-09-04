import { renderHook, act } from '@testing-library/react'
import { useAffiliateManagement } from '../useAffiliateManagement'

// Mock del logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

// Mock de los esquemas de validación
jest.mock('../../schemas/affiliateSchema', () => ({
  affiliateSchema: {
    validate: jest.fn()
  }
}))

const mockUser = {
  id: 'user1',
  name: 'Usuario Test',
  affiliates: [
    {
      id: 'aff1',
      name: 'Afiliado Test',
      dni: '12345678',
      phone: '987654321',
      relationship: 'hijo',
      birthDate: '2000-01-01',
      status: 'active',
      addedAt: '2024-01-01T00:00:00.000Z'
    }
  ]
}

describe('useAffiliateManagement', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with user affiliates', () => {
    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    expect(result.current.affiliates).toHaveLength(1)
    expect(result.current.affiliates[0].name).toBe('Afiliado Test')
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
  })

  it('should initialize with empty affiliates when user has none', () => {
    const userWithoutAffiliates = { ...mockUser, affiliates: [] }
    const { result } = renderHook(() => useAffiliateManagement(userWithoutAffiliates))

    expect(result.current.affiliates).toHaveLength(0)
  })

  it('should add affiliate successfully', async () => {
    const { affiliateSchema } = require('../../schemas/affiliateSchema')
    affiliateSchema.validate.mockResolvedValue(true)

    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    const newAffiliate = {
      name: 'Nuevo Afiliado',
      dni: '87654321',
      phone: '123456789',
      relationship: 'conyuge',
      birthDate: '1990-01-01'
    }

    let addResult
    await act(async () => {
      addResult = await result.current.addAffiliate(newAffiliate)
    })

    expect(addResult.success).toBe(true)
    expect(addResult.message).toContain('agregado')
    expect(result.current.affiliates).toHaveLength(2)
    expect(result.current.affiliates[1].name).toBe('Nuevo Afiliado')
    expect(result.current.affiliates[1].status).toBe('active')
  })

  it('should handle validation errors when adding affiliate', async () => {
    const { affiliateSchema } = require('../../schemas/affiliateSchema')
    affiliateSchema.validate.mockRejectedValue(new Error('DNI inválido'))

    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    const invalidAffiliate = {
      name: '',
      dni: '123',
      relationship: 'hijo'
    }

    let addResult
    await act(async () => {
      addResult = await result.current.addAffiliate(invalidAffiliate)
    })

    expect(addResult.success).toBe(false)
    expect(addResult.error).toBe('DNI inválido')
    expect(result.current.affiliates).toHaveLength(1) // No se agregó
  })

  it('should prevent duplicate DNI', async () => {
    const { affiliateSchema } = require('../../schemas/affiliateSchema')
    affiliateSchema.validate.mockResolvedValue(true)

    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    const duplicateAffiliate = {
      name: 'Duplicate',
      dni: '12345678', // Same as existing affiliate
      relationship: 'padre'
    }

    let addResult
    await act(async () => {
      addResult = await result.current.addAffiliate(duplicateAffiliate)
    })

    expect(addResult.success).toBe(false)
    expect(addResult.error).toContain('Ya existe un afiliado con este DNI')
    expect(result.current.affiliates).toHaveLength(1)
  })

  it('should update affiliate successfully', async () => {
    const { affiliateSchema } = require('../../schemas/affiliateSchema')
    affiliateSchema.validate.mockResolvedValue(true)

    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    const updateData = {
      name: 'Nombre Actualizado',
      phone: '999888777'
    }

    let updateResult
    await act(async () => {
      updateResult = await result.current.updateAffiliate('aff1', updateData)
    })

    expect(updateResult.success).toBe(true)
    expect(updateResult.message).toContain('actualizado')
    expect(result.current.affiliates[0].name).toBe('Nombre Actualizado')
    expect(result.current.affiliates[0].phone).toBe('999888777')
  })

  it('should handle non-existent affiliate update', async () => {
    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    let updateResult
    await act(async () => {
      updateResult = await result.current.updateAffiliate('nonexistent', { name: 'Test' })
    })

    expect(updateResult.success).toBe(false)
    expect(updateResult.error).toContain('no encontrado')
  })

  it('should remove affiliate successfully', async () => {
    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    let removeResult
    await act(async () => {
      removeResult = await result.current.removeAffiliate('aff1')
    })

    expect(removeResult.success).toBe(true)
    expect(removeResult.message).toContain('eliminado')
    expect(result.current.affiliates).toHaveLength(0)
  })

  it('should toggle affiliate status', async () => {
    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    expect(result.current.affiliates[0].status).toBe('active')

    let toggleResult
    await act(async () => {
      toggleResult = await result.current.toggleAffiliateStatus('aff1')
    })

    expect(toggleResult.success).toBe(true)
    expect(result.current.affiliates[0].status).toBe('inactive')

    // Toggle back
    await act(async () => {
      await result.current.toggleAffiliateStatus('aff1')
    })

    expect(result.current.affiliates[0].status).toBe('active')
  })

  it('should get affiliate by ID', () => {
    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    const affiliate = result.current.getAffiliateById('aff1')
    expect(affiliate).not.toBeNull()
    expect(affiliate.name).toBe('Afiliado Test')

    const nonExistent = result.current.getAffiliateById('nonexistent')
    expect(nonExistent).toBeNull()
  })

  it('should calculate affiliate stats correctly', () => {
    const userWithMultipleAffiliates = {
      ...mockUser,
      affiliates: [
        { id: '1', status: 'active' },
        { id: '2', status: 'active' },
        { id: '3', status: 'inactive' }
      ]
    }

    const { result } = renderHook(() => useAffiliateManagement(userWithMultipleAffiliates))

    const stats = result.current.getAffiliateStats()
    expect(stats.total).toBe(3)
    expect(stats.active).toBe(2)
    expect(stats.inactive).toBe(1)
    expect(stats.activePercentage).toBe(67) // 2/3 * 100 rounded
  })

  it('should handle loading states correctly', async () => {
    const { affiliateSchema } = require('../../schemas/affiliateSchema')
    affiliateSchema.validate.mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve(true), 100))
    )

    const { result } = renderHook(() => useAffiliateManagement(mockUser))

    expect(result.current.loading).toBe(false)

    const addPromise = act(async () => {
      result.current.addAffiliate({ name: 'Test', dni: '12345', relationship: 'hijo' })
    })

    // Durante la operación async, loading debería ser true
    expect(result.current.loading).toBe(true)

    await addPromise

    // Después de completarse, loading debería ser false
    expect(result.current.loading).toBe(false)
  })
})
