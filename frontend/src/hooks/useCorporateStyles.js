/**
 * Hook especializado para clases CSS dinámicas de contratos corporativos
 * ✅ Cumple reglas de tamaño: <100 líneas
 * ✅ Responsabilidad única: Style utilities
 * ✅ Lógica pura de presentación
 */
const useCorporateStyles = () => {
  /**
   * Obtiene clase CSS para porcentaje de uso
   */
  const getUsageColor = (percentage) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 70) return 'text-orange-600'
    return 'text-green-600'
  }

  /**
   * Obtiene clase CSS para estado de contrato
   */
  const getContractStatusClass = (status) => {
    const classes = {
      expired: 'bg-red-100 text-red-800 border-red-200',
      expiring: 'bg-orange-100 text-orange-800 border-orange-200',
      active: 'bg-green-100 text-green-800 border-green-200'
    }
    return classes[status] || 'bg-gray-100 text-gray-800 border-gray-200'
  }

  return {
    getUsageColor,
    getContractStatusClass
  }
}

export default useCorporateStyles