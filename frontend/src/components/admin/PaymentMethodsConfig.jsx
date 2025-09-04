import React, { useState, useEffect } from 'react'

/**
 * Panel de configuración de métodos de pago para administrador
 * Permite editar toda la información de los métodos de pago alternativos
 */
const PaymentMethodsConfig = () => {
  const [config, setConfig] = useState({
    // Estado de métodos habilitados
    enabledMethods: {
      card: true,
      yape: true,
      plin: true,
      transfer: true
    },
    
    // Configuración de Yape
    yape: {
      phoneNumber: '999888777',
      ownerName: 'HELPMED S.A.C.',
      instructions: 'Enviar captura del voucher después de realizar el pago'
    },
    
    // Configuración de Plin
    plin: {
      phoneNumber: '998877666',
      ownerName: 'HELPMED S.A.C.',
      instructions: 'Usar el código QR o número para realizar el pago'
    },
    
    // Configuración de Transferencia Bancaria
    transfer: {
      bankName: 'Banco de Crédito del Perú',
      accountNumber: '123-456789-0-12',
      cci: '00212300456789012',
      accountType: 'corriente', // 'ahorros' o 'corriente'
      ownerName: 'HELPMED S.A.C.',
      instructions: 'Enviar voucher a administracion@helpmed.com después de la transferencia'
    },
    
    // Configuración general
    general: {
      maxFileSize: 5, // MB
      allowedFormats: ['jpg', 'jpeg', 'png', 'pdf'],
      confirmationMessage: 'Su pago ha sido registrado y será verificado en las próximas 2 horas'
    }
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState('')

  // Cargar configuración guardada
  useEffect(() => {
    const savedConfig = localStorage.getItem('paymentMethodsConfig')
    if (savedConfig) {
      setConfig(JSON.parse(savedConfig))
    }
  }, [])

  const handleMethodToggle = (method) => {
    setConfig(prev => ({
      ...prev,
      enabledMethods: {
        ...prev.enabledMethods,
        [method]: !prev.enabledMethods[method]
      }
    }))
  }

  const handleConfigChange = (method, field, value) => {
    setConfig(prev => ({
      ...prev,
      [method]: {
        ...prev[method],
        [field]: value
      }
    }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveMessage('')
    
    try {
      // Simular guardado en backend
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Guardar en localStorage por ahora
      localStorage.setItem('paymentMethodsConfig', JSON.stringify(config))
      
      setSaveMessage('Configuración guardada exitosamente')
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage('Error al guardar la configuración')
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-exo mb-2">
          Configuración de Métodos de Pago
        </h2>
        <p className="text-gray-600 text-sm">
          Configure los métodos de pago disponibles para servicios particulares
        </p>
      </div>

      {/* Métodos habilitados */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Métodos Habilitados</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(config.enabledMethods).map(([method, enabled]) => (
            <div key={method} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-3">
                <i className={`fas ${
                  method === 'card' ? 'fa-credit-card' : 
                  method === 'yape' ? 'fa-mobile-alt' :
                  method === 'plin' ? 'fa-qrcode' :
                  'fa-university'
                } text-lg ${enabled ? 'text-blue-600' : 'text-gray-400'}`}></i>
                <span className="font-medium capitalize">{method === 'transfer' ? 'Transferencia' : method}</span>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={enabled}
                  onChange={() => handleMethodToggle(method)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* Configuración de Yape */}
      {config.enabledMethods.yape && (
        <div className="mb-8 p-6 bg-purple-50 border border-purple-200 rounded-lg">
          <h3 className="text-lg font-semibold text-purple-900 mb-4">
            <i className="fas fa-mobile-alt mr-2"></i>
            Configuración de Yape
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Yape
              </label>
              <input
                type="text"
                value={config.yape.phoneNumber}
                onChange={(e) => handleConfigChange('yape', 'phoneNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="999888777"
                maxLength="9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Titular
              </label>
              <input
                type="text"
                value={config.yape.ownerName}
                onChange={(e) => handleConfigChange('yape', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder="Nombre o razón social"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones adicionales
              </label>
              <textarea
                value={config.yape.instructions}
                onChange={(e) => handleConfigChange('yape', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="2"
                placeholder="Instrucciones para el usuario..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Configuración de Plin */}
      {config.enabledMethods.plin && (
        <div className="mb-8 p-6 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-lg font-semibold text-green-900 mb-4">
            <i className="fas fa-qrcode mr-2"></i>
            Configuración de Plin
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Plin
              </label>
              <input
                type="text"
                value={config.plin.phoneNumber}
                onChange={(e) => handleConfigChange('plin', 'phoneNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="998877666"
                maxLength="9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Titular
              </label>
              <input
                type="text"
                value={config.plin.ownerName}
                onChange={(e) => handleConfigChange('plin', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="Nombre o razón social"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones adicionales
              </label>
              <textarea
                value={config.plin.instructions}
                onChange={(e) => handleConfigChange('plin', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows="2"
                placeholder="Instrucciones para el usuario..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Configuración de Transferencia Bancaria */}
      {config.enabledMethods.transfer && (
        <div className="mb-8 p-6 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-lg font-semibold text-blue-900 mb-4">
            <i className="fas fa-university mr-2"></i>
            Configuración de Transferencia Bancaria
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Banco
              </label>
              <select
                value={config.transfer.bankName}
                onChange={(e) => handleConfigChange('transfer', 'bankName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Banco de Crédito del Perú">Banco de Crédito del Perú (BCP)</option>
                <option value="BBVA Continental">BBVA Continental</option>
                <option value="Interbank">Interbank</option>
                <option value="Scotiabank">Scotiabank</option>
                <option value="Banco de la Nación">Banco de la Nación</option>
                <option value="Banco Pichincha">Banco Pichincha</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Número de Cuenta
              </label>
              <input
                type="text"
                value={config.transfer.accountNumber}
                onChange={(e) => handleConfigChange('transfer', 'accountNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="123-456789-0-12"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                CCI (Código Interbancario)
              </label>
              <input
                type="text"
                value={config.transfer.cci}
                onChange={(e) => handleConfigChange('transfer', 'cci', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="00212300456789012"
                maxLength="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo de Cuenta
              </label>
              <select
                value={config.transfer.accountType}
                onChange={(e) => handleConfigChange('transfer', 'accountType', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ahorros">Cuenta de Ahorros</option>
                <option value="corriente">Cuenta Corriente</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Titular de la Cuenta
              </label>
              <input
                type="text"
                value={config.transfer.ownerName}
                onChange={(e) => handleConfigChange('transfer', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Nombre o razón social"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Instrucciones adicionales
              </label>
              <textarea
                value={config.transfer.instructions}
                onChange={(e) => handleConfigChange('transfer', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder="Instrucciones para el usuario..."
              />
            </div>
          </div>
        </div>
      )}

      {/* Configuración General */}
      <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <i className="fas fa-cog mr-2"></i>
          Configuración General
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tamaño máximo de archivo (MB)
            </label>
            <input
              type="number"
              value={config.general.maxFileSize}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                general: { ...prev.general, maxFileSize: parseInt(e.target.value) }
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
              min="1"
              max="10"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Formatos permitidos
            </label>
            <input
              type="text"
              value={config.general.allowedFormats.join(', ')}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Mensaje de confirmación
            </label>
            <textarea
              value={config.general.confirmationMessage}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                general: { ...prev.general, confirmationMessage: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
              rows="2"
              placeholder="Mensaje que verá el usuario después de enviar el pago..."
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-2">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes('Error') ? 'text-red-600' : 'text-green-600'}`}>
              {saveMessage}
            </span>
          )}
        </div>
        <div className="flex space-x-3">
          <button
            type="button"
            className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
            onClick={() => window.location.reload()}
          >
            Cancelar
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
          >
            {isSaving ? (
              <span className="flex items-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Guardando...
              </span>
            ) : (
              'Guardar Cambios'
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodsConfig