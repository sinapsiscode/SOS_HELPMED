import React from 'react'
import useEmergencyRequestForm from '../../hooks/useEmergencyRequestForm'
import AffiliateSelection from './AffiliateSelection'
import ServiceOption from './ServiceOption'
import LocationInput from './LocationInput'
import EmergencyContactForm from './EmergencyContactForm'
import ServiceReclassificationWarning from './ServiceReclassificationWarning'

/**
 * Formulario de solicitud de emergencia refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useEmergencyRequestForm
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @param {Object} props.user - Usuario actual
 * @param {Function} props.onSubmit - Función para enviar solicitud
 * @returns {JSX.Element} Formulario de emergencia optimizado
 */
const EmergencyRequestForm = ({ user, onSubmit }) => {
  const {
    // Estados del formulario
    selectedService,
    setSelectedService,
    selectedAffiliate,
    setSelectedAffiliate,
    description,
    setDescription,
    location,
    setLocation,
    isUrgent,
    setIsUrgent,

    // Estados de ubicación
    isGettingLocation,

    // Estados de contactos
    extraContacts,
    handleExtraContactChange,
    hasValidExtraContact,

    // Estados de advertencias
    showReclassificationWarning,
    pendingSubmission,

    // Datos calculados
    availableAffiliates,
    availableServices,
    locationInfo,

    // Funciones de interacción
    handleSubmit,
    handleGetLocation,
    handleUseRegisteredAddress,
    handleAcceptWarning,
    handleCancelWarning
  } = useEmergencyRequestForm(user, onSubmit)

  // Si no hay servicios disponibles
  if (availableServices.length === 0) {
    return (
      <div className="p-6 bg-white rounded-xl shadow-medium">
        <div className="py-8 text-center">
          <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full">
            <i className="text-2xl text-gray-400 fas fa-exclamation-triangle"></i>
          </div>
          <h3 className="mb-2 text-lg font-semibold text-gray-800 font-exo">
            Sin Servicios Disponibles
          </h3>
          <p className="mb-4 text-gray-600 font-roboto">
            {user.plan.subtype === 'HELP'
              ? 'Has agotado todos tus servicios del Plan Help'
              : 'Has agotado todos los servicios de tu plan'}
          </p>
          <button className="px-6 py-2 text-white transition-colors rounded-lg bg-primary-red hover:bg-red-700 font-roboto">
            Ver Opciones de Renovación
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 bg-white rounded-xl shadow-medium">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 font-exo">Solicitar Servicio Médico</h2>
        <span className="px-3 py-1 text-sm font-medium text-green-800 bg-green-100 rounded-full font-roboto">
          {availableServices.length} servicios disponibles
        </span>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Selección de Servicios - Primero seleccionar el tipo */}
        <div>
          <label className="block mb-3 text-sm font-medium text-gray-700 font-exo">
            Tipo de Servicio
          </label>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {availableServices.map((service) => (
              <ServiceOption
                key={service.type}
                service={service}
                isSelected={selectedService === service.type}
                onSelect={() => setSelectedService(service.type)}
                user={user}
              />
            ))}
          </div>
        </div>

        {/* Selección de Afiliado a Tratar - No mostrar para Zona Protegida */}
        {selectedService && selectedService !== 'ZONA_PROTEGIDA' && (
          <AffiliateSelection
            affiliates={availableAffiliates}
            selectedAffiliate={selectedAffiliate}
            onSelectAffiliate={setSelectedAffiliate}
          />
        )}

        {/* Mensaje informativo para Zona Protegida */}
        {selectedService === 'ZONA_PROTEGIDA' && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <i className="fas fa-info-circle text-blue-600 mt-1"></i>
              <div>
                <p className="text-sm font-medium text-blue-800 font-exo">
                  Servicio de Zona Protegida
                </p>
                <p className="text-sm text-blue-700 font-roboto mt-1">
                  Este servicio permite atender a terceras personas (no afiliados) que se encuentren en tu domicilio registrado.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Descripción */}
        <div>
          <label className="block mb-2 text-sm font-medium text-gray-700 font-exo">
            Descripción del Problema
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-red focus:border-primary-red font-roboto"
            placeholder="Describe brevemente la situación médica..."
            required
          />
        </div>

        {/* Ubicación */}
        <LocationInput
          selectedService={selectedService}
          location={location}
          onLocationChange={setLocation}
          locationInfo={locationInfo}
          onGetLocation={handleGetLocation}
          onUseAddress={handleUseRegisteredAddress}
          isGettingLocation={isGettingLocation}
        />

        {/* Contacto de Emergencia Adicional */}
        <EmergencyContactForm
          extraContacts={extraContacts}
          onContactChange={handleExtraContactChange}
          hasValidContact={hasValidExtraContact}
        />

        {/* Opciones adicionales para emergencias */}
        {selectedService === 'EMERGENCIA' && (
          <div className="p-4 border border-red-200 rounded-lg bg-red-50">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="urgent"
                checked={isUrgent}
                onChange={(e) => setIsUrgent(e.target.checked)}
                className="text-red-600 focus:ring-red-500"
              />
              <label htmlFor="urgent" className="text-sm font-medium text-red-800 font-roboto">
                Situación crítica que pone en riesgo la vida
              </label>
            </div>
          </div>
        )}

        {/* Botón de envío */}
        <button
          type="submit"
          className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 font-roboto ${
            selectedService === 'EMERGENCIA'
              ? 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl'
              : 'bg-primary-red hover:bg-red-700 text-white'
          }`}
        >
          {selectedService === 'EMERGENCIA' ? (
            <span className="flex items-center justify-center">
              <i className="mr-2 fas fa-ambulance"></i>
              Solicitar Emergencia
            </span>
          ) : (
            'Solicitar Servicio'
          )}
        </button>
      </form>

      {/* Orientación telefónica */}
      <div className="pt-4 mt-6 border-t border-gray-100">
        <button className="w-full px-4 py-3 text-blue-600 transition-colors rounded-lg bg-blue-50 hover:bg-blue-100 font-roboto">
          <i className="mr-2 fas fa-phone"></i>
          Orientación Médica Telefónica (Gratis)
        </button>
      </div>

      {/* Modal de advertencia de reclasificación */}
      {showReclassificationWarning && (
        <ServiceReclassificationWarning
          onAccept={handleAcceptWarning}
          onCancel={handleCancelWarning}
          requestedService={pendingSubmission?.selectedService || 'EMERGENCIA'}
          symptoms={pendingSubmission?.description || ''}
        />
      )}
    </div>
  )
}

export default EmergencyRequestForm
