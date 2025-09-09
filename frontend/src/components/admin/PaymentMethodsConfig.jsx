import React, { useState, useEffect } from 'react'
import { LABELS } from '../../config/labels'

/**
 * ${LABELS.admin.paymentMethodsConfig.comments.title}
 * ${LABELS.admin.paymentMethodsConfig.comments.description}
 */
const PaymentMethodsConfig = () => {
  const labels = LABELS.admin.paymentMethodsConfig
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
      ownerName: labels.defaultValues.ownerName,
      instructions: labels.defaultValues.yapeInstructions
    },
    
    // Configuración de Plin
    plin: {
      phoneNumber: '998877666',
      ownerName: labels.defaultValues.ownerName,
      instructions: labels.defaultValues.plinInstructions
    },
    
    // Configuración de Transferencia Bancaria
    transfer: {
      bankName: labels.defaultValues.bankName,
      accountNumber: '123-456789-0-12',
      cci: '00212300456789012',
      accountType: labels.defaultValues.accountType, // 'ahorros' o 'corriente'
      ownerName: labels.defaultValues.ownerName,
      instructions: labels.defaultValues.transferInstructions
    },
    
    // Configuración general
    general: {
      maxFileSize: 5, // MB
      allowedFormats: labels.defaultValues.formats || ['jpg', 'jpeg', 'png', 'pdf'],
      confirmationMessage: labels.defaultValues.confirmationMessage
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
      
      setSaveMessage(labels.messages.saveSuccess)
      setTimeout(() => setSaveMessage(''), 3000)
    } catch (error) {
      setSaveMessage(labels.messages.saveError)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 font-exo mb-2">
          {labels.title}
        </h2>
        <p className="text-gray-600 text-sm">
          {labels.subtitle}
        </p>
      </div>

      {/* Métodos habilitados */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{labels.sections.enabledMethods}</h3>
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
                <span className="font-medium capitalize">{method === 'transfer' ? labels.methods.transfer : method}</span>
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
            {labels.sections.yapeConfig}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.yapeNumber}
              </label>
              <input
                type="text"
                value={config.yape.phoneNumber}
                onChange={(e) => handleConfigChange('yape', 'phoneNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={labels.placeholders.yapePhone}
                maxLength="9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.ownerName}
              </label>
              <input
                type="text"
                value={config.yape.ownerName}
                onChange={(e) => handleConfigChange('yape', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                placeholder={labels.placeholders.ownerName}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.additionalInstructions}
              </label>
              <textarea
                value={config.yape.instructions}
                onChange={(e) => handleConfigChange('yape', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500"
                rows="2"
                placeholder={labels.placeholders.userInstructions}
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
            {labels.sections.plinConfig}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.plinNumber}
              </label>
              <input
                type="text"
                value={config.plin.phoneNumber}
                onChange={(e) => handleConfigChange('plin', 'phoneNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder={labels.placeholders.plinPhone}
                maxLength="9"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.ownerName}
              </label>
              <input
                type="text"
                value={config.plin.ownerName}
                onChange={(e) => handleConfigChange('plin', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder={labels.placeholders.ownerName}
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.additionalInstructions}
              </label>
              <textarea
                value={config.plin.instructions}
                onChange={(e) => handleConfigChange('plin', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-green-500"
                rows="2"
                placeholder={labels.placeholders.userInstructions}
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
            {labels.sections.transferConfig}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.bank}
              </label>
              <select
                value={config.transfer.bankName}
                onChange={(e) => handleConfigChange('transfer', 'bankName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="Banco de Crédito del Perú">{labels.options.banks.bcp}</option>
                <option value="BBVA Continental">{labels.options.banks.bbva}</option>
                <option value="Interbank">{labels.options.banks.interbank}</option>
                <option value="Scotiabank">{labels.options.banks.scotiabank}</option>
                <option value="Banco de la Nación">{labels.options.banks.bancoNacion}</option>
                <option value="Banco Pichincha">{labels.options.banks.pichincha}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.accountNumber}
              </label>
              <input
                type="text"
                value={config.transfer.accountNumber}
                onChange={(e) => handleConfigChange('transfer', 'accountNumber', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={labels.placeholders.accountNumber}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.cci}
              </label>
              <input
                type="text"
                value={config.transfer.cci}
                onChange={(e) => handleConfigChange('transfer', 'cci', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={labels.placeholders.cci}
                maxLength="20"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.accountType}
              </label>
              <select
                value={config.transfer.accountType}
                onChange={(e) => handleConfigChange('transfer', 'accountType', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="ahorros">{labels.options.accountTypes.savings}</option>
                <option value="corriente">{labels.options.accountTypes.current}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.accountOwner}
              </label>
              <input
                type="text"
                value={config.transfer.ownerName}
                onChange={(e) => handleConfigChange('transfer', 'ownerName', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder={labels.placeholders.ownerName}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                {labels.fields.additionalInstructions}
              </label>
              <textarea
                value={config.transfer.instructions}
                onChange={(e) => handleConfigChange('transfer', 'instructions', e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                rows="2"
                placeholder={labels.placeholders.userInstructions}
              />
            </div>
          </div>
        </div>
      )}

      {/* Configuración General */}
      <div className="mb-8 p-6 bg-gray-50 border border-gray-200 rounded-lg">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          <i className="fas fa-cog mr-2"></i>
          {labels.sections.generalConfig}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels.fields.maxFileSize}
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
              {labels.fields.allowedFormats}
            </label>
            <input
              type="text"
              value={(config.general.allowedFormats || []).join(', ')}
              className="w-full px-4 py-2 border rounded-lg bg-gray-100"
              readOnly
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              {labels.fields.confirmationMessage}
            </label>
            <textarea
              value={config.general.confirmationMessage}
              onChange={(e) => setConfig(prev => ({
                ...prev,
                general: { ...prev.general, confirmationMessage: e.target.value }
              }))}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-gray-500"
              rows="2"
              placeholder={labels.placeholders.confirmationMessage}
            />
          </div>
        </div>
      </div>

      {/* Botones de acción */}
      <div className="flex items-center justify-between pt-6 border-t">
        <div className="flex items-center space-x-2">
          {saveMessage && (
            <span className={`text-sm ${saveMessage.includes(labels.messages.error) ? 'text-red-600' : 'text-green-600'}`}>
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
            {labels.buttons.cancel}
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
                {labels.buttons.saving}
              </span>
            ) : (
              labels.buttons.save
            )}
          </button>
        </div>
      </div>
    </div>
  )
}

export default PaymentMethodsConfig