import React from 'react'
import useExternalDashboard from '../../hooks/useExternalDashboard'
import ExternalHeader from './ExternalHeader'
import ExternalBanners from './ExternalBanners'
import ExternalServiceForm from './ExternalServiceForm'
import UnlimitedPlanCard from './UnlimitedPlanCard'
import ExternalStats from './ExternalStats'
import ServiceUsageOverview from './ServiceUsageOverview'
import ExternalLimitsBreakdown from './ExternalLimitsBreakdown'
import LimitsCard from '../shared/LimitsCard'
import LimitAlert from '../shared/LimitAlert'
import externalService from '../../services/externalService'

/**
 * Dashboard de usuarios externos refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useExternalDashboard
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @returns {JSX.Element} Dashboard externo optimizado
 */
const ExternalDashboard = () => {
  const {
    // Estados básicos
    currentUser,
    activeTab,
    loading,
    error,
    isValidExternalUser,

    // Tipos de caso
    userCaseType,

    // Estados del formulario
    serviceFormData,
    formErrors,

    // Estados de ubicación GPS
    isGettingLocation,
    currentCoordinates,

    // Datos calculados
    externalStats,
    displayLimits,
    serviceBreakdown,

    // Funciones de navegación
    handleTabChange,

    // Funciones del formulario de servicio
    handleServiceRequest,
    updateServiceFormData,

    // Funciones de ubicación GPS
    handleGetLocation,
    useRegisteredAddress,

    // Funciones de servicios
    canUseService,
    hasAdditionalCost,
    handlePurchaseAdditional,

    // Funciones de control
    clearError
  } = useExternalDashboard()

  if (!isValidExternalUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800">Usuario externo no válido</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-teal-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Obtener alertas de banner
  const bannerAlerts = externalService.getBannerAlerts(currentUser)

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            user={currentUser}
            userCaseType={userCaseType}
            externalStats={externalStats}
            displayLimits={displayLimits}
            serviceBreakdown={serviceBreakdown}
            serviceFormData={serviceFormData}
            formErrors={formErrors}
            currentCoordinates={currentCoordinates}
            isGettingLocation={isGettingLocation}
            onServiceRequest={handleServiceRequest}
            onUpdateData={updateServiceFormData}
            onGetLocation={handleGetLocation}
            onUseAddress={useRegisteredAddress}
            canUseService={canUseService}
            hasAdditionalCost={hasAdditionalCost}
          />
        )
      case 'limits':
        return (
          <LimitsTab user={currentUser} userCaseType={userCaseType} displayLimits={displayLimits} />
        )
      default:
        return (
          <OverviewTab
            user={currentUser}
            userCaseType={userCaseType}
            externalStats={externalStats}
            displayLimits={displayLimits}
            serviceBreakdown={serviceBreakdown}
            serviceFormData={serviceFormData}
            formErrors={formErrors}
            currentCoordinates={currentCoordinates}
            isGettingLocation={isGettingLocation}
            onServiceRequest={handleServiceRequest}
            onUpdateData={updateServiceFormData}
            onGetLocation={handleGetLocation}
            onUseAddress={useRegisteredAddress}
            canUseService={canUseService}
            hasAdditionalCost={hasAdditionalCost}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Externo */}
      <ExternalHeader user={currentUser} />

      {/* Alertas de límites */}
      <div className="px-3 sm:px-4 py-3 sm:py-4">
        <LimitAlert user={currentUser} onPurchaseAdditional={handlePurchaseAdditional} />
      </div>

      {/* Banners informativos */}
      <ExternalBanners user={currentUser} bannerAlerts={bannerAlerts} />

      {/* Navigation Tabs - Responsive */}
      <div className="px-2 sm:px-4">
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6 max-w-6xl mx-auto">
          <nav className="flex space-x-1 sm:space-x-8 px-2 sm:px-6 overflow-x-auto scrollbar-hide">
            {[
              { id: 'overview', label: 'Resumen', shortLabel: 'Inicio', icon: 'fas fa-home' },
              { id: 'limits', label: 'Límites', shortLabel: 'Límites', icon: 'fas fa-chart-pie' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-3 sm:py-4 px-3 sm:px-0 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === tab.id
                    ? 'border-teal-500 text-teal-600 bg-teal-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-50'
                }`}
              >
                <i className={`${tab.icon} text-sm sm:text-base`}></i>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden text-xs mt-1">{tab.shortLabel}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="px-4 pb-6 sm:pb-8 max-w-6xl mx-auto">{renderTabContent()}</div>
    </div>
  )
}

// Componentes de las pestañas
const OverviewTab = ({
  user,
  userCaseType,
  externalStats,
  displayLimits,
  serviceBreakdown,
  serviceFormData,
  formErrors,
  currentCoordinates,
  isGettingLocation,
  onServiceRequest,
  onUpdateData,
  onGetLocation,
  onUseAddress,
  canUseService,
  hasAdditionalCost
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Columna izquierda - Solicitar servicios */}
      <div className="lg:col-span-2 space-y-6">
        <ExternalServiceForm
          user={user}
          formData={serviceFormData}
          errors={formErrors}
          coordinates={currentCoordinates}
          isGettingLocation={isGettingLocation}
          onUpdateData={onUpdateData}
          onGetLocation={onGetLocation}
          onUseAddress={onUseAddress}
          onSubmit={onServiceRequest}
          canUseService={canUseService}
          hasAdditionalCost={hasAdditionalCost}
        />

        <ServiceUsageOverview serviceBreakdown={serviceBreakdown} />
      </div>

      {/* Columna derecha - Información */}
      <div className="space-y-6">
        {userCaseType.isCaso1 ? (
          <UnlimitedPlanCard user={user} />
        ) : (
          <LimitsCard
            title="Tus Límites"
            limits={displayLimits}
            userType={user.role}
            planInfo={user.plan}
          />
        )}

        <ExternalStats stats={externalStats} user={user} />
      </div>
    </div>
  )
}

const LimitsTab = ({ user, userCaseType, displayLimits }) => {
  if (userCaseType.isCaso1) {
    return (
      <div className="bg-white rounded-xl shadow-medium p-8 text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <i className="fas fa-infinity text-green-600 text-2xl"></i>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2 font-exo">Servicios Ilimitados</h2>
        <p className="text-gray-600 mb-6 font-roboto">
          Tu plan incluye servicios ilimitados con facturación directa a tu empresa.
        </p>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 font-exo">Emergencias</h3>
            <p className="text-2xl font-bold text-blue-600 font-exo">∞</p>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-medium text-green-800 font-exo">Médico a Domicilio</h3>
            <p className="text-2xl font-bold text-green-600 font-exo">∞</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <LimitsCard
        title="Límites Detallados"
        limits={displayLimits}
        userType={user.role}
        planInfo={user.plan}
      />

      <ExternalLimitsBreakdown user={user} />
    </div>
  )
}

export default ExternalDashboard
