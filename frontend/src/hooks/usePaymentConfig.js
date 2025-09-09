import { useState, useEffect } from 'react'

/**
 * Hook para manejar la configuración de métodos de pago
 * Usado tanto por el admin para configurar como por el usuario para ver la info
 */
const usePaymentConfig = () => {
  const [paymentConfig, setPaymentConfig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Cargar configuración de métodos de pago
  const loadPaymentConfig = async () => {
    try {
      setLoading(true)
      
      // Obtener configuración del localStorage o desde db.json
      const savedConfig = localStorage.getItem('paymentMethodsConfig')
      
      if (savedConfig) {
        setPaymentConfig(JSON.parse(savedConfig))
      } else {
        // Cargar desde db.json
        try {
          const response = await fetch('http://localhost:4001/paymentConfig')
          if (response.ok) {
            const config = await response.json()
            setPaymentConfig(config)
          } else {
            throw new Error('No se pudo cargar la configuración desde el servidor')
          }
        } catch (fetchError) {
          console.warn('Using fallback payment configuration')
          // Configuración de fallback
          const defaultConfig = {
            enabledMethods: {
              card: true,
              yape: true,
              plin: true,
              transfer: true
            },
            yape: {
              phoneNumber: '999888777',
              ownerName: 'HELPMED S.A.C.',
              instructions: 'Enviar captura del voucher después de realizar el pago'
            },
            plin: {
              phoneNumber: '998877666',
              ownerName: 'HELPMED S.A.C.',
              instructions: 'Usar el código QR o número para realizar el pago'
            },
            transfer: {
              bankName: 'Banco de Crédito del Perú',
              accountNumber: '',
              cci: '',
              accountType: 'corriente',
              ownerName: 'HELPMED S.A.C.',
              instructions: 'Enviar voucher a administracion@helpmed.com después de la transferencia'
            },
            general: {
              maxFileSize: 5,
              allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
              confirmationMessage: 'Su pago ha sido registrado y será verificado en las próximas 2 horas'
            }
          }
          setPaymentConfig(defaultConfig)
        }
      }
    } catch (err) {
      setError('Error al cargar la configuración de pagos')
      console.error('Error loading payment config:', err)
    } finally {
      setLoading(false)
    }
  }

  // Guardar configuración (solo para admin)
  const savePaymentConfig = async (newConfig) => {
    try {
      // En producción esto sería una llamada a la API
      localStorage.setItem('paymentMethodsConfig', JSON.stringify(newConfig))
      setPaymentConfig(newConfig)
      return { success: true }
    } catch (err) {
      console.error('Error saving payment config:', err)
      return { success: false, error: err.message }
    }
  }

  // Obtener información de un método específico
  const getMethodInfo = (method) => {
    if (!paymentConfig) return null
    
    return {
      enabled: paymentConfig.enabledMethods[method],
      ...paymentConfig[method]
    }
  }

  // Verificar si un método está habilitado
  const isMethodEnabled = (method) => {
    if (!paymentConfig) return false
    return paymentConfig.enabledMethods[method] || false
  }

  // Obtener métodos habilitados
  const getEnabledMethods = () => {
    if (!paymentConfig) return []
    
    return Object.entries(paymentConfig.enabledMethods)
      .filter(([_, enabled]) => enabled)
      .map(([method]) => method)
  }

  useEffect(() => {
    loadPaymentConfig()
  }, [])

  return {
    paymentConfig,
    loading,
    error,
    loadPaymentConfig,
    savePaymentConfig,
    getMethodInfo,
    isMethodEnabled,
    getEnabledMethods
  }
}

export default usePaymentConfig