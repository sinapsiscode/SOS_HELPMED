import React, { useState, useEffect } from 'react'
import useAppStore from '../../../stores/useAppStore'
import Swal from 'sweetalert2'
import { LABELS } from '../../../config/labels'

const FinancialReport = () => {
  const labels = LABELS.admin.reports.financialReport
  const { transactions, revenueSummary, allUsers } = useAppStore()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [showAddModal, setShowAddModal] = useState(false)
  const [metrics, setMetrics] = useState({
    totalRevenue: 0,
    monthlyRevenue: 0,
    todayRevenue: 0,
    averageTransaction: 0,
    growthRate: 0
  })
  
  const [revenueByType, setRevenueByType] = useState({
    subscription: { amount: 0, percentage: 0 },
    additional: { amount: 0, percentage: 0 },
    corporate: { amount: 0, percentage: 0 },
    particular: { amount: 0, percentage: 0 },
    manual: { amount: 0, percentage: 0 }
  })

  // Calcular métricas
  useEffect(() => {
    if (transactions && transactions.length > 0) {
      const now = new Date()
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate())

      const totalRevenue = transactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth)
      const todayTransactions = transactions.filter(t => new Date(t.date) >= startOfDay)

      const monthlyRevenue = monthlyTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)
      const todayRevenue = todayTransactions.reduce((sum, t) => sum + (t.amount || 0), 0)

      // Calcular ingresos por tipo
      const byType = {
        subscription: 0,
        additional: 0,
        corporate: 0,
        particular: 0,
        manual: 0
      }
      
      transactions.forEach(t => {
        if (t.type === 'SUBSCRIPTION') byType.subscription += t.amount || 0
        else if (t.type === 'ADDITIONAL') byType.additional += t.amount || 0
        else if (t.type === 'CORPORATE') byType.corporate += t.amount || 0
        else if (t.type === 'PARTICULAR') byType.particular += t.amount || 0
        else byType.manual += t.amount || 0
      })
      
      const total = Object.values(byType).reduce((sum, val) => sum + val, 0)
      
      setRevenueByType({
        subscription: { 
          amount: byType.subscription, 
          percentage: total > 0 ? (byType.subscription / total * 100) : 0 
        },
        additional: { 
          amount: byType.additional, 
          percentage: total > 0 ? (byType.additional / total * 100) : 0 
        },
        corporate: { 
          amount: byType.corporate, 
          percentage: total > 0 ? (byType.corporate / total * 100) : 0 
        },
        particular: { 
          amount: byType.particular, 
          percentage: total > 0 ? (byType.particular / total * 100) : 0 
        },
        manual: { 
          amount: byType.manual, 
          percentage: total > 0 ? (byType.manual / total * 100) : 0 
        }
      })

      setMetrics({
        totalRevenue,
        monthlyRevenue,
        todayRevenue,
        averageTransaction: transactions.length > 0 ? totalRevenue / transactions.length : 0,
        growthRate: 0 // Calculado vs mes anterior
      })
    }
  }, [transactions])

  const handleRegisterManual = () => {
    Swal.fire({
      title: labels.modals.registerManual.title,
      html: `
        <div class="text-left">
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.registerManual.fields.concept.label}</label>
            <input id="concept" class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.registerManual.fields.concept.placeholder}">
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.registerManual.fields.amount.label}</label>
            <input id="amount" type="number" class="w-full px-3 py-2 border rounded-lg" placeholder="${labels.modals.registerManual.fields.amount.placeholder}">
          </div>
          <div class="mb-3">
            <label class="block text-sm font-medium text-gray-700 mb-1">${labels.modals.registerManual.fields.type.label}</label>
            <select id="type" class="w-full px-3 py-2 border rounded-lg">
              <option value="MANUAL">${labels.modals.registerManual.fields.type.options.manual}</option>
              <option value="SUBSCRIPTION">${labels.modals.registerManual.fields.type.options.subscription}</option>
              <option value="ADDITIONAL">${labels.modals.registerManual.fields.type.options.additional}</option>
              <option value="CORPORATE">${labels.modals.registerManual.fields.type.options.corporate}</option>
              <option value="PARTICULAR">${labels.modals.registerManual.fields.type.options.particular}</option>
            </select>
          </div>
        </div>
      `,
      showCancelButton: true,
      confirmButtonText: labels.modals.registerManual.buttons.register,
      cancelButtonText: labels.modals.registerManual.buttons.cancel,
      confirmButtonColor: '#10b981',
      preConfirm: () => {
        const concept = document.getElementById('concept').value
        const amount = document.getElementById('amount').value
        const type = document.getElementById('type').value
        
        if (!concept || !amount) {
          Swal.showValidationMessage(labels.modals.registerManual.validation)
          return false
        }
        
        return { concept, amount: parseFloat(amount), type }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        // Aquí se registraría la transacción
        Swal.fire(labels.modals.registerManual.success.title, labels.modals.registerManual.success.message, 'success')
      }
    })
  }

  const handleExportExcel = () => {
    Swal.fire({
      icon: 'info',
      title: labels.modals.exportExcel.title,
      text: labels.modals.exportExcel.message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleExportPDF = () => {
    Swal.fire({
      icon: 'info', 
      title: labels.modals.exportPDF.title,
      text: labels.modals.exportPDF.message,
      timer: 2000,
      showConfirmButton: false
    })
  }

  return (
    <div className="space-y-6">
      {/* Header con título y botones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-800">{labels.title}</h2>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={handleRegisterManual}
              className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <i className="fas fa-plus"></i>
              {labels.buttons.registerManual}
            </button>
            <button
              onClick={handleExportExcel}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <i className="fas fa-file-excel"></i>
              {labels.buttons.excel}
            </button>
            <button
              onClick={handleExportPDF}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2 text-sm font-medium"
            >
              <i className="fas fa-file-pdf"></i>
              {labels.buttons.pdf}
            </button>
          </div>
        </div>

        {/* Tabs de navegación */}
        <div className="flex gap-1 mt-6 border-b">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'dashboard'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-chart-line"></i>
            {labels.tabs.dashboard}
          </button>
          <button
            onClick={() => setActiveTab('transactions')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'transactions'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-list"></i>
            {labels.tabs.transactions}
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'pending'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-clock"></i>
            {labels.tabs.pending}
          </button>
          <button
            onClick={() => setActiveTab('analysis')}
            className={`px-4 py-2 font-medium text-sm transition-colors flex items-center gap-2 border-b-2 ${
              activeTab === 'analysis'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-600 border-transparent hover:text-gray-800'
            }`}
          >
            <i className="fas fa-chart-pie"></i>
            {labels.tabs.analysis}
          </button>
        </div>
      </div>

      {/* Cards de métricas principales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Ingresos Totales */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <span className="text-green-600 font-bold text-xl">$</span>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                S/ {metrics.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-green-600 font-medium mt-1">{labels.metrics.totalRevenue.title}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.metrics.totalRevenue.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Ingresos del Mes */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-calendar text-blue-600 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                S/ {metrics.monthlyRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-blue-600 font-medium mt-1">{labels.metrics.monthlyRevenue.title}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.metrics.monthlyRevenue.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Ingresos Hoy */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-clock text-purple-600 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                S/ {metrics.todayRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-purple-600 font-medium mt-1">{labels.metrics.todayRevenue.title}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.metrics.todayRevenue.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Transacción Promedio */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-bar text-orange-600 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                S/ {Math.round(metrics.averageTransaction).toLocaleString()}
              </p>
              <p className="text-sm text-orange-600 font-medium mt-1">{labels.metrics.averageTransaction.title}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.metrics.averageTransaction.subtitle}</p>
            </div>
          </div>
        </div>

        {/* Crecimiento - Card adicional */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 lg:hidden">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                  <i className="fas fa-chart-line text-gray-600 text-lg"></i>
                </div>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {metrics.growthRate > 0 ? labels.metrics.growth.noData : labels.metrics.growth.noData}
              </p>
              <p className="text-sm text-gray-600 font-medium mt-1">{labels.metrics.growth.title}</p>
              <p className="text-xs text-gray-500 mt-1">{labels.metrics.growth.subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Ingresos por Tipo */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{labels.revenueByType.title}</h3>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {/* Plan Familiar */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">{labels.revenueByType.types.subscription}</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {revenueByType.subscription.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {revenueByType.subscription.percentage.toFixed(0)}%
            </p>
          </div>

          {/* Servicio Adicional */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">{labels.revenueByType.types.additional}</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {revenueByType.additional.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {revenueByType.additional.percentage.toFixed(0)}%
            </p>
          </div>

          {/* Contrato Corporativo */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">{labels.revenueByType.types.corporate}</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {revenueByType.corporate.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {revenueByType.corporate.percentage.toFixed(0)}%
            </p>
          </div>

          {/* Particular */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">{labels.revenueByType.types.particular}</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {revenueByType.particular.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {revenueByType.particular.percentage.toFixed(0)}%
            </p>
          </div>

          {/* Manual */}
          <div className="text-center">
            <p className="text-sm text-gray-600 mb-1">{labels.revenueByType.types.manual}</p>
            <p className="text-xl font-bold text-gray-900">
              S/ {revenueByType.manual.amount.toLocaleString()}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {revenueByType.manual.percentage.toFixed(0)}%
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Últimas Transacciones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-800">{labels.transactions.title}</h3>
          <p className="text-sm text-gray-500">{labels.transactions.subtitle}</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">{labels.transactions.headers.date}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">{labels.transactions.headers.concept}</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">{labels.transactions.headers.type}</th>
                <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm">{labels.transactions.headers.amount}</th>
                <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">{labels.transactions.headers.status}</th>
              </tr>
            </thead>
            <tbody>
              {transactions && transactions.length > 0 ? (
                transactions.slice(0, 10).map((transaction, index) => (
                  <tr key={transaction.id || index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 px-4 text-sm text-gray-600">
                      {new Date(transaction.date || Date.now()).toLocaleDateString('es-PE')}
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-800">
                      {transaction.concept || labels.transactions.defaultConcept}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        transaction.type === 'SUBSCRIPTION' 
                          ? 'bg-blue-100 text-blue-800'
                          : transaction.type === 'ADDITIONAL'
                          ? 'bg-purple-100 text-purple-800'
                          : transaction.type === 'CORPORATE'
                          ? 'bg-green-100 text-green-800'
                          : transaction.type === 'PARTICULAR'
                          ? 'bg-orange-100 text-orange-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {transaction.type === 'SUBSCRIPTION' ? labels.transactions.types.subscription
                          : transaction.type === 'ADDITIONAL' ? labels.transactions.types.additional
                          : transaction.type === 'CORPORATE' ? labels.transactions.types.corporate
                          : transaction.type === 'PARTICULAR' ? labels.transactions.types.particular
                          : labels.transactions.types.manual}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm font-semibold text-gray-900 text-right">
                      S/ {(transaction.amount || 0).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${
                        transaction.status === 'COMPLETED' 
                          ? 'bg-green-100 text-green-800' 
                          : transaction.status === 'PENDING'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {transaction.status === 'COMPLETED' ? labels.transactions.status.completed 
                          : transaction.status === 'PENDING' ? labels.transactions.status.pending
                          : labels.transactions.status.cancelled}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-gray-500">
                    {labels.transactions.empty}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Indicador Online */}
        <div className="flex justify-end mt-4">
          <span className="px-3 py-1 bg-green-500 text-white text-xs rounded-full font-medium flex items-center gap-2">
            <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
            {labels.indicator.online}
          </span>
        </div>
      </div>
    </div>
  )
}

export default FinancialReport