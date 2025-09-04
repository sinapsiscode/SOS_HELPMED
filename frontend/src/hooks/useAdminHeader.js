import { useMemo } from 'react'

/**
 * Hook que maneja TODA la lógica del header de administrador
 * El componente NO tomará ninguna decisión, solo mostrará lo que este hook provee
 * Siguiendo Regla #2 - Separación COMPLETA de UI y Lógica
 *
 * @param {Object} user - Datos del usuario
 * @returns {Object} Todo lo necesario para el componente UI
 */
export const useAdminHeader = (user) => {
  // ============================================
  // PROCESAMIENTO DE DATOS
  // ============================================

  /**
   * Nombre del usuario procesado
   * Provee valor por defecto si no existe
   */
  const userName = useMemo(() => {
    return user?.name || 'Administrador'
  }, [user?.name])

  /**
   * Email del usuario procesado
   * Provee valor por defecto si no existe
   */
  const userEmail = useMemo(() => {
    return user?.email || 'admin@helpmed.com'
  }, [user?.email])

  /**
   * Inicial del usuario para el avatar
   * Extrae la primera letra del nombre y la capitaliza
   */
  const userInitial = useMemo(() => {
    const name = user?.name || 'A'
    return name.charAt(0).toUpperCase()
  }, [user?.name])

  // ============================================
  // CONFIGURACIÓN DE ESTILOS
  // ============================================

  /**
   * Clases CSS organizadas por sección
   * Todo el Tailwind está aquí pero organizado
   */
  const classes = useMemo(
    () => ({
      container: 'bg-white shadow-sm border-b',
      innerContainer: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
      mainWrapper: 'flex justify-between items-center py-4',
      leftSection: 'flex items-center space-x-4',
      rightSection: 'flex items-center space-x-4',
      title: {
        text: 'Admin',
        className: 'text-2xl font-bold text-gray-900'
      },
      userInfo: {
        wrapper: 'text-right',
        name: 'text-sm font-medium text-gray-900',
        email: 'text-xs text-gray-500'
      },
      avatar: {
        container: 'h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center',
        text: 'text-sm font-medium text-white'
      }
    }),
    []
  )

  // ============================================
  // ESTRUCTURA DE DATOS PARA EL COMPONENTE
  // ============================================

  /**
   * Información del header organizada
   */
  const headerData = useMemo(
    () => ({
      title: 'Admin',
      user: {
        name: userName,
        email: userEmail,
        initial: userInitial
      }
    }),
    [userName, userEmail, userInitial]
  )

  // ============================================
  // CONFIGURACIÓN DE SECCIONES
  // ============================================

  /**
   * Configuración de la sección izquierda
   */
  const leftSection = useMemo(
    () => ({
      visible: true,
      className: classes.leftSection,
      content: {
        title: {
          text: headerData.title,
          className: classes.title.className
        }
      }
    }),
    [classes.leftSection, classes.title.className, headerData.title]
  )

  /**
   * Configuración de la sección derecha
   */
  const rightSection = useMemo(
    () => ({
      visible: true,
      className: classes.rightSection,
      userInfo: {
        className: classes.userInfo.wrapper,
        name: {
          text: headerData.user.name,
          className: classes.userInfo.name
        },
        email: {
          text: headerData.user.email,
          className: classes.userInfo.email
        }
      },
      avatar: {
        className: classes.avatar.container,
        initial: {
          text: headerData.user.initial,
          className: classes.avatar.text
        }
      }
    }),
    [classes.rightSection, classes.userInfo, classes.avatar, headerData.user]
  )

  // ============================================
  // RETORNO - Todo listo para el componente
  // ============================================

  return {
    // Clases principales
    containerClass: classes.container,
    innerContainerClass: classes.innerContainer,
    mainWrapperClass: classes.mainWrapper,

    // Secciones
    leftSection,
    rightSection,

    // Datos
    headerData
  }
}
