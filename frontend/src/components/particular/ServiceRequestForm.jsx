import React from 'react'
import useServiceRequest from '../../hooks/useServiceRequest'
import ServiceSelector from './ServiceSelector'
import PatientDataForm from './PatientDataForm'
import PriceEstimate from './PriceEstimate'
import ServiceInfoNote from './ServiceInfoNote'

/**
 * Formulario de solicitud de servicio médico refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useServiceRequest
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onSubmit - Función para enviar formulario
 * @param {Object} props.prices - Configuración de precios
 * @param {Function} props.calculateTotal - Función para calcular total
 * @returns {JSX.Element} Formulario de solicitud optimizado
 */
const ServiceRequestForm = ({ onSubmit, prices, calculateTotal }) => {
  const {
    // Estados
    selectedService,
    formData,
    errors,
    estimatedPrice,

    // Funciones
    handleInputChange,
    handleServiceSelect,
    handleSubmit,
    getServiceInfo,
    getPriceMessage
  } = useServiceRequest(onSubmit, prices, calculateTotal)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selección de servicio */}
      <ServiceSelector
        prices={prices}
        selectedService={selectedService}
        onServiceSelect={handleServiceSelect}
        getServiceInfo={getServiceInfo}
        error={errors.service}
      />

      {selectedService && (
        <>
          {/* Datos del paciente */}
          <PatientDataForm formData={formData} errors={errors} onInputChange={handleInputChange} />

          {/* Estimación de precio */}
          <PriceEstimate estimatedPrice={estimatedPrice} priceMessage={getPriceMessage()} />

          {/* Nota informativa */}
          <ServiceInfoNote />

          {/* Botón de continuar */}
          <button
            type="submit"
            className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all duration-300 shadow-lg hover:shadow-xl font-roboto"
          >
            Continuar al Pago
            <i className="fas fa-arrow-right ml-2"></i>
          </button>
        </>
      )}
    </form>
  )
}

export default ServiceRequestForm
