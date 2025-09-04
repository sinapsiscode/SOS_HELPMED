/**
 * Mock data para seguimiento de emergencias activas
 * ENFOQUE BALANCEADO: Datos separados del código de producción
 */

export const MOCK_EMERGENCY_DATA = [
  {
    id: 'EMG-2024-001',
    priority: 'CRITICA',
    status: 'EN_PROGRESO',
    type: 'INFARTO_AGUDO',
    patient: {
      name: 'Juan Carlos Mendoza',
      age: 58,
      gender: 'M',
      phone: '+51 9 8765 4321',
      medicalHistory: ['Hipertensión', 'Diabetes tipo 2']
    },
    location: {
      address: 'Av. San Isidro 11049, San Isidro',
      coordinates: { lat: -12.0147, lng: -77.0122 },
      landmark: 'Centro Comercial Parque Arauco'
    },
    caller: {
      name: 'María Mendoza',
      relationship: 'Esposa',
      phone: '+51 9 1234 5678'
    },
    timeline: [
      {
        time: '2024-01-15T14:23:00',
        event: 'Llamada recibida',
        operator: 'Ana García',
        details: 'Paciente con dolor torácico severo'
      },
      {
        time: '2024-01-15T14:24:30',
        event: 'Emergencia clasificada',
        operator: 'Sistema',
        details: 'Prioridad CRÍTICA - Posible infarto'
      },
      {
        time: '2024-01-15T14:25:00',
        event: 'Unidad despachada',
        operator: 'Carlos López',
        details: 'Ambulancia AMB-002 asignada'
      },
      {
        time: '2024-01-15T14:26:00',
        event: 'Unidad en ruta',
        operator: 'Sistema',
        details: 'ETA: 8 minutos'
      },
      {
        time: '2024-01-15T14:32:00',
        event: 'Unidad en escena',
        operator: 'Dr. María López',
        details: 'Paciente consciente, signos vitales estables'
      }
    ],
    assignedUnit: {
      id: 'AMB-002',
      name: 'Ambulancia 002',
      crew: ['Dr. María López', 'Carlos Ruiz', 'Luis Morales'],
      eta: '2 min',
      distance: '0.8 km'
    },
    vital_signs: {
      timestamp: '2024-01-15T14:32:00',
      heartRate: 95,
      bloodPressure: '140/90',
      oxygenSaturation: 92,
      temperature: 36.8,
      consciousness: 'Consciente y orientado'
    },
    startTime: '2024-01-15T14:23:00',
    estimatedDuration: 45,
    destination: 'Hospital Nacional Dos de Mayo',
    severity_score: 8.5
  },
  {
    id: 'EMG-2024-002',
    priority: 'ALTA',
    status: 'COMPLETADA',
    type: 'ACCIDENTE_TRAFICO',
    patient: {
      name: 'Sofia Ramirez',
      age: 24,
      gender: 'F',
      phone: '+51 9 5555 1234',
      medicalHistory: []
    },
    location: {
      address: 'Av. Miraflores con Manuel Montt',
      coordinates: { lat: -12.0372, lng: -77.0506 },
      landmark: 'Metro Manuel Montt'
    },
    caller: {
      name: 'Testigo',
      relationship: 'Testigo presencial',
      phone: '+51 9 9876 5432'
    },
    timeline: [
      {
        time: '2024-01-15T13:45:00',
        event: 'Llamada recibida',
        operator: 'Pedro Silva',
        details: 'Colisión menor, paciente consciente'
      },
      {
        time: '2024-01-15T13:46:00',
        event: 'Unidad despachada',
        operator: 'Pedro Silva',
        details: 'Ambulancia AMB-001 asignada'
      },
      {
        time: '2024-01-15T13:52:00',
        event: 'Unidad en escena',
        operator: 'Dr. Juan Pérez',
        details: 'Evaluación inicial completada'
      },
      {
        time: '2024-01-15T14:15:00',
        event: 'Traslado iniciado',
        operator: 'Dr. Juan Pérez',
        details: 'Paciente estable, trasladando a hospital'
      },
      {
        time: '2024-01-15T14:35:00',
        event: 'Llegada a hospital',
        operator: 'Dr. Juan Pérez',
        details: 'Paciente entregado a urgencias'
      },
      {
        time: '2024-01-15T14:45:00',
        event: 'Servicio completado',
        operator: 'Sistema',
        details: 'Unidad disponible nuevamente'
      }
    ],
    assignedUnit: {
      id: 'AMB-001',
      name: 'Ambulancia 001',
      crew: ['Dr. Juan Pérez', 'Ana García'],
      eta: 'Completado',
      distance: '15.2 km total'
    },
    vital_signs: {
      timestamp: '2024-01-15T13:52:00',
      heartRate: 88,
      bloodPressure: '120/80',
      oxygenSaturation: 98,
      temperature: 36.5,
      consciousness: 'Consciente y orientado'
    },
    startTime: '2024-01-15T13:45:00',
    completedTime: '2024-01-15T14:45:00',
    estimatedDuration: 60,
    actualDuration: 60,
    destination: 'Hospital Salvador',
    severity_score: 4.2
  },
  {
    id: 'EMG-2024-003',
    priority: 'MEDIA',
    status: 'PENDIENTE',
    type: 'DOLOR_ABDOMINAL',
    patient: {
      name: 'Roberto González',
      age: 42,
      gender: 'M',
      phone: '+51 9 3333 7777',
      medicalHistory: ['Gastritis crónica']
    },
    location: {
      address: 'Calle Los Laureles 1234, Ñuñoa',
      coordinates: { lat: -12.0569, lng: -77.0483 },
      landmark: 'Cerca del Metro Ñuñoa'
    },
    caller: {
      name: 'Roberto González',
      relationship: 'Paciente',
      phone: '+51 9 3333 7777'
    },
    timeline: [
      {
        time: '2024-01-15T14:40:00',
        event: 'Llamada recibida',
        operator: 'Luis Torres',
        details: 'Dolor abdominal intenso, náuseas'
      },
      {
        time: '2024-01-15T14:41:00',
        event: 'Emergencia en cola',
        operator: 'Sistema',
        details: 'Esperando disponibilidad de unidad'
      }
    ],
    assignedUnit: null,
    vital_signs: null,
    startTime: '2024-01-15T14:40:00',
    estimatedDuration: 30,
    destination: 'Por determinar',
    severity_score: 5.1,
    waitTime: 8
  },
  {
    id: 'EMG-2024-004',
    priority: 'ALTA',
    status: 'EN_RUTA',
    type: 'DIFICULTAD_RESPIRATORIA',
    patient: {
      name: 'Elena Morales',
      age: 76,
      gender: 'F',
      phone: '+51 9 8888 4444',
      medicalHistory: ['EPOC', 'Insuficiencia cardíaca']
    },
    location: {
      address: 'Av. Apoquindo 4501, San Isidro',
      coordinates: { lat: -12.0248, lng: -77.012 },
      landmark: 'Edificio residencial Torre del Sol'
    },
    caller: {
      name: 'Carmen Morales',
      relationship: 'Hija',
      phone: '+51 9 7777 3333'
    },
    timeline: [
      {
        time: '2024-01-15T14:35:00',
        event: 'Llamada recibida',
        operator: 'Ana García',
        details: 'Paciente con disnea severa'
      },
      {
        time: '2024-01-15T14:36:00',
        event: 'Unidad despachada',
        operator: 'Ana García',
        details: 'Unidad Móvil MOV-001 asignada'
      },
      {
        time: '2024-01-15T14:38:00',
        event: 'Unidad en ruta',
        operator: 'Sistema',
        details: 'ETA: 12 minutos'
      }
    ],
    assignedUnit: {
      id: 'MOV-001',
      name: 'Unidad Móvil 001',
      crew: ['Dr. Roberto Silva', 'Patricia Vega'],
      eta: '9 min',
      distance: '3.2 km'
    },
    vital_signs: null,
    startTime: '2024-01-15T14:35:00',
    estimatedDuration: 40,
    destination: 'Clínica San Isidro',
    severity_score: 7.2
  }
]
