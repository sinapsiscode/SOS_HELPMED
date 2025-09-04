/**
 * Tests para hook de gestor offline
 * ✅ Regla #7: Tests en lógica crítica
 */
import { renderHook, act } from '@testing-library/react-hooks'
import useOfflineManager from '../useOfflineManager'
import useAppStore from '../../stores/useAppStore'

// Mock dependencies
jest.mock('../../stores/useAppStore')
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: false }))
}))
jest.mock('sweetalert2-react-content', () =>
  jest.fn(() => ({
    fire: jest.fn(() => Promise.resolve({ isConfirmed: false }))
  }))
)

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn()
}
global.localStorage = localStorageMock

// Mock navigator.onLine
Object.defineProperty(navigator, 'onLine', {
  writable: true,
  value: true
})

describe('useOfflineManager', () => {
  const mockCurrentUser = {
    id: 'user123',
    name: 'Test User'
  }

  beforeEach(() => {
    useAppStore.mockReturnValue({
      currentUser: mockCurrentUser
    })

    localStorageMock.getItem.mockReturnValue('{}')
    localStorageMock.setItem.mockClear()
    localStorageMock.removeItem.mockClear()

    // Reset navigator.onLine
    navigator.onLine = true

    jest.clearAllMocks()
  })

  afterEach(() => {
    // Clean up event listeners
    const events = ['online', 'offline']
    events.forEach((event) => {
      window.removeEventListener(event, jest.fn())
    })
  })

  it('should initialize with correct default state', () => {
    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.isOnline).toBe(true)
    expect(result.current.pendingSync).toEqual([])
    expect(result.current.lastSync).toBe(null)
    expect(result.current.syncInProgress).toBe(false)
    expect(result.current.offlineData).toEqual({})
  })

  it('should initialize offline state correctly', () => {
    navigator.onLine = false

    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.isOnline).toBe(false)
  })

  it('should load offline data from localStorage on init', () => {
    const mockOfflineData = { key1: 'value1' }
    const mockPendingSync = [{ id: 1, action: { type: 'TEST' } }]
    const mockLastSync = new Date().toISOString()

    localStorageMock.getItem.mockImplementation((key) => {
      switch (key) {
        case 'helpmed_offline_data':
          return JSON.stringify(mockOfflineData)
        case 'helpmed_pending_sync':
          return JSON.stringify(mockPendingSync)
        case 'helpmed_last_sync':
          return mockLastSync
        default:
          return null
      }
    })

    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.offlineData).toEqual(mockOfflineData)
    expect(result.current.pendingSync).toEqual(mockPendingSync)
    expect(result.current.lastSync).toEqual(new Date(mockLastSync))
  })

  it('should handle corrupted localStorage data gracefully', () => {
    localStorageMock.getItem.mockImplementation(() => 'invalid json')

    const { result } = renderHook(() => useOfflineManager())

    // Should initialize with defaults when localStorage data is corrupted
    expect(result.current.offlineData).toEqual({})
    expect(result.current.pendingSync).toEqual([])
    expect(result.current.lastSync).toBe(null)
  })

  it('should save offline data correctly', () => {
    const { result } = renderHook(() => useOfflineManager())

    const testData = { test: 'data' }

    act(() => {
      const success = result.current.saveOfflineData(testData)
      expect(success).toBe(true)
    })

    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      'helpmed_offline_data',
      JSON.stringify(testData)
    )
    expect(result.current.offlineData).toEqual(testData)
  })

  it('should add items to pending sync correctly', () => {
    const { result } = renderHook(() => useOfflineManager())

    const testAction = { type: 'CREATE_EMERGENCY_REQUEST', data: { test: true } }

    act(() => {
      const success = result.current.addToPendingSync(testAction)
      expect(success).toBe(true)
    })

    expect(result.current.pendingSync).toHaveLength(1)
    expect(result.current.pendingSync[0].action).toEqual(testAction)
    expect(result.current.pendingSync[0].userId).toBe(mockCurrentUser.id)
  })

  it('should calculate sync stats correctly', () => {
    const mockPendingSync = [
      {
        id: '1',
        timestamp: new Date(Date.now() - 1000).toISOString(),
        action: { type: 'TEST' },
        retryCount: 0
      },
      {
        id: '2',
        timestamp: new Date(Date.now() - 2000).toISOString(),
        action: { type: 'TEST2' },
        retryCount: 2
      }
    ]

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'helpmed_pending_sync') {
        return JSON.stringify(mockPendingSync)
      }
      return '{}'
    })

    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.syncStats.pendingCount).toBe(2)
    expect(result.current.syncStats.hasFailedItems).toBe(true)
    expect(result.current.syncStats.oldestPending).toBeInstanceOf(Date)
  })

  it('should limit displayed pending items', () => {
    const mockPendingSync = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      timestamp: new Date().toISOString(),
      action: { type: 'TEST' }
    }))

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'helpmed_pending_sync') {
        return JSON.stringify(mockPendingSync)
      }
      return '{}'
    })

    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.displayPendingItems).toHaveLength(5) // Limited to 5
    expect(result.current.syncStats.pendingCount).toBe(10) // But stats show all
  })

  it('should handle sync process correctly', async () => {
    const mockPendingSync = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        action: { type: 'TEST' },
        retryCount: 0
      }
    ]

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'helpmed_pending_sync') {
        return JSON.stringify(mockPendingSync)
      }
      return '{}'
    })

    const { result } = renderHook(() => useOfflineManager())

    expect(result.current.syncInProgress).toBe(false)

    await act(async () => {
      const syncResult = await result.current.handleSync()
      expect(syncResult.success).toBe(true)
    })

    expect(result.current.syncInProgress).toBe(false)
    expect(result.current.lastSync).toBeInstanceOf(Date)
  })

  it('should not sync when offline', async () => {
    navigator.onLine = false

    const { result } = renderHook(() => useOfflineManager())

    await act(async () => {
      const syncResult = await result.current.handleSync()
      expect(syncResult.success).toBe(false)
    })

    expect(result.current.syncInProgress).toBe(false)
  })

  it('should handle sync errors gracefully', async () => {
    const mockPendingSync = [
      {
        id: '1',
        timestamp: new Date().toISOString(),
        action: { type: 'TEST' },
        retryCount: 0
      }
    ]

    localStorageMock.getItem.mockImplementation((key) => {
      if (key === 'helpmed_pending_sync') {
        return JSON.stringify(mockPendingSync)
      }
      return '{}'
    })

    // Mock sync failure
    const originalSetTimeout = global.setTimeout
    global.setTimeout = jest.fn(() => {
      throw new Error('Sync error')
    })

    const { result } = renderHook(() => useOfflineManager())

    await act(async () => {
      const syncResult = await result.current.handleSync()
      expect(syncResult.success).toBe(false)
      expect(syncResult.error).toBeDefined()
    })

    global.setTimeout = originalSetTimeout
  })

  it('should provide correct function types', () => {
    const { result } = renderHook(() => useOfflineManager())

    expect(typeof result.current.saveOfflineData).toBe('function')
    expect(typeof result.current.addToPendingSync).toBe('function')
    expect(typeof result.current.handleSync).toBe('function')
    expect(typeof result.current.clearOfflineData).toBe('function')
    expect(typeof result.current.loadOfflineData).toBe('function')
    expect(typeof result.current.showOfflineNotification).toBe('function')
    expect(typeof result.current.handleAutoSync).toBe('function')
  })

  it('should maintain stable references for memoized values', () => {
    const { result, rerender } = renderHook(() => useOfflineManager())

    const firstSyncStats = result.current.syncStats
    const firstDisplayItems = result.current.displayPendingItems

    rerender()

    // Should maintain same reference if underlying data hasn't changed
    expect(result.current.syncStats).toBe(firstSyncStats)
    expect(result.current.displayPendingItems).toBe(firstDisplayItems)
  })
})
