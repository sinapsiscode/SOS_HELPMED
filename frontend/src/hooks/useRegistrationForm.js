import { useState, useEffect } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'
import logger from '../utils/logger'

/**
 * Hook para lógica de formulario de registro
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #5: SweetAlert2 centralizado en hook
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useState
 */
const useRegistrationForm = (onBack) => {
  // Estado del formulario
  const [formData, setFormData] = useState({
    planType: '',
    planSubtype: '',
    name: '',
    lastName: '',
    email: '',
    phone: '',
    dni: '',
    birthDate: '',
    address: '',
    district: '',
    city: '',
    companyName: '',
    ruc: '',
    contactPosition: '',
    externalEntity: '',
    externalEntityOther: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: '',
    medicalConditions: '',
    comments: ''
  })

  // Estados de UI
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showTerms, setShowTerms] = useState(false)
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false)
  const [loading, setLoading] = useState(true)

  // Store
  const { submitRegistrationRequest } = useAppStore()

  // Configuración dinámica desde db.json
  const [planOptions, setPlanOptions] = useState({})
  const [externalEntities, setExternalEntities] = useState([])

  // Cargar configuración desde db.json
  useEffect(() => {
    const loadRegistrationConfig = async () => {
      try {
        setLoading(true)
        const response = await fetch('http://localhost:4001/registrationConfig')
        if (response.ok) {
          const config = await response.json()
          setPlanOptions(config.planOptions)
          setExternalEntities(config.externalEntities)
        } else {
          throw new Error('Failed to fetch registration config')
        }
      } catch (error) {
        logger.error('Error loading registration config:', error)
        console.warn('Using fallback registration configuration')
        
        // Configuración de fallback
        setPlanOptions({
          familiar: {
            help: 'Plan Help - 10 servicios/mes',
            basico: 'Plan Básico - Servicios limitados',
            vip: 'Plan VIP - Servicios premium',
            dorado: 'Plan Dorado - Servicios ilimitados'
          },
          corporativo: {
            area_protegida: 'Área Protegida - Plan empresarial'
          },
          externo: {
            caso1: 'Afiliado Externo - Sin límites',
            caso2: 'Afiliado Externo - Con límites'
          }
        })
        
        setExternalEntities([
          { value: 'BCR', label: 'Banco Central de Reserva (BCR)' },
          { value: 'RIMAC', label: 'Rimac Seguros' },
          { value: 'PACIFICO', label: 'Pacífico Seguros' },
          { value: 'MAPFRE', label: 'Mapfre Seguros' },
          { value: 'other', label: 'Otra entidad' }
        ])
      } finally {
        setLoading(false)
      }
    }

    loadRegistrationConfig()
  }, [])

  // Manejar cambios en inputs
  const handleInputChange = (e) => {
    try {
      const { name, value } = e.target
      setFormData((prev) => {
        const newData = {
          ...prev,
          [name]: value
        }

        // Reset planSubtype cuando cambia planType
        if (name === 'planType') {
          newData.planSubtype = ''
        }

        return newData
      })
    } catch (error) {
      logger.error('Error en handleInputChange', error, { name: e.target?.name })
    }
  }

  // Manejar envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      // Verificar términos para plan familiar
      if (formData.planType === 'familiar' && !hasAcceptedTerms) {
        setShowTerms(true)
        return
      }

      setIsSubmitting(true)

      // Enviar solicitud
      await submitRegistrationRequest(formData)

      // Mostrar confirmación exitosa
      await Swal.fire({
        title: '¡Solicitud Enviada!',
        html: `
          <div class="text-left space-y-3">
            <p>Tu solicitud de registro ha sido enviada exitosamente.</p>
            <div class="bg-blue-50 p-4 rounded-lg">
              <h4 class="font-semibold text-blue-800 mb-2">Próximos pasos:</h4>
              <ul class="text-sm text-blue-700 space-y-1">
                <li>• Nuestro equipo revisará tu solicitud</li>
                <li>• Te contactaremos en 24-48 horas</li>
                <li>• Recibirás un email con el estado de tu solicitud</li>
              </ul>
            </div>
            <p class="text-sm text-gray-600">
              <strong>Número de referencia:</strong> REG-${Date.now().toString().slice(-6)}
            </p>
          </div>
        `,
        icon: 'success',
        confirmButtonText: 'Entendido',
        confirmButtonColor: '#1D44D1'
      })

      // Volver a pantalla anterior
      onBack()

    } catch (error) {
      logger.error('Error enviando solicitud de registro', error)
      
      await Swal.fire({
        title: 'Error',
        text: 'Hubo un problema al enviar tu solicitud. Por favor, inténtalo nuevamente.',
        icon: 'error',
        confirmButtonText: 'Intentar de nuevo',
        confirmButtonColor: '#1D44D1'
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Aceptar términos y condiciones
  const handleAcceptTerms = () => {
    try {
      setHasAcceptedTerms(true)
      setShowTerms(false)
      // Reenviar formulario después de aceptar términos
      handleSubmit({ preventDefault: () => {} })
    } catch (error) {
      logger.error('Error aceptando términos', error)
    }
  }

  // Declinar términos y condiciones
  const handleDeclineTerms = () => {
    try {
      setShowTerms(false)
      setHasAcceptedTerms(false)
    } catch (error) {
      logger.error('Error declinando términos', error)
    }
  }

  return {
    // Estado del formulario
    formData,
    isSubmitting,
    showTerms,
    hasAcceptedTerms,
    loading,

    // Datos de referencia
    planOptions,
    externalEntities,

    // Funciones
    handleInputChange,
    handleSubmit,
    handleAcceptTerms,
    handleDeclineTerms,
    setShowTerms,
    setHasAcceptedTerms
  }
}

export default useRegistrationForm