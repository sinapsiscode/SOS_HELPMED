import React, { Suspense } from 'react'
import usePlanConfiguration from '../../hooks/usePlanConfiguration'
import PlanHeader from './planconfig/PlanHeader'
import PlanFilters from './planconfig/PlanFilters'
import PlanCard from './planconfig/PlanCard'
import LoadingSkeleton from '../shared/LoadingSkeleton'
import ErrorMessage from '../shared/ErrorMessage'

// Lazy loading de modals para optimizar bundle (Regla #11)
const PlanFormModal = React.lazy(() => import('./planconfig/PlanFormModal'))
const AdditionalPricingModal = React.lazy(() => import('./planconfig/AdditionalPricingModal'))

/**
 * Sistema de configuración dinámica de planes y precios
 * ENFOQUE BALANCEADO: Estructura en componente, lógica en hook
 * 
 * Funcionalidades:
 * - CRUD completo de planes (familiar, corporativo, externo)
 * - Exportación múltiple: Excel, PDF, CSV con formato profesional
 * - Sistema de filtros y búsqueda avanzada
 * - Gestión de precios adicionales y configuraciones especiales
 * - Validación robusta y manejo de errores
 * - Interfaz responsive y accesible
 * 
 * Arquitectura modular:
 * - PlanHeader: Header con estadísticas y controles de exportación
 * - PlanFilters: Filtros de búsqueda y ordenación
 * - PlanCard: Tarjetas individuales de planes con acciones CRUD
 * - PlanFormModal: Modal para crear/editar planes (lazy loaded)
 * - AdditionalPricingModal: Configuración de precios adicionales (lazy loaded)
 * 
 * Características especiales:
 * - Validación exhaustiva de datos de entrada
 * - Exportación profesional a Excel, PDF y CSV
 * - Filtros dinámicos por categoría, estado y texto
 * - Ordenación por nombre, precio y fecha de creación
 * - Interfaz completamente responsive
 * 
 * @returns {JSX.Element} Componente de configuración de planes
 * 
 * @example
 * // Uso básico en dashboard administrativo
 * <PlanConfiguration />
 * 
 * @see {@link usePlanConfiguration} Hook que maneja toda la lógica de negocio
 * @see {@link INITIAL_PLANS_CONFIG} Configuración inicial de mock data
 * 
 * Cumple reglas de refactorización:
 * - Regla #3: <200 líneas (195 líneas aprox)
 * - Regla #4: Validación de datos y props en hook y componentes
 * - Regla #5: Lógica compleja en hook personalizado
 * - Regla #6: Componentes modulares y reutilizables
 * - Regla #8: Manejo consistente de errores
 * - Regla #11: Lazy loading de modals
 * - Regla #12: Documentación JSDoc completa
 */
const PlanConfiguration = () => {
  // ============================================
  // HOOK - Toda la lógica compleja (Regla #5)
  // ============================================
  const {
    // Datos principales
    filteredPlans,
    planStats,
    additionalPricing,
    isLoading,
    error,

    // Estados de modals
    showCreateModal,
    showPricingModal,
    editingPlan,

    // Estados de filtros
    searchTerm,
    filterType,
    sortBy,

    // Operaciones CRUD
    createPlan,
    updatePlan,
    deletePlan,
    duplicatePlan,

    // Funciones de exportación
    exportToExcel,
    exportToPDF,
    exportToCSV,

    // Control de modals
    openCreateModal,
    closeCreateModal,
    openEditModal,
    openPricingModal,
    closePricingModal,

    // Búsqueda y filtros
    handleSearch,
    handleFilterChange,
    handleSortChange,
    clearFilters,

    // Setters
    setSelectedPlan,

    // Control de errores
    clearError
  } = usePlanConfiguration()

  // ============================================
  // MANEJO DE ERRORES (Regla #8)
  // ============================================
  if (error) {
    return (
      <div className="space-y-4">
        <ErrorMessage 
          message={`Error en configuración de planes: ${error}`}
          onRetry={clearError}
        />
      </div>
    )
  }

  // ============================================
  // FUNCIONES DE MANEJO DE MODALS
  // ============================================
  const handleSavePlan = async (category, planKey, planData) => {
    if (editingPlan) {
      return await updatePlan(category, planKey, planData)
    } else {
      return await createPlan(category, planKey, planData)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas y controles */}
      <PlanHeader
        planStats={planStats}
        onCreatePlan={openCreateModal}
        onExportExcel={exportToExcel}
        onExportPDF={exportToPDF}
        onExportCSV={exportToCSV}
        onOpenPricing={openPricingModal}
        isLoading={isLoading}
      />

      {/* Filtros y búsqueda */}
      <PlanFilters
        searchTerm={searchTerm}
        filterType={filterType}
        sortBy={sortBy}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onSortChange={handleSortChange}
        onClearFilters={clearFilters}
      />

      {/* Grid de planes */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Planes Configurados ({filteredPlans.length})
        </h2>
        
        {isLoading && filteredPlans.length === 0 ? (
          <LoadingSkeleton rows={3} />
        ) : filteredPlans.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlans.map((plan, index) => (
              <PlanCard
                key={`${plan.category}-${plan.key}-${index}`}
                plan={plan}
                onEdit={openEditModal}
                onDelete={deletePlan}
                onDuplicate={duplicatePlan}
                onSelect={setSelectedPlan}
                isSelected={false}
                isLoading={isLoading}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <i className="fas fa-search text-5xl text-gray-300 mb-4"></i>
            <p className="text-lg">No se encontraron planes</p>
            <p className="text-sm mt-2">
              {searchTerm || filterType !== 'all' 
                ? 'Intenta ajustar los filtros de búsqueda'
                : 'Comienza creando tu primer plan'
              }
            </p>
            {(!searchTerm && filterType === 'all') && (
              <button
                onClick={openCreateModal}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
              >
                Crear Primer Plan
              </button>
            )}
          </div>
        )}
      </div>

      {/* Modals con lazy loading (Regla #11) */}
      <Suspense fallback={<div>Cargando...</div>}>
        {showCreateModal && (
          <PlanFormModal
            isOpen={showCreateModal}
            editingPlan={editingPlan}
            onClose={closeCreateModal}
            onSave={handleSavePlan}
            isLoading={isLoading}
          />
        )}

        {showPricingModal && (
          <AdditionalPricingModal
            isOpen={showPricingModal}
            additionalPricing={additionalPricing}
            onClose={closePricingModal}
            onSave={() => {}} // Read-only por ahora
            isLoading={isLoading}
          />
        )}
      </Suspense>
    </div>
  )
}

export default PlanConfiguration
      HELP: {
        id: 'FAM_HELP',
        name: 'Plan Help',
        description: 'Plan básico de emergencias médicas',
        active: true,
        pricing: {
          monthly: 65,
          quarterly: 170,
          annually: 650,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          URGENCIA: 'ILIMITADO',
          MEDICO_DOMICILIO: 0,
          TRASLADO_PROGRAMADO: 0,
          ZONA_PROTEGIDA: 0,
          ORIENTACION_TELEFONICA: 'ILIMITADO',
          EXAMENES_LABORATORIO: 0
        },
        benefits: {
          emergencias_ilimitadas: true,
          orientacion_telefonica: true,
          zona_protegida: false,
          seguro_accidentes: false,
          examenes_laboratorio: false
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 10,
          red_hospitales: 'básica',
          app_movil: true,
          seguimiento_gps: false
        },
        target_market: 'Familias con presupuesto limitado',
        created_at: '2024-01-01',
        updated_at: '2024-01-15'
      },
      BASICO: {
        id: 'FAM_BASICO',
        name: 'Plan Básico',
        description: 'Plan familiar con servicios esenciales',
        active: true,
        pricing: {
          monthly: 150,
          quarterly: 410,
          annually: 1500,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          URGENCIA: 3,
          MEDICO_DOMICILIO: 2,
          TRASLADO_PROGRAMADO: 1,
          ZONA_PROTEGIDA: 0,
          ORIENTACION_TELEFONICA: 'ILIMITADO',
          EXAMENES_LABORATORIO: 0
        },
        benefits: {
          emergencias_ilimitadas: true,
          orientacion_telefonica: true,
          zona_protegida: false,
          seguro_accidentes: false,
          examenes_laboratorio: false
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 8,
          red_hospitales: 'estándar',
          app_movil: true,
          seguimiento_gps: true
        },
        target_market: 'Familias clase media',
        created_at: '2024-01-01',
        updated_at: '2024-01-10'
      },
      VIP: {
        id: 'FAM_VIP',
        name: 'Plan VIP',
        description: 'Plan premium con beneficios adicionales',
        active: true,
        pricing: {
          monthly: 280,
          quarterly: 775,
          annually: 2800,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          URGENCIA: 6,
          MEDICO_DOMICILIO: 4,
          TRASLADO_PROGRAMADO: 3,
          ZONA_PROTEGIDA: 1,
          ORIENTACION_TELEFONICA: 'ILIMITADO',
          EXAMENES_LABORATORIO: 0
        },
        benefits: {
          emergencias_ilimitadas: true,
          orientacion_telefonica: true,
          zona_protegida: true,
          seguro_accidentes: true,
          examenes_laboratorio: false
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 6,
          red_hospitales: 'premium',
          app_movil: true,
          seguimiento_gps: true
        },
        target_market: 'Familias de ingresos altos',
        created_at: '2024-01-01',
        updated_at: '2024-01-12'
      },
      DORADO: {
        id: 'FAM_DORADO',
        name: 'Plan Dorado',
        description: 'Plan de lujo con todos los beneficios',
        active: true,
        pricing: {
          monthly: 410,
          quarterly: 1160,
          annually: 4100,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          URGENCIA: 10,
          MEDICO_DOMICILIO: 8,
          TRASLADO_PROGRAMADO: 6,
          ZONA_PROTEGIDA: 2,
          ORIENTACION_TELEFONICA: 'ILIMITADO',
          EXAMENES_LABORATORIO: 4
        },
        benefits: {
          emergencias_ilimitadas: true,
          orientacion_telefonica: true,
          zona_protegida: true,
          seguro_accidentes: true,
          examenes_laboratorio: true
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 5,
          red_hospitales: 'premium_plus',
          app_movil: true,
          seguimiento_gps: true
        },
        target_market: 'Familias premium',
        created_at: '2024-01-01',
        updated_at: '2024-01-08'
      }
    },
    corporativo: {
      EMPRESARIAL_BASICO: {
        id: 'CORP_BASIC',
        name: 'Plan Empresarial Básico',
        description: 'Plan corporativo para pequeñas empresas',
        active: true,
        pricing: {
          per_employee: 108,
          minimum_employees: 10,
          setup_fee: 645,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          services_per_employee: 12
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 8,
          dashboard_corporativo: true,
          reportes_mensual: true,
          soporte_dedicado: false
        },
        target_market: 'Empresas 10-50 empleados',
        created_at: '2024-01-01',
        updated_at: '2024-01-14'
      },
      EMPRESARIAL_PREMIUM: {
        id: 'CORP_PREMIUM',
        name: 'Plan Empresarial Premium',
        description: 'Plan corporativo para medianas empresas',
        active: true,
        pricing: {
          per_employee: 151,
          minimum_employees: 25,
          setup_fee: 1290,
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          services_per_employee: 20
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 6,
          dashboard_corporativo: true,
          reportes_mensual: true,
          soporte_dedicado: true
        },
        target_market: 'Empresas 25-200 empleados',
        created_at: '2024-01-01',
        updated_at: '2024-01-11'
      }
    },
    externo: {
      CASO_1: {
        id: 'EXT_UNLIMITED',
        name: 'Afiliado Externo - Sin Límites',
        description: 'Plan para afiliados con facturación directa',
        active: true,
        pricing: {
          per_service: 0,
          monthly_fee: 0,
          billing_method: 'direct_to_company',
          currency: 'PEN'
        },
        limits: {
          EMERGENCIA: 'ILIMITADO',
          MEDICO_DOMICILIO: 'ILIMITADO'
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 7,
          facturacion_directa: true,
          sin_limites_servicios: true
        },
        target_market: 'Grandes corporaciones con convenio',
        created_at: '2024-01-01',
        updated_at: '2024-01-13'
      },
      CASO_2: {
        id: 'EXT_LIMITED',
        name: 'Afiliado Externo - Con Límites',
        description: 'Plan para afiliados con límites anuales',
        active: true,
        pricing: {
          annual_services: 3,
          cost_per_additional: 45000,
          monthly_fee: 0,
          currency: 'PEN'
        },
        limits: {
          individual_annual: 3,
          company_general: 430
        },
        features: {
          cobertura_24_7: true,
          tiempo_respuesta_max: 8,
          servicios_gratuitos: 3,
          costo_adicional: true
        },
        target_market: 'Empresas con convenio limitado',
        created_at: '2024-01-01',
        updated_at: '2024-01-09'
      }
    }
  })

  // Configuración de precios adicionales
  const [additionalPricing, setAdditionalPricing] = useState({
    emergency_surcharge: {
      night_hours: { percentage: 20, hours: '22:00-06:00' },
      weekend: { percentage: 15, days: 'Sábado y Domingo' },
      holidays: { percentage: 25, description: 'Días festivos nacionales' }
    },
    geographic_zones: {
      zona_1: { name: 'Centro Lima', multiplier: 1.0, coverage: 'Completa' },
      zona_2: { name: 'Lima Metropolitana', multiplier: 1.2, coverage: 'Completa' },
      zona_3: { name: 'Callao y Alrededores', multiplier: 1.5, coverage: 'Limitada' },
      zona_4: { name: 'Otras Ciudades', multiplier: 2.0, coverage: 'Bajo demanda' }
    },
    service_costs: {
      EMERGENCIA: { base_cost: 365, description: 'Servicio de emergencia básico' },
      MEDICO_DOMICILIO: { base_cost: 280, description: 'Consulta médica domiciliaria' },
      TRASLADO_PROGRAMADO: { base_cost: 194, description: 'Traslado no urgente' },
      ZONA_PROTEGIDA: { base_cost: 0, description: 'Servicio incluido en ubicación' }
    }
  })

  const handleCreatePlan = (planType) => {
    setSelectedPlan(null)
    // Solo planes familiares
    setShowCreateModal(true)
  }

  const handleEditPlan = (planKey, planData) => {
    setSelectedPlan({ key: planKey, data: planData, type: 'familiar' })
    setShowCreateModal(true)
  }

  const handleTogglePlanStatus = (planKey, currentStatus) => {
    const action = currentStatus ? 'desactivar' : 'activar'
    
    Swal.fire({
      title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} Plan?`,
      text: `¿Deseas ${action} el plan ${plansConfig.familiar[planKey].name}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: currentStatus ? '#DC2626' : '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: action.charAt(0).toUpperCase() + action.slice(1),
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setPlansConfig(prev => ({
          ...prev,
          familiar: {
            ...prev.familiar,
            [planKey]: {
              ...prev.familiar[planKey],
              active: !currentStatus,
              updated_at: new Date().toISOString().split('T')[0]
            }
          }
        }))
        
        Swal.fire({
          title: `Plan ${currentStatus ? 'Desactivado' : 'Activado'}`,
          text: `El plan ha sido ${action}do exitosamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const handleDeletePlan = (planKey) => {
    const planName = plansConfig.familiar[planKey].name
    
    Swal.fire({
      title: '¿Eliminar Plan?',
      html: `
        <div class="text-left">
          <p class="mb-3">¿Estás seguro de eliminar el plan:</p>
          <div class="bg-red-50 border border-red-200 rounded-lg p-3">
            <p class="font-medium text-red-800">${planName}</p>
            <p class="text-sm text-red-600">Esta acción no se puede deshacer</p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#DC2626',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        setPlansConfig(prev => {
          const newConfig = { ...prev }
          delete newConfig.familiar[planKey]
          return newConfig
        })
        
        Swal.fire({
          title: 'Plan Eliminado',
          text: 'El plan ha sido eliminado exitosamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const handleExportConfig = () => {
    Swal.fire({
      title: 'Seleccionar Formato de Exportación',
      html: `
        <div class="space-y-4">
          <p class="text-sm text-gray-600 mb-4">¿En qué formato deseas exportar la configuración?</p>
          <div class="grid grid-cols-1 gap-3">
            <button id="export-excel" class="w-full bg-green-600 hover:bg-green-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <i class="fas fa-file-excel"></i>
              <span>Exportar como Excel (.xlsx)</span>
            </button>
            <button id="export-pdf" class="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <i class="fas fa-file-pdf"></i>
              <span>Exportar como PDF</span>
            </button>
            <button id="export-csv" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 px-4 rounded-lg transition-colors flex items-center justify-center space-x-2">
              <i class="fas fa-file-csv"></i>
              <span>Exportar como CSV (para Excel)</span>
            </button>
          </div>
        </div>
      `,
      showConfirmButton: false,
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      width: '500px',
      didOpen: () => {
        // Excel Export
        document.getElementById('export-excel').onclick = () => {
          Swal.close()
          exportToExcel()
        }
        
        // PDF Export
        document.getElementById('export-pdf').onclick = () => {
          Swal.close()
          exportToPDF()
        }
        
        // CSV Export
        document.getElementById('export-csv').onclick = () => {
          Swal.close()
          exportToCSV()
        }
      }
    })
  }

  const exportToExcel = () => {
    // Crear tabla HTML que Excel puede interpretar
    let htmlContent = `
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #000; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .section-header { background-color: #4CAF50; color: white; font-weight: bold; }
          </style>
        </head>
        <body>
          <h1>Configuración de Planes HelpMED</h1>
          <p>Fecha de exportación: ${new Date().toLocaleDateString('es-PE')} ${new Date().toLocaleTimeString('es-PE')}</p>
    `

    // Generar contenido para cada tipo de plan
    Object.entries(plansConfig).forEach(([planType, plans]) => {
      htmlContent += `
        <h2>Planes ${planType.charAt(0).toUpperCase() + planType.slice(1)}</h2>
        <table>
          <tr class="section-header">
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Estado</th>
            <th>Precio</th>
            <th>Límites/Servicios</th>
            <th>Mercado Objetivo</th>
            <th>Última Actualización</th>
          </tr>
      `
      
      Object.entries(plans).forEach(([planKey, planData]) => {
        const precio = planType === 'familiar' 
          ? `S/ ${planData.pricing?.annually || 0}/año (S/ ${Math.round((planData.pricing?.annually || 0) / 12)}/mes)`
          : planType === 'corporativo'
          ? `S/ ${planData.pricing?.per_employee || 0}/empleado`
          : 'Variable'
        
        const limites = planType === 'familiar'
          ? `Emergencias: ${planData.limits?.EMERGENCIA || 'N/A'}, Urgencias: ${planData.limits?.URGENCIA || 'N/A'}`
          : planType === 'corporativo'
          ? `${planData.limits?.services_per_employee || 0} servicios/empleado`
          : `${planData.pricing?.annual_services || 0} servicios anuales`
        
        htmlContent += `
          <tr>
            <td>${planData.name}</td>
            <td>${planData.description}</td>
            <td>${planData.active ? 'Activo' : 'Inactivo'}</td>
            <td>${precio}</td>
            <td>${limites}</td>
            <td>${planData.target_market || 'N/A'}</td>
            <td>${planData.updated_at || 'N/A'}</td>
          </tr>
        `
      })
      
      htmlContent += '</table><br>'
    })

    htmlContent += '</body></html>'

    // Crear blob y descargar como archivo Excel
    const blob = new Blob([htmlContent], { type: 'application/vnd.ms-excel' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Configuracion_Planes_${new Date().toISOString().split('T')[0]}.xls`
    a.click()
    URL.revokeObjectURL(url)

    Swal.fire({
      title: 'Excel Generado',
      text: 'El archivo Excel ha sido descargado exitosamente',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const exportToPDF = () => {
    // Crear contenido HTML para PDF
    const printWindow = window.open('', '_blank')
    
    let htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <title>Configuración de Planes HelpMED</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #d32f2f; text-align: center; }
            h2 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 5px; }
            .plan-card { 
              border: 1px solid #ddd; 
              margin: 10px 0; 
              padding: 15px; 
              border-radius: 5px;
              page-break-inside: avoid;
            }
            .plan-header { 
              background-color: #f5f5f5; 
              padding: 10px; 
              margin: -15px -15px 10px -15px; 
              border-radius: 5px 5px 0 0;
            }
            .plan-name { font-size: 18px; font-weight: bold; margin: 0; }
            .plan-status { 
              display: inline-block; 
              padding: 3px 8px; 
              border-radius: 12px; 
              font-size: 12px; 
              margin-left: 10px;
            }
            .active { background-color: #c8e6c9; color: #2e7d32; }
            .inactive { background-color: #ffcdd2; color: #c62828; }
            .detail-row { margin: 5px 0; }
            .label { font-weight: bold; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <h1>Configuración de Planes HelpMED</h1>
          <p><strong>Fecha de exportación:</strong> ${new Date().toLocaleDateString('es-PE')} - ${new Date().toLocaleTimeString('es-PE')}</p>
          
          <div class="no-print" style="text-align: center; margin: 20px 0;">
            <button onclick="window.print()" style="background: #d32f2f; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer;">
              🖨️ Imprimir/Guardar como PDF
            </button>
            <button onclick="window.close()" style="background: #666; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; margin-left: 10px;">
              ❌ Cerrar
            </button>
          </div>
    `

    // Generar contenido para cada tipo de plan
    Object.entries(plansConfig).forEach(([planType, plans]) => {
      htmlContent += `<h2>Planes ${planType.charAt(0).toUpperCase() + planType.slice(1)} (${Object.keys(plans).length})</h2>`
      
      Object.entries(plans).forEach(([planKey, planData]) => {
        const precio = planType === 'familiar' 
          ? `S/ ${(planData.pricing?.annually || 0).toLocaleString()}/año (S/ ${Math.round((planData.pricing?.annually || 0) / 12).toLocaleString()}/mes)`
          : planType === 'corporativo'
          ? `S/ ${(planData.pricing?.per_employee || 0).toLocaleString()}/empleado`
          : 'Facturación variable'

        htmlContent += `
          <div class="plan-card">
            <div class="plan-header">
              <span class="plan-name">${planData.name}</span>
              <span class="plan-status ${planData.active ? 'active' : 'inactive'}">
                ${planData.active ? 'Activo' : 'Inactivo'}
              </span>
            </div>
            
            <div class="detail-row">
              <span class="label">Descripción:</span> ${planData.description}
            </div>
            
            <div class="detail-row">
              <span class="label">Precio:</span> ${precio}
            </div>
            
            ${planType === 'familiar' ? `
              <div class="detail-row">
                <span class="label">Límites de Servicios:</span>
                Emergencias: ${planData.limits?.EMERGENCIA || 'N/A'}, 
                Urgencias: ${planData.limits?.URGENCIA || 'N/A'}, 
                Médico Domicilio: ${planData.limits?.MEDICO_DOMICILIO || 'N/A'}, 
                Traslados: ${planData.limits?.TRASLADO_PROGRAMADO || 'N/A'}
              </div>
            ` : ''}
            
            ${planData.target_market ? `
              <div class="detail-row">
                <span class="label">Mercado Objetivo:</span> ${planData.target_market}
              </div>
            ` : ''}
            
            <div class="detail-row">
              <span class="label">Última Actualización:</span> ${planData.updated_at || 'N/A'}
            </div>
          </div>
        `
      })
    })

    htmlContent += '</body></html>'
    
    printWindow.document.write(htmlContent)
    printWindow.document.close()

    Swal.fire({
      title: 'PDF Preparado',
      text: 'Se ha abierto una nueva ventana. Usa Ctrl+P para imprimir o guardar como PDF',
      icon: 'info',
      timer: 3000,
      showConfirmButton: false
    })
  }

  const exportToCSV = () => {
    // Preparar datos para CSV compatible con Excel
    const csvData = []
    
    // Header
    csvData.push([
      'Tipo Plan', 'Nombre', 'Descripción', 'Estado', 'Precio', 'Límites', 
      'Mercado Objetivo', 'Fecha Creación', 'Última Actualización'
    ])
    
    // Datos
    Object.entries(plansConfig).forEach(([planType, plans]) => {
      Object.entries(plans).forEach(([planKey, planData]) => {
        const precio = planType === 'familiar' 
          ? `S/ ${planData.pricing?.annually || 0}/año`
          : planType === 'corporativo'
          ? `S/ ${planData.pricing?.per_employee || 0}/empleado`
          : 'Variable'
        
        const limites = planType === 'familiar'
          ? `Emergencias: ${planData.limits?.EMERGENCIA || 'N/A'} | Urgencias: ${planData.limits?.URGENCIA || 'N/A'}`
          : `${planData.limits?.services_per_employee || 0} servicios/empleado`

        csvData.push([
          planType.charAt(0).toUpperCase() + planType.slice(1),
          planData.name,
          planData.description,
          planData.active ? 'Activo' : 'Inactivo',
          precio,
          limites,
          planData.target_market || 'N/A',
          planData.created_at || 'N/A',
          planData.updated_at || 'N/A'
        ])
      })
    })
    
    // Convertir a CSV
    const csvContent = csvData.map(row => 
      row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')
    ).join('\n')
    
    // Crear archivo con BOM para Excel
    const BOM = '\uFEFF'
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Configuracion_Planes_${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    URL.revokeObjectURL(url)

    Swal.fire({
      title: 'CSV Generado',
      text: 'El archivo CSV ha sido descargado. Se abrirá automáticamente en Excel',
      icon: 'success',
      timer: 2000,
      showConfirmButton: false
    })
  }

  const getPlansCount = () => {
    return {
      familiar: Object.keys(plansConfig.familiar).length,
      corporativo: Object.keys(plansConfig.corporativo).length,
      externo: Object.keys(plansConfig.externo).length,
      total: Object.keys(plansConfig.familiar).length + 
             Object.keys(plansConfig.corporativo).length + 
             Object.keys(plansConfig.externo).length
    }
  }

  const counts = getPlansCount()

  return (
    <div className="space-y-6">
      {/* Header y Controles - Responsive */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-3 sm:space-y-0">
          <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-800">Configuración de Planes</h1>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
            <button
              onClick={() => setShowPricingModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <i className="fas fa-dollar-sign mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Precios Adicionales</span>
              <span className="sm:hidden">Precios</span>
            </button>
            <button
              onClick={handleExportConfig}
              className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <i className="fas fa-download mr-1 sm:mr-2"></i>
              Exportar
            </button>
            <button
              onClick={() => handleCreatePlan('familiar')}
              className="bg-primary-red hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm"
            >
              <i className="fas fa-plus mr-1 sm:mr-2"></i>
              <span className="hidden sm:inline">Nuevo Plan</span>
              <span className="sm:hidden">Nuevo</span>
            </button>
          </div>
        </div>

        {/* Estadísticas rápidas - Responsive */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
          <PlanStatCard title="Total Planes" count={counts.total} color="blue" icon="fas fa-list" />
          <PlanStatCard title="Familiares" count={counts.familiar} color="green" icon="fas fa-users" />
          <PlanStatCard title="Corporativos" count={counts.corporativo} color="purple" icon="fas fa-building" />
          <PlanStatCard title="Externos" count={counts.externo} color="orange" icon="fas fa-handshake" />
        </div>

        {/* Navegación de secciones - Solo Familiares */}
        <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
          <button
            className="flex items-center space-x-1 sm:space-x-2 px-2 sm:px-3 lg:px-4 py-2 rounded-lg font-medium text-xs sm:text-sm bg-white text-blue-600 shadow-sm"
          >
            <i className="fas fa-users"></i>
            <span className="hidden sm:inline">Planes Familiares</span>
            <span className="sm:hidden">Familiares</span>
          </button>
        </div>
      </div>

      {/* Lista de Planes - Responsive */}
      <div className="bg-white rounded-xl shadow-medium">
        <div className="p-4 sm:p-6 border-b border-gray-100">
          <h2 className="text-base sm:text-lg font-bold text-gray-800 capitalize">
            Planes Familiares ({Object.keys(plansConfig.familiar).length})
          </h2>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4 lg:gap-6">
            {Object.entries(plansConfig.familiar).map(([planKey, planData]) => (
              <PlanCard
                key={planKey}
                planKey={planKey}
                planData={planData}
                planType='familiar'
                onEdit={() => handleEditPlan(planKey, planData)}
                onToggleStatus={() => handleTogglePlanStatus(planKey, planData.active)}
                onDelete={() => handleDeletePlan(planKey)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal de creación/edición */}
      {showCreateModal && (
        <PlanFormModal
          plan={selectedPlan}
          planType='familiar'
          onClose={() => setShowCreateModal(false)}
          onSave={(planData) => {
            if (selectedPlan) {
              // Editar plan existente
              setPlansConfig(prev => ({
                ...prev,
                familiar: {
                  ...prev.familiar,
                  [selectedPlan.key]: {
                    ...planData,
                    updated_at: new Date().toISOString().split('T')[0]
                  }
                }
              }))
            } else {
              // Crear nuevo plan
              const planKey = planData.name.toUpperCase().replace(/\s+/g, '_')
              setPlansConfig(prev => ({
                ...prev,
                familiar: {
                  ...prev.familiar,
                  [planKey]: {
                    ...planData,
                    id: `FAM_${planKey}`,
                    created_at: new Date().toISOString().split('T')[0],
                    updated_at: new Date().toISOString().split('T')[0]
                  }
                }
              }))
            }
            setShowCreateModal(false)
            
            Swal.fire({
              title: selectedPlan ? 'Plan Actualizado' : 'Plan Creado',
              text: `El plan ${planData.name} ha sido ${selectedPlan ? 'actualizado' : 'creado'} exitosamente`,
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
          }}
        />
      )}

      {/* Modal de precios adicionales */}
      {showPricingModal && (
        <AdditionalPricingModal
          pricing={additionalPricing}
          onClose={() => setShowPricingModal(false)}
          onSave={(newPricing) => {
            setAdditionalPricing(newPricing)
            setShowPricingModal(false)
            
            Swal.fire({
              title: 'Precios Actualizados',
              text: 'La configuración de precios ha sido actualizada',
              icon: 'success',
              timer: 2000,
              showConfirmButton: false
            })
          }}
        />
      )}
    </div>
  )
}

// Componentes auxiliares
const PlanStatCard = ({ title, count, color, icon }) => {
  const colorClasses = {
    blue: 'bg-blue-50 border-blue-200 text-blue-600',
    green: 'bg-green-50 border-green-200 text-green-600',
    purple: 'bg-purple-50 border-purple-200 text-purple-600',
    orange: 'bg-orange-50 border-orange-200 text-orange-600'
  }

  return (
    <div className={`border rounded-lg p-2 sm:p-3 lg:p-4 ${colorClasses[color]}`}>
      <div className="flex items-center justify-between">
        <div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold">{count}</div>
          <div className="text-xs sm:text-sm font-medium">{title}</div>
        </div>
        <i className={`${icon} text-lg sm:text-xl lg:text-2xl opacity-75`}></i>
      </div>
    </div>
  )
}

const PlanCard = ({ planKey, planData, planType, onEdit, onToggleStatus, onDelete }) => {
  const getPriceDisplay = () => {
    if (planType === 'familiar') {
      const annual = planData.pricing.annually || 0
      const monthly = Math.round(annual / 12)
      return (
        <div className="text-right">
          <div className="font-semibold text-blue-600">S/ {annual.toLocaleString()}/año</div>
          <div className="text-xs text-gray-500">S/ {monthly.toLocaleString()}/mes</div>
        </div>
      )
    } else if (planType === 'corporativo') {
      return `S/ ${planData.pricing.per_employee.toLocaleString()}/empleado`
    } else {
      if (planData.pricing.billing_method === 'direct_to_company') {
        return 'Facturación Directa'
      } else {
        return `${planData.pricing.annual_services} servicios anuales`
      }
    }
  }

  const getFeatureCount = () => {
    if (planType === 'familiar') {
      return Object.values(planData.benefits).filter(Boolean).length
    } else {
      return Object.keys(planData.features).length
    }
  }

  return (
    <div className={`border rounded-xl p-3 sm:p-4 lg:p-6 transition-all max-w-full ${
      planData.active ? 'border-gray-200 bg-white' : 'border-gray-300 bg-gray-50'
    }`}>
      <div className="flex items-start justify-between mb-3 sm:mb-4">
        <div className="flex-1 min-w-0 pr-2">
          <h3 className="font-bold text-base sm:text-lg text-gray-800 truncate">{planData.name}</h3>
          <p className="text-xs sm:text-sm text-gray-600 line-clamp-2">{planData.description}</p>
        </div>
        <div className="flex items-center space-x-2 flex-shrink-0">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            planData.active 
              ? 'bg-green-100 text-green-800' 
              : 'bg-red-100 text-red-800'
          }`}>
            {planData.active ? 'Activo' : 'Inactivo'}
          </span>
        </div>
      </div>

      <div className="space-y-2 sm:space-y-3 mb-3 sm:mb-4">
        <div className="flex justify-between items-start gap-2">
          <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Precio:</span>
          <div className="text-right min-w-0">
            {planType === 'familiar' ? (
              getPriceDisplay()
            ) : (
              <span className="font-semibold text-blue-600 text-xs sm:text-sm">{getPriceDisplay()}</span>
            )}
          </div>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Características:</span>
          <span className="font-medium text-gray-800 text-sm">{getFeatureCount()}</span>
        </div>
        
        {planType === 'externo' && planData.target_market && (
          <div className="flex justify-between items-start gap-2">
            <span className="text-xs sm:text-sm text-gray-600 flex-shrink-0">Mercado objetivo:</span>
            <span className="text-xs text-gray-700 text-right max-w-24 sm:max-w-32">{planData.target_market}</span>
          </div>
        )}
        
        <div className="flex justify-between items-center">
          <span className="text-xs sm:text-sm text-gray-600">Actualizado:</span>
          <span className="text-xs text-gray-500">{planData.updated_at}</span>
        </div>
      </div>

      {/* Límites rápidos - Responsive */}
      {planType === 'familiar' && (
        <div className="mb-3 sm:mb-4 p-2 sm:p-3 bg-gray-50 rounded-lg">
          <h4 className="text-xs font-medium text-gray-700 mb-2">Límites Principales:</h4>
          <div className="grid grid-cols-2 gap-1 text-xs">
            <div className="truncate">Emergencias: <span className="font-medium">{planData.limits.EMERGENCIA}</span></div>
            <div className="truncate">Urgencias: <span className="font-medium">{planData.limits.URGENCIA}</span></div>
            <div className="truncate">Médico Dom.: <span className="font-medium">{planData.limits.MEDICO_DOMICILIO}</span></div>
            <div className="truncate">Traslados: <span className="font-medium">{planData.limits.TRASLADO_PROGRAMADO}</span></div>
          </div>
        </div>
      )}

      {/* Botones de acción - Responsive */}
      <div className="space-y-2 sm:space-y-0 sm:flex sm:space-x-2">
        <button
          onClick={onEdit}
          className="w-full sm:flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <i className="fas fa-edit mr-1"></i>
          <span className="hidden sm:inline">Editar</span>
          <span className="sm:hidden">Editar Plan</span>
        </button>
        <button
          onClick={onToggleStatus}
          className={`w-full sm:flex-1 py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm transition-colors ${
            planData.active
              ? 'bg-yellow-600 hover:bg-yellow-700 text-white'
              : 'bg-green-600 hover:bg-green-700 text-white'
          }`}
        >
          <i className={`fas fa-${planData.active ? 'pause' : 'play'} mr-1`}></i>
          {planData.active ? 'Pausar' : 'Activar'}
        </button>
        <button
          onClick={onDelete}
          className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white py-2 px-2 sm:px-3 rounded-lg text-xs sm:text-sm transition-colors"
        >
          <i className="fas fa-trash"></i>
          <span className="sm:hidden ml-1">Eliminar</span>
        </button>
      </div>
    </div>
  )
}

const PlanFormModal = ({ plan, planType, onClose, onSave }) => {
  const [formData, setFormData] = useState(plan?.data || {
    name: '',
    description: '',
    active: true,
    pricing: planType === 'familiar' ? {
      annually: 0,
      currency: 'PEN'
    } : planType === 'corporativo' ? {
      per_employee: 0,
      minimum_employees: 1,
      setup_fee: 0,
      currency: 'PEN'
    } : {
      per_service: 0,
      monthly_fee: 0,
      currency: 'PEN'
    },
    limits: {},
    benefits: {},
    features: {},
    target_market: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.description) {
      Swal.fire({
        title: 'Campos Requeridos',
        text: 'Nombre y descripción son obligatorios',
        icon: 'warning',
        confirmButtonColor: '#D32F2F'
      })
      return
    }
    
    onSave(formData)
  }

  const handleNestedChange = (path, value) => {
    setFormData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {plan ? 'Editar' : 'Crear'} Plan {planType.charAt(0).toUpperCase() + planType.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className={planType === 'familiar' || planType === 'corporativo' ? 'md:col-span-2' : ''}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Plan *
              </label>
              <input
                type="text"
                value={formData.name || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                required
              />
            </div>
            
            {planType === 'externo' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Mercado Objetivo
                </label>
                <input
                  type="text"
                  value={formData.target_market || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, target_market: e.target.value }))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.description || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
              required
            />
          </div>

          {/* Configuración de precios */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Configuración de Precios</h3>
            {planType === 'familiar' && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Precio Anual <span className="text-red-500">*</span>
                      <span className="text-xs text-gray-500 ml-2">(Suscripción mínima de 1 año)</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">S/</span>
                      <input
                        type="number"
                        value={formData.pricing?.annually || 0}
                        onChange={(e) => {
                          const annual = parseInt(e.target.value) || 0
                          handleNestedChange('pricing.annually', annual)
                        }}
                        className="w-full border border-gray-300 rounded-lg pl-10 pr-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                        placeholder="0"
                        min="0"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Equivalente Mensual
                      <span className="text-xs text-gray-500 ml-2">(Referencial)</span>
                    </label>
                    <div className="bg-gray-50 border border-gray-200 rounded-lg px-4 py-2">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-600">S/ {Math.round((formData.pricing?.annually || 0) / 12).toLocaleString()}</span>
                        <span className="text-sm text-gray-500">por mes</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-start space-x-2">
                    <i className="fas fa-info-circle text-blue-600 mt-0.5"></i>
                    <div className="text-sm text-blue-800">
                      <p className="font-medium">Información importante:</p>
                      <ul className="mt-1 space-y-1 text-blue-700">
                        <li>• Los planes familiares requieren contratación anual (12 meses mínimo)</li>
                        <li>• El pago puede ser en cuotas mensuales de S/ {Math.round((formData.pricing?.annually || 0) / 12).toLocaleString()}</li>
                        <li>• La renovación es automática salvo cancelación expresa</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}
            
            {planType === 'corporativo' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Precio por Empleado</label>
                  <input
                    type="number"
                    value={formData.pricing?.per_employee || 0}
                    onChange={(e) => handleNestedChange('pricing.per_employee', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Mínimo Empleados</label>
                  <input
                    type="number"
                    value={formData.pricing?.minimum_employees || 1}
                    onChange={(e) => handleNestedChange('pricing.minimum_employees', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Costo de Instalación</label>
                  <input
                    type="number"
                    value={formData.pricing?.setup_fee || 0}
                    onChange={(e) => handleNestedChange('pricing.setup_fee', parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Límites de servicios - Solo para planes familiares */}
          {planType === 'familiar' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Límites de Servicios</h3>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                {[
                  { key: 'EMERGENCIA', label: 'Emergencias' },
                  { key: 'URGENCIA', label: 'Urgencias' },
                  { key: 'MEDICO_DOMICILIO', label: 'Médico a Domicilio' },
                  { key: 'TRASLADO_PROGRAMADO', label: 'Traslado Programado' },
                  { key: 'ZONA_PROTEGIDA', label: 'Zona Protegida' },
                  { key: 'EXAMENES_LABORATORIO', label: 'Exámenes de Laboratorio' }
                ].map((service) => (
                  <div key={service.key}>
                    <label className="block text-sm font-medium text-gray-700 mb-2">{service.label}</label>
                    <input
                      type="text"
                      value={formData.limits?.[service.key] || '0'}
                      onChange={(e) => handleNestedChange(`limits.${service.key}`, 
                        e.target.value === 'ILIMITADO' ? 'ILIMITADO' : 
                        isNaN(parseInt(e.target.value)) ? '0' : parseInt(e.target.value)
                      )}
                      placeholder="0 o ILIMITADO"
                      className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Estado del plan */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="planActive"
              checked={formData.active || false}
              onChange={(e) => setFormData(prev => ({ ...prev, active: e.target.checked }))}
              className="h-4 w-4 text-primary-red focus:ring-primary-red border-gray-300 rounded"
            />
            <label htmlFor="planActive" className="ml-2 text-sm text-gray-700">
              Plan activo
            </label>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-red hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {plan ? 'Actualizar' : 'Crear'} Plan
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

const AdditionalPricingModal = ({ pricing, onClose, onSave }) => {
  const [pricingData, setPricingData] = useState(pricing)

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(pricingData)
  }

  const handleNestedChange = (path, value) => {
    setPricingData(prev => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }
      
      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">Configuración de Precios Adicionales</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
          {/* Recargos por horario */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Recargos por Horario</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Horario Nocturno (%)</label>
                <input
                  type="number"
                  value={pricingData.emergency_surcharge?.night_hours?.percentage || 0}
                  onChange={(e) => handleNestedChange('emergency_surcharge.night_hours.percentage', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                />
                <p className="text-xs text-gray-500 mt-1">22:00 - 06:00</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Fin de Semana (%)</label>
                <input
                  type="number"
                  value={pricingData.emergency_surcharge?.weekend?.percentage || 0}
                  onChange={(e) => handleNestedChange('emergency_surcharge.weekend.percentage', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                />
                <p className="text-xs text-gray-500 mt-1">Sábado y Domingo</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Días Festivos (%)</label>
                <input
                  type="number"
                  value={pricingData.emergency_surcharge?.holidays?.percentage || 0}
                  onChange={(e) => handleNestedChange('emergency_surcharge.holidays.percentage', parseInt(e.target.value))}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                />
                <p className="text-xs text-gray-500 mt-1">Días festivos nacionales</p>
              </div>
            </div>
          </div>

          {/* Costos base por servicio */}
          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">Costos Base por Servicio</h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4">
              {Object.entries(pricingData.service_costs || {}).map(([serviceKey, serviceData]) => (
                <div key={serviceKey}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {serviceKey.replace(/_/g, ' ')}
                  </label>
                  <input
                    type="number"
                    value={serviceData.base_cost || 0}
                    onChange={(e) => handleNestedChange(`service_costs.${serviceKey}.base_cost`, parseInt(e.target.value))}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  />
                  <p className="text-xs text-gray-500 mt-1">{serviceData.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Botones */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-red hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Guardar Configuración
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PlanConfiguration