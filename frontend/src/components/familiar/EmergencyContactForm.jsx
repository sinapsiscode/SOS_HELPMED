import React from 'react'

/**
 * Formulario de contacto de emergencia adicional
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {Array} props.extraContacts - Contactos adicionales
 * @param {Function} props.onContactChange - Función para cambiar contacto
 * @param {boolean} props.hasValidContact - Si hay contacto válido
 * @returns {JSX.Element} Formulario de contacto de emergencia
 */
const EmergencyContactForm = ({ extraContacts, onContactChange, hasValidContact }) => {
  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
      <h4 className="font-medium text-blue-800 mb-3 flex items-center font-exo">
        <i className="fas fa-phone mr-2"></i>
        Contacto de Emergencia Adicional (Opcional)
      </h4>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <ContactNameField
          value={extraContacts[0]?.name || ''}
          onChange={(value) => onContactChange(0, 'name', value)}
        />
        <ContactPhoneField
          value={extraContacts[0]?.phone || ''}
          onChange={(value) => onContactChange(0, 'phone', value)}
        />
      </div>

      <ContactInfoPanel hasValidContact={hasValidContact} />
    </div>
  )
}

/**
 * Campo de nombre del contacto
 */
const ContactNameField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-blue-700 mb-1 font-exo">
        Nombre del Contacto
      </label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-roboto"
        placeholder="Ej: María González"
      />
    </div>
  )
}

/**
 * Campo de teléfono del contacto
 */
const ContactPhoneField = ({ value, onChange }) => {
  return (
    <div>
      <label className="block text-xs font-medium text-blue-700 mb-1 font-exo">
        Teléfono del Contacto
      </label>
      <input
        type="tel"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-blue-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-roboto"
        placeholder="Ej: +51 987 654 321"
      />
    </div>
  )
}

/**
 * Panel informativo del contacto
 */
const ContactInfoPanel = ({ hasValidContact }) => {
  return (
    <div className="mt-3 p-2 bg-blue-100 border border-blue-300 rounded-lg">
      <p className="text-xs text-blue-700 flex items-start font-roboto">
        <i className="fas fa-info-circle mr-2 mt-0.5 flex-shrink-0"></i>
        <span>
          Este contacto será notificado cuando se solicite el servicio. Solo se registrará si tiene
          nombre y teléfono completos.
          {hasValidContact && (
            <span className="block mt-1 font-medium text-blue-800">
              <i className="fas fa-check mr-1"></i>
              Contacto adicional válido
            </span>
          )}
        </span>
      </p>
    </div>
  )
}

export default EmergencyContactForm
