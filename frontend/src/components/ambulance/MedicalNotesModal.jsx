import React from 'react'

/**
 * Modal para gestión de notas médicas
 * Siguiendo Regla #3: Componente específico <200 líneas
 * Siguiendo Regla #2: Solo presentación
 *
 * @param {Object} props - Props del componente
 * @param {boolean} props.isOpen - Estado del modal
 * @param {Object} props.patient - Paciente actual
 * @param {string} props.notes - Notas médicas actuales
 * @param {boolean} props.loading - Estado de carga
 * @param {Function} props.onNotesChange - Función para cambiar notas
 * @param {Function} props.onSave - Función para guardar notas
 * @param {Function} props.onClose - Función para cerrar modal
 * @returns {JSX.Element} Modal de notas médicas
 */
const MedicalNotesModal = ({ isOpen, patient, notes, loading, onNotesChange, onSave, onClose }) => {
  if (!isOpen) return null

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full m-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg mr-3">
                <i className="fas fa-notes-medical text-helpmed-blue text-xl"></i>
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800 font-exo">Notas Médicas</h2>
                <p className="text-gray-600 font-roboto text-sm">
                  Registrar observaciones y tratamiento
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors"
              title="Cerrar modal"
            >
              <i className="fas fa-times text-xl"></i>
            </button>
          </div>
        </div>

        {/* Contenido */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Información del paciente */}
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center mb-2">
              <i className="fas fa-user-md text-blue-600 mr-2"></i>
              <h3 className="font-semibold text-gray-800 font-exo">Información del Paciente</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Nombre:</strong> {patient?.name || 'No especificado'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Edad:</strong> {patient?.age ? `${patient.age} años` : 'No especificada'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">
                  <strong>Género:</strong>{' '}
                  {patient?.gender === 'M'
                    ? 'Masculino'
                    : patient?.gender === 'F'
                      ? 'Femenino'
                      : 'No especificado'}
                </p>
                <p className="text-sm text-gray-600">
                  <strong>Tipo de Emergencia:</strong>{' '}
                  {patient?.emergencyType === 'cardiac'
                    ? 'Cardiaca'
                    : patient?.emergencyType === 'accident'
                      ? 'Accidente'
                      : patient?.emergencyType === 'respiratory'
                        ? 'Respiratoria'
                        : patient?.emergencyType === 'medical'
                          ? 'Médica'
                          : 'No especificado'}
                </p>
              </div>
            </div>
          </div>

          {/* Campo de notas */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <i className="fas fa-edit mr-2"></i>
                Notas Médicas *
              </label>
              <textarea
                value={notes}
                onChange={(e) => onNotesChange(e.target.value)}
                rows="8"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-helpmed-blue focus:border-helpmed-blue font-roboto resize-none"
                placeholder="Ingrese las observaciones médicas, síntomas, signos vitales, tratamiento aplicado, medicamentos administrados, estado del paciente, recomendaciones..."
                required
              />
              <p className="text-xs text-gray-500 mt-2">
                <i className="fas fa-info-circle mr-1"></i>
                Incluya información detallada sobre el estado del paciente, tratamiento y
                observaciones relevantes.
              </p>
            </div>

            {/* Guía de información a incluir */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="text-sm font-medium text-blue-800 mb-2">
                <i className="fas fa-lightbulb mr-2"></i>
                Información recomendada a incluir:
              </h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>
                  • <strong>Síntomas:</strong> Descripción detallada de los síntomas observados
                </li>
                <li>
                  • <strong>Signos vitales:</strong> Presión arterial, frecuencia cardíaca,
                  temperatura, saturación
                </li>
                <li>
                  • <strong>Tratamiento:</strong> Medicamentos administrados, dosis, vía de
                  administración
                </li>
                <li>
                  • <strong>Evolución:</strong> Respuesta del paciente al tratamiento
                </li>
                <li>
                  • <strong>Recomendaciones:</strong> Seguimiento necesario o derivaciones
                </li>
              </ul>
            </div>
          </div>

          {/* Validación de campos requeridos */}
          {!patient && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <i className="fas fa-exclamation-triangle text-red-600 mr-2"></i>
                <p className="text-sm text-red-700">
                  <strong>Error:</strong> No hay paciente seleccionado. Por favor seleccione un
                  paciente antes de agregar notas.
                </p>
              </div>
            </div>
          )}

          {/* Botones */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg transition-colors font-roboto disabled:cursor-not-allowed"
            >
              <i className="fas fa-times mr-2"></i>
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!patient || !notes.trim() || loading}
              className="flex-1 bg-helpmed-blue hover:bg-blue-700 disabled:bg-gray-300 text-white py-3 px-4 rounded-lg transition-colors font-roboto disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <i className="fas fa-spinner fa-spin mr-2"></i>
                  Guardando...
                </>
              ) : (
                <>
                  <i className="fas fa-save mr-2"></i>
                  Guardar Notas
                </>
              )}
            </button>
          </div>

          {/* Información de privacidad */}
          <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
            <i className="fas fa-shield-alt mr-1"></i>
            <strong>Privacidad:</strong> Esta información médica es confidencial y está protegida
            por las leyes de privacidad de datos de salud. Solo el personal médico autorizado tiene
            acceso a estos registros.
          </div>
        </form>
      </div>
    </div>
  )
}

export default MedicalNotesModal
