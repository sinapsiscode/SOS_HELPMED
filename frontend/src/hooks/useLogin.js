import { useState } from 'react'
import useAppStore from '../stores/useAppStore'
import { loginService } from '../services/loginService'

/**
 * Hook personalizado para gestión de login
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Toda la lógica de login centralizada en este hook
 * ✅ Regla #5: Estados gestionados completamente por el hook
 * ✅ Regla #7: Integración con servicios especializados
 *
 * @returns {Object} Estados y funciones de login
 */
const useLogin = () => {
  // Estados del formulario
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showCredentials, setShowCredentials] = useState(false)
  const [showRegistrationForm, setShowRegistrationForm] = useState(false)
  const [showParticularService, setShowParticularService] = useState(false)

  // Estado global
  const { login, isLoading } = useAppStore()

  /**
   * Maneja el envío del formulario de login
   */
  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Login attempt:', { username, password })

    if (username && password) {
      try {
        const result = await login(username, password)
        console.log('Login result:', result)

        if (!result.success) {
          console.error('Login failed:', result.error)
          loginService.showLoginError(result.error)
        }
      } catch (error) {
        console.error('Login error:', error)
        loginService.showLoginError(error.message)
      }
    } else {
      console.log('Missing credentials:', { username: !!username, password: !!password })
    }
  }

  /**
   * Maneja el login rápido con credenciales predefinidas
   */
  const quickLogin = async (type) => {
    const credentials = loginService.getQuickLoginCredentials(type)

    console.log('Quick login attempt:', { type, username: credentials.username })

    try {
      const result = await login(credentials.username, credentials.password)
      console.log('Quick login result:', result)

      if (!result.success) {
        console.error('Quick login failed:', result.error)
        loginService.showQuickLoginError(result.error)
      }
    } catch (error) {
      console.error('Quick login error:', error)
      loginService.showQuickLoginError(error.message)
    }
  }

  /**
   * Alterna la visibilidad de las credenciales
   */
  const toggleCredentials = () => {
    setShowCredentials(!showCredentials)
  }

  /**
   * Navega al formulario de registro
   */
  const goToRegistration = () => {
    setShowRegistrationForm(true)
  }

  /**
   * Vuelve del formulario de registro
   */
  const backFromRegistration = () => {
    setShowRegistrationForm(false)
  }

  /**
   * Navega al servicio particular
   */
  const goToParticular = () => {
    setShowParticularService(true)
  }

  /**
   * Vuelve del servicio particular
   */
  const backFromParticular = () => {
    setShowParticularService(false)
  }

  return {
    // Estados del formulario
    username,
    password,
    showCredentials,
    showRegistrationForm,
    showParticularService,
    isLoading,

    // Funciones de cambio de estado
    setUsername,
    setPassword,

    // Funciones de acción
    handleSubmit,
    quickLogin,
    toggleCredentials,

    // Funciones de navegación
    goToRegistration,
    backFromRegistration,
    goToParticular,
    backFromParticular
  }
}

export default useLogin
