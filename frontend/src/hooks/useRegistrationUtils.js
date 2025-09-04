import { useCallback } from 'react'

/**
 * Hook especializado para funciones utilitarias de registros
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Utility functions
 * ✅ Funciones puras sin efectos secundarios
 */
const useRegistrationUtils = () => {
  /**
   * Obtener clases CSS según el estado de la solicitud
   */
  const getStatusColor = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }, [])

  /**
   * Obtener icono Font Awesome según el estado
   */
  const getStatusIcon = useCallback((status) => {
    switch (status) {
      case 'pending':
        return 'fas fa-clock text-yellow-600'
      case 'approved':
        return 'fas fa-check-circle text-green-600'
      case 'rejected':
        return 'fas fa-times-circle text-red-600'
      default:
        return 'fas fa-question-circle text-gray-600'
    }
  }, [])

  /**
   * Formatear nombre del plan para mostrar
   */
  const getPlanTypeName = useCallback((planType, planSubtype) => {
    const planNames = {
      familiar: {
        help: 'Plan Help',
        basico: 'Plan Básico',
        vip: 'Plan VIP',
        dorado: 'Plan Dorado'
      },
      corporativo: {
        area_protegida: 'Área Protegida',
        empresarial_basico: 'Empresarial Básico',
        empresarial_premium: 'Empresarial Premium'
      }
    }
    return planNames[planType]?.[planSubtype] || 'Plan No Especificado'
  }, [])

  return {
    getStatusColor,
    getStatusIcon,
    getPlanTypeName
  }
}

export default useRegistrationUtils