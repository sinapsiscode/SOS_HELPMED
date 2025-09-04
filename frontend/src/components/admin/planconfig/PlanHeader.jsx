import React from 'react'

/**
 * Header del sistema de configuración de planes
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} planStats - Estadísticas de planes
 * @param {Function} onCreatePlan - Función para crear nuevo plan
 * @param {Function} onExportExcel - Función para exportar a Excel
 * @param {Function} onExportPDF - Función para exportar a PDF
 * @param {Function} onExportCSV - Función para exportar a CSV
 * @param {Function} onOpenPricing - Función para abrir modal de precios
 * @param {boolean} isLoading - Estado de carga
 * @returns {JSX.Element} Header con estadísticas y controles
 */
const PlanHeader = ({
  planStats,
  onCreatePlan,
  onExportExcel,
  onExportPDF,
  onExportCSV,
  onOpenPricing,
  isLoading
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!planStats || typeof planStats !== 'object') {
    console.error('PlanHeader: planStats es requerido y debe ser un objeto')
    return null
  }

  if (typeof onCreatePlan !== 'function') {
    console.error('PlanHeader: onCreatePlan debe ser una función')
    return null
  }

  if (typeof onExportExcel !== 'function') {
    console.error('PlanHeader: onExportExcel debe ser una función')
    return null
  }

  if (typeof onExportPDF !== 'function') {
    console.error('PlanHeader: onExportPDF debe ser una función')
    return null
  }

  if (typeof onExportCSV !== 'function') {
    console.error('PlanHeader: onExportCSV debe ser una función')
    return null
  }

  if (typeof onOpenPricing !== 'function') {
    console.error('PlanHeader: onOpenPricing debe ser una función')
    return null
  }

  if (typeof isLoading !== 'boolean') {
    console.error('PlanHeader: isLoading debe ser boolean')
    return null
  }

  return (
    <div className="space-y-6">
      {/* Título principal */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Configuración de Planes</h1>
          <p className="text-gray-600 mt-1">Gestiona planes familiares, corporativos y externos</p>
        </div>

        {/* Botón crear plan */}
        <button
          onClick={onCreatePlan}
          disabled={isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center space-x-2 transition-colors disabled:opacity-50"
        >
          <i className="fas fa-plus"></i>
          <span>Crear Plan</span>
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl shadow-medium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-gray-800">{planStats.total}</p>
              <p className="text-sm text-gray-600">Total Planes</p>
            </div>
            <i className="fas fa-list-alt text-blue-600 text-xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-green-600">{planStats.active}</p>
              <p className="text-sm text-gray-600">Activos</p>
            </div>
            <i className="fas fa-check-circle text-green-600 text-xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-orange-600">
                {planStats.byCategory?.familiar || 0}
              </p>
              <p className="text-sm text-gray-600">Familiares</p>
            </div>
            <i className="fas fa-home text-orange-600 text-xl"></i>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-medium p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-2xl font-bold text-purple-600">
                {planStats.byCategory?.corporativo || 0}
              </p>
              <p className="text-sm text-gray-600">Corporativos</p>
            </div>
            <i className="fas fa-building text-purple-600 text-xl"></i>
          </div>
        </div>
      </div>

      {/* Controles de exportación y configuración */}
      <div className="bg-white rounded-xl shadow-medium p-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-3 sm:space-y-0">
          <h2 className="text-lg font-semibold text-gray-800">Herramientas de Gestión</h2>

          <div className="flex flex-wrap gap-2">
            {/* Botones de exportación */}
            <button
              onClick={onExportExcel}
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-file-excel"></i>
              <span>Excel</span>
            </button>

            <button
              onClick={onExportPDF}
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-file-pdf"></i>
              <span>PDF</span>
            </button>

            <button
              onClick={onExportCSV}
              disabled={isLoading}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-file-csv"></i>
              <span>CSV</span>
            </button>

            {/* Separador */}
            <div className="border-l border-gray-300 mx-2"></div>

            {/* Configuración adicional */}
            <button
              onClick={onOpenPricing}
              disabled={isLoading}
              className="bg-yellow-600 hover:bg-yellow-700 text-white px-3 py-2 rounded-lg text-sm flex items-center space-x-2 transition-colors disabled:opacity-50"
            >
              <i className="fas fa-cog"></i>
              <span>Precios Adicionales</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PlanHeader
