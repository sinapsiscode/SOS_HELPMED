import React, { lazy, Suspense } from 'react'
import { useAmbulanceManagement } from '../../hooks/useAmbulanceManagement'
import AssignmentMap from './AssignmentMap'
import { UnitsTab, AssignmentsTab } from './ambulance'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { MOCK_PENDING_EMERGENCIES } from '../../mocks/emergencyData'
import { LABELS } from '../../config/labels'

// ${LABELS.admin.ambulanceManagement.comments.lazyLoading}
const AmbulanceFormModal = lazy(() => import('./ambulance/AmbulanceFormModal'))

/**
 * ${LABELS.admin.ambulanceManagement.comments.title}
 * ${LABELS.admin.ambulanceManagement.comments.approach}
 * ${LABELS.admin.ambulanceManagement.comments.rule3}
 */
const AmbulanceManagement = () => {
  const labels = LABELS.admin.ambulanceManagement
  
  // ============================================
  // ${LABELS.admin.ambulanceManagement.comments.businessLogic}
  // ============================================
  const {
    ambulanceUsers,
    filteredAmbulances,
    availableUnits,
    showCreateForm,
    filter,
    activeTab,
    loading,
    error,
    setShowCreateForm,
    setFilter,
    setActiveTab,
    handleCreateAmbulance,
    handleEditAmbulance,
    handleDeleteAmbulance,
    handleSaveAmbulance,
    getStatusColor,
    getCurrentStatusColor,
    getStatusText,
    getCurrentStatusText,
    clearError
  } = useAmbulanceManagement()

  // ============================================
  // ${LABELS.admin.ambulanceManagement.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-6">
        <ErrorMessage message={labels.errors.managementError.replace('{error}', error)} onRetry={clearError} />
      </div>
    )
  }

  if (loading) {
    return <LoadingSkeleton rows={5} />
  }

  // ============================================
  // ${LABELS.admin.ambulanceManagement.comments.tabRendering}
  // ============================================
  const renderActiveTab = () => {
    switch (activeTab) {
      case 'units':
        return (
          <UnitsTab
            ambulances={ambulanceUsers}
            filteredAmbulances={filteredAmbulances}
            onEdit={handleEditAmbulance}
            onDelete={handleDeleteAmbulance}
            getStatusColor={getStatusColor}
            getCurrentStatusColor={getCurrentStatusColor}
            getStatusText={getStatusText}
            getCurrentStatusText={getCurrentStatusText}
          />
        )
      case 'assignments':
        return (
          <AssignmentsTab
            pendingEmergencies={MOCK_PENDING_EMERGENCIES}
            availableUnits={availableUnits}
          />
        )
      case 'map':
        return <AssignmentMap />
      default:
        return (
          <UnitsTab
            ambulances={ambulanceUsers}
            filteredAmbulances={filteredAmbulances}
            onEdit={handleEditAmbulance}
            onDelete={handleDeleteAmbulance}
            getStatusColor={getStatusColor}
            getCurrentStatusColor={getCurrentStatusColor}
            getStatusText={getStatusText}
            getCurrentStatusText={getCurrentStatusText}
          />
        )
    }
  }

  return (
    <div className="space-y-6">
      {/* Header y Controles */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 space-y-4 sm:space-y-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-xl sm:text-2xl font-exo font-bold text-gray-800">
              {labels.header.title}
            </h2>
            <p className="text-sm sm:text-base text-gray-600 font-roboto">
              {labels.header.subtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:space-x-4 sm:flex-nowrap">
            {activeTab === 'units' && (
              <>
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                >
                  <option value="all">{labels.filters.all}</option>
                  <option value="active">{labels.filters.active}</option>
                  <option value="inactive">{labels.filters.inactive}</option>
                  <option value="on_duty">{labels.filters.onDuty}</option>
                </select>

                <button
                  onClick={handleCreateAmbulance}
                  className="bg-helpmed-blue hover:bg-primary-blue text-white px-3 sm:px-4 py-2 rounded-lg font-exo font-medium transition-colors flex items-center space-x-1 sm:space-x-2 text-sm"
                >
                  <i className="fas fa-plus"></i>
                  <span className="hidden sm:inline">{labels.buttons.newUnit}</span>
                  <span className="sm:hidden">{labels.buttons.newUnitShort}</span>
                </button>
              </>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setActiveTab('units')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'units'
                  ? 'border-helpmed-blue text-helpmed-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-exo`}
            >
              <i className="fas fa-ambulance mr-2"></i>
              {labels.tabs.units.replace('{count}', ambulanceUsers.length)}
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'assignments'
                  ? 'border-helpmed-blue text-helpmed-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-exo`}
            >
              <i className="fas fa-clipboard-list mr-2"></i>
              {labels.tabs.assignments.replace('{count}', MOCK_PENDING_EMERGENCIES?.length || 0)}
            </button>
            <button
              onClick={() => setActiveTab('map')}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'map'
                  ? 'border-helpmed-blue text-helpmed-blue'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              } font-exo`}
            >
              <i className="fas fa-map-marked-alt mr-2"></i>
              {labels.tabs.map}
            </button>
          </nav>
        </div>
      </div>

      {/* Tab Content */}
      {renderActiveTab()}

      {/* Modal con ${LABELS.admin.ambulanceManagement.comments.lazyLoading} */}
      {showCreateForm && (
        <Suspense fallback={<LoadingSkeleton />}>
          <AmbulanceFormModal
            ambulance={null} // selectedAmbulance removido por simplicidad
            onClose={() => setShowCreateForm(false)}
            onSave={handleSaveAmbulance}
          />
        </Suspense>
      )}
    </div>
  )
}

export default AmbulanceManagement
