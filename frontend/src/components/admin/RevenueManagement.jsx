import React, { useState } from 'react'

const RevenueManagement = () => {
  const [activeTab, setActiveTab] = useState('transacciones')
  const [dateFrom, setDateFrom] = useState('dd/mm/aaaa')
  const [dateTo, setDateTo] = useState('dd/mm/aaaa')
  const [filterType, setFilterType] = useState('todos')
  const [filterStatus, setFilterStatus] = useState('todos')
  const [searchTerm, setSearchTerm] = useState('')

  // Datos de ejemplo para la tabla
  const transactions = [
    {
      id: 'TRX-001',
      fecha: '15/03/2024',
      concepto: 'Plan Familiar - Mensualidad',
      cliente: 'Juan Pérez García',
      tipo: 'Suscripción',
      monto: 280.00,
      estado: 'Pagado',
      estadoColor: 'text-green-600 bg-green-50'
    },
    {
      id: 'TRX-002',
      fecha: '14/03/2024',
      concepto: 'Servicio de Emergencia',
      cliente: 'María López',
      tipo: 'Servicio',
      monto: 150.00,
      estado: 'Pendiente',
      estadoColor: 'text-yellow-600 bg-yellow-50'
    },
    {
      id: 'TRX-003',
      fecha: '14/03/2024',
      concepto: 'Plan Corporativo - Trimestre',
      cliente: 'Empresa ABC S.A.',
      tipo: 'Corporativo',
      monto: 2500.00,
      estado: 'Pagado',
      estadoColor: 'text-green-600 bg-green-50'
    },
    {
      id: 'TRX-004',
      fecha: '13/03/2024',
      concepto: 'Traslado Programado',
      cliente: 'Carlos Mendoza',
      tipo: 'Servicio',
      monto: 80.00,
      estado: 'Pagado',
      estadoColor: 'text-green-600 bg-green-50'
    },
    {
      id: 'TRX-005',
      fecha: '13/03/2024',
      concepto: 'Plan VIP - Anual',
      cliente: 'Roberto Silva',
      tipo: 'Suscripción',
      monto: 4920.00,
      estado: 'Procesando',
      estadoColor: 'text-blue-600 bg-blue-50'
    }
  ]

  const tabs = [
    { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-chart-pie' },
    { id: 'transacciones', label: 'Transacciones', icon: 'fas fa-list' },
    { id: 'pendientes', label: 'Pendientes', icon: 'fas fa-clock' },
    { id: 'analisis', label: 'Análisis', icon: 'fas fa-chart-bar' }
  ]

  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardContent />
      case 'transacciones':
        return <TransaccionesContent transactions={transactions} />
      case 'pendientes':
        return <PendientesContent transactions={transactions.filter(t => t.estado === 'Pendiente')} />
      case 'analisis':
        return <AnalisisContent />
      default:
        return <TransaccionesContent transactions={transactions} />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión Financiera</h1>
          <div className="flex gap-3">
            <button className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i className="fas fa-plus mr-2"></i>
              Registrar Ingreso Manual
            </button>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i className="fas fa-file-excel mr-2"></i>
              Excel
            </button>
            <button className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center">
              <i className="fas fa-file-pdf mr-2"></i>
              PDF
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-1 border-b">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 font-medium transition-colors ${
                activeTab === tab.id
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <i className={`${tab.icon} mr-2`}></i>
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Filtros */}
      {activeTab === 'transacciones' && (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <span className="text-gray-500">-</span>
              <input
                type="text"
                placeholder="dd/mm/aaaa"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 text-sm w-32 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los tipos</option>
              <option value="suscripcion">Suscripción</option>
              <option value="servicio">Servicio</option>
              <option value="corporativo">Corporativo</option>
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos los estados</option>
              <option value="pagado">Pagado</option>
              <option value="pendiente">Pendiente</option>
              <option value="procesando">Procesando</option>
              <option value="cancelado">Cancelado</option>
            </select>

            <div className="flex-1 max-w-md">
              <input
                type="text"
                placeholder="Buscar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      )}

      {/* Contenido */}
      {renderTabContent()}
    </div>
  )
}

// Componente Dashboard
const DashboardContent = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-dollar-sign text-green-600 text-xl"></i>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">S/ 45,280</h3>
        <p className="text-sm text-gray-600 mt-1">Ingresos del Mes</p>
        <div className="flex items-center mt-2 text-green-600 text-sm">
          <i className="fas fa-arrow-up mr-1"></i>
          <span>12% vs mes anterior</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-file-invoice text-blue-600 text-xl"></i>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">156</h3>
        <p className="text-sm text-gray-600 mt-1">Transacciones</p>
        <div className="flex items-center mt-2 text-blue-600 text-sm">
          <i className="fas fa-arrow-up mr-1"></i>
          <span>8% vs mes anterior</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-clock text-yellow-600 text-xl"></i>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">23</h3>
        <p className="text-sm text-gray-600 mt-1">Pagos Pendientes</p>
        <div className="flex items-center mt-2 text-yellow-600 text-sm">
          <span>S/ 3,450 por cobrar</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
            <i className="fas fa-users text-purple-600 text-xl"></i>
          </div>
        </div>
        <h3 className="text-2xl font-bold text-gray-800">89</h3>
        <p className="text-sm text-gray-600 mt-1">Clientes Activos</p>
        <div className="flex items-center mt-2 text-purple-600 text-sm">
          <i className="fas fa-arrow-up mr-1"></i>
          <span>5 nuevos este mes</span>
        </div>
      </div>
    </div>
  )
}

// Componente Transacciones
const TransaccionesContent = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">ID</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Fecha</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Concepto</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Cliente</th>
              <th className="text-left py-3 px-4 font-medium text-gray-700 text-sm">Tipo</th>
              <th className="text-right py-3 px-4 font-medium text-gray-700 text-sm">Monto</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">Estado</th>
              <th className="text-center py-3 px-4 font-medium text-gray-700 text-sm">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={transaction.id} className="border-b hover:bg-gray-50">
                <td className="py-3 px-4 text-sm font-medium text-gray-900">{transaction.id}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.fecha}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.concepto}</td>
                <td className="py-3 px-4 text-sm text-gray-700">{transaction.cliente}</td>
                <td className="py-3 px-4 text-sm">
                  <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                    {transaction.tipo}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-right font-medium">S/ {transaction.monto.toFixed(2)}</td>
                <td className="py-3 px-4 text-sm text-center">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${transaction.estadoColor}`}>
                    {transaction.estado}
                  </span>
                </td>
                <td className="py-3 px-4 text-sm text-center">
                  <div className="flex items-center justify-center space-x-2">
                    <button className="text-blue-600 hover:text-blue-800">
                      <i className="fas fa-eye"></i>
                    </button>
                    <button className="text-green-600 hover:text-green-800">
                      <i className="fas fa-edit"></i>
                    </button>
                    <button className="text-red-600 hover:text-red-800">
                      <i className="fas fa-trash"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Paginación */}
      <div className="flex items-center justify-between p-4 border-t">
        <div className="text-sm text-gray-600">
          Mostrando 1-5 de 156 registros
        </div>
        <div className="flex space-x-2">
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            Anterior
          </button>
          <button className="px-3 py-1 bg-blue-600 text-white rounded text-sm">1</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">2</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">3</button>
          <button className="px-3 py-1 border border-gray-300 rounded hover:bg-gray-50 text-sm">
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}

// Componente Pendientes
const PendientesContent = ({ transactions }) => {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Pagos Pendientes</h3>
      <div className="space-y-4">
        {transactions.length > 0 ? (
          transactions.map((transaction) => (
            <div key={transaction.id} className="border border-yellow-200 bg-yellow-50 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900">{transaction.concepto}</h4>
                  <p className="text-sm text-gray-600 mt-1">Cliente: {transaction.cliente}</p>
                  <p className="text-sm text-gray-500">Fecha: {transaction.fecha}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-gray-900">S/ {transaction.monto.toFixed(2)}</p>
                  <button className="mt-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm">
                    Marcar como Pagado
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-8 text-gray-500">
            <i className="fas fa-check-circle text-4xl mb-2"></i>
            <p>No hay pagos pendientes</p>
          </div>
        )}
      </div>
    </div>
  )
}

// Componente Análisis
const AnalisisContent = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Ingresos por Mes</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Gráfico de barras de ingresos mensuales</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Distribución por Tipo</h3>
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded">
          <p className="text-gray-500">Gráfico circular de tipos de servicio</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Clientes</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Empresa ABC S.A.</span>
            <span className="font-medium">S/ 12,500</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Roberto Silva</span>
            <span className="font-medium">S/ 4,920</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700">Juan Pérez García</span>
            <span className="font-medium">S/ 3,360</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Estados de Pago</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Pagados</span>
            </div>
            <span className="font-medium">S/ 38,450 (85%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Pendientes</span>
            </div>
            <span className="font-medium">S/ 3,450 (8%)</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
              <span className="text-sm text-gray-700">Procesando</span>
            </div>
            <span className="font-medium">S/ 3,380 (7%)</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RevenueManagement