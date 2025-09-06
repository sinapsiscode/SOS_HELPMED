import React, { useState } from 'react'
import { LABELS } from '../../../config/labels'
import { AMBULANCE_TYPES, MEDICAL_TEAM_TYPES, AMBULANCE_DEFAULTS } from '../../../config/constants'
import { MODAL_STYLES, FORM_STYLES } from '../../../config/styles'

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
  
  const labels = LABELS.admin.ambulance.form
  
  const [formData, setFormData] = useState({
    // Credenciales de acceso
    username: ambulance?.username || '',
    password: ambulance ? '' : AMBULANCE_DEFAULTS.PASSWORD,

    // Datos de la ambulancia
    unit_id: ambulance?.ambulance?.unit_id || '',
    type: ambulance?.ambulance?.type || AMBULANCE_DEFAULTS.TYPE,
    plate: ambulance?.ambulance?.plate || '',
    capacity: ambulance?.ambulance?.capacity || AMBULANCE_DEFAULTS.CAPACITY,
    medical_team: ambulance?.ambulance?.medical_team || AMBULANCE_DEFAULTS.MEDICAL_TEAM,

    // Estado
    status: ambulance?.status || AMBULANCE_DEFAULTS.STATUS
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
      alert(labels.validation.userRequired)
      return
    }

    if (!formData.unit_id.trim()) {
      alert(labels.validation.unitIdRequired)
      return
    }

    if (!formData.plate.trim()) {
      alert(labels.validation.plateRequired)
      return
    }

    if (!ambulance && !formData.password.trim()) {
      alert(labels.validation.passwordRequired)
      return
    }

    // Llamar a onSave con manejo de errores (Regla #8)
    try {
      const result = await onSave(formData)
      if (!result.success) {
        alert(`${LABELS.messages.error}: ${result.error}`)
      }
    } catch (error) {
      alert(`${labels.errors.unexpectedError}: ${error.message}`)
    }
  }

  return (
    <div className={MODAL_STYLES.overlay}>
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-screen overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <h3 className="text-xl font-exo font-bold text-gray-800">
            {ambulance ? labels.title.edit : labels.title.new}
          </h3>
          <button onClick={onClose} className={MODAL_STYLES.header.closeButton}>
            <i className="fas fa-times text-xl"></i>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Datos de Login */}
          <div className="bg-blue-50 rounded-lg p-4">
            <h4 className="font-exo font-semibold text-gray-800 mb-4">{labels.sections.credentials}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.username} {LABELS.forms.fields.requiredIndicator}
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  className={FORM_STYLES.input.base + ' ' + FORM_STYLES.input.normal}
                  required
                />
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {ambulance ? labels.fields.passwordOptional : `${labels.fields.password} ${LABELS.forms.fields.requiredIndicator}`}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal} pr-10`}
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
            <h4 className="font-exo font-semibold text-gray-800 mb-4">{labels.sections.ambulanceData}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.unitId} {LABELS.forms.fields.requiredIndicator}
                </label>
                <input
                  type="text"
                  name="unit_id"
                  value={formData.unit_id}
                  onChange={handleInputChange}
                  placeholder={labels.placeholders.unitId}
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                  required
                />
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.plate} {LABELS.forms.fields.requiredIndicator}
                </label>
                <input
                  type="text"
                  name="plate"
                  value={formData.plate}
                  onChange={handleInputChange}
                  placeholder={labels.placeholders.plate}
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                  required
                />
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.type}
                </label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                >
                  <option value={AMBULANCE_TYPES.AMBULANCE}>{labels.options.type.ambulance}</option>
                  <option value={AMBULANCE_TYPES.MOTORIZED_DOCTOR}>{labels.options.type.motorizedDoctor}</option>
                  <option value={AMBULANCE_TYPES.CAR_DOCTOR}>{labels.options.type.carDoctor}</option>
                </select>
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.capacity}
                </label>
                <input
                  type="number"
                  name="capacity"
                  value={formData.capacity}
                  onChange={handleInputChange}
                  min="1"
                  max="10"
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                />
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.medicalTeam} {LABELS.forms.fields.requiredIndicator}
                </label>
                <select
                  name="medical_team"
                  value={formData.medical_team}
                  onChange={handleInputChange}
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                  required
                >
                  <option value={MEDICAL_TEAM_TYPES.NURSING_TECH}>{labels.options.medicalTeam.nursingTech}</option>
                  <option value={MEDICAL_TEAM_TYPES.NURSING_LICENSE}>{labels.options.medicalTeam.nursingLicense}</option>
                  <option value={MEDICAL_TEAM_TYPES.BOTH}>{labels.options.medicalTeam.both}</option>
                </select>
              </div>
              <div>
                <label className={FORM_STYLES.label.base}>
                  {labels.fields.status}
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className={`${FORM_STYLES.input.base} ${FORM_STYLES.input.normal}`}
                >
                  <option value="active">{labels.options.status.active}</option>
                  <option value="inactive">{labels.options.status.inactive}</option>
                  <option value="maintenance">{labels.options.status.maintenance}</option>
                </select>
              </div>
            </div>
          </div>

          {/* Botones */}
          <div className={FORM_STYLES.container.formButtons}>
            <button
              type="button"
              onClick={onClose}
              className={FORM_STYLES.button.secondary}
            >
              {LABELS.buttons.cancel}
            </button>
            <button
              type="submit"
              className={FORM_STYLES.button.primary}
            >
              {ambulance ? labels.buttons.update : labels.buttons.create} {labels.buttons.unit}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AmbulanceFormModal