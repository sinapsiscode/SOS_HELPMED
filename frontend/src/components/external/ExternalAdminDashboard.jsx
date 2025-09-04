import React from 'react'
import useExternalAdminDashboard from '../../hooks/useExternalAdminDashboard'
import ExternalAdminHeader from './ExternalAdminHeader'
import ExternalAdminKPICard from './ExternalAdminKPICard'
import {
  ServiceDistributionChart,
  MonthlyTrendChart,
  EmployeeUtilizationChart
} from './ExternalAdminCharts'
import {
  RecentServicesList,
  EmployeesTable,
  ServiceDetailsTable,
  ReportCards
} from './ExternalAdminTables'

/**
 * Dashboard para administradores externos refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useExternalAdminDashboard
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @returns {JSX.Element} Dashboard de administrador externo optimizado
 */
const ExternalAdminDashboard = () => {
  const {
    // Estados básicos
    currentUser,
    activeTab,
    loading,
    error,
    isValidExternalAdmin,

    // Filtros y configuración
    dateFilter,
    organizationInfo,

    // Datos calculados
    summaryStats,
    employeesData,
    recentServicesFormatted,

    // Funciones de navegación
    handleTabChange,

    // Funciones de filtros
    updateDateFilter,
    resetToLastMonth,

    // Funciones de datos
    handleExportReport,

    // Funciones de control
    clearError
  } = useExternalAdminDashboard()

  if (!isValidExternalAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-exclamation-triangle text-red-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800 font-exo">Usuario no autorizado</p>
          <p className="text-gray-600 font-roboto">No tienes permisos para acceder a este panel</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <i className="fas fa-spinner fa-spin text-green-500 text-4xl mb-4"></i>
          <p className="text-lg font-semibold text-gray-800 font-exo">Cargando dashboard...</p>
        </div>
      </div>
    )
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <OverviewTab
            summaryStats={summaryStats}
            employeesData={employeesData}
            recentServices={recentServicesFormatted}
            loading={loading}
          />
        )
      case 'employees':
        return <EmployeesTab employees={employeesData} organization={organizationInfo} />
      case 'services':
        return (
          <ServicesTab
            services={recentServicesFormatted}
            dateFilter={dateFilter}
            onUpdateFilter={updateDateFilter}
            onResetFilter={resetToLastMonth}
          />
        )
      case 'reports':
        return <ReportsTab onExport={handleExportReport} />
      default:
        return (
          <OverviewTab
            summaryStats={summaryStats}
            employeesData={employeesData}
            recentServices={recentServicesFormatted}
            loading={loading}
          />
        )
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <ExternalAdminHeader user={currentUser} />

      {/* Navigation Tabs - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 mt-4 sm:mt-6">
        <div className="bg-white rounded-lg shadow-sm mb-4 sm:mb-6">
          <nav className="flex space-x-1 sm:space-x-4 md:space-x-8 px-2 sm:px-4 md:px-6 overflow-x-auto scrollbar-hide sm:justify-center">
            {[
              { id: 'overview', label: 'Resumen', shortLabel: 'Inicio', icon: 'fas fa-chart-pie' },
              {
                id: 'employees',
                label: 'Empleados',
                shortLabel: 'Empleados',
                icon: 'fas fa-users'
              },
              {
                id: 'services',
                label: 'Servicios',
                shortLabel: 'Servicios',
                icon: 'fas fa-ambulance'
              },
              { id: 'reports', label: 'Reportes', shortLabel: 'Reportes', icon: 'fas fa-file-alt' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(tab.id)}
                className={`flex flex-col sm:flex-row items-center justify-center sm:space-x-2 py-2 sm:py-4 px-2 sm:px-3 border-b-2 font-medium text-xs sm:text-sm transition-colors whitespace-nowrap ${
                  activeTab === tab.id
                    ? 'border-green-500 text-green-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
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

      {/* Tab Content - Responsive */}
      <div className="max-w-7xl mx-auto px-3 sm:px-4 pb-6 sm:pb-8">{renderTabContent()}</div>
    </div>
  )
}

// Componentes de las pestañas
const OverviewTab = ({ summaryStats, employeesData, recentServices, loading }) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <i className="fas fa-spinner fa-spin text-4xl text-gray-400"></i>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards - Responsive */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-6">
        <ExternalAdminKPICard
          title="Empleados Afiliados"
          value={summaryStats?.totalEmployees || 0}
          icon="fas fa-users"
          color="blue"
        />
        <ExternalAdminKPICard
          title="Servicios Utilizados"
          value={summaryStats?.totalServices || 0}
          icon="fas fa-ambulance"
          color="green"
        />
        <ExternalAdminKPICard
          title="Emergencias"
          value={summaryStats?.emergencies || 0}
          icon="fas fa-hospital"
          color="red"
        />
        <ExternalAdminKPICard
          title="Médico a Domicilio"
          value={summaryStats?.homeDoctors || 0}
          icon="fas fa-user-md"
          color="purple"
        />
      </div>

      {/* Charts - Responsive */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
        <ServiceDistributionChart
          data={
            summaryStats
              ? {
                  emergencias: summaryStats.emergencies,
                  medico_domicilio: summaryStats.homeDoctors
                }
              : null
          }
        />
        <MonthlyTrendChart data={null} />
        <EmployeeUtilizationChart employeesData={employeesData} />
      </div>

      {/* Recent Services */}
      <RecentServicesList services={recentServices || []} />
    </div>
  )
}

const EmployeesTab = ({ employees, organization }) => {
  return <EmployeesTable employees={employees} organization={organization} />
}

const ServicesTab = ({ services, dateFilter, onUpdateFilter, onResetFilter }) => {
  return (
    <div className="space-y-6">
      {/* Date Filter - Responsive */}
      <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4">
        <div className="flex flex-col sm:flex-row sm:items-end space-y-3 sm:space-y-0 sm:space-x-4">
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-roboto">
              Desde
            </label>
            <input
              type="date"
              value={dateFilter.start}
              onChange={(e) => onUpdateFilter({ start: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm sm:text-base font-roboto"
            />
          </div>
          <div className="flex-1">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1 font-roboto">
              Hasta
            </label>
            <input
              type="date"
              value={dateFilter.end}
              onChange={(e) => onUpdateFilter({ end: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-2 sm:px-3 py-2 text-sm sm:text-base font-roboto"
            />
          </div>
          <button
            onClick={onResetFilter}
            className="bg-gray-500 hover:bg-gray-600 text-white px-3 sm:px-4 py-2 rounded-lg text-sm sm:text-base transition-colors font-roboto"
          >
            <span className="hidden sm:inline">Último Mes</span>
            <span className="sm:hidden">Mes</span>
          </button>
        </div>
      </div>

      {/* Services List */}
      <ServiceDetailsTable services={services || []} />
    </div>
  )
}

const ReportsTab = ({ onExport }) => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4 sm:mb-6 font-exo">
          Generar Reportes
        </h2>

        <ReportCards onExport={onExport} />
      </div>
    </div>
  )
}

export default ExternalAdminDashboard
