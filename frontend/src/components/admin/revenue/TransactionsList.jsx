import React from 'react'
import { LABELS } from '../../../config/labels'

/**
 * ${LABELS.admin.revenue.transactionsList.comments.title}
 * ${LABELS.admin.revenue.transactionsList.comments.rules.rule3}
 * ${LABELS.admin.revenue.transactionsList.comments.rules.rule2}
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
  const labels = LABELS.admin.revenue.transactionsList
  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-exo font-semibold text-gray-800 mb-4">
          <i className="fas fa-filter text-helpmed-blue mr-2"></i>
          {labels.filters.title}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              {labels.filters.fields.from}
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
              {labels.filters.fields.to}
            </label>
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onFilterChange('dateTo', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            />
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">{labels.filters.fields.type}</label>
            <select
              value={filters.type}
              onChange={(e) => onFilterChange('type', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">{labels.filters.options.allTypes}</option>
              <option value="service_payment">{labels.transactionTypes.service_payment}</option>
              <option value="plan_payment">{labels.transactionTypes.plan_payment}</option>
              <option value="additional_fee">{labels.transactionTypes.additional_fee}</option>
              <option value="refund">{labels.transactionTypes.refund}</option>
              <option value="adjustment">{labels.transactionTypes.adjustment}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              {labels.filters.fields.status}
            </label>
            <select
              value={filters.status}
              onChange={(e) => onFilterChange('status', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
            >
              <option value="all">{labels.filters.options.allStatuses}</option>
              <option value="COMPLETED">{labels.statuses.completed}</option>
              <option value="PENDING">{labels.statuses.pending}</option>
              <option value="FAILED">{labels.statuses.failed}</option>
              <option value="CANCELLED">{labels.statuses.cancelled}</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-roboto font-medium text-gray-700 mb-2">
              {labels.filters.fields.search}
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder={labels.filters.placeholders.search}
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
            {labels.filters.clearFilters}
          </button>

          <span className="text-sm text-gray-600 font-roboto">
            {labels.filters.transactionsFound.replace('{count}', transactions.length)}
          </span>
        </div>
      </div>

      {/* Lista de Transacciones */}
      <div className="bg-white rounded-xl shadow-medium overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-exo font-semibold text-gray-800">{labels.list.title}</h3>
        </div>

        {loading ? (
          <div className="p-8 text-center">
            <i className="fas fa-spinner fa-spin text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">{labels.list.loading.title}</h3>
            <p className="text-gray-600 font-roboto">{labels.list.loading.message}</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="p-8 text-center">
            <i className="fas fa-receipt text-4xl text-gray-400 mb-4"></i>
            <h3 className="text-lg font-exo font-semibold text-gray-800 mb-2">
              {labels.list.empty.title}
            </h3>
            <p className="text-gray-600 font-roboto">
              {labels.list.empty.message}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.date}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.concept}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.client}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.type}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.amount}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.status}
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-exo font-semibold text-gray-500 uppercase tracking-wider">
                    {labels.list.headers.actions}
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
                          ? labels.statuses.completed
                          : transaction.status === 'PENDING'
                            ? labels.statuses.pending
                            : transaction.status === 'FAILED'
                              ? labels.statuses.failed
                              : labels.statuses.cancelled}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => onEdit(transaction)}
                          className="text-helpmed-blue hover:text-blue-700 transition-colors"
                          title={labels.list.actions.edit}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button
                          onClick={() => onDelete(transaction.id)}
                          className="text-red-600 hover:text-red-700 transition-colors"
                          title={labels.list.actions.delete}
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
