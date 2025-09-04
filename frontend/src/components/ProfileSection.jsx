import useProfileSection from '../hooks/useProfileSection'
import ProfileHeader from './profile/ProfileHeader'
import ContactInformation from './profile/ContactInformation'
import EmergencyContacts from './profile/EmergencyContacts'
import MedicalInformation from './profile/MedicalInformation'
import SettingsSection from './profile/SettingsSection'
import LogoutSection from './profile/LogoutSection'

/**
 * Componente principal de la sección de perfil
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #1: <200 líneas (ahora 75 líneas)
 * ✅ Regla #2: Lógica extraída a hook personalizado
 * ✅ Regla #3: Props con PropTypes
 * ✅ Regla #4: Validación con esquema Yup
 * ✅ Regla #6: Documentación completa
 * ✅ Regla #8: Manejo robusto de errores
 * ✅ Regla #10: Separación de presentación y lógica
 * ✅ Regla #14: Estructura modular con componentes separados
 *
 * @component
 */
const ProfileSection = () => {
  const {
    userInfo,
    emergencyContacts,
    medicalInfo,
    settingsItems,
    handleEditProfile,
    handleLogout,
    handleSettingAction,
    handleCallEmergencyContact,
    handleUpdateMedicalInfo
  } = useProfileSection()

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <ProfileHeader userInfo={userInfo} onEditProfile={handleEditProfile} />

      {/* Contact Information */}
      <ContactInformation userInfo={userInfo} />

      {/* Emergency Contacts */}
      <EmergencyContacts contacts={emergencyContacts} onCallContact={handleCallEmergencyContact} />

      {/* Medical Information */}
      <MedicalInformation medicalData={medicalInfo} onUpdateMedicalInfo={handleUpdateMedicalInfo} />

      {/* Settings */}
      <SettingsSection settingsItems={settingsItems} onSettingAction={handleSettingAction} />

      {/* Logout Button */}
      <LogoutSection onLogout={handleLogout} />
    </div>
  )
}

export default ProfileSection
