import React, { useState } from 'react'
import { LABELS } from '../../config/labels'
import Swal from 'sweetalert2'
import PaymentMethodsConfig from './PaymentMethodsConfig'

const SystemConfiguration = () => {
  const labels = LABELS.admin.systemConfiguration
  const [activeSection, setActiveSection] = useState('alerts') // 'alerts' o 'payments'
  const [emailNotifications, setEmailNotifications] = useState(true)
  const [smsNotifications, setSmsNotifications] = useState(true)
  const [corporateAlerts, setCorporateAlerts] = useState({
    clients: 2,
    services: 2,
    familiarClients: 1,
    familiarServices: 1,
    contractDays: 15,
    views: {
      renewRecord: true,
      notRenewedRecord: true,
      nextToExpire: true,
      expired: false
    }
  })

  const handleSaveAlerts = (type) => {
    Swal.fire({
      icon: 'success',
      title: labels.save.title,
      text: labels.save.message.replace('{type}', type),
      timer: 2000,
      showConfirmButton: false
    })
  }

  const handleViewAlert = (view) => {
    const alerts = {
      corporate: '2 contratos corporativos están por vencer en los próximos 15 días',
      familiar: '1 servicio familiar restante para 3 clientes'
    }
    Swal.fire({
      title: labels.preview.title,
      text: alerts[view] || labels.preview.defaultMessage,
      icon: 'info',
      confirmButtonColor: '#3b82f6'
    })
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{labels.header.title}</h2>
        <p className="text-sm text-gray-600">{labels.header.subtitle}</p>
        
        {/* Tabs de navegación */}
        <div className="flex space-x-4 mt-6 border-b">
          <button
            onClick={() => setActiveSection('alerts')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeSection === 'alerts'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <i className="fas fa-bell mr-2"></i>
            {labels.tabs.alerts}
          </button>
          <button
            onClick={() => setActiveSection('payments')}
            className={`pb-3 px-1 text-sm font-medium transition-colors border-b-2 ${
              activeSection === 'payments'
                ? 'text-blue-600 border-blue-600'
                : 'text-gray-500 border-transparent hover:text-gray-700'
            }`}
          >
            <i className="fas fa-credit-card mr-2"></i>
            {labels.tabs.payments}
          </button>
        </div>
      </div>

      {/* Contenido condicional */}
      {activeSection === 'alerts' ? (
        <>

      {/* Alertas de Servicios Agotándose */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-orange-500 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-800">{labels.serviceAlerts.title}</h3>
        </div>

        {/* Clientes Corporativos */}
        <div className="bg-purple-50 rounded-lg p-4 mb-4">
          <div className="flex items-center mb-3">
            <i className="fas fa-building text-purple-600 mr-2"></i>
            <h4 className="font-medium text-gray-800">{labels.serviceAlerts.corporateClients}</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">{labels.serviceAlerts.thresholdLabel}</label>
              <input
                type="number"
                value={corporateAlerts.clients}
                onChange={(e) => setCorporateAlerts({...corporateAlerts, clients: e.target.value})}
                className="w-16 px-2 py-1 border rounded text-center"
              />
              <span className="text-sm text-gray-500">{labels.serviceAlerts.servicesUnit}</span>
            </div>
            <button
              onClick={() => handleViewAlert('corporate')}
              className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-yellow-200"
            >
              <i className="fas fa-eye"></i>
              Vista Previa de la Alerta
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Los corporativos serán una alerta cuando tengan 2 o menos servicios restantes
          </p>

          <div className="flex items-center mt-3 p-3 bg-yellow-50 rounded-lg">
            <i className="fas fa-exclamation-triangle text-yellow-600 mr-2"></i>
            <span className="text-sm text-gray-700">Te quedan solo <strong>2 servicios restantes</strong></span>
          </div>
        </div>

        {/* Clientes Familiares */}
        <div className="bg-blue-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <i className="fas fa-home text-blue-600 mr-2"></i>
            <h4 className="font-medium text-gray-800">{labels.serviceAlerts.familiarClients}</h4>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">{labels.serviceAlerts.thresholdLabel}</label>
              <input
                type="number"
                value={corporateAlerts.familiarClients}
                onChange={(e) => setCorporateAlerts({...corporateAlerts, familiarClients: e.target.value})}
                className="w-16 px-2 py-1 border rounded text-center"
              />
              <span className="text-sm text-gray-500">{labels.serviceAlerts.servicesUnit}</span>
            </div>
            <button
              onClick={() => handleViewAlert('familiar')}
              className="px-4 py-2 bg-red-100 text-red-700 rounded-lg text-sm font-medium flex items-center gap-2 hover:bg-red-200"
            >
              <i className="fas fa-eye"></i>
              Vista Previa de la Alerta
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mt-2">
            Los familiares serán una alerta cuando tengan 1 o menos servicios restantes
          </p>

          <div className="flex items-center mt-3 p-3 bg-red-50 rounded-lg">
            <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
            <span className="text-sm text-gray-700">Te quedan solo <strong>1 servicios restantes</strong></span>
          </div>
        </div>
      </div>

      {/* Alertas de Vencimiento de Contratos */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <div className="w-2 h-6 bg-blue-500 rounded-full mr-3"></div>
          <h3 className="text-lg font-semibold text-gray-800">{labels.contractAlerts.title}</h3>
        </div>

        <div className="bg-green-50 rounded-lg p-4">
          <div className="flex items-center mb-3">
            <i className="fas fa-file-contract text-green-600 mr-2"></i>
            <h4 className="font-medium text-gray-800">{labels.contractAlerts.corporateContracts}</h4>
          </div>
          
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <label className="text-sm text-gray-600">{labels.contractAlerts.daysBeforeLabel}</label>
              <input
                type="number"
                value={corporateAlerts.contractDays}
                onChange={(e) => setCorporateAlerts({...corporateAlerts, contractDays: e.target.value})}
                className="w-16 px-2 py-1 border rounded text-center"
              />
              <span className="text-sm text-gray-500">{labels.contractAlerts.daysUnit}</span>
            </div>
            <button
              onClick={() => handleSaveAlerts('contratos')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
            >
              <i className="fas fa-save mr-2"></i>
              Guardar
            </button>
          </div>
          
          <p className="text-xs text-gray-500 mb-4">
            Los corporativos serán una alerta cuando falten 15 o menos días para que venza su contrato
          </p>

          {/* Vista Previa de la Alerta */}
          <div className="border-t pt-4">
            <h5 className="text-sm font-medium text-gray-700 mb-3">Vista Previa de la Alerta</h5>
            
            <div className="space-y-2">
              <button
                onClick={() => handleViewAlert('corporate')}
                className="w-full px-4 py-3 bg-blue-500 text-white rounded-lg text-sm font-medium hover:bg-blue-600 flex items-center justify-between"
              >
                <span className="flex items-center">
                  <i className="fas fa-chart-line mr-2"></i>
                  Recordatorio de Renovación
                </span>
                <span className="text-xs bg-blue-600 px-2 py-1 rounded">15 días restantes</span>
              </button>
              
              <p className="text-xs text-gray-500 ml-8">Tu contrato corporativo vence próximamente</p>
              
              <h5 className="text-sm font-medium text-gray-700 mt-4 mb-2">Visualizar según objetivo:</h5>
              
              <div className="space-y-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={corporateAlerts.views.renewRecord}
                    onChange={(e) => setCorporateAlerts({
                      ...corporateAlerts,
                      views: {...corporateAlerts.views, renewRecord: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">📊 Recordatorio (+ 7 días)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={corporateAlerts.views.nextToExpire}
                    onChange={(e) => setCorporateAlerts({
                      ...corporateAlerts,
                      views: {...corporateAlerts.views, nextToExpire: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">⚠️ Próximo a Vencer (5-7 días)</span>
                </label>
                
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={corporateAlerts.views.expired}
                    onChange={(e) => setCorporateAlerts({
                      ...corporateAlerts,
                      views: {...corporateAlerts.views, expired: e.target.checked}
                    })}
                    className="mr-2"
                  />
                  <span className="text-sm">🔴 EXPIRÓ (1-3 días)</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración de Notificaciones */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-bell text-blue-500 mr-3"></i>
          <h3 className="text-lg font-semibold text-gray-800">{labels.notifications.title}</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Recordatorios por Email Automáticos</h4>
              <p className="text-sm text-gray-600">Enviar emails automáticos cuando los servicios estén por agotarse</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={emailNotifications}
                onChange={(e) => setEmailNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <h4 className="font-medium text-gray-800">Notificaciones SMS</h4>
              <p className="text-sm text-gray-600">Enviar mensajes de texto para alertas críticas</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={smsNotifications}
                onChange={(e) => setSmsNotifications(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </div>
      </div>

      {/* Impacto de la Configuración Actual */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-center mb-4">
          <i className="fas fa-chart-line text-green-500 mr-3"></i>
          <h3 className="text-lg font-semibold text-gray-800">Impacto de la Configuración Actual</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-purple-700">Servicios Corporativos</h4>
              <i className="fas fa-building text-purple-500"></i>
            </div>
            <div className="text-3xl font-bold text-purple-700">~23</div>
            <p className="text-sm text-gray-600 mt-1">Clientes con 2 o menos servicios restantes</p>
          </div>

          <div className="bg-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-700">Servicios Familiares</h4>
              <i className="fas fa-home text-blue-500"></i>
            </div>
            <div className="text-3xl font-bold text-blue-700">~47</div>
            <p className="text-sm text-gray-600 mt-1">Clientes con 1 o menos servicios restantes</p>
          </div>

          <div className="bg-green-50 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-700">Contratos por Vencer</h4>
              <i className="fas fa-calendar-check text-green-500"></i>
            </div>
            <div className="text-3xl font-bold text-green-700">~12</div>
            <p className="text-sm text-gray-600 mt-1">Contratos que vencen en 15 o menos días</p>
          </div>
        </div>

        <div className="mt-4 p-4 bg-yellow-50 rounded-lg">
          <div className="flex items-start">
            <i className="fas fa-lightbulb text-yellow-500 mt-1 mr-3"></i>
            <div>
              <h5 className="font-medium text-gray-800">💡 Recomendaciones</h5>
              <ul className="text-sm text-gray-600 mt-2 space-y-1">
                <li>• Un umbral de 2-3 servicios para corporativos permite tiempo suficiente para renovaciones</li>
                <li>• Un umbral de 1 servicio para familiares evita interrupciones del servicio</li>
                <li>• Alertar 15-30 días antes del vencimiento da tiempo suficiente para procesar renovaciones</li>
                <li>• Las notificaciones automáticas reducen significativamente la pérdida de clientes</li>
                <li>• Configuraciones muy tempranas pueden saturar con alertas prematuras</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      </>
      ) : (
        <PaymentMethodsConfig />
      )}
    </div>
  )
}

export default SystemConfiguration