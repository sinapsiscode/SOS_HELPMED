/**
 * Tests para hook de sección de perfil
 * ✅ Regla #7: Tests en lógica crítica
 */
import { renderHook, act } from '@testing-library/react-hooks'
import useProfileSection from '../useProfileSection'
import useAppStore from '../../stores/useAppStore'

// Mock del store
jest.mock('../../stores/useAppStore')
jest.mock('sweetalert2', () => ({
  fire: jest.fn(),
  showValidationMessage: jest.fn()
}))

describe('useProfileSection', () => {
  const mockCurrentUser = {
    id: 'user123',
    name: 'Carlos Mendoza',
    username: 'carlos.mendoza',
    membership: 'Plan MED',
    phone: '+51 9 8765 4321',
    email: 'carlos@email.com',
    profile: {
      phone: '+51 9 8765 4321',
      email: 'carlos@email.com',
      address: 'Av. Lince 2594, Lince'
    }
  }

  const mockUpdateUserProfile = jest.fn()
  const mockLogout = jest.fn()

  beforeEach(() => {
    useAppStore.mockReturnValue({
      currentUser: mockCurrentUser,
      updateUserProfile: mockUpdateUserProfile,
      logout: mockLogout
    })
    jest.clearAllMocks()
  })

  it('should initialize with correct user info', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(result.current.userInfo).toEqual({
      name: 'Carlos Mendoza',
      username: 'carlos.mendoza',
      membership: 'Plan MED',
      phone: '+51 9 8765 4321',
      email: 'carlos@email.com',
      address: 'Av. Lince 2594, Lince',
      avatar: 'C'
    })
  })

  it('should initialize with default values when user data is missing', () => {
    useAppStore.mockReturnValue({
      currentUser: null,
      updateUserProfile: mockUpdateUserProfile,
      logout: mockLogout
    })

    const { result } = renderHook(() => useProfileSection())

    expect(result.current.userInfo).toEqual({
      name: 'Usuario',
      username: 'user',
      membership: 'Sin Plan',
      phone: '+51 9 8765 4321',
      email: 'usuario@email.com',
      address: 'Av. Lince 2594, Lince',
      avatar: 'U'
    })
  })

  it('should provide emergency contacts', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(result.current.emergencyContacts).toHaveLength(2)
    expect(result.current.emergencyContacts[0]).toEqual({
      id: 1,
      name: 'María Mendoza',
      relationship: 'Madre',
      phone: '+51 9 1234 5678',
      isPrimary: true
    })
  })

  it('should provide medical information', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(result.current.medicalInfo).toHaveLength(4)
    expect(result.current.medicalInfo[0]).toEqual({
      label: 'Tipo de Sangre',
      value: 'O+'
    })
  })

  it('should provide settings items', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(result.current.settingsItems).toHaveLength(3)
    expect(result.current.settingsItems[0]).toEqual({
      id: 'notifications',
      icon: 'fas fa-bell',
      title: 'Notificaciones',
      description: 'Gestionar alertas y notificaciones'
    })
  })

  it('should handle edit data state changes', () => {
    const { result } = renderHook(() => useProfileSection())

    act(() => {
      result.current.setEditData({
        phone: '+51 9 9999 9999',
        email: 'nuevo@email.com'
      })
    })

    expect(result.current.editData.phone).toBe('+51 9 9999 9999')
    expect(result.current.editData.email).toBe('nuevo@email.com')
  })

  it('should handle editing state toggle', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(result.current.isEditing).toBe(false)

    act(() => {
      result.current.setIsEditing(true)
    })

    expect(result.current.isEditing).toBe(true)
  })

  it('should have handleEditProfile function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.handleEditProfile).toBe('function')
  })

  it('should have handleLogout function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.handleLogout).toBe('function')
  })

  it('should have handleSettingAction function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.handleSettingAction).toBe('function')
  })

  it('should have handleCallEmergencyContact function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.handleCallEmergencyContact).toBe('function')
  })

  it('should have handleUpdateMedicalInfo function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.handleUpdateMedicalInfo).toBe('function')
  })

  it('should have validateData function', () => {
    const { result } = renderHook(() => useProfileSection())

    expect(typeof result.current.validateData).toBe('function')
  })

  it('should update user info when current user changes', () => {
    const { result, rerender } = renderHook(() => useProfileSection())

    const newUser = {
      ...mockCurrentUser,
      name: 'Juan Pérez',
      username: 'juan.perez'
    }

    useAppStore.mockReturnValue({
      currentUser: newUser,
      updateUserProfile: mockUpdateUserProfile,
      logout: mockLogout
    })

    rerender()

    expect(result.current.userInfo.name).toBe('Juan Pérez')
    expect(result.current.userInfo.username).toBe('juan.perez')
    expect(result.current.userInfo.avatar).toBe('J')
  })

  it('should maintain stable references for memoized values', () => {
    const { result, rerender } = renderHook(() => useProfileSection())

    const firstEmergencyContacts = result.current.emergencyContacts
    const firstMedicalInfo = result.current.medicalInfo
    const firstSettingsItems = result.current.settingsItems

    rerender()

    expect(result.current.emergencyContacts).toBe(firstEmergencyContacts)
    expect(result.current.medicalInfo).toBe(firstMedicalInfo)
    expect(result.current.settingsItems).toBe(firstSettingsItems)
  })

  it('should handle user with partial profile data', () => {
    const partialUser = {
      id: 'user456',
      name: 'Ana García',
      phone: '+51 9 1111 1111'
      // Sin email, username, profile, etc.
    }

    useAppStore.mockReturnValue({
      currentUser: partialUser,
      updateUserProfile: mockUpdateUserProfile,
      logout: mockLogout
    })

    const { result } = renderHook(() => useProfileSection())

    expect(result.current.userInfo.name).toBe('Ana García')
    expect(result.current.userInfo.username).toBe('user')
    expect(result.current.userInfo.phone).toBe('+51 9 1111 1111')
    expect(result.current.userInfo.email).toBe('usuario@email.com')
  })
})
