import React from 'react'
import { loginService } from '../../services/loginService'

/**
 * Panel de acceso rápido con credenciales demo
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {boolean} props.showCredentials - Si mostrar credenciales
 * @param {Function} props.onToggleCredentials - Función para alternar visibilidad
 * @param {Function} props.onQuickLogin - Función para login rápido
 * @returns {JSX.Element} Panel de acceso rápido
 */
const QuickAccessPanel = ({ showCredentials, onToggleCredentials, onQuickLogin }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <PanelHeader showCredentials={showCredentials} onToggle={onToggleCredentials} />

      {showCredentials && <CredentialsGrid onQuickLogin={onQuickLogin} />}
    </div>
  )
}

/**
 * Cabecera del panel
 */
const PanelHeader = ({ showCredentials, onToggle }) => {
  return (
    <div className="flex items-center justify-between mb-3">
      <span className="text-sm font-medium text-blue-800 font-exo">
        Acceso rápido de demostración
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="text-blue-600 hover:text-blue-800 transition-colors"
      >
        <i className={`fas fa-${showCredentials ? 'eye-slash' : 'eye'}`}></i>
      </button>
    </div>
  )
}

/**
 * Grid de credenciales por categoría
 */
const CredentialsGrid = ({ onQuickLogin }) => {
  const categories = loginService.getAllUserCategories()

  return (
    <div className="space-y-3">
      {/* Administrador */}
      <CategoryCard
        category={categories.admin}
        users={loginService.getUsersByCategory('admin')}
        onQuickLogin={onQuickLogin}
      />

      {/* Planes Familiares */}
      <FamiliarPlansCard onQuickLogin={onQuickLogin} />

      {/* Ambulancias */}
      <AmbulancesCard onQuickLogin={onQuickLogin} />

      {/* Corporativo */}
      <CategoryCard
        category={categories.corporativo}
        users={loginService.getUsersByCategory('corporativo')}
        onQuickLogin={onQuickLogin}
      />

      {/* Externos */}
      <CategoryCard
        category={categories.externo}
        users={loginService.getUsersByCategory('externo')}
        onQuickLogin={onQuickLogin}
      />

      {/* Admin Externos */}
      <CategoryCard
        category={categories.externo_admin}
        users={loginService.getUsersByCategory('externo_admin')}
        onQuickLogin={onQuickLogin}
      />
    </div>
  )
}

/**
 * Tarjeta de categoría genérica
 */
const CategoryCard = ({ category, users, onQuickLogin }) => {
  if (!users.length) return null

  return (
    <div className={`bg-${category.color}-100 border border-${category.color}-200 rounded p-2`}>
      <p className={`text-xs font-semibold text-${category.color}-800 mb-1 font-exo`}>
        {category.name}
      </p>
      {users.map((user) => (
        <div key={user.type} className="mb-1">
          <p className={`text-xs text-${category.color}-700 font-roboto`}>{user.description}</p>
          <LoginButton type={user.type} color={category.color} onQuickLogin={onQuickLogin} />
        </div>
      ))}
    </div>
  )
}

/**
 * Tarjeta especializada para planes familiares
 */
const FamiliarPlansCard = ({ onQuickLogin }) => {
  const familiarUsers = loginService.getUsersByCategory('familiar')
  const color = 'green'

  return (
    <div className={`bg-${color}-100 border border-${color}-200 rounded p-2`}>
      <p className={`text-xs font-semibold text-${color}-800 mb-1 font-exo`}>PLANES FAMILIARES</p>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {familiarUsers.map((user) => (
          <div key={user.type}>
            <p className={`text-${color}-700 font-roboto`}>
              {user.displayName}: {user.credentials.username} / {user.credentials.password}
            </p>
            <LoginButton type={user.type} color={color} onQuickLogin={onQuickLogin} size="small" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Tarjeta especializada para ambulancias
 */
const AmbulancesCard = ({ onQuickLogin }) => {
  const ambulanceUsers = loginService.getUsersByCategory('ambulancia')
  const color = 'orange'

  return (
    <div className={`bg-${color}-100 border border-${color}-200 rounded p-2`}>
      <p className={`text-xs font-semibold text-${color}-800 mb-1 font-exo`}>AMBULANCIAS</p>
      <div className="grid grid-cols-2 gap-1 text-xs">
        {ambulanceUsers.map((user) => (
          <div key={user.type}>
            <p className={`text-${color}-700 font-roboto`}>
              {user.displayName}: {user.credentials.username} / {user.credentials.password}
            </p>
            <LoginButton type={user.type} color={color} onQuickLogin={onQuickLogin} size="small" />
          </div>
        ))}
      </div>
    </div>
  )
}

/**
 * Botón de login rápido
 */
const LoginButton = ({ type, color, onQuickLogin, size = 'normal' }) => {
  const sizeClasses = size === 'small' ? 'px-2 py-1 text-xs' : 'px-3 py-1.5 text-xs'

  return (
    <button
      type="button"
      onClick={() => onQuickLogin(type)}
      className={`bg-${color}-600 text-white ${sizeClasses} rounded mt-1 hover:bg-${color}-700 transition-colors font-medium font-roboto`}
    >
      <i className="fas fa-sign-in-alt mr-1"></i>
      Ingresar
    </button>
  )
}

export default QuickAccessPanel
