import { useState, useCallback, useMemo } from 'react'
import creditCardService from '../services/creditCardService'

/**
 * Hook para manejo del formulario de tarjeta de crédito
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica del componente principal
 * ✅ Regla #5: Gestión completa de estados
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #9: Uso de callbacks para optimización
 *
 * @param {Function} onSubmit - Callback para enviar datos de la tarjeta
 * @param {boolean} isProcessing - Si está procesando el pago
 * @param {number} amount - Monto a cobrar
 * @returns {Object} Estados y funciones del formulario de tarjeta
 */
const useCreditCardForm = (onSubmit, isProcessing, amount) => {
  // Estados del formulario
  const [cardData, setCardData] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    saveCard: false
  })

  // Estados de validación
  const [errors, setErrors] = useState({})
  const [cardType, setCardType] = useState('')

  // Detectar tipo de tarjeta en tiempo real
  const detectedCardType = useMemo(() => {
    return creditCardService.detectCardType(cardData.cardNumber.replace(/\s/g, ''))
  }, [cardData.cardNumber])

  // Actualizar tipo de tarjeta cuando cambia
  useMemo(() => {
    setCardType(detectedCardType)
  }, [detectedCardType])

  // Icono de la tarjeta actual
  const cardIcon = useMemo(() => {
    return creditCardService.getCardIcon(cardType)
  }, [cardType])

  // Información de la tarjeta formateada
  const cardInfo = useMemo(
    () => ({
      type: cardType,
      icon: cardIcon,
      isAmex: cardType === 'amex',
      cvvLength: cardType === 'amex' ? 4 : 3,
      last4: cardData.cardNumber.replace(/\s/g, '').slice(-4)
    }),
    [cardType, cardIcon, cardData.cardNumber]
  )

  // Manejar cambios en los campos
  const handleInputChange = useCallback(
    (field, value) => {
      let processedValue = value

      // Aplicar formato específico según el campo
      if (field === 'cardNumber') {
        processedValue = creditCardService.formatCardNumber(value)
      } else if (field === 'expiryMonth' || field === 'expiryYear') {
        processedValue = creditCardService.formatNumericInput(value)
      } else if (field === 'cvv') {
        const maxLength = cardType === 'amex' ? 4 : 3
        processedValue = creditCardService.formatCVV(value, maxLength)
      } else if (field === 'cardHolder') {
        processedValue = value.toUpperCase()
      }

      setCardData((prev) => ({ ...prev, [field]: processedValue }))

      // Limpiar error cuando el usuario empieza a escribir
      if (errors[field]) {
        setErrors((prev) => ({ ...prev, [field]: '' }))
      }
    },
    [cardType, errors]
  )

  // Validar el formulario completo
  const validateForm = useCallback(() => {
    const validationResult = creditCardService.validateCardData({
      ...cardData,
      cardType
    })

    setErrors(validationResult.errors)
    return validationResult.isValid
  }, [cardData, cardType])

  // Manejar envío del formulario
  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()

      if (validateForm()) {
        const processedCardData = {
          ...cardData,
          cardNumber: cardData.cardNumber.replace(/\s/g, ''),
          cardType,
          last4: cardData.cardNumber.replace(/\s/g, '').slice(-4)
        }

        onSubmit(processedCardData)
      }
    },
    [validateForm, cardData, cardType, onSubmit]
  )

  // Limpiar formulario
  const clearForm = useCallback(() => {
    setCardData({
      cardNumber: '',
      cardHolder: '',
      expiryMonth: '',
      expiryYear: '',
      cvv: '',
      saveCard: false
    })
    setErrors({})
    setCardType('')
  }, [])

  // Verificar si el formulario es válido
  const isFormValid = useMemo(() => {
    return creditCardService.validateCardData({
      ...cardData,
      cardType
    }).isValid
  }, [cardData, cardType])

  // Información del pago
  const paymentInfo = useMemo(
    () => ({
      amount,
      formattedAmount: amount.toFixed(2),
      currency: 'S/',
      isProcessing
    }),
    [amount, isProcessing]
  )

  // Tarjetas aceptadas
  const acceptedCards = useMemo(() => creditCardService.getAcceptedCards(), [])

  return {
    // Estados del formulario
    cardData,
    errors,
    cardType,

    // Información calculada
    cardInfo,
    paymentInfo,
    acceptedCards,
    isFormValid,

    // Funciones de interacción
    handleInputChange,
    handleSubmit,
    clearForm,

    // Estado de procesamiento
    isProcessing
  }
}

export default useCreditCardForm
