import PropTypes from 'prop-types'

/**
 * Encabezado del perfil de usuario
 * ✅ Regla #1: <200 líneas
 * ✅ Regla #3: PropTypes definidos
 */
const ProfileHeader = ({ userInfo, onEditProfile }) => (
  <div className="bg-white rounded-xl shadow-medium p-6">
    <div className="flex items-center space-x-4 mb-6">
      <div className="w-20 h-20 bg-gradient-to-r from-primary-red to-red-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold text-2xl">{userInfo.avatar}</span>
      </div>
      <div className="flex-1">
        <h2 className="text-2xl font-bold text-gray-800">{userInfo.name}</h2>
        <p className="text-gray-600">@{userInfo.username}</p>
        <div className="flex items-center space-x-2 mt-2">
          <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full text-xs font-semibold">
            {userInfo.membership}
          </span>
        </div>
      </div>
    </div>

    <button
      onClick={onEditProfile}
      className="w-full bg-helpmed-blue hover:bg-primary-blue text-white py-3 px-4 rounded-lg font-exo font-medium transition-colors"
    >
      <i className="fas fa-edit mr-2"></i>
      Editar Información de Contacto
    </button>
  </div>
)

ProfileHeader.propTypes = {
  userInfo: PropTypes.shape({
    avatar: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    username: PropTypes.string.isRequired,
    membership: PropTypes.string.isRequired
  }).isRequired,
  onEditProfile: PropTypes.func.isRequired
}

export default ProfileHeader