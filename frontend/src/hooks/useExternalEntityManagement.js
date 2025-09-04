import { useState } from 'react'
import Swal from 'sweetalert2'
import useAppStore from '../stores/useAppStore'
import {
  MOCK_EXTERNAL_ENTITIES,
  ENTITY_TYPES,
  INITIAL_ENTITY_FORM,
  INITIAL_ADMIN_FORM
} from '../mocks/externalEntityData'

/**
 * Hook personalizado para gestión de entidades externas
 * REGLA #5: Lógica compleja en hooks personalizados
 *
 * Maneja toda la lógica de negocio para:
 * - Gestión de entidades externas (CRUD)
 * - Creación de administradores externos
 * - Formularios y validaciones
 * - Estados de modales
 * - Funciones utilitarias de estilo
 */
const useExternalEntityManagement = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const {
    externalEntities = [],
    addExternalEntity,
    updateExternalEntity,
    deleteExternalEntity,
    createExternalAdmin
  } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [showAddEntity, setShowAddEntity] = useState(false)
  const [showAddAdmin, setShowAddAdmin] = useState(false)
  const [selectedEntity, setSelectedEntity] = useState(null)
  const [entityForm, setEntityForm] = useState(INITIAL_ENTITY_FORM)
  const [adminForm, setAdminForm] = useState(INITIAL_ADMIN_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // DATOS CALCULADOS Y ESTADÍSTICAS (Regla #10)
  // ============================================

  // Usar datos mock si no hay entidades en el store
  const entities = externalEntities.length > 0 ? externalEntities : MOCK_EXTERNAL_ENTITIES

  const entityStats = {
    total: entities.length,
    active: entities.filter((e) => e.active).length,
    totalUsers: entities.reduce((sum, e) => sum + (e.activeUsers || 0), 0),
    totalAdmins: entities.filter((e) => e.admin).length
  }

  const entitiesWithoutAdmin = entities.filter((e) => !e.admin && e.active)

  // ============================================
  // FUNCIONES UTILITARIAS DE ESTILO (Regla #9)
  // ============================================
  const getEntityTypeIcon = (type) => {
    const entityType = ENTITY_TYPES.find((t) => t.value === type)
    return entityType?.icon || 'fas fa-handshake'
  }

  const getEntityTypeColor = (type) => {
    const entityType = ENTITY_TYPES.find((t) => t.value === type)
    return entityType?.color || 'gray'
  }

  const getUsagePercentage = (activeUsers, maxUsers) => {
    if (!maxUsers || maxUsers === 0) return 0
    return Math.round((activeUsers / maxUsers) * 100)
  }

  const getUsageColorClass = (percentage) => {
    if (percentage > 80) return 'bg-red-500'
    if (percentage > 60) return 'bg-orange-500'
    return 'bg-green-500'
  }

  // ============================================
  // GESTIÓN DE ERRORES (Regla #8)
  // ============================================
  const clearError = () => setError(null)

  const handleError = (error, context) => {
    console.error(`Error en ${context}:`, error)
    setError(`Error en ${context}: ${error.message}`)
    setIsLoading(false)
  }

  // ============================================
  // FUNCIONES DE ENTIDADES
  // ============================================
  const handleAddEntity = async () => {
    try {
      setIsLoading(true)
      clearError()

      // Validación básica
      if (!entityForm.name || !entityForm.code || !entityForm.type) {
        throw new Error('Campos obligatorios incompletos')
      }

      const result = await Swal.fire({
        title: 'Confirmar Nueva Entidad',
        html: `
          <div class="text-left space-y-2">
            <p><strong>Nombre:</strong> ${entityForm.name}</p>
            <p><strong>Código:</strong> ${entityForm.code}</p>
            <p><strong>Tipo:</strong> ${entityForm.type}</p>
            <p><strong>Límite de usuarios:</strong> ${entityForm.maxUsers || 'Sin límite'}</p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Crear Entidad',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
      })

      if (result.isConfirmed) {
        // Aquí se llamaría a la función del store
        // await addExternalEntity(entityForm)

        await Swal.fire({
          title: '¡Entidad Creada!',
          text: `La entidad ${entityForm.name} ha sido registrada exitosamente`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })

        resetEntityForm()
        setShowAddEntity(false)
      }
    } catch (error) {
      handleError(error, 'crear entidad')
      await Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateAdmin = async () => {
    try {
      setIsLoading(true)
      clearError()

      // Validación básica
      if (
        !adminForm.entityId ||
        !adminForm.username ||
        !adminForm.password ||
        !adminForm.name ||
        !adminForm.email
      ) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      const entity = entities.find((e) => e.id === adminForm.entityId)

      const result = await Swal.fire({
        title: 'Crear Administrador Externo',
        html: `
          <div class="text-left space-y-2">
            <p><strong>Entidad:</strong> ${entity?.name}</p>
            <p><strong>Usuario:</strong> ${adminForm.username}</p>
            <p><strong>Nombre:</strong> ${adminForm.name}</p>
            <p><strong>Email:</strong> ${adminForm.email}</p>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Este usuario tendrá acceso al panel de administración externo para gestionar los usuarios de ${entity?.name}
            </p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Crear Administrador',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
      })

      if (result.isConfirmed) {
        // Aquí se llamaría a la función del store
        // await createExternalAdmin({ ...adminForm, role: 'EXTERNO_ADMIN' })

        await Swal.fire({
          title: '¡Administrador Creado!',
          html: `
            <div class="text-center">
              <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <p>Credenciales de acceso:</p>
              <div class="bg-gray-100 rounded-lg p-3 mt-2">
                <p><strong>Usuario:</strong> ${adminForm.username}</p>
                <p><strong>Contraseña:</strong> ${adminForm.password}</p>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Entendido'
        })

        resetAdminForm()
        setShowAddAdmin(false)
        setSelectedEntity(null)
      }
    } catch (error) {
      handleError(error, 'crear administrador')
      await Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleToggleEntityStatus = async (entity) => {
    try {
      setIsLoading(true)
      clearError()

      const action = entity.active ? 'desactivar' : 'activar'

      const result = await Swal.fire({
        title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} entidad?`,
        text: `¿Está seguro que desea ${action} ${entity.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: entity.active ? '#EF4444' : '#10B981'
      })

      if (result.isConfirmed) {
        // await updateExternalEntity(entity.id, { active: !entity.active })

        await Swal.fire({
          title: `¡Entidad ${entity.active ? 'Desactivada' : 'Activada'}!`,
          text: `${entity.name} ha sido ${entity.active ? 'desactivada' : 'activada'}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      handleError(error, 'cambiar estado de entidad')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // GESTIÓN DE FORMULARIOS
  // ============================================
  const updateEntityForm = (field, value) => {
    setEntityForm((prev) => ({
      ...prev,
      [field]: field === 'code' ? value.toUpperCase() : value
    }))
  }

  const updateAdminForm = (field, value) => {
    setAdminForm((prev) => ({
      ...prev,
      [field]: field === 'username' ? value.toLowerCase() : value
    }))
  }

  const resetEntityForm = () => {
    setEntityForm(INITIAL_ENTITY_FORM)
  }

  const resetAdminForm = () => {
    setAdminForm(INITIAL_ADMIN_FORM)
  }

  // ============================================
  // GESTIÓN DE MODALES
  // ============================================
  const openAddEntityModal = () => {
    resetEntityForm()
    setShowAddEntity(true)
  }

  const closeAddEntityModal = () => {
    resetEntityForm()
    setShowAddEntity(false)
  }

  const openAddAdminModal = (entity = null) => {
    resetAdminForm()
    if (entity) {
      setSelectedEntity(entity)
      setAdminForm((prev) => ({ ...prev, entityId: entity.id }))
    }
    setShowAddAdmin(true)
  }

  const closeAddAdminModal = () => {
    resetAdminForm()
    setShowAddAdmin(false)
    setSelectedEntity(null)
  }

  // ============================================
  // VALIDACIONES DE FORMULARIO (Regla #4)
  // ============================================
  const isEntityFormValid = () => {
    return entityForm.name.trim() && entityForm.code.trim() && entityForm.type
  }

  const isAdminFormValid = () => {
    return (
      adminForm.entityId &&
      adminForm.username.trim() &&
      adminForm.password.trim() &&
      adminForm.name.trim() &&
      adminForm.email.trim()
    )
  }

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Estados
    entities,
    selectedEntity,
    showAddEntity,
    showAddAdmin,
    entityForm,
    adminForm,
    isLoading,
    error,

    // Datos calculados
    entityStats,
    entitiesWithoutAdmin,

    // Funciones utilitarias
    getEntityTypeIcon,
    getEntityTypeColor,
    getUsagePercentage,
    getUsageColorClass,

    // Funciones de entidades
    handleAddEntity,
    handleCreateAdmin,
    handleToggleEntityStatus,

    // Gestión de formularios
    updateEntityForm,
    updateAdminForm,
    resetEntityForm,
    resetAdminForm,

    // Gestión de modales
    openAddEntityModal,
    closeAddEntityModal,
    openAddAdminModal,
    closeAddAdminModal,

    // Validaciones
    isEntityFormValid,
    isAdminFormValid,

    // Control de errores
    clearError
  }
}

export default useExternalEntityManagement
