import React from 'react'
import useCorporateDashboard from '../../hooks/useCorporateDashboard'
import CorporateHeader from './CorporateHeader'
import OverviewTab from './tabs/OverviewTab'
import ReportsTab from './tabs/ReportsTab'
import ContractTab from './tabs/ContractTab'
import BillingTab from './tabs/BillingTab'

/**
 * Dashboard corporativo refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useCorporateDashboard
 * ✅ Regla #3: Componente principal <200 líneas (ahora 195 líneas)
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @returns {JSX.Element} Dashboard corporativo optimizado
 */
const CorporateDashboard = () => {
  const {
    // Estados básicos
    currentUser,
    activeTab,
    loading,
    error,
    isValidCorporateUser,

    // Estados del formulario
    emergencyFormData,
    formErrors,

    // Datos calculados
    companyStats,
    contractAlerts,
    reportData,

    // Funciones de navegación
    handleTabChange,

    // Funciones del formulario de emergencia
    handleEmergencyRequest,
    updateEmergencyFormData,

    // Funciones de alertas y servicios
    handlePurchaseAdditional,
    handleContractRenewal,
    handleContactSales,
    handleSOSEmergency,

    // Funciones de contrato
    handleDownloadContract,
    handleViewContract,

    // Funciones de control
    clearError,
    logout
  } = useCorporateDashboard()

  // Validación de usuario
  if (!isValidCorporateUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800">Usuario corporativo no válido</p>
          <button
            onClick={logout}
            className="mt-4 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            Volver al login
          </button>
        </div>
      </div>
    )
  }

  // Estado de carga
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-blue-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  // Manejo de errores
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md">
          <i className="fas fa-exclamation-circle text-red-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800 mb-2">Error al cargar el dashboard</p>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={clearError}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  // Configuración de tabs
  const tabs = [
    { id: 'overview', name: 'Resumen', icon: 'fa-home', short: 'Resumen' },
    { id: 'reports', name: 'Reportes', icon: 'fa-chart-bar', short: 'Rep.' },
    { id: 'contract', name: 'Contrato', icon: 'fa-file-contract', short: 'Cont.' },
    { id: 'billing', name: 'Facturación', icon: 'fa-file-invoice-dollar', short: 'Fact.' }
  ]

  // Renderizado de contenido de tabs
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            user={currentUser}
            companyStats={companyStats}
            contractAlerts={contractAlerts}
            emergencyFormData={emergencyFormData}
            formErrors={formErrors}
            loading={loading}
            onEmergencyRequest={handleEmergencyRequest}
            onUpdateData={updateEmergencyFormData}
            onPurchaseAdditional={handlePurchaseAdditional}
            onRenewal={handleContractRenewal}
            onContact={handleContactSales}
            onSOSEmergency={handleSOSEmergency}
          />
        )
      case 'reports':
        return <ReportsTab reportData={reportData} />
      case 'contract':
        return (
          <ContractTab
            user={currentUser}
            onDownloadContract={handleDownloadContract}
            onViewContract={handleViewContract}
          />
        )
      case 'billing':
        return <BillingTab user={currentUser} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <CorporateHeader user={currentUser} onLogout={logout} />

      {/* Navigation Tabs */}
      <div className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto">
          <nav className="flex overflow-x-auto scrollbar-hide" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`
                  flex-1 min-w-0 py-3 px-3 sm:px-4 text-center border-b-2 font-medium text-xs sm:text-sm transition-colors
                  flex flex-col sm:flex-row items-center justify-center sm:space-x-2 whitespace-nowrap
                  ${
                    activeTab === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                <i className={`fas ${tab.icon} text-base sm:text-lg`}></i>
                <span className="hidden sm:inline">{tab.name}</span>
                <span className="sm:hidden text-xs">{tab.short}</span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 py-6 sm:py-8">{renderTabContent()}</div>
    </div>
  )
}

export default CorporateDashboard
