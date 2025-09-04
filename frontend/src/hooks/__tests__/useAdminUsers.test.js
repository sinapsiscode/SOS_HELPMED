import { renderHook, act } from '@testing-library/react'
import { useAdminUsers } from '../useAdminUsers'

// Mock del logger
jest.mock('../../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn()
  }
}))

describe('useAdminUsers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should initialize with empty state', () => {
    const { result } = renderHook(() => useAdminUsers())

    expect(result.current.users).toEqual([])
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBe(null)
    expect(result.current.searchTerm).toBe('')
    expect(result.current.filterStatus).toBe('all')
  })

  it('should update search term', () => {
    const { result } = renderHook(() => useAdminUsers())

    act(() => {
      result.current.setSearchTerm('test')
    })

    expect(result.current.searchTerm).toBe('test')
  })

  it('should update filter status', () => {
    const { result } = renderHook(() => useAdminUsers())

    act(() => {
      result.current.setFilterStatus('active')
    })

    expect(result.current.filterStatus).toBe('active')
  })

  it('should handle user update successfully', async () => {
    const { result } = renderHook(() => useAdminUsers())

    // Wait for initial load to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    const updateResult = await act(async () => {
      return await result.current.updateUser('1', { name: 'Updated Name' })
    })

    expect(updateResult.success).toBe(true)
    expect(updateResult.message).toContain('actualizado')
  })

  it('should handle user update with invalid ID', async () => {
    const { result } = renderHook(() => useAdminUsers())

    const updateResult = await act(async () => {
      return await result.current.updateUser('', { name: 'Test' })
    })

    expect(updateResult.success).toBe(false)
    expect(updateResult.error).toContain('requerido')
  })

  it('should handle user deletion successfully', async () => {
    const { result } = renderHook(() => useAdminUsers())

    // Wait for initial load to complete
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    const deleteResult = await act(async () => {
      return await result.current.deleteUser('1')
    })

    expect(deleteResult.success).toBe(true)
    expect(deleteResult.message).toContain('eliminado')
  })

  it('should handle user deletion with invalid ID', async () => {
    const { result } = renderHook(() => useAdminUsers())

    const deleteResult = await act(async () => {
      return await result.current.deleteUser('')
    })

    expect(deleteResult.success).toBe(false)
    expect(deleteResult.error).toContain('requerido')
  })

  it('should filter users by search term', async () => {
    const { result } = renderHook(() => useAdminUsers())

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    // Set search term
    act(() => {
      result.current.setSearchTerm('Juan')
    })

    // Users should be filtered by name
    expect(result.current.users.length).toBeGreaterThan(0)
    expect(
      result.current.users.every(
        (user) =>
          user.name.toLowerCase().includes('juan') || user.email.toLowerCase().includes('juan')
      )
    ).toBe(true)
  })

  it('should filter users by status', async () => {
    const { result } = renderHook(() => useAdminUsers())

    // Wait for initial load
    await act(async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
    })

    // Set status filter
    act(() => {
      result.current.setFilterStatus('active')
    })

    // Users should be filtered by status
    expect(result.current.users.every((user) => user.status === 'active')).toBe(true)
  })
})
