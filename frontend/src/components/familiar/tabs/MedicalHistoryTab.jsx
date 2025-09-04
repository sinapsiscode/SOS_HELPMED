import React, { useState } from 'react'

const MedicalHistoryTab = ({ user }) => {
  const [selectedAffiliate, setSelectedAffiliate] = useState('all')

  // Datos mock del historial médico basados en la imagen
  const medicalStats = {
    atencionesMedicas: 9,
    afiliadosConHistorial: 6,
    medicamentosRecetados: 9
  }

  const medicalRecords = [
    {
      id: 1,
      patient: 'Alejandra Vega',
      type: 'Familiar',
      date: '20 de diciembre de 2024',
      time: '09:30 a.m.',
      attendedBy: 'Dr. Carlos Mendoza',
      status: 'Mejorado'
    },
    {
      id: 2,
      patient: 'Alejandra Vega', 
      type: 'Familiar',
      date: '18 de diciembre de 2024',
      time: '06:15 a.m.',
      attendedBy: 'Dr. Carlos Mendoza',
      status: 'Mejorado'
    }
  ]

  const medications = {
    'Alejandra Vega (Titular)': [
      { name: 'Alprazolam', dose: '0.5mg - cada 12h', prescribed: '19-12-2024' },
      { name: 'Omeprazol', dose: '20mg - cada 24h', prescribed: '09-12-2024' },
      { name: 'Probióticos', dose: '1 cápsula - cada 12h', prescribed: '09-12-2024' }
    ],
    'Fernando Vega (Cónyuge)': [
      { name: 'Ibuprofeno', dose: '600mg - cada 8h', prescribed: '21-09-2024' },
      { name: 'Sulfato de glucosamina', dose: '500mg - cada 12h', prescribed: '11-12-2024' }
    ],
    'Camila Vega (Hija)': [
      { name: 'Paracetamol', dose: '250mg - cada 8h', prescribed: '15-12-2024' }
    ],
    'Sebastián Vega (Hijo)': [
      { name: 'Salbutamol', dose: '2 puff - cada 8h', prescribed: '27-10-2024' }
    ],
    'Isabel Mendoza (Madre)': [
      { name: 'Amlodipino', dose: '5mg - cada 24h', prescribed: '03-11-2024' }
    ]
  }

  const affiliates = Object.keys(medications)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          <i className="fas fa-file-medical mr-2 text-blue-600"></i>
          Historial Médico Familiar
        </h2>
        <select 
          value={selectedAffiliate}
          onChange={(e) => setSelectedAffiliate(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Todos los afiliados</option>
          {affiliates.map(affiliate => (
            <option key={affiliate} value={affiliate}>{affiliate}</option>
          ))}
        </select>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-blue-600 mb-2">
            {medicalStats.atencionesMedicas}
          </div>
          <div className="text-sm text-blue-700 font-medium">
            Atenciones Médicas
          </div>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-600 mb-2">
            {medicalStats.afiliadosConHistorial}
          </div>
          <div className="text-sm text-green-700 font-medium">
            Afiliados con Historial
          </div>
        </div>
        
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-purple-600 mb-2">
            {medicalStats.medicamentosRecetados}
          </div>
          <div className="text-sm text-purple-700 font-medium">
            Medicamentos Recetados
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Registros Médicos */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              Registros Médicos ({medicalRecords.length})
            </h3>
            
            <div className="space-y-4">
              {medicalRecords.map(record => (
                <div key={record.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className="fas fa-user text-blue-600"></i>
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900">{record.patient}</h4>
                        <p className="text-sm text-blue-600">{record.type}</p>
                      </div>
                    </div>
                    <button className="text-blue-600 hover:text-blue-800 transition-colors">
                      <span className="text-sm font-medium">Mejorado</span>
                      <i className="fas fa-chevron-down ml-1"></i>
                    </button>
                  </div>
                  
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>
                      <span className="font-medium">Fecha:</span> {record.date}, {record.time}
                    </div>
                    <div className="flex items-center gap-2">
                      <i className="fas fa-user-md text-gray-400"></i>
                      <span>Atendido por: <strong>{record.attendedBy}</strong></span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Medicamentos */}
        <div>
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
              <i className="fas fa-pills mr-2 text-purple-600"></i>
              Medicamentos
            </h3>
            
            <div className="space-y-4">
              {Object.entries(medications).map(([affiliate, meds]) => (
                <div key={affiliate} className="space-y-2">
                  <h4 className="font-semibold text-gray-900 text-sm">{affiliate}</h4>
                  {meds.map((med, index) => (
                    <div key={index} className="bg-purple-50 rounded-lg p-3">
                      <div className="font-medium text-purple-900">{med.name}</div>
                      <div className="text-sm text-purple-700">{med.dose}</div>
                      <div className="text-xs text-purple-600">Prescrito: {med.prescribed}</div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default MedicalHistoryTab