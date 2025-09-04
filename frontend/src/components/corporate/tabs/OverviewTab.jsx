import React from 'react'
import ContractExpirationAlert from '../ContractExpirationAlert'
import ServicesExhaustionAlert from '../ServicesExhaustionAlert'
import CompanyStats from '../CompanyStats'
import CorporateEmergencyForm from '../CorporateEmergencyForm'
import ServiceCounter from '../../shared/ServiceCounter'

/**
 * Tab de vista general del dashboard corporativo
 * Muestra alertas, estadísticas y formulario de emergencia
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario corporativo
 * @param {Object} props.companyStats - Estadísticas de la empresa
 * @param {Object} props.contractAlerts - Alertas del contrato
 * @param {Object} props.emergencyFormData - Datos del formulario de emergencia
 * @param {Object} props.formErrors - Errores del formulario
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.onEmergencyRequest - Callback para solicitar emergencia
 * @param {Function} props.onUpdateData - Callback para actualizar datos del formulario
 * @param {Function} props.onPurchaseAdditional - Callback para comprar servicios adicionales
 * @param {Function} props.onRenewal - Callback para renovar contrato
 * @param {Function} props.onContact - Callback para contactar ventas
 * @param {Function} props.onSOSEmergency - Callback para emergencia SOS
 */
const OverviewTab = ({
  user,
  companyStats,
  contractAlerts,
  emergencyFormData,
  formErrors,
  loading,
  onEmergencyRequest,
  onUpdateData,
  onPurchaseAdditional,
  onRenewal,
  onContact,
  onSOSEmergency
}) => {
  return (
    <div className="space-y-6">
      {/* Botón de Emergencia SOS Flotante */}
      <button
        onClick={onSOSEmergency}
        className="fixed bottom-6 right-6 z-50 bg-red-600 hover:bg-red-700 text-white rounded-full w-16 h-16 shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center group animate-pulse-slow"
        title="Emergencia SOS - Enviar alerta inmediata"
      >
        <span className="font-bold text-lg">SOS</span>
        <div className="absolute inset-0 rounded-full bg-red-600 animate-ping opacity-75"></div>
      </button>

      {/* Alertas de Contrato y Servicios */}
      <ContractExpirationAlert alert={contractAlerts} onRenewal={onRenewal} onContact={onContact} />

      <ServicesExhaustionAlert alert={contractAlerts} onPurchase={onPurchaseAdditional} />


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Columna izquierda - Solicitar emergencia */}
        <div className="lg:col-span-2 space-y-6">
          <CorporateEmergencyForm
            user={user}
            formData={emergencyFormData}
            errors={formErrors}
            loading={loading}
            onUpdateData={onUpdateData}
            onSubmit={onEmergencyRequest}
          />
        </div>

        {/* Columna derecha - Información */}
        <div className="space-y-6">
          {/* Servicios Contratados */}
          <div className="bg-white rounded-xl shadow-medium p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-800 font-exo">Servicios Contratados</h3>
              <span className="bg-purple-100 text-purple-600 text-xs font-medium px-2 py-1 rounded-full">
                CORPORATIVO
              </span>
            </div>
            <div className="text-sm text-gray-600 font-roboto mb-4">
              Área Protegida - Empresa ABC
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-3">
                    <i className="fas fa-heartbeat text-red-600 text-sm"></i>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-800">Servicios Disponibles</div>
                    <div className="text-xs text-gray-600">Emergencias, urgencias y médico a domicilio</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-red-600">0</div>
                  <div className="text-xs text-gray-500">/12</div>
                </div>
              </div>
            </div>
          </div>

          {/* Estadísticas de la Empresa */}
          <div className="bg-white rounded-xl shadow-medium p-6">
            <h3 className="text-lg font-bold text-gray-800 font-exo mb-4">
              Estadísticas de la Empresa
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-roboto">Tipo de Plan:</span>
                <span className="text-sm font-bold text-gray-900 font-exo">Anual</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-roboto">Servicios:</span>
                <span className="text-sm font-bold text-gray-900 font-exo">50/año</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-blue-600 font-roboto cursor-pointer hover:underline">Ubicaciones:</span>
                <span className="text-sm font-bold text-gray-900 font-exo">2</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 font-roboto">Uso del contrato:</span>
                <span className="text-sm font-bold text-gray-900 font-exo">100%</span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-500 h-2 rounded-full" style={{width: '100%'}}></div>
              </div>
              
              <div className="pt-4 border-t border-gray-200">
                <div className="flex justify-between items-center text-xs">
                  <span className="text-blue-600 font-roboto">Próximo reset: 31-12-2024</span>
                  <span className="text-gray-500 font-roboto">245 días</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas de la empresa - Movido a la parte inferior */}
      <CompanyStats stats={companyStats} />
    </div>
  )
}

export default OverviewTab
