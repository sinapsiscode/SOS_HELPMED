import React, { useState } from 'react'
import userService from '../../../services/userService'
import LocationMapModal from './LocationMapModal'

/**
 * Modal para creación y edición de usuarios
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación y validación básica
 *
 * @param {Object} props - Props del componente
 * @param {Object|null} props.user - Usuario a editar (null para crear)
 * @param {string} props.userType - Tipo de usuario
 * @param {Function} props.onClose - Función para cerrar modal
 * @param {Function} props.onSave - Función para guardar usuario
 * @returns {JSX.Element} Modal de formulario de usuario
 */
const UserFormModal = ({ user, userType, onClose, onSave }) => {
  const [formData, setFormData] = useState(user || {})
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()

    // Si es un nuevo usuario familiar, generar username y contraseña
    let generatedPassword = null
    if (!user && userType === 'familiar') {
      // Generar username basado en el nombre si no existe
      if (!formData.username && formData.profile?.name) {
        const nameParts = formData.profile.name.toLowerCase().split(' ')
        const baseUsername = nameParts.join('_').replace(/[^a-z0-9_]/g, '')
        formData.username = `${baseUsername}_${Date.now().toString().slice(-4)}`
      }

      generatedPassword = userService.generateSecurePassword()
      formData.password = generatedPassword
    }

    onSave(formData, generatedPassword)
  }

  const handleChange = (path, value) => {
    setFormData((prev) => {
      const newData = { ...prev }
      const keys = path.split('.')
      let current = newData

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {}
        current = current[keys[i]]
      }

      current[keys[keys.length - 1]] = value
      return newData
    })
  }

  const renderUserTypeFields = () => {
    switch (userType) {
      case 'familiar':
        return <FamiliarUserFields formData={formData} onChange={handleChange} />
      case 'corporativo':
        return <CorporateUserFields formData={formData} onChange={handleChange} />
      case 'externo':
        return <ExternalUserFields formData={formData} onChange={handleChange} />
      case 'admin':
        return <AdminUserFields formData={formData} onChange={handleChange} />
      default:
        return null
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-800">
              {user ? 'Editar' : 'Crear'} Usuario{' '}
              {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Campos básicos */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de Usuario
              </label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => handleChange('username', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Contraseña</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password || ''}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder={
                    !user ? 'Ingrese contraseña' : 'Dejar en blanco para mantener actual'
                  }
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 pr-10 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
                  required={!user}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 px-3 flex items-center text-gray-600 hover:text-gray-800"
                  title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                >
                  <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                </button>
              </div>
              {user && (
                <p className="text-xs text-gray-500 mt-1">
                  Dejar en blanco para mantener la contraseña actual
                </p>
              )}
            </div>
          </div>

          {/* Campos específicos por tipo */}
          {renderUserTypeFields()}

          {/* Botones */}
          <div className="flex space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 bg-primary-red hover:bg-red-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              {user ? 'Actualizar' : 'Crear'} Usuario
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

// Componentes de campos específicos por tipo de usuario
const FamiliarUserFields = ({ formData, onChange }) => {
  const handleDniChange = (e) => {
    const value = e.target.value
    if (/^\d{0,8}$/.test(value)) {
      onChange('profile.dni', value)
    }
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
          <input
            type="text"
            value={formData.profile?.name || ''}
            onChange={(e) => onChange('profile.name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">DNI</label>
          <input
            type="text"
            value={formData.profile?.dni || ''}
            onChange={handleDniChange}
            placeholder="12345678"
            maxLength="8"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Debe contener exactamente 8 dígitos</p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <input
            type="email"
            value={formData.profile?.email || ''}
            onChange={(e) => onChange('profile.email', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <input
            type="tel"
            value={formData.profile?.phone || ''}
            onChange={(e) => onChange('profile.phone', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Nacimiento
          </label>
          <input
            type="date"
            value={formData.profile?.birthDate || ''}
            onChange={(e) => onChange('profile.birthDate', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Plan</label>
          <select
            value={formData.plan?.subtype || ''}
            onChange={(e) => onChange('plan.subtype', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          >
            <option value="">Seleccionar plan...</option>
            <option value="HELP">Plan Help</option>
            <option value="BASICO">Plan Básico</option>
            <option value="VIP">Plan VIP</option>
            <option value="DORADO">Plan Dorado</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
        <textarea
          value={formData.profile?.address || ''}
          onChange={(e) => onChange('profile.address', e.target.value)}
          placeholder="Av. Principal 123, Distrito, Ciudad"
          rows="3"
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
    </div>
  )
}

const CorporateUserFields = ({ formData, onChange }) => {
  const [sedes, setSedes] = useState(formData.company?.sedes || [])
  const [newSede, setNewSede] = useState('')
  const [showMapModal, setShowMapModal] = useState(false)

  const handleAddSede = () => {
    if (newSede.trim()) {
      const updatedSedes = [...sedes, newSede.trim()]
      setSedes(updatedSedes)
      onChange('company.sedes', updatedSedes)
      setNewSede('')
    }
  }

  const handleRemoveSede = (index) => {
    const updatedSedes = sedes.filter((_, i) => i !== index)
    setSedes(updatedSedes)
    onChange('company.sedes', updatedSedes)
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Nombre de la Empresa</label>
          <input
            type="text"
            value={formData.company?.name || ''}
            onChange={(e) => onChange('company.name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">RUC Empresa</label>
          <input
            type="text"
            value={formData.company?.rut || ''}
            onChange={(e) => onChange('company.rut', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dirección Principal de la Empresa <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            value={formData.company?.address || ''}
            onChange={(e) => onChange('company.address', e.target.value)}
            placeholder="Ej: Av. Principal 1234, Comuna, Ciudad"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
          
          {/* Coordenadas GPS */}
          <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">
                <i className="fas fa-map-marker-alt mr-1 text-red-500"></i>
                Ubicación GPS Exacta
              </label>
              <button
                type="button"
                onClick={() => setShowMapModal(true)}
                className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm hover:shadow-md"
              >
                <i className="fas fa-map-marked-alt mr-2"></i>
                Seleccionar en Mapa
              </button>
            </div>
            
            {formData.company?.coordinates?.lat && formData.company?.coordinates?.lng ? (
              <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-green-800 mb-1">
                      <i className="fas fa-check-circle mr-1"></i>
                      Ubicación configurada
                    </p>
                    <p className="text-xs text-gray-700">
                      <strong>Coordenadas:</strong> {formData.company.coordinates.lat.toFixed(6)}, {formData.company.coordinates.lng.toFixed(6)}
                    </p>
                    {formData.company?.mapAddress && (
                      <p className="text-xs text-gray-600 mt-1">
                        <strong>Dirección detectada:</strong> {formData.company.mapAddress}
                      </p>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowMapModal(true)}
                    className="text-xs text-blue-600 hover:text-blue-700"
                  >
                    Cambiar
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                <p className="text-xs text-yellow-800">
                  <i className="fas fa-exclamation-triangle mr-1"></i>
                  Recomendado: Configure la ubicación GPS para máxima precisión en emergencias
                </p>
              </div>
            )}
          </div>
          
          {/* Modal del Mapa */}
          <LocationMapModal
            isOpen={showMapModal}
            onClose={() => setShowMapModal(false)}
            onSelectLocation={(location) => {
              onChange('company.coordinates.lat', location.lat)
              onChange('company.coordinates.lng', location.lng)
              if (location.address) {
                onChange('company.mapAddress', location.address)
                // Opcional: actualizar también la dirección principal si está vacía
                if (!formData.company?.address) {
                  onChange('company.address', location.address)
                }
              }
            }}
            initialCoordinates={formData.company?.coordinates}
          />
          
          <p className="text-xs text-gray-500 mt-2">
            <i className="fas fa-ambulance mr-1 text-red-500"></i>
            Las coordenadas GPS garantizan que la ambulancia llegue al lugar exacto en emergencias
          </p>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Contacto Principal</label>
          <input
            type="text"
            value={formData.profile?.name || ''}
            onChange={(e) => onChange('profile.name', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Servicios Contratados
          </label>
          <input
            type="number"
            value={formData.plan?.contract_services || ''}
            onChange={(e) => onChange('plan.contract_services', parseInt(e.target.value))}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto de Contrato
          </label>
          <input
            type="number"
            value={formData.plan?.contract_amount || ''}
            onChange={(e) => onChange('plan.contract_amount', parseFloat(e.target.value))}
            placeholder="0.00"
            step="0.01"
            min="0"
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
            required
          />
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Sedes Adicionales (Opcional)
        </label>
        <p className="text-xs text-gray-500 mb-2">
          Agregue otras direcciones donde la empresa tiene operaciones
        </p>
        <div className="flex gap-2 mb-2">
          <input
            type="text"
            value={newSede}
            onChange={(e) => setNewSede(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSede())}
            placeholder="Dirección de la sede (Ej: Av. Sur 5678, Comuna, Ciudad)"
            className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          />
          <button
            type="button"
            onClick={handleAddSede}
            className="bg-primary-red hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <i className="fas fa-plus mr-2"></i>Agregar
          </button>
        </div>
        {sedes.length > 0 && (
          <div className="border border-gray-200 rounded-lg p-2 max-h-32 overflow-y-auto">
            {sedes.map((sede, index) => (
              <div key={index} className="flex justify-between items-center py-1 px-2 hover:bg-gray-50 rounded">
                <span className="text-sm">{sede}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveSede(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  <i className="fas fa-times"></i>
                </button>
              </div>
            ))}
          </div>
        )}
        {sedes.length === 0 && (
          <p className="text-xs text-gray-500 mt-1">No hay sedes agregadas</p>
        )}
      </div>
    </div>
  )
}

const ExternalUserFields = ({ formData, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
        <input
          type="text"
          value={formData.profile?.name || ''}
          onChange={(e) => onChange('profile.name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Empresa Cliente</label>
        <input
          type="text"
          value={formData.client_company?.name || ''}
          onChange={(e) => onChange('client_company.name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Plan</label>
        <select
          value={formData.plan?.subtype || ''}
          onChange={(e) => onChange('plan.subtype', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        >
          <option value="">Seleccionar tipo...</option>
          <option value="CASO_1">Caso 1 - Sin límites</option>
          <option value="CASO_2">Caso 2 - Con límites</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">ID Afiliado</label>
        <input
          type="text"
          value={formData.profile?.affiliate_id || ''}
          onChange={(e) => onChange('profile.affiliate_id', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
    </div>
  </div>
)

const AdminUserFields = ({ formData, onChange }) => (
  <div className="space-y-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Nombre Completo</label>
        <input
          type="text"
          value={formData.profile?.name || ''}
          onChange={(e) => onChange('profile.name', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Cargo</label>
        <input
          type="text"
          value={formData.profile?.position || ''}
          onChange={(e) => onChange('profile.position', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
        <input
          type="email"
          value={formData.profile?.email || ''}
          onChange={(e) => onChange('profile.email', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
        <input
          type="tel"
          value={formData.profile?.phone || ''}
          onChange={(e) => onChange('profile.phone', e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary-red focus:border-primary-red"
          required
        />
      </div>
    </div>
  </div>
)

export default UserFormModal
