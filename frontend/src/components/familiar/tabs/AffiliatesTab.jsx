import React from 'react'

/**
 * Componente de pestaña Afiliados para FamiliarDashboard
 * ✅ Separado del componente principal
 * ✅ Props claramente definidos
 * ✅ Responsabilidad única: Affiliates display
 */
const AffiliatesTab = ({ user }) => {
  // Calcular edad basada en la fecha de nacimiento
  const calculateAge = (birthDate) => {
    if (!birthDate) return null
    const today = new Date()
    const birth = new Date(birthDate)
    let age = today.getFullYear() - birth.getFullYear()
    const monthDiff = today.getMonth() - birth.getMonth()

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--
    }
    return age
  }

  // Obtener todos los afiliados incluyendo al titular
  const getAllAffiliates = () => {
    const affiliates = [
      {
        id: 'titular',
        name: user.profile.name,
        dni: user.profile.dni,
        phone: user.profile.phone,
        email: user.profile.email,
        relationship: 'Titular',
        birthDate: user.profile.birth_date,
        addedAt: user.plan.start_date,
        status: 'active'
      }
    ]

    if (user.affiliates && user.affiliates.length > 0) {
      const activeAffiliates = user.affiliates.filter((affiliate) => affiliate.status === 'active')
      const affiliatesWithRelation = activeAffiliates.map((affiliate) => ({
        ...affiliate,
        relationship: getRelationDisplayName(affiliate.relationship)
      }))
      affiliates.push(...affiliatesWithRelation)
    }

    return affiliates
  }

  const getRelationDisplayName = (relationship) => {
    const relationMap = {
      conyuge: 'Cónyuge',
      hijo: 'Hijo/a',
      madre: 'Madre',
      padre: 'Padre',
      hermano: 'Hermano/a',
      abuelo: 'Abuelo/a',
      nieto: 'Nieto/a',
      otro: 'Otro'
    }
    return relationMap[relationship] || relationship
  }

  // Verificar si es elegible para beneficios especiales (menor de 79 años)
  const age = calculateAge(user.profile.birth_date)
  const isEligibleForAccidentInsurance = age !== null && age < 79

  const allAffiliates = getAllAffiliates()

  return (
    <div className="space-y-6">
      {/* Lista de todos los afiliados */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center">
          <i className="fas fa-users mr-2 text-blue-600"></i>
          Datos de Afiliados ({allAffiliates.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {allAffiliates.map((affiliate, index) => (
            <div
              key={affiliate.id}
              className={`border rounded-lg p-4 ${
                affiliate.id === 'titular'
                  ? 'border-blue-200 bg-blue-50'
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      affiliate.id === 'titular'
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-500 text-white'
                    }`}
                  >
                    <i className={`fas ${affiliate.id === 'titular' ? 'fa-crown' : 'fa-user'}`}></i>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">{affiliate.name}</h4>
                    <p
                      className={`text-sm ${
                        affiliate.id === 'titular' ? 'text-blue-600' : 'text-gray-600'
                      }`}
                    >
                      {affiliate.relationship}
                    </p>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    affiliate.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {affiliate.status === 'active' ? 'ACTIVO' : 'INACTIVO'}
                </span>
              </div>

              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">DNI/RUC</label>
                    <p className="text-gray-800">{affiliate.dni || 'No registrado'}</p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Teléfono</label>
                    <p className="text-gray-800">{affiliate.phone || 'No registrado'}</p>
                  </div>
                </div>

                {affiliate.email && (
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Email</label>
                    <p className="text-gray-800">{affiliate.email}</p>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">
                      Fecha de Nacimiento
                    </label>
                    <p className="text-gray-800">
                      {affiliate.birthDate
                        ? new Date(affiliate.birthDate).toLocaleDateString('es-CL')
                        : 'No registrada'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Edad</label>
                    <p className="text-gray-800 font-medium">
                      {affiliate.birthDate
                        ? `${calculateAge(affiliate.birthDate)} años`
                        : 'No disponible'}
                    </p>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Fecha de Afiliación
                  </label>
                  <p className="text-gray-800">
                    {new Date(affiliate.addedAt).toLocaleDateString('es-CL')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Estado de Afiliación */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-id-card mr-2 text-green-600"></i>
          Estado de Afiliación
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-check text-white text-lg sm:text-xl"></i>
            </div>
            <div className="text-xs sm:text-sm font-medium text-green-800">Estado</div>
            <div className="text-base sm:text-lg font-bold text-green-600">ACTIVO</div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-calendar text-white text-lg sm:text-xl"></i>
            </div>
            <div className="text-xs sm:text-sm font-medium text-blue-800">Fecha de Afiliación</div>
            <div className="text-sm sm:text-lg font-bold text-blue-600">
              {new Date(user.plan.start_date).toLocaleDateString('es-CL')}
            </div>
          </div>

          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3 sm:p-4 text-center">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <i className="fas fa-crown text-white text-lg sm:text-xl"></i>
            </div>
            <div className="text-xs sm:text-sm font-medium text-purple-800">Plan Actual</div>
            <div className="text-sm sm:text-lg font-bold text-purple-600">{user.plan.name}</div>
          </div>
        </div>
      </div>

      {/* Verificación de Edad para Seguro */}
      <div className="bg-white rounded-xl shadow-medium p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-user-check mr-2 text-yellow-600"></i>
          Verificación de Edad para Seguro
        </h3>

        <div className="space-y-4">
          {/* Seguro contra Accidentes Personales */}
          <div
            className={`border rounded-lg p-4 ${
              isEligibleForAccidentInsurance
                ? 'border-green-200 bg-green-50'
                : 'border-red-200 bg-red-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    isEligibleForAccidentInsurance
                      ? 'bg-green-500 text-white'
                      : 'bg-red-500 text-white'
                  }`}
                >
                  <i
                    className={`fas ${isEligibleForAccidentInsurance ? 'fa-check' : 'fa-times'}`}
                  ></i>
                </div>
                <div>
                  <h4
                    className={`font-semibold ${
                      isEligibleForAccidentInsurance ? 'text-green-800' : 'text-red-800'
                    }`}
                  >
                    Seguro contra Accidentes Personales
                  </h4>
                  <p
                    className={`text-sm ${
                      isEligibleForAccidentInsurance ? 'text-green-600' : 'text-red-600'
                    }`}
                  >
                    {isEligibleForAccidentInsurance
                      ? 'ELEGIBLE - Menor de 79 años'
                      : 'NO ELEGIBLE - Mayor de 79 años'}
                  </p>
                </div>
              </div>

              <div className="text-right">
                {isEligibleForAccidentInsurance ? (
                  <div className="text-green-600 font-bold">✓ INCLUIDO</div>
                ) : (
                  <div className="text-red-600 font-bold">✗ NO APLICA</div>
                )}
              </div>
            </div>

            {isEligibleForAccidentInsurance && (
              <div className="mt-3 pt-3 border-t border-green-200">
                <div className="grid grid-cols-1 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div>
                    <span className="font-medium text-green-700">Vigencia:</span>
                    <p className="text-green-600">24/7 - 365 días</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Nota informativa */}
          <div className="bg-gray-100 border border-gray-300 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <i className="fas fa-info-circle text-gray-500 mt-1"></i>
              <div>
                <p className="text-sm text-gray-700">
                  <strong>Nota:</strong> El seguro contra accidentes personales tiene un límite de edad de 79 años. Los demás beneficios del plan (servicios médicos, orientación telefónica, descuentos, etc.) están disponibles sin restricción de edad.
                </p>
                <p className="text-sm text-blue-600 mt-2">
                  Para ver todos los beneficios de tu plan, consulta la pestaña 'Beneficios'.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actualización de Datos */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
          <i className="fas fa-exclamation-triangle mr-2 text-yellow-600"></i>
          Actualización de Datos
        </h3>

        <p className="text-sm text-gray-700 mb-4">
          Para actualizar tus datos de afiliado, contacta a nuestro equipo:
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Teléfono */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-phone text-blue-600"></i>
            <span className="text-sm font-medium text-gray-700">+56 2 2800 4000</span>
          </div>

          {/* Email */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-envelope text-red-600"></i>
            <span className="text-sm font-medium text-gray-700">soporte@helpmed.com</span>
          </div>

          {/* Horario */}
          <div className="flex items-center space-x-2">
            <i className="fas fa-clock text-yellow-600"></i>
            <span className="text-sm font-medium text-gray-700">Lun-Vie 9:00-18:00</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AffiliatesTab