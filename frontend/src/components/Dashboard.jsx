import useAppStore from '../stores/useAppStore'
import FamiliarDashboard from './familiar/FamiliarDashboard'
import CorporateDashboard from './corporate/CorporateDashboard'
import ExternalDashboard from './external/ExternalDashboard'
import ExternalAdminDashboard from './external/ExternalAdminDashboard'
import AdminDashboard from './admin/AdminDashboard'
import AmbulanceDashboard from './ambulance/AmbulanceDashboard'

const Dashboard = () => {
  const { currentUser } = useAppStore()

  if (!currentUser) {
    return <div>Error: Usuario no encontrado</div>
  }

  // Renderizar dashboard específico según el tipo de usuario
  switch (currentUser.role) {
    case 'FAMILIAR':
      return <FamiliarDashboard />
    case 'CORPORATIVO':
      return <CorporateDashboard />
    case 'EXTERNO':
      return <ExternalDashboard />
    case 'EXTERNO_ADMIN':
      return <ExternalAdminDashboard />
    case 'ADMIN':
      return <AdminDashboard />
    case 'AMBULANCE':
      return <AmbulanceDashboard />
    default:
      return <div>Error: Tipo de usuario no válido</div>
  }
}

const NavigationTab = ({ icon, label, section }) => {
  const { activeSection, setActiveSection } = useAppStore()
  const isActive = activeSection === section

  return (
    <button
      onClick={() => setActiveSection(section)}
      className={`flex flex-col items-center py-2 px-1 sm:px-2 rounded-lg transition-all duration-200 min-w-0 ${
        isActive
          ? 'bg-primary-red text-white shadow-lg'
          : 'text-gray-600 hover:text-primary-red hover:bg-gray-50'
      }`}
    >
      <i className={`${icon} text-base sm:text-lg mb-1`}></i>
      <span className="text-xs sm:text-sm font-medium leading-tight text-center">{label}</span>
    </button>
  )
}

export default Dashboard
