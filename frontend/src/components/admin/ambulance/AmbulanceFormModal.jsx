import React, { useState } from 'react'

/**
 * Modal de formulario para crear/editar ambulancia
 * ENFOQUE BALANCEADO: Componente con formulario y validación simple
 *
 * @param {Object} ambulance - Datos de ambulancia para editar (null para crear)
 * @param {Function} onClose - Callback para cerrar modal
 * @param {Function} onSave - Callback para guardar datos
 */
const AmbulanceFormModal = ({ ambulance, onClose, onSave }) => {
  // ============================================
  // VALIDACIÓN DE PROPS (Regla #4)
  // ============================================
  if (typeof onClose !== 'function') {
    console.error('AmbulanceFormModal: onClose debe ser una función')
    return null
  }

  if (typeof onSave !== 'function') {
    console.error('AmbulanceFormModal: onSave debe ser una función')
    return null
  }
  const [formData, setFormData] = useState({
    // Credenciales de acceso
    username: ambulance?.username || '',
    password: ambulance ? '' : 'temp123',

    // Datos de la ambulancia
    unit_id: ambulance?.ambulance?.unit_id || '',
    type: ambulance?.ambulance?.type || 'Ambulancia',
    plate: ambulance?.ambulance?.plate || '',
    capacity: ambulance?.ambulance?.capacity || 2,
    medical_team: ambulance?.ambulance?.medical_team || 'tecnico_enfermeria',

    // Estado
    status: ambulance?.status || 'active'
  })
  
  // Estado para mostrar/ocultar contraseña
  const [showPassword, setShowPassword] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validación básica de campos requeridos (Regla #4)
    if (!formData.username.trim()) {
      alert('El usuario es requerido')
      return
    }

    if (!formData.unit_id.trim()) {
      alert('El ID de unidad es requerido')
      return
    }

    if (!formData.plate.trim()) {
      alert('La placa es requerida')
      return
    }

    if (!ambulance && !formData.password.trim()) {
      alert('La contraseña es requerida para nuevas unidades')
      return
    }

    // Llamar a onSave con manejo de errores (Regla #8)
    try {
      const result = await onSave(formData)
      if (!result.success) {
        alert(`Error: ${result.error}`)
      }
    } catch (error) {
      alert(`Error inesperado: ${error.message}`)
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-exo font-bold text-gray-800">
            {ambulance ? 'Editar Unidad' : 'Nueva Unidad'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Datos de Login */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-800 mb-4">Credenciales de Acceso</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Usuario *
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  {ambulance ? 'Nueva Contraseña (opcional)' : 'Contraseña *'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                    required={!ambulance}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                    tabIndex="-1"
                  >
                    <i className={`fas ${showPassword ? 'fa-eye-slash' : 'fa-eye'}`}></i>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Datos de la Ambulancia */}
          <div className="bg-green-50 rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-800 mb-4">Datos de la Ambulancia</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  ID de Unidad *
                </label>
                <input
                  type="text"
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleInputChange}
                  placeholder="AMB-001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Placa *
                </label>
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleInputChange}
                  placeholder="ABC-123"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Tipo
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                >
                  <option value="Ambulancia">Ambulancia</option>
                  <option value="Médico motorizado">Médico motorizado</option>
                  <option value="Médico en auto">Médico en auto</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Capacidad (personas)
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                />
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Equipo Médico *
                </label>
                <select
                  name="medical_team"
                  value={formData.medical_team}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                  required
                >
                  <option value="tecnico_enfermeria">Técnico en Enfermería</option>
                  <option value="licenciado_enfermeria">Licenciado en Enfermería</option>
                  <option value="ambos">Técnico y Licenciado</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-exo font-medium text-gray-700 mb-2">
                  Estado
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto"
                >
                  <option value="active">Activa</option>
                  <option value="inactive">Inactiva</option>
                  <option value="maintenance">Mantenimiento</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className="flex space-x-4 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-exo font-medium hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-helpmed-blue hover:bg-primary-blue text-white rounded-lg font-exo font-medium transition-colors"
            >
              {ambulance ? 'Actualizar' : 'Crear'} Unidad
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AmbulanceFormModal
