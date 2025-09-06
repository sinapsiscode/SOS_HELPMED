import React, { lazy, Suspense } from 'react'
import Swal from 'sweetalert2'
import { useCorporateContractManagement } from '../../hooks/useCorporateContractManagement'
import CorporateHeader from './corporate/CorporateHeader'
import ContractsList from './corporate/ContractsList'
import { showContractDetail } from './corporate/ContractDetailModal'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'
import { LABELS } from '../../config/labels'

// ${LABELS.admin.corporateContractManagement.comments.lazyLoading}
const AddContractModal = lazy(() => import('./corporate/AddContractModal'))

/**
 * ${LABELS.admin.corporateContractManagement.comments.title}
 * ${LABELS.admin.corporateContractManagement.comments.approach}
 *
 * ${LABELS.admin.corporateContractManagement.comments.features.title}
 * ${LABELS.admin.corporateContractManagement.comments.features.visualization}
 * ${LABELS.admin.corporateContractManagement.comments.features.renewal}
 * ${LABELS.admin.corporateContractManagement.comments.features.services}
 * ${LABELS.admin.corporateContractManagement.comments.features.upload}
 * ${LABELS.admin.corporateContractManagement.comments.features.stats}
 *
 * ${LABELS.admin.corporateContractManagement.comments.architecture.title}
 * ${LABELS.admin.corporateContractManagement.comments.architecture.header}
 * ${LABELS.admin.corporateContractManagement.comments.architecture.list}
 * ${LABELS.admin.corporateContractManagement.comments.architecture.modal}
 *
 * @returns {JSX.Element} Componente de gestión de contratos corporativos
 *
 * ${LABELS.admin.corporateContractManagement.comments.example.title}
 * ${LABELS.admin.corporateContractManagement.comments.example.usage}
 * ${LABELS.admin.corporateContractManagement.comments.example.component}
 *
 * ${LABELS.admin.corporateContractManagement.comments.see}
 *
 * ${LABELS.admin.corporateContractManagement.comments.rules.title}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule3}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule4}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule5}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule6}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule8}
 * ${LABELS.admin.corporateContractManagement.comments.rules.rule12}
 */
const CorporateContractManagement = () => {
  const labels = LABELS.admin.corporateContractManagement
  
  // ============================================
  // ${LABELS.admin.corporateContractManagement.comments.businessLogic}
  // ============================================
  const {
    // Estado
    showAddForm,
    filter,
    searchTerm,
    isLoading,
    error,
    corporateUsers,

    // Datos calculados
    filteredContracts,
    contractStats,

    // Funciones de estado
    getContractStatus,
    getUsageColor,
    getContractStatusClass,

    // Handlers
    setShowAddForm,
    setFilter,
    setSearchTerm,
    handleRenewContract,
    clearError
  } = useCorporateContractManagement()

  // ============================================
  // ${LABELS.admin.corporateContractManagement.comments.errorHandling}
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={labels.errors.managementError.replace('{error}', error)} onRetry={clearError} />
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton rows={3} />
  }

  // ============================================
  // ${LABELS.admin.corporateContractManagement.comments.localHandlers}
  // ============================================

  /**
   * ${LABELS.admin.corporateContractManagement.comments.viewContract}
   */
  const handleViewContract = (contract) => {
    showContractDetail(contract, () => setShowAddForm(true))
  }

  /**
   * ${LABELS.admin.corporateContractManagement.comments.saveContract}
   */
  const handleSaveContract = (contractData) => {
    console.log(labels.logs.contractUploaded.replace('{data}', JSON.stringify(contractData)))
    setShowAddForm(false)
    Swal.fire({
      title: labels.alerts.title,
      text: labels.alerts.message,
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Header con filtros y estadísticas */}
      <CorporateHeader
        contractStats={contractStats}
        searchTerm={searchTerm}
        filter={filter}
        setSearchTerm={setSearchTerm}
        setFilter={setFilter}
        onShowAddForm={() => setShowAddForm(true)}
      />

      {/* Lista de Contratos */}
      <ContractsList
        contracts={filteredContracts}
        getContractStatus={getContractStatus}
        getUsageColor={getUsageColor}
        getContractStatusClass={getContractStatusClass}
        onViewContract={handleViewContract}
        onRenewContract={handleRenewContract}
      />

      {/* Modal de Nuevo Contrato (Lazy Loading) */}
      {showAddForm && (
        <Suspense fallback={<LoadingSkeleton rows={2} />}>
          <AddContractModal
            onClose={() => setShowAddForm(false)}
            isLoading={isLoading}
            corporateUsers={corporateUsers}
            onSave={handleSaveContract}
          />
        </Suspense>
      )}
    </div>
  )
}

export default CorporateContractManagement
