import React from 'react'

/**
 * Componente para la lista de transacciones con filtros
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación, lógica delegada
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.transactions - Lista de transacciones filtradas
 * @param {Object} props.filters - Filtros actuales
 * @param {Function} props.onFilterChange - Función para cambiar filtros
 * @param {Function} props.onEdit - Función para editar transacción
 * @param {Function} props.onDelete - Función para eliminar transacción
 * @param {Function} props.getTypeName - Función para obtener nombre del tipo
 * @param {Function} props.getStatusColor - Función para obtener color del estado
 * @param {Function} props.formatCurrency - Función para formatear moneda
 * @param {Function} props.clearFilters - Función para limpiar filtros
 * @param {Boolean} props.loading - Estado de carga
 * @returns {JSX.Element} Vista de la lista de transacciones
 */
const TransactionsList = ({
  transactions,
  filters,
  onFilterChange,
  onEdit,
  onDelete,
  getTypeName,
  getStatusColor,
  formatCurrency,
  clearFilters,
  loading
}) => {
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
          <i className="fas fa-filter text-helpmed-blue mr-2"></i>
          Filtros de Búsqueda
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              Desde
            </label>
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onFilterChange('dateFrom', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              Hasta
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">Tipo</label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">Todos los tipos</option>
              <option value="service_payment">Pago de Servicio</option>
              <option value="plan_payment">Pago de Plan</option>
              <option value="additional_fee">Tarifa Adicional</option>
              <option value="refund">Reembolso</option>
              <option value="adjustment">Ajuste</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">Todos los estados</option>
              <option value="COMPLETED">Completado</option>
              <option value="PENDING">Pendiente</option>
              <option value="FAILED">Fallido</option>
              <option value="CANCELLED">Cancelado</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              Búsqueda
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Buscar por concepto, cliente..."
                value={filters.search}
                onChange={(e) => onFilterChange('search', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
              />
              <i className="fas fa-search absolute right-3 top-3 text-gray-400"></i>
            </div>
          </div>
        </div>

        <div className="mt-4 flex justify-between items-center">
          <button
            onClick={clearFilters}
            className="text-sm text-gray-600 hover:text-gray-800 font-roboto"
          >
            <i className="fas fa-times mr-1"></i>
            Limpiar filtros
          </button>

          <span className="text-sm text-gray-600 font-roboto">
            {transactions.length} transacciones encontradas
          </span>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">Transacciones</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">Cargando...</h3>
            <p className="text-gray-600 font-roboto">Obteniendo transacciones</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-receipt text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">
              No hay transacciones
            </h3>
            <p className="text-gray-600 font-roboto">
              No se encontraron transacciones con los filtros seleccionados.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Fecha
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Concepto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Cliente
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-roboto">
                      {new Date(transaction.date).toLocaleDateString('es-PE')}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-roboto">
                      <div className="max-w-xs">
                        <div className="font-medium truncate">{transaction.concept}</div>
                        {transaction.notes && (
                          <div className="text-xs text-gray-500 truncate">{transaction.notes}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-roboto">
                      {transaction.userName || transaction.companyName || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-roboto">
                      {getTypeName(transaction.type)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-exo font-semibold text-gray-900">
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-exo font-semibold ${getStatusColor(transaction.status)}`}
                      >
                        {transaction.status === 'COMPLETED' && (
                          <i className="fas fa-check mr-1"></i>
                        )}
                        {transaction.status === 'PENDING' && <i className="fas fa-clock mr-1"></i>}
                        {transaction.status === 'FAILED' && <i className="fas fa-times mr-1"></i>}
                        {transaction.status === 'CANCELLED' && <i className="fas fa-ban mr-1"></i>}
                        {transaction.status === 'COMPLETED'
                          ? 'Completado'
                          : transaction.status === 'PENDING'
                            ? 'Pendiente'
                            : transaction.status === 'FAILED'
                              ? 'Fallido'
                              : 'Cancelado'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-helpmed-blue hover:text-blue-700 transition-colors"
                          title="Editar transacción"
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title="Eliminar transacción"
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default TransactionsList
