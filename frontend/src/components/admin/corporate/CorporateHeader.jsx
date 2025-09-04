import React from 'react'

/**
 * Componente header para gestión de contratos corporativos
 * ENFOQUE BALANCEADO: Solo presentación con validación de props
 *
 * @param {Object} contractStats - Estadísticas de contratos
 * @param {string} searchTerm - Término de búsqueda
 * @param {string} filter - Filtro activo
 * @param {Function} setSearchTerm - Función para actualizar búsqueda
 * @param {Function} setFilter - Función para actualizar filtro
 * @param {Function} onShowAddForm - Función para mostrar formulario
 */
const CorporateHeader = ({
  contractStats,
  searchTerm,
  filter,
  setSearchTerm,
  setFilter,
  onShowAddForm
}) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (!contractStats) {
    console.error('CorporateHeader: contractStats es requerido')
    return null
  }

  if (typeof setSearchTerm !== 'function') {
    console.error('CorporateHeader: setSearchTerm debe ser una función')
    return null
  }

  if (typeof setFilter !== 'function') {
    console.error('CorporateHeader: setFilter debe ser una función')
    return null
  }

  if (typeof onShowAddForm !== 'function') {
    console.error('CorporateHeader: onShowAddForm debe ser una función')
    return null
  }

  const { totalContracts, activeContracts, expiringContracts, monthlyRevenue } = contractStats

  return (
    <div className="bg-white rounded-xl shadow-medium p-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Gestión de Contratos Corporativos</h2>
          <p className="text-gray-600">Administra contratos de área protegida para empresas</p>
        </div>

        <button
          onClick={onShowAddForm}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium transition-colors flex items-center space-x-2 mt-4 md:mt-0"
        >
          <i className="fas fa-plus"></i>
          <span>Subir Contrato PDF</span>
        </button>
      </div>

      {/* Filtros y Búsqueda */}
      <div className="flex flex-col md:flex-row md:items-center space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <i className="fas fa-search absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
            <input
              type="text"
              placeholder="Buscar por empresa, contacto o RUC..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500"
            />
          </div>
        </div>

        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 focus:border-red-500"
        >
          <option value="all">Todos los Contratos</option>
          <option value="active">Contratos Activos</option>
          <option value="expiring">Por Vencer (30 días)</option>
        </select>
      </div>

      {/* Estadísticas Rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{totalContracts}</div>
          <div className="text-sm text-blue-700">Total Contratos</div>
        </div>
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{activeContracts}</div>
          <div className="text-sm text-green-700">Contratos Activos</div>
        </div>
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{expiringContracts}</div>
          <div className="text-sm text-orange-700">Por Vencer</div>
        </div>
        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">
            S/ {monthlyRevenue.toLocaleString()}
          </div>
          <div className="text-sm text-purple-700">Ingresos Mensuales</div>
        </div>
      </div>
    </div>
  )
}

export default CorporateHeader
