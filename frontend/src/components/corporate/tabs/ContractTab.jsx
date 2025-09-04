import React from 'react'

/**
 * Tab de información del contrato corporativo
 * Muestra detalles del contrato, documentos y términos
 *
 * @component
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.user - Datos del usuario corporativo
 * @param {Function} props.onDownloadContract - Callback para descargar contrato
 * @param {Function} props.onViewContract - Callback para ver contrato
 */
const ContractTab = ({ user, onDownloadContract, onViewContract }) => {
  const hasContractPDF = true

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header del Contrato - Responsive */}
      <div className="bg-white rounded-xl shadow-medium p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 space-y-4 sm:space-y-0">
          <div className="text-center sm:text-left">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-800 font-exo">Mi Contrato</h2>
            <p className="text-sm sm:text-base text-gray-600 mt-1 font-roboto">
              Información y documentos del contrato corporativo
            </p>
          </div>
          <div className="flex justify-center sm:justify-end">
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
              Activo
            </span>
          </div>
        </div>

        {/* Información Básica del Contrato */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-4 sm:mb-6">
          <InfoCard
            icon="fa-file-signature"
            color="blue"
            value={user.plan.contract_id}
            label="ID del Contrato"
          />
          <InfoCard
            icon="fa-calendar-check"
            color="green"
            value={new Date(user.plan.start_date).toLocaleDateString('es-PE')}
            label="Fecha de Inicio"
          />
          <InfoCard
            icon="fa-calendar-times"
            color="orange"
            value={new Date(user.plan.endDate || user.plan.renewal_date).toLocaleDateString(
              'es-PE'
            )}
            label="Fecha de Vencimiento"
          />
          <InfoCard
            icon="fa-ambulance"
            color="purple"
            value={user.plan.contract_services}
            label="Servicios Contratados"
          />
        </div>

        {/* Documento del Contrato */}
        <div className="border-t border-gray-200 pt-4 sm:pt-6">
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4 font-exo">
            Documento del Contrato
          </h3>

          {hasContractPDF ? (
            <ContractDocument
              user={user}
              onViewContract={onViewContract}
              onDownloadContract={onDownloadContract}
            />
          ) : (
            <DocumentPending />
          )}
        </div>

        {/* Información Adicional */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
          <ContractTerms user={user} />
          <ContactInfo />
        </div>
      </div>
    </div>
  )
}

/**
 * Componente para mostrar tarjetas de información
 */
const InfoCard = ({ icon, color, value, label }) => (
  <div className="text-center">
    <div className={`bg-${color}-50 rounded-lg p-3 sm:p-4`}>
      <i className={`fas ${icon} text-${color}-600 text-lg sm:text-2xl mb-1 sm:mb-2`}></i>
      <div className="font-bold text-gray-800 text-sm sm:text-base truncate font-exo">{value}</div>
      <div className="text-xs sm:text-sm text-gray-600 font-roboto">{label}</div>
    </div>
  </div>
)

/**
 * Componente para mostrar el documento del contrato
 */
const ContractDocument = ({ user, onViewContract, onDownloadContract }) => (
  <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 sm:p-6">
    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
      <div className="flex flex-col sm:flex-row sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 flex-1 min-w-0">
        <div className="bg-red-100 p-3 rounded-lg self-center sm:self-auto flex-shrink-0">
          <i className="fas fa-file-pdf text-red-600 text-xl sm:text-2xl"></i>
        </div>
        <div className="text-center sm:text-left min-w-0 flex-1">
          <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate font-roboto">
            Contrato-{user.company.name}-{user.plan.contract_id}.pdf
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 font-roboto">
            Contrato corporativo • Última actualización:{' '}
            {new Date(user.plan.start_date).toLocaleDateString('es-PE')}
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3 flex-shrink-0">
        <button
          onClick={onViewContract}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-roboto"
        >
          <i className="fas fa-eye"></i>
          <span>Ver</span>
        </button>

        <button
          onClick={onDownloadContract}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm font-roboto"
        >
          <i className="fas fa-download"></i>
          <span>Descargar</span>
        </button>
      </div>
    </div>
  </div>
)

/**
 * Componente para mostrar estado pendiente del documento
 */
const DocumentPending = () => (
  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 sm:p-6 text-center">
    <i className="fas fa-exclamation-triangle text-yellow-600 text-2xl sm:text-3xl mb-2 sm:mb-3"></i>
    <h4 className="font-medium text-yellow-800 mb-2 text-sm sm:text-base font-exo">
      Documento en Proceso
    </h4>
    <p className="text-yellow-700 text-xs sm:text-sm font-roboto">
      El documento del contrato está siendo procesado. Se notificará cuando esté disponible.
    </p>
  </div>
)

/**
 * Componente para mostrar términos del contrato
 */
const ContractTerms = ({ user }) => (
  <div>
    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base font-exo">
      Términos del Contrato
    </h4>
    <ul className="text-xs sm:text-sm text-gray-600 space-y-2 font-roboto">
      <li>• Área protegida 24/7</li>
      <li>• {user.plan.contract_services} servicios de emergencia incluidos</li>
      <li>• Tiempo de respuesta garantizado</li>
      <li>• Cobertura nacional</li>
    </ul>
  </div>
)

/**
 * Componente para mostrar información de contacto
 */
const ContactInfo = () => (
  <div>
    <h4 className="font-semibold text-gray-800 mb-3 text-sm sm:text-base font-exo">
      Contacto para Consultas
    </h4>
    <div className="text-xs sm:text-sm text-gray-600 space-y-2 font-roboto">
      <p className="flex items-center">
        <i className="fas fa-phone mr-2 w-4"></i> +56 2 2800 4000
      </p>
      <p className="flex items-center">
        <i className="fas fa-envelope mr-2 w-4"></i> corporativo@helpmed.com
      </p>
      <p className="flex items-center">
        <i className="fas fa-clock mr-2 w-4"></i> Lun-Vie 8:00-18:00
      </p>
    </div>
  </div>
)

export default ContractTab
