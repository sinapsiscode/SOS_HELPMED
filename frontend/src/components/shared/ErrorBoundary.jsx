import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught:', error, errorInfo)
    this.setState({
      error,
      errorInfo
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="p-8 m-4 border border-red-200 rounded-lg bg-red-50 max-w-2xl">
            <h2 className="mb-4 text-2xl font-bold text-red-600">
              Error al cargar el componente
            </h2>
            <details className="mb-4">
              <summary className="font-semibold text-red-700 cursor-pointer">
                Ver detalles del error
              </summary>
              <pre className="p-4 mt-2 overflow-auto text-xs bg-red-100 rounded">
                {this.state.error && this.state.error.toString()}
                {this.state.errorInfo && this.state.errorInfo.componentStack}
              </pre>
            </details>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 text-white bg-red-600 rounded hover:bg-red-700"
            >
              Recargar página
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary