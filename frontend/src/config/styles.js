/**
 * Estilos centralizados para componentes
 * Evita hardcodeo de clases CSS en los componentes
 */

export const FORM_STYLES = {
  // Estilos de campos de formulario
  input: {
    base: 'w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors',
    error: 'border-red-300',
    normal: 'border-gray-300',
    disabled: 'bg-gray-100 cursor-not-allowed'
  },
  
  // Estilos de labels
  label: {
    base: 'block text-sm font-medium text-gray-700 mb-2'
  },
  
  // Estilos de mensajes de error
  error: {
    text: 'mt-1 text-sm text-red-600',
    alert: 'bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-600'
  },
  
  // Estilos de botones
  button: {
    primary: 'flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    secondary: 'flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    danger: 'flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    success: 'flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
    withSpinner: 'flex items-center justify-center'
  },
  
  // Estilos de contenedores
  container: {
    formButtons: 'flex space-x-3 pt-4',
    field: 'div'
  },
  
  // Estilos del spinner
  spinner: {
    base: 'animate-spin -ml-1 mr-2 h-4 w-4 text-white',
    svg: {
      xmlns: 'http://www.w3.org/2000/svg',
      fill: 'none',
      viewBox: '0 0 24 24'
    },
    circle: {
      className: 'opacity-25',
      cx: '12',
      cy: '12',
      r: '10',
      stroke: 'currentColor',
      strokeWidth: '4'
    },
    path: {
      className: 'opacity-75',
      fill: 'currentColor',
      d: 'M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
    }
  }
}

export const MODAL_STYLES = {
  // Estilos del modal
  overlay: 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50',
  container: 'bg-white rounded-xl shadow-2xl max-w-md w-full m-4',
  
  // Estilos del header
  header: {
    wrapper: 'px-6 py-4 border-b border-gray-200',
    content: 'flex items-center justify-between',
    title: 'text-lg font-bold text-gray-800',
    subtitle: 'text-sm text-gray-600 mt-1',
    closeButton: 'text-gray-400 hover:text-gray-600 transition-colors disabled:cursor-not-allowed'
  },
  
  // Estilos del body
  body: 'p-6 space-y-4'
}

export const CARD_STYLES = {
  // Estilos de tarjetas
  base: 'bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow',
  
  // Header de tarjeta
  header: {
    wrapper: 'flex items-start justify-between mb-3',
    leftSection: 'flex items-center space-x-3',
    avatar: {
      container: 'w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center',
      icon: 'text-blue-600 font-medium'
    },
    info: {
      name: 'font-semibold text-gray-800',
      subtitle: 'text-sm text-gray-600'
    }
  },
  
  // Cuerpo de tarjeta
  body: {
    wrapper: 'space-y-2 mb-4 text-sm',
    row: {
      container: 'flex items-center justify-between',
      label: 'text-gray-600',
      value: 'font-medium text-gray-800'
    }
  },
  
  // Acciones de tarjeta
  actions: {
    wrapper: 'flex space-x-2',
    button: 'flex-1 px-3 py-1 rounded text-xs font-medium transition-colors'
  }
}

export const BADGE_STYLES = {
  // Estados
  status: {
    active: 'bg-green-100 text-green-800 border-green-200',
    inactive: 'bg-red-100 text-red-800 border-red-200',
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    completed: 'bg-blue-100 text-blue-800 border-blue-200'
  },
  
  // Tamaños
  size: {
    small: 'px-2 py-1 text-xs',
    medium: 'px-3 py-1 text-sm',
    large: 'px-4 py-2 text-base'
  },
  
  // Base
  base: 'rounded-full font-medium border'
}

export const GRID_STYLES = {
  // Configuraciones de grid
  responsive: {
    oneColumn: 'grid grid-cols-1 gap-4',
    twoColumns: 'grid grid-cols-1 md:grid-cols-2 gap-4',
    threeColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4',
    fourColumns: 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'
  }
}

export const EMPTY_STATE_STYLES = {
  container: 'text-center py-12',
  icon: 'text-6xl mb-4',
  title: 'text-lg font-semibold text-gray-800 mb-2',
  description: 'text-gray-600 mb-6',
  button: 'bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors inline-flex items-center space-x-2'
}