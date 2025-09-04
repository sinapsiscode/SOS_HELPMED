import React, { lazy, Suspense } from 'react'
import Swal from 'sweetalert2'
import { useCorporateContractManagement } from '../../hooks/useCorporateContractManagement'
import CorporateHeader from './corporate/CorporateHeader'
import ContractsList from './corporate/ContractsList'
import { showContractDetail } from './corporate/ContractDetailModal'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading del modal pesado (Regla #5)
const AddContractModal = lazy(() => import('./corporate/AddContractModal'))

/**
 * Componente principal de gestión de contratos corporativos
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 *
 * Funcionalidades:
 * - Visualización y filtrado de contratos corporativos
 * - Renovación automática de contratos
 * - Gestión de servicios adicionales y consumidos
 * - Subida de contratos PDF
 * - Estadísticas en tiempo real
 *
 * Arquitectura modular:
 * - CorporateHeader: Header con filtros y estadísticas
 * - ContractsList: Lista de contratos con vista responsive
 * - AddContractModal: Modal para subir contratos PDF (lazy loaded)
 *
 * @returns {JSX.Element} Componente de gestión de contratos corporativos
 *
 * @example
 * // Uso básico en dashboard administrativo
 * <CorporateContractManagement />
 *
 * @see {@link useCorporateContractManagement} Hook que maneja toda la lógica de negocio
 *
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (150 líneas aprox)
 * - Regla #4: Validación de datos y props
 * - Regla #5: Lógica compleja en hook personalizado
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #12: Documentación JSDoc completa
 */
const CorporateContractManagement = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #2)
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
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage message={`Error en gestión de contratos: ${error}`} onRetry={clearError} />
      </div>
    )
  }

  if (isLoading) {
    return <LoadingSkeleton rows={3} />
  }

  // ============================================
  // HANDLERS LOCALES SIMPLES (Regla #2)
  // ============================================

  /**
   * Maneja la visualización detallada de un contrato
   */
  const handleViewContract = (contract) => {
    showContractDetail(contract, () => setShowAddForm(true))
  }

  /**
   * Maneja el guardado de contratos PDF
   */
  const handleSaveContract = (contractData) => {
    console.log('Contrato subido:', contractData)
    setShowAddForm(false)
    Swal.fire({
      title: '¡Contrato Subido!',
      text: 'El contrato PDF ha sido subido exitosamente',
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
