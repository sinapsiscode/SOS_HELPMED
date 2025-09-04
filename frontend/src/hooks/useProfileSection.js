import { useState, useCallback, useMemo } from 'react'
import useAppStore from '../stores/useAppStore'
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { validateProfileData } from '../schemas/profileSchema'
import logger from '../utils/logger'

const MySwal = withReactContent(Swal)

/**
 * Hook para gestión de la sección de perfil de usuario
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #2: Extrae toda la lógica del componente
 * ✅ Regla #4: Validación de formularios
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #13: Optimización con useMemo y useCallback
 *
 * @returns {Object} Estados y funciones para manejo de perfil
 */
const useProfileSection = () => {
  const { currentUser, updateUserProfile, logout } = useAppStore()
  
  const [isEditing, setIsEditing] = useState(false)
  const [editData, setEditData] = useState({
    phone: currentUser?.profile?.phone || currentUser?.phone || '',
    email: currentUser?.profile?.email || currentUser?.email || ''
  })

  /**
   * Información del usuario procesada
   * ✅ Regla #13: Optimizada con useMemo
   */
  const userInfo = useMemo(() => ({
    name: currentUser?.name || 'Usuario',
    username: currentUser?.username || 'user',
    membership: currentUser?.membership || 'Sin Plan',
    phone: currentUser?.phone || editData.phone || '+51 9 8765 4321',
    email: currentUser?.email || editData.email || 'usuario@email.com',
    address: currentUser?.profile?.address || 'Av. Lince 2594, Lince',
    avatar: currentUser?.name?.charAt(0) || 'U'
  }), [currentUser, editData])

  /**
   * Contactos de emergencia por defecto
   * ✅ Regla #13: Datos memorizados
   */
  const emergencyContacts = useMemo(() => [
    {
      id: 1,
      name: 'María Mendoza',
      relationship: 'Madre',
      phone: '+51 9 1234 5678',
      isPrimary: true
    },
    {
      id: 2,
      name: 'Dr. González',
      relationship: 'Médico de Cabecera',
      phone: '+51 2 2345 6789',
      isPrimary: false
    }
  ], [])

  /**
   * Información médica por defecto
   * ✅ Regla #13: Datos memorizados
   */
  const medicalInfo = useMemo(() => [
    { label: 'Tipo de Sangre', value: 'O+' },
    { label: 'Alergias', value: 'Penicilina' },
    { label: 'Condiciones Médicas', value: 'Hipertensión' },
    { label: 'Medicamentos', value: 'Losartán 50mg' }
  ], [])

  /**
   * Configuraciones disponibles
   * ✅ Regla #13: Configuraciones memorizadas
   */
  const settingsItems = useMemo(() => [
    {
      id: 'notifications',
      icon: 'fas fa-bell',
      title: 'Notificaciones',
      description: 'Gestionar alertas y notificaciones'
    },
    {
      id: 'security',
      icon: 'fas fa-lock',
      title: 'Seguridad',
      description: 'Cambiar contraseña y configurar 2FA'
    },
    {
      id: 'privacy',
      icon: 'fas fa-shield-alt',
      title: 'Privacidad',
      description: 'Configuración de privacidad y datos'
    }
  ], [])

  /**
   * Valida los datos del perfil usando esquema Yup
   * ✅ Regla #4: Validación con esquema
   * ✅ Regla #8: Manejo de errores
   */
  const validateData = useCallback(async (phone, email) => {
    try {
      const validation = await validateProfileData({ phone, email })
      if (!validation.isValid) {
        const firstError = Object.values(validation.errors)[0]
        MySwal.showValidationMessage(firstError)
        return false
      }
      return true
    } catch (error) {
      logger.error('Error validando datos de perfil', error)
      MySwal.showValidationMessage('Error de validación')
      return false
    }
  }, [])

  /**
   * Maneja la edición del perfil
   * ✅ Regla #8: Manejo robusto de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleEditProfile = useCallback(async () => {
    try {
      const { value: formValues } = await MySwal.fire({
        title: 'Editar Información de Contacto',
        html: `
          <div class="text-left space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
              <input id="swal-input1" class="swal2-input" placeholder="Teléfono" value="${editData.phone}">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input id="swal-input2" type="email" class="swal2-input" placeholder="Email" value="${editData.email}">
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <p class="text-sm text-yellow-800">
                <i class="fas fa-info-circle mr-2"></i>
                Solo puedes modificar tu teléfono y correo electrónico. Para cambios en nombre o dirección, contacta al administrador.
              </p>
            </div>
          </div>
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Guardar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#1D44D1',
        preConfirm: async () => {
          const phone = document.getElementById('swal-input1').value
          const email = document.getElementById('swal-input2').value

          const isValid = await validateData(phone, email)
          if (!isValid) return false

          return { phone, email }
        }
      })

      if (formValues) {
        logger.info('Actualizando perfil de usuario', { userId: currentUser.id })
        
        await updateUserProfile(currentUser.id, {
          phone: formValues.phone,
          email: formValues.email
        })

        setEditData({
          phone: formValues.phone,
          email: formValues.email
        })

        MySwal.fire({
          title: '¡Actualizado!',
          text: 'Tu información de contacto ha sido actualizada correctamente',
          icon: 'success',
          timer: 2000,
          showConfirmButton: false,
          confirmButtonColor: '#1D44D1'
        })

        logger.info('Perfil actualizado exitosamente')
      }
    } catch (error) {
      logger.error('Error actualizando perfil', error)
      MySwal.fire({
        title: 'Error',
        text: 'No se pudo actualizar la información. Inténtalo nuevamente.',
        icon: 'error',
        confirmButtonColor: '#1D44D1'
      })
    }
  }, [editData, currentUser, updateUserProfile, validateData])

  /**
   * Maneja el cambio de contraseña
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleChangePassword = useCallback(() => {
    MySwal.fire({
      title: 'Cambiar Contraseña',
      text: 'Esta funcionalidad estará disponible próximamente.',
      icon: 'info',
      confirmButtonColor: '#D32F2F'
    })
  }, [])

  /**
   * Maneja el cierre de sesión
   * ✅ Regla #8: Manejo de errores
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleLogout = useCallback(() => {
    MySwal.fire({
      title: '¿Cerrar sesión?',
      text: 'Serás redirigido a la pantalla de inicio de sesión.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#D32F2F',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Sí, cerrar sesión',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        try {
          logger.info('Usuario cerrando sesión', { userId: currentUser?.id })
          logout()
        } catch (error) {
          logger.error('Error cerrando sesión', error)
        }
      }
    })
  }, [logout, currentUser])

  /**
   * Maneja acciones de configuración
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleSettingAction = useCallback((settingId) => {
    switch (settingId) {
      case 'security':
        handleChangePassword()
        break
      case 'notifications':
        MySwal.fire({
          title: 'Notificaciones',
          text: 'Configuración de notificaciones próximamente disponible.',
          icon: 'info',
          confirmButtonColor: '#1D44D1'
        })
        break
      case 'privacy':
        MySwal.fire({
          title: 'Privacidad',
          text: 'Configuración de privacidad próximamente disponible.',
          icon: 'info',
          confirmButtonColor: '#1D44D1'
        })
        break
      default:
        logger.warn('Acción de configuración no reconocida', { settingId })
    }
  }, [handleChangePassword])

  /**
   * Maneja llamada a contacto de emergencia
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleCallEmergencyContact = useCallback((contact) => {
    MySwal.fire({
      title: `Llamar a ${contact.name}`,
      text: `¿Deseas llamar a ${contact.phone}?`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Llamar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // En un entorno real, aquí se abriría la aplicación de teléfono
        window.location.href = `tel:${contact.phone.replace(/\s/g, '')}`
        logger.info('Iniciando llamada de emergencia', { contactId: contact.id })
      }
    })
  }, [])

  /**
   * Maneja actualización de información médica
   * ✅ Regla #13: Optimizado con useCallback
   */
  const handleUpdateMedicalInfo = useCallback(() => {
    MySwal.fire({
      title: 'Información Médica',
      text: 'La actualización de información médica estará disponible próximamente.',
      icon: 'info',
      confirmButtonColor: '#10B981'
    })
  }, [])

  return {
    // Estados
    isEditing,
    editData,

    // Datos procesados
    userInfo,
    emergencyContacts,
    medicalInfo,
    settingsItems,

    // Funciones de estado
    setIsEditing,
    setEditData,

    // Acciones principales
    handleEditProfile,
    handleChangePassword,
    handleLogout,
    handleSettingAction,
    handleCallEmergencyContact,
    handleUpdateMedicalInfo,

    // Funciones auxiliares
    validateData
  }
}

export default useProfileSection