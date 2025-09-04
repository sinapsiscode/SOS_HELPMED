const SplashScreen = () => {
  return (
    <div className="fixed inset-0 gradient-primary flex items-center justify-center z-50">
      <div className="text-center text-white animate-fade-in">
        <div className="mb-10">
          <div className="w-24 h-24 mx-auto mb-6 bg-white rounded-full flex items-center justify-center">
            <i className="fas fa-heartbeat text-primary-red text-3xl"></i>
          </div>
          <h1 className="text-4xl font-bold mb-2">Help MED</h1>
          <p className="text-xl opacity-90">Emergencias Médicas</p>
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
