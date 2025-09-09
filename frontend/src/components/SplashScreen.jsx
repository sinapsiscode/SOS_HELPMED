const SplashScreen = () => {
  return (
    <div className="fixed inset-0 gradient-primary flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-10">
          <div className="mb-6">
            <img 
              src="/Logo-Helpmed-negativo.png" 
              alt="HelpMed Logo" 
              className="h-16 mx-auto"
            />
          </div>
          <p className="text-xl opacity-90">Primera Respuesta Médica</p>
        </div>

        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-lg">Cargando sistema...</p>
        </div>
      </div>
    </div>
  )
}

export default SplashScreen
