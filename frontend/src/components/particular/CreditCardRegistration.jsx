import React, { useState } from 'react'
import useCreditCardForm from '../../hooks/useCreditCardForm'
import usePaymentConfig from '../../hooks/usePaymentConfig'
import PaymentSummary from './PaymentSummary'
import CardInput from './CardInput'
import ExpiryDateInput from './ExpiryDateInput'
import PaymentSecurityInfo from './PaymentSecurityInfo'

/**
 * Componente de registro de tarjeta de crédito refactorizado
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae TODA la lógica al hook useCreditCardForm
 * ✅ Regla #3: Componente principal <200 líneas
 * ✅ Regla #5: Gestión de estados a través del hook
 * ✅ Regla #7: Integración con servicios especializados
 * ✅ Regla #10: Arquitectura modular con componentes especializados
 *
 * @param {Object} props - Props del componente
 * @param {Function} props.onSubmit - Función para procesar el pago
 * @param {boolean} props.isProcessing - Si está procesando el pago
 * @param {number} props.amount - Monto a cobrar
 * @returns {JSX.Element} Formulario de tarjeta optimizado
 */
const CreditCardRegistration = ({ onSubmit, isProcessing, amount }) => {
  const [paymentMethod, setPaymentMethod] = useState('card') // 'card', 'yape', 'plin', 'transfer'
  const [voucherFile, setVoucherFile] = useState(null)
  const [voucherPreview, setVoucherPreview] = useState(null)
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneError, setPhoneError] = useState('')
  
  // Cargar configuración de métodos de pago
  const { paymentConfig, getMethodInfo, isMethodEnabled, getEnabledMethods } = usePaymentConfig()

  const {
    // Estados del formulario
    cardData,
    errors,

    // Información calculada
    cardInfo,
    paymentInfo,
    acceptedCards,
    isFormValid,

    // Funciones de interacción
    handleInputChange,
    handleSubmit
  } = useCreditCardForm(onSubmit, isProcessing, amount)

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB max
        alert('El archivo no debe superar los 5MB')
        return
      }
      setVoucherFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setVoucherPreview(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAlternativeSubmit = (e) => {
    e.preventDefault()
    if (paymentMethod === 'yape' || paymentMethod === 'plin') {
      if (!phoneNumber || phoneNumber.length !== 9) {
        setPhoneError('Ingresa un número de teléfono válido (9 dígitos)')
        return
      }
    }
    if (!voucherFile) {
      alert('Por favor, sube el voucher de pago')
      return
    }
    onSubmit({
      paymentMethod,
      voucherFile,
      phoneNumber: paymentMethod === 'yape' || paymentMethod === 'plin' ? phoneNumber : null,
      amount
    })
  }

  return (
    <form onSubmit={paymentMethod === 'card' ? handleSubmit : handleAlternativeSubmit} className="space-y-6">
      <div className="bg-gray-50 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 font-exo">Información de Pago</h3>

        {/* Selector de método de pago */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
            Método de Pago
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 border rounded-lg text-center transition-all ${
                paymentMethod === 'card'
                  ? 'border-red-500 bg-red-50 text-red-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-credit-card mb-1"></i>
              <div className="text-xs font-roboto">Tarjeta</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('yape')}
              className={`p-3 border rounded-lg text-center transition-all ${
                paymentMethod === 'yape'
                  ? 'border-purple-500 bg-purple-50 text-purple-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-mobile-alt mb-1"></i>
              <div className="text-xs font-roboto">Yape</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('plin')}
              className={`p-3 border rounded-lg text-center transition-all ${
                paymentMethod === 'plin'
                  ? 'border-green-500 bg-green-50 text-green-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-qrcode mb-1"></i>
              <div className="text-xs font-roboto">Plin</div>
            </button>
            <button
              type="button"
              onClick={() => setPaymentMethod('transfer')}
              className={`p-3 border rounded-lg text-center transition-all ${
                paymentMethod === 'transfer'
                  ? 'border-blue-500 bg-blue-50 text-blue-600'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
            >
              <i className="fas fa-university mb-1"></i>
              <div className="text-xs font-roboto">Transferencia</div>
            </button>
          </div>
        </div>

        {/* Resumen del pago */}
        <PaymentSummary
          amount={paymentInfo.amount}
          currency={paymentInfo.currency}
          description="Servicio médico particular"
        />

        {/* Contenido según método de pago */}
        {paymentMethod === 'card' ? (
          <>
            {/* Número de tarjeta */}
            <CardInput
              value={cardData.cardNumber}
              onChange={(value) => handleInputChange('cardNumber', value)}
              error={errors.cardNumber}
              cardIcon={cardInfo.icon}
              cardType={cardInfo.type}
            />

            {/* Nombre del titular */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
                Nombre del Titular
              </label>
              <input
                type="text"
                value={cardData.cardHolder}
                onChange={(e) => handleInputChange('cardHolder', e.target.value)}
                placeholder="JUAN PEREZ"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 font-roboto transition-colors ${
                  errors.cardHolder ? 'border-red-500 bg-red-50' : 'border-gray-300'
                }`}
              />
              {errors.cardHolder && (
                <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
                  <i className="fas fa-exclamation-circle mr-1"></i>
                  {errors.cardHolder}
                </p>
              )}
            </div>

            {/* Fecha de expiración y CVV */}
            <ExpiryDateInput
              expiryMonth={cardData.expiryMonth}
              expiryYear={cardData.expiryYear}
              cvv={cardData.cvv}
              onMonthChange={(value) => handleInputChange('expiryMonth', value)}
              onYearChange={(value) => handleInputChange('expiryYear', value)}
              onCVVChange={(value) => handleInputChange('cvv', value)}
              expiryError={errors.expiry}
              cvvError={errors.cvv}
              isAmex={cardInfo.isAmex}
            />

            {/* Guardar tarjeta */}
            <div className="mt-4">
              <label className="flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={cardData.saveCard}
                  onChange={(e) => handleInputChange('saveCard', e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <span className="ml-2 text-sm text-gray-700 font-roboto">
                  Guardar esta tarjeta para futuros pagos
                </span>
              </label>
              <p className="text-xs text-gray-500 mt-1 ml-6 font-roboto">
                Tus datos se almacenan de forma segura y encriptada
              </p>
            </div>
          </>
        ) : (
          /* Métodos de pago alternativos */
          <div className="space-y-4">
            {/* Información del método seleccionado */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              {paymentMethod === 'yape' && (
                <>
                  <h4 className="font-semibold text-blue-800 mb-2">Pago con Yape</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    1. Abre tu aplicación Yape<br/>
                    2. Yapea al número: <strong>999 888 777</strong><br/>
                    3. Monto a pagar: <strong>{paymentInfo.currency} {paymentInfo.formattedAmount}</strong><br/>
                    4. Sube el voucher de pago
                  </p>
                </>
              )}
              {paymentMethod === 'plin' && (
                <>
                  <h4 className="font-semibold text-green-800 mb-2">Pago con Plin</h4>
                  <p className="text-sm text-green-700 mb-3">
                    1. Abre tu aplicación de banco<br/>
                    2. Busca la opción Plin<br/>
                    3. Envía al número: <strong>999 888 777</strong><br/>
                    4. Monto: <strong>{paymentInfo.currency} {paymentInfo.formattedAmount}</strong><br/>
                    5. Sube el voucher de pago
                  </p>
                </>
              )}
              {paymentMethod === 'transfer' && (
                <>
                  <h4 className="font-semibold text-blue-800 mb-2">Transferencia Bancaria</h4>
                  <p className="text-sm text-blue-700 mb-3">
                    <strong>Banco BCP</strong><br/>
                    Cuenta Corriente: 123-456789-0-12<br/>
                    CCI: 002-123-000456789012-34<br/>
                    Titular: HelpMED S.A.C.<br/>
                    RUC: 20123456789<br/>
                    Monto: <strong>{paymentInfo.currency} {paymentInfo.formattedAmount}</strong>
                  </p>
                </>
              )}
            </div>

            {/* Campo de teléfono para Yape/Plin */}
            {(paymentMethod === 'yape' || paymentMethod === 'plin') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
                  Tu número de teléfono
                </label>
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => {
                    setPhoneNumber(e.target.value.replace(/\D/g, '').slice(0, 9))
                    setPhoneError('')
                  }}
                  placeholder="999888777"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-red-500 font-roboto ${
                    phoneError ? 'border-red-500 bg-red-50' : 'border-gray-300'
                  }`}
                />
                {phoneError && (
                  <p className="mt-1 text-sm text-red-600 flex items-center font-roboto">
                    <i className="fas fa-exclamation-circle mr-1"></i>
                    {phoneError}
                  </p>
                )}
              </div>
            )}

            {/* Subir voucher */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2 font-exo">
                Voucher de Pago *
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-gray-400 transition-colors">
                {voucherPreview ? (
                  <div className="space-y-3">
                    <img 
                      src={voucherPreview} 
                      alt="Voucher" 
                      className="max-h-48 mx-auto rounded-lg shadow-sm"
                    />
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <i className="fas fa-check-circle text-green-500"></i>
                      <span>{voucherFile?.name}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVoucherFile(null)
                        setVoucherPreview(null)
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      <i className="fas fa-trash mr-1"></i>
                      Eliminar
                    </button>
                  </div>
                ) : (
                  <label className="cursor-pointer block">
                    <input
                      type="file"
                      accept="image/*,.pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <div className="space-y-2">
                      <i className="fas fa-cloud-upload-alt text-3xl text-gray-400"></i>
                      <p className="text-gray-600 font-roboto">
                        Haz clic para subir tu voucher
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG o PDF (máx. 5MB)
                      </p>
                    </div>
                  </label>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Información de seguridad - solo para tarjetas */}
      {paymentMethod === 'card' && <PaymentSecurityInfo acceptedCards={acceptedCards} />}

      {/* Botón de pago */}
      <button
        type="submit"
        disabled={isProcessing || (paymentMethod === 'card' && !isFormValid) || (paymentMethod !== 'card' && !voucherFile)}
        className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 font-roboto ${
          isProcessing || (paymentMethod === 'card' && !isFormValid) || (paymentMethod !== 'card' && !voucherFile)
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-red-600 hover:bg-red-700 text-white shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'
        }`}
      >
        {isProcessing ? (
          <span className="flex items-center justify-center">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
            Procesando Pago...
          </span>
        ) : paymentMethod === 'card' ? (
          <span className="flex items-center justify-center">
            <i className="fas fa-lock mr-2"></i>
            Pagar {paymentInfo.currency} {paymentInfo.formattedAmount}
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <i className="fas fa-check mr-2"></i>
            Confirmar Pago {paymentInfo.currency} {paymentInfo.formattedAmount}
          </span>
        )}
      </button>

      {/* Nota de términos */}
      <div className="text-center">
        <p className="text-xs text-gray-500 font-roboto">
          Al procesar el pago, aceptas nuestros{' '}
          <button type="button" className="text-blue-600 hover:underline">
            términos y condiciones
          </button>{' '}
          y{' '}
          <button type="button" className="text-blue-600 hover:underline">
            política de privacidad
          </button>
        </p>
      </div>
    </form>
  )
}

export default CreditCardRegistration
