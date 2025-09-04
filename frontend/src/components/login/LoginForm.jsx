import React from 'react'

/**
 * Formulario principal de login
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {string} props.username - Usuario actual
 * @param {string} props.password - Contraseña actual
 * @param {boolean} props.isLoading - Si está cargando
 * @param {Function} props.onUsernameChange - Función para cambiar usuario
 * @param {Function} props.onPasswordChange - Función para cambiar contraseña
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @returns {JSX.Element} Formulario de login
 */
const LoginForm = ({
  username,
  password,
  isLoading,
  onUsernameChange,
  onPasswordChange,
  onSubmit
}) => {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <UsernameField value={username} onChange={onUsernameChange} />

      <PasswordField value={password} onChange={onPasswordChange} />

      <LoginButton isLoading={isLoading} isDisabled={isLoading || !username || !password} />
    </form>
  )
}

/**
 * Campo de usuario
 */
const UsernameField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Usuario</label>
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ingresa tu usuario"
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
        <i className="fas fa-user absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>
  )
}

/**
 * Campo de contraseña
 */
const PasswordField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-exo font-medium text-gray-700 mb-2">Contraseña</label>
      <div className="relative">
        <input
          type="password"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Ingresa tu contraseña"
          className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue transition-colors font-roboto"
          required
        />
        <i className="fas fa-lock absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
      </div>
    </div>
  )
}

/**
 * Botón de login
 */
const LoginButton = ({ isLoading, isDisabled }) => {
  return (
    <button
      type="submit"
      disabled={isDisabled}
      className="w-full relative overflow-hidden bg-gradient-to-r from-helpmed-blue to-primary-blue text-white py-3 px-4 rounded-lg font-exo font-semibold transition-all duration-300 hover:shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isLoading ? <LoadingContent /> : 'Iniciar Sesión'}

      {!isLoading && <ButtonHoverEffect />}
    </button>
  )
}

/**
 * Contenido de carga
 */
const LoadingContent = () => {
  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
      Iniciando sesión...
    </div>
  )
}

/**
 * Efecto de hover del botón
 */
const ButtonHoverEffect = () => {
  return (
    <div className="absolute inset-0 bg-white opacity-0 hover:opacity-10 transition-opacity"></div>
  )
}

export default LoginForm
