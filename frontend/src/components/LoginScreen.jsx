import React from 'react'
import useLogin from '../hooks/useLogin'
import RegistrationForm from './RegistrationForm'
import ParticularService from './particular/ParticularService'
import LogoSection from './login/LogoSection'
import LoginForm from './login/LoginForm'
import QuickAccessPanel from './login/QuickAccessPanel'
import RegistrationPrompt from './login/RegistrationPrompt'
import ParticularServiceButton from './login/ParticularServiceButton'
import Footer from './login/Footer'

/**
 * Componente de pantalla de login refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useLogin
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @returns {JSX.Element} Pantalla de login optimizada
 */
const LoginScreen = () => {
  const {
    // Estados
    username,
    password,
    showCredentials,
    showRegistrationForm,
    showParticularService,
    isLoading,

    // Funciones de cambio
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
  } = useLogin()

  if (showRegistrationForm) {
    return <RegistrationForm onBack={backFromRegistration} />
  }

  if (showParticularService) {
    return <ParticularService onBack={backFromParticular} />
  }

  return (
    <div className="min-h-screen gradient-helpmed flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-heavy p-6">
          <LogoSection />

          <div className="mb-3">
            <LoginForm
              username={username}
              password={password}
              isLoading={isLoading}
              onUsernameChange={setUsername}
              onPasswordChange={setPassword}
              onSubmit={handleSubmit}
            />
          </div>

          <div className="mb-2">
            <QuickAccessPanel
              showCredentials={showCredentials}
              onToggleCredentials={toggleCredentials}
              onQuickLogin={quickLogin}
            />
          </div>

          <RegistrationPrompt onGoToRegistration={goToRegistration} />

          <ParticularServiceButton onGoToParticular={goToParticular} />

          <Footer />
        </div>
      </div>
    </div>
  )
}

export default LoginScreen
