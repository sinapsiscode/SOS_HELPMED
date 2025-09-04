import { useState } from 'react'
import Swal from 'sweetalert2'
import useAppStore from '../stores/useAppStore'
import {
  MOCK_EXTERNAL_STRUCTURE,
  ENTITY_TYPES,
  INITIAL_ENTITY_ADMIN_FORM,
  VIEW_MODES
} from '../mocks/externalUsersData'

/**
 * Hook personalizado para gestión de usuarios de entidades externas
 * REGLA #5: Lógica compleja en hooks personalizados
 *
 * Maneja toda la lógica de negocio para:
 * - Gestión jerárquica de entidades -> administradores -> usuarios
 * - Creación de entidades con administrador obligatorio
 * - Vista expandible/colapsable de entidades
 * - Filtrado y búsqueda de usuarios
 * - Activación/desactivación de usuarios
 * - Cambios de modo de vista (jerárquico/lista)
 */
const useExternalUsersManagement = () => {
  // ============================================
  // STORE Y ESTADOS GLOBALES
  // ============================================
  const { allUsers } = useAppStore()

  // ============================================
  // ESTADOS LOCALES
  // ============================================
  const [expandedEntity, setExpandedEntity] = useState(null)
  const [showAddEntity, setShowAddEntity] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewMode, setViewMode] = useState(VIEW_MODES.HIERARCHICAL)
  const [entityAdminForm, setEntityAdminForm] = useState(INITIAL_ENTITY_ADMIN_FORM)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)

  // ============================================
  // DATOS CALCULADOS Y ESTADÍSTICAS (Regla #10)
  // ============================================

  // Usar datos mock para demostración
  const externalStructure = MOCK_EXTERNAL_STRUCTURE

  const globalStats = {
    totalEntities: externalStructure.length,
    totalAdmins: externalStructure.filter((e) => e.admin).length,
    totalUsers: externalStructure.reduce((sum, e) => sum + e.users.length, 0),
    activeUsers: externalStructure.reduce(
      (sum, e) => sum + e.users.filter((u) => u.status === 'active').length,
      0
    ),
    monthlyServices: externalStructure.reduce((sum, e) => sum + e.stats.monthlyServices, 0)
  }

  const filteredStructure = externalStructure.filter((entity) => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      entity.entity.toLowerCase().includes(searchLower) ||
      entity.entityCode.toLowerCase().includes(searchLower) ||
      entity.admin?.name.toLowerCase().includes(searchLower) ||
      entity.users.some(
        (u) =>
          u.name.toLowerCase().includes(searchLower) ||
          u.email.toLowerCase().includes(searchLower) ||
          u.employeeCode.toLowerCase().includes(searchLower)
      )
    )
  })

  // ============================================
  // FUNCIONES UTILITARIAS DE ESTILO (Regla #9)
  // ============================================
  const getEntityIcon = (type) => {
    const entityType = ENTITY_TYPES.find((t) => t.value === type)
    return entityType?.icon || 'fas fa-building'
  }

  const getEntityColor = (type) => {
    const entityType = ENTITY_TYPES.find((t) => t.value === type)
    return entityType?.color || 'purple'
  }

  const getUserStatusColor = (status) => {
    return status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
  }

  const getUserStatusText = (status) => {
    return status === 'active' ? 'Activo' : 'Inactivo'
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
  // FUNCIONES DE ENTIDADES Y ADMINISTRADORES
  // ============================================
  const handleCreateEntityWithAdmin = async () => {
    try {
      setIsLoading(true)
      clearError()

      // Validación básica
      if (
        !entityAdminForm.entityName ||
        !entityAdminForm.entityCode ||
        !entityAdminForm.adminName ||
        !entityAdminForm.adminUsername ||
        !entityAdminForm.adminPassword ||
        !entityAdminForm.adminEmail
      ) {
        throw new Error('Todos los campos obligatorios deben estar completos')
      }

      const result = await Swal.fire({
        title: 'Crear Nueva Entidad Externa',
        html: `
          <div class="text-left space-y-3">
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <h4 class="font-semibold text-blue-800 mb-2">Datos de la Entidad</h4>
              <p class="text-sm"><strong>Nombre:</strong> ${entityAdminForm.entityName}</p>
              <p class="text-sm"><strong>Código:</strong> ${entityAdminForm.entityCode}</p>
              <p class="text-sm"><strong>Tipo:</strong> ${entityAdminForm.entityType}</p>
            </div>
            
            <div class="bg-green-50 border border-green-200 rounded-lg p-3">
              <h4 class="font-semibold text-green-800 mb-2">Administrador de la Entidad</h4>
              <p class="text-sm"><strong>Nombre:</strong> ${entityAdminForm.adminName}</p>
              <p class="text-sm"><strong>Usuario:</strong> ${entityAdminForm.adminUsername}</p>
              <p class="text-sm"><strong>Email:</strong> ${entityAdminForm.adminEmail}</p>
            </div>
          </div>
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
            <p class="text-sm text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Se creará la entidad ${entityAdminForm.entityName} junto con su administrador
            </p>
          </div>
        `,
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'Crear Entidad y Administrador',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#10B981'
      })

      if (result.isConfirmed) {
        // Aquí se llamaría a la función del store
        // await createExternalEntityWithAdmin(entityAdminForm)

        await Swal.fire({
          title: '¡Entidad y Administrador Creados!',
          html: `
            <div class="text-center">
              <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
              <p class="mb-3">La entidad <strong>${entityAdminForm.entityName}</strong> ha sido creada exitosamente</p>
              <div class="bg-gray-100 rounded-lg p-3">
                <p class="font-semibold mb-2">Credenciales del Administrador:</p>
                <p><strong>Usuario:</strong> ${entityAdminForm.adminUsername}</p>
                <p><strong>Contraseña:</strong> ${entityAdminForm.adminPassword}</p>
              </div>
            </div>
          `,
          icon: 'success',
          confirmButtonText: 'Entendido'
        })

        resetEntityAdminForm()
        setShowAddEntity(false)
      }
    } catch (error) {
      handleError(error, 'crear entidad con administrador')
      await Swal.fire({
        title: 'Error',
        text: error.message,
        icon: 'error'
      })
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // FUNCIONES DE USUARIOS
  // ============================================
  const handleToggleUserStatus = async (user, entity) => {
    try {
      setIsLoading(true)
      clearError()

      const action = user.status === 'active' ? 'desactivar' : 'activar'

      const result = await Swal.fire({
        title: `¿${action.charAt(0).toUpperCase() + action.slice(1)} usuario?`,
        text: `¿Está seguro que desea ${action} a ${user.name}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: `Sí, ${action}`,
        cancelButtonText: 'Cancelar',
        confirmButtonColor: user.status === 'active' ? '#EF4444' : '#10B981'
      })

      if (result.isConfirmed) {
        // Aquí se llamaría a la función del store
        // await toggleExternalUserStatus(user.id, entity.entityCode)

        await Swal.fire({
          title: `Usuario ${user.status === 'active' ? 'Desactivado' : 'Activado'}`,
          text: `${user.name} ha sido ${user.status === 'active' ? 'desactivado' : 'activado'}`,
          icon: 'success',
          timer: 2000,
          showConfirmButton: false
        })
      }
    } catch (error) {
      handleError(error, 'cambiar estado de usuario')
    } finally {
      setIsLoading(false)
    }
  }

  // ============================================
  // GESTIÓN DE FORMULARIOS
  // ============================================
  const updateEntityAdminForm = (field, value) => {
    setEntityAdminForm((prev) => ({
      ...prev,
      [field]:
        field === 'entityCode'
          ? value.toUpperCase()
          : field === 'adminUsername'
            ? value.toLowerCase()
            : value
    }))
  }

  const resetEntityAdminForm = () => {
    setEntityAdminForm(INITIAL_ENTITY_ADMIN_FORM)
  }

  // ============================================
  // GESTIÓN DE VISTAS Y NAVEGACIÓN
  // ============================================
  const toggleEntityExpansion = (entityCode) => {
    setExpandedEntity(expandedEntity === entityCode ? null : entityCode)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === VIEW_MODES.HIERARCHICAL ? VIEW_MODES.LIST : VIEW_MODES.HIERARCHICAL)
  }

  const openAddEntityModal = () => {
    resetEntityAdminForm()
    setShowAddEntity(true)
  }

  const closeAddEntityModal = () => {
    resetEntityAdminForm()
    setShowAddEntity(false)
  }

  // ============================================
  // FUNCIONES DE BÚSQUEDA
  // ============================================
  const updateSearchTerm = (term) => {
    setSearchTerm(term)
  }

  const clearSearch = () => {
    setSearchTerm('')
  }

  // ============================================
  // VALIDACIONES DE FORMULARIO (Regla #4)
  // ============================================
  const isEntityAdminFormValid = () => {
    return (
      entityAdminForm.entityName.trim() &&
      entityAdminForm.entityCode.trim() &&
      entityAdminForm.adminName.trim() &&
      entityAdminForm.adminUsername.trim() &&
      entityAdminForm.adminPassword.trim() &&
      entityAdminForm.adminEmail.trim()
    )
  }

  // ============================================
  // RETORNO DEL HOOK
  // ============================================
  return {
    // Estados
    externalStructure,
    filteredStructure,
    expandedEntity,
    showAddEntity,
    searchTerm,
    viewMode,
    entityAdminForm,
    isLoading,
    error,

    // Datos calculados
    globalStats,

    // Funciones utilitarias
    getEntityIcon,
    getEntityColor,
    getUserStatusColor,
    getUserStatusText,

    // Funciones de entidades y administradores
    handleCreateEntityWithAdmin,

    // Funciones de usuarios
    handleToggleUserStatus,

    // Gestión de formularios
    updateEntityAdminForm,
    resetEntityAdminForm,

    // Gestión de vistas
    toggleEntityExpansion,
    toggleViewMode,
    openAddEntityModal,
    closeAddEntityModal,

    // Funciones de búsqueda
    updateSearchTerm,
    clearSearch,

    // Validaciones
    isEntityAdminFormValid,

    // Control de errores
    clearError,

    // Constantes
    VIEW_MODES,
    ENTITY_TYPES
  }
}

export default useExternalUsersManagement
