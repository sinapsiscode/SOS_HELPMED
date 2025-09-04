// Usuarios con planes familiares

import { PLAN_TYPES, FAMILIAR_SUBTYPES, SERVICE_TYPES } from '../plans/plan-config.js'

export const FAMILIAR_USERS = [
  // PLAN HELP USERS
  {
    id: 'fam_help_001',
    username: 'help_user',
    password: 'help123',
    role: 'FAMILIAR',
    plan: {
      type: PLAN_TYPES.FAMILIAR,
      subtype: FAMILIAR_SUBTYPES.HELP,
      name: 'Plan Help',
      total_services: 16,
      start_date: '2024-01-15T00:00:00Z',
      renewal_date: '2025-01-15T00:00:00Z'
    },
    profile: {
      name: 'Ana Rodríguez',
      email: 'ana.rodriguez@email.com',
      phone: '+51 9 9876 5432',
      dni: '12.345.678-9',
      address: 'Av. Javier Prado 1234, San Isidro',
      birth_date: '1985-03-15',
      avatar: null,
      emergency_contacts: [
        {
          name: 'Pedro Rodríguez',
          relationship: 'Esposo',
          phone: '+51 9 8765 4321'
        },
        {
          name: 'Carmen Silva',
          relationship: 'Madre',
          phone: '+51 9 7654 3210'
        }
      ],
      medical_info: {
        blood_type: 'O+',
        allergies: ['Penicilina'],
        conditions: ['Hipertensión'],
        medications: ['Losartán 50mg'],
        insurance: 'SIS'
      }
    },
    service_usage: {
      current_period: {
        used_services: 7, // Ha usado 7 de 16 servicios
        remaining_services: 9,
        breakdown: {
          [SERVICE_TYPES.EMERGENCIA]: 2,
          [SERVICE_TYPES.URGENCIA]: 3,
          [SERVICE_TYPES.MEDICO_DOMICILIO]: 2,
          [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 8 // Ilimitado
        }
      },
      reset_date: '2025-01-15T00:00:00Z'
    },
    billing: {
      monthly_cost: 195,
      payment_method: 'credit_card',
      auto_renewal: true,
      additional_charges: 0
    },
    affiliates: [
      {
        id: 'aff_001_001',
        name: 'Pedro Rodríguez',
        dni: '12.345.679-8',
        phone: '+51 9 8765 4321',
        relationship: 'conyuge',
        birthDate: '1982-07-20',
        addedAt: '2024-01-15T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_001_002',
        name: 'Sofía Rodríguez',
        dni: '76.543.210-1',
        phone: '+51 9 1111 2222',
        relationship: 'hijo',
        birthDate: '2015-09-10',
        addedAt: '2024-01-15T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_001_003',
        name: 'Carmen Silva',
        dni: '98.765.432-3',
        phone: '+51 9 7654 3210',
        relationship: 'madre',
        birthDate: '1960-05-12',
        addedAt: '2024-01-20T00:00:00.000Z',
        status: 'active'
      }
    ],
    affiliatesCount: 3
  },
  {
    id: 'fam_help_002',
    username: 'help16_user',
    password: 'help16',
    role: 'FAMILIAR',
    plan: {
      type: PLAN_TYPES.FAMILIAR,
      subtype: FAMILIAR_SUBTYPES.HELP,
      name: 'Plan Help',
      total_services: 16,
      start_date: '2024-03-01T00:00:00Z',
      renewal_date: '2025-03-01T00:00:00Z'
    },
    profile: {
      name: 'Roberto Morales',
      email: 'roberto.morales@email.com',
      phone: '+51 9 5555 1234',
      dni: '15.789.456-2',
      address: 'Av. Arequipa 2800, Miraflores',
      birth_date: '1978-11-22',
      emergency_contacts: [
        {
          name: 'Sofia Morales',
          relationship: 'Esposa',
          phone: '+51 9 5555 5678'
        }
      ],
      medical_info: {
        blood_type: 'A+',
        allergies: [],
        conditions: [],
        medications: [],
        insurance: 'EsSalud'
      }
    },
    service_usage: {
      current_period: {
        used_services: 3,
        remaining_services: 13,
        breakdown: {
          [SERVICE_TYPES.EMERGENCIA]: 1,
          [SERVICE_TYPES.URGENCIA]: 1,
          [SERVICE_TYPES.MEDICO_DOMICILIO]: 1,
          [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 5
        }
      },
      reset_date: '2025-03-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 237,
      payment_method: 'bank_transfer',
      auto_renewal: true,
      additional_charges: 0
    },
    affiliates: [
      {
        id: 'aff_002_001',
        name: 'Sofia Morales',
        dni: '15.789.457-9',
        phone: '+51 9 5555 5678',
        relationship: 'conyuge',
        birthDate: '1980-04-15',
        addedAt: '2024-03-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_002_002',
        name: 'Diego Morales',
        dni: '88.999.111-5',
        phone: '+51 9 6666 7777',
        relationship: 'hijo',
        birthDate: '2010-12-08',
        addedAt: '2024-03-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_002_003',
        name: 'Elena Morales',
        dni: '77.888.222-4',
        phone: '+51 9 8888 9999',
        relationship: 'hijo',
        birthDate: '2013-06-25',
        addedAt: '2024-03-05T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_002_004',
        name: 'Luis Morales Sr.',
        dni: '33.444.555-7',
        phone: '+51 9 2222 3333',
        relationship: 'padre',
        birthDate: '1950-08-30',
        addedAt: '2024-03-10T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_002_005',
        name: 'Rosa Vargas',
        dni: '44.555.666-8',
        phone: '+51 9 3333 4444',
        relationship: 'madre',
        birthDate: '1952-11-18',
        addedAt: '2024-03-10T00:00:00.000Z',
        status: 'active'
      }
    ],
    affiliatesCount: 5
  },

  // PLAN BÁSICO USER
  {
    id: 'fam_bas_001',
    username: 'basico_user',
    password: 'basico123',
    role: 'FAMILIAR',
    plan: {
      type: PLAN_TYPES.FAMILIAR,
      subtype: FAMILIAR_SUBTYPES.BASICO,
      name: 'Plan Básico',
      start_date: '2024-02-01T00:00:00Z',
      renewal_date: '2025-02-01T00:00:00Z'
    },
    profile: {
      name: 'Carmen López',
      email: 'carmen.lopez@email.com',
      phone: '+51 9 3333 4444',
      dni: '11.222.333-4',
      address: 'Calle Los Jardines 555, San Borja',
      birth_date: '1990-07-08',
      emergency_contacts: [
        {
          name: 'Luis López',
          relationship: 'Hermano',
          phone: '+51 9 3333 5555'
        }
      ],
      medical_info: {
        blood_type: 'B+',
        allergies: ['Mariscos'],
        conditions: [],
        medications: [],
        insurance: 'SIS'
      }
    },
    service_usage: {
      current_period: {
        breakdown: {
          [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO', // 2 usadas
          [SERVICE_TYPES.URGENCIA]: { used: 1, limit: 3 },
          [SERVICE_TYPES.MEDICO_DOMICILIO]: { used: 2, limit: 4 },
          [SERVICE_TYPES.TRASLADO_PROGRAMADO]: { used: 0, limit: 1 },
          [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO' // 12 usadas
        }
      },
      reset_date: '2025-02-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 280,
      payment_method: 'credit_card',
      auto_renewal: true,
      additional_charges: 0
    }
  },

  // PLAN VIP USER
  {
    id: 'fam_vip_001',
    username: 'vip_user',
    password: 'vip123',
    role: 'FAMILIAR',
    plan: {
      type: PLAN_TYPES.FAMILIAR,
      subtype: FAMILIAR_SUBTYPES.VIP,
      name: 'Plan VIP',
      start_date: '2024-01-01T00:00:00Z',
      renewal_date: '2025-01-01T00:00:00Z'
    },
    profile: {
      name: 'Eduardo Silva',
      email: 'eduardo.silva@email.com',
      phone: '+51 9 7777 8888',
      dni: '16.555.777-8',
      address: 'Av. Salaverry 3000, Jesús María',
      birth_date: '1975-12-03',
      age: 48, // Para validar seguro (máximo 79 años)
      emergency_contacts: [
        {
          name: 'Patricia Silva',
          relationship: 'Esposa',
          phone: '+51 9 7777 9999'
        },
        {
          name: 'Dr. Ramirez',
          relationship: 'Médico de cabecera',
          phone: '+56 2 2345 6789'
        }
      ],
      medical_info: {
        blood_type: 'AB+',
        allergies: [],
        conditions: ['Diabetes Tipo 2'],
        medications: ['Metformina 850mg'],
        insurance: 'EsSalud'
      }
    },
    service_usage: {
      current_period: {
        breakdown: {
          [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO', // 3 usadas
          [SERVICE_TYPES.URGENCIA]: { used: 4, limit: 6 },
          [SERVICE_TYPES.MEDICO_DOMICILIO]: { used: 3, limit: 6 },
          [SERVICE_TYPES.TRASLADO_PROGRAMADO]: { used: 1, limit: 1 },
          [SERVICE_TYPES.ZONA_PROTEGIDA]: { used: 0, limit: 1 },
          [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO' // 15 usadas
        }
      },
      reset_date: '2025-01-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 410,
      payment_method: 'credit_card',
      auto_renewal: true,
      additional_charges: 0
    },
    benefits: {
      seguro_accidentes: {
        active: true,
        provider: 'Chubb',
        coverage: 215000, // 50 millones
        valid_until: '2025-01-01T00:00:00Z'
      }
    }
  },

  // PLAN DORADO USER
  {
    id: 'fam_dor_001',
    username: 'dorado_user',
    password: 'dorado123',
    role: 'FAMILIAR',
    plan: {
      type: PLAN_TYPES.FAMILIAR,
      subtype: FAMILIAR_SUBTYPES.DORADO,
      name: 'Plan Dorado',
      start_date: '2024-01-01T00:00:00Z',
      renewal_date: '2025-01-01T00:00:00Z'
    },
    profile: {
      name: 'Alejandra Vega',
      email: 'alejandra.vega@email.com',
      phone: '+51 9 9999 0000',
      dni: '18.999.000-1',
      address: 'Av. El Bosque 500, San Isidro',
      birth_date: '1980-04-25',
      age: 44,
      emergency_contacts: [
        {
          name: 'Fernando Vega',
          relationship: 'Esposo',
          phone: '+51 9 9999 1111'
        },
        {
          name: 'Isabel Mendoza',
          relationship: 'Madre',
          phone: '+51 9 8888 2222'
        }
      ],
      medical_info: {
        blood_type: 'O-',
        allergies: ['Látex'],
        conditions: [],
        medications: [],
        insurance: 'EsSalud'
      }
    },
    service_usage: {
      current_period: {
        breakdown: {
          [SERVICE_TYPES.EMERGENCIA]: 'ILIMITADO', // 1 usada
          [SERVICE_TYPES.URGENCIA]: { used: 2, limit: 10 },
          [SERVICE_TYPES.MEDICO_DOMICILIO]: { used: 5, limit: 10 },
          [SERVICE_TYPES.TRASLADO_PROGRAMADO]: { used: 0, limit: 1 },
          [SERVICE_TYPES.ZONA_PROTEGIDA]: { used: 1, limit: 2 },
          [SERVICE_TYPES.ORIENTACION_TELEFONICA]: 'ILIMITADO', // 8 usadas
          [SERVICE_TYPES.EXAMENES_LABORATORIO]: 'ILIMITADO' // 3 usados
        }
      },
      reset_date: '2025-01-01T00:00:00Z'
    },
    billing: {
      monthly_cost: 625,
      payment_method: 'credit_card',
      auto_renewal: true,
      additional_charges: 0
    },
    benefits: {
      seguro_accidentes: {
        active: true,
        provider: 'Chubb',
        coverage: 430000, // 100 millones
        valid_until: '2025-01-01T00:00:00Z'
      },
      examenes_laboratorio: {
        active: true,
        monthly_limit: 'ILIMITADO',
        last_exam: '2024-11-15T00:00:00Z'
      }
    },
    affiliates: [
      {
        id: 'aff_dor_001',
        name: 'Fernando Vega',
        dni: '18.999.001-8',
        phone: '+51 9 9999 1111',
        relationship: 'conyuge',
        birthDate: '1978-08-12',
        addedAt: '2024-01-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_dor_002',
        name: 'Camila Vega',
        dni: '77.888.999-2',
        phone: '+51 9 7777 1234',
        relationship: 'hijo',
        birthDate: '2008-03-18',
        addedAt: '2024-01-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_dor_003',
        name: 'Sebastián Vega',
        dni: '66.777.888-3',
        phone: '+51 9 6666 5678',
        relationship: 'hijo',
        birthDate: '2012-11-05',
        addedAt: '2024-01-01T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_dor_004',
        name: 'Isabel Mendoza',
        dni: '44.555.666-4',
        phone: '+51 9 8888 2222',
        relationship: 'madre',
        birthDate: '1955-02-14',
        addedAt: '2024-01-15T00:00:00.000Z',
        status: 'active'
      },
      {
        id: 'aff_dor_005',
        name: 'Ricardo Vega',
        dni: '33.444.555-5',
        phone: '+51 9 3333 9999',
        relationship: 'padre',
        birthDate: '1952-09-28',
        addedAt: '2024-01-15T00:00:00.000Z',
        status: 'active'
      }
    ],
    affiliatesCount: 5,
    medicalHistory: {
      titular: {
        patientInfo: {
          name: 'Alejandra Vega',
          relation: 'Titular'
        },
        records: [
          {
            id: 'med_dor_001_001',
            emergencyId: 'emg_dor_001',
            patientId: 'titular',
            date: '2024-12-20T14:30:00.000Z',
            medicalActions:
              'Evaluación inicial por crisis de ansiedad. Se realizó electrocardiograma para descartar problemas cardíacos. Aplicación de técnicas de relajación y respiración controlada.',
            medications: 'Alprazolam 0.5mg sublingual',
            recommendedMedications:
              'Alprazolam 0.25mg cada 12h por 3 días si persiste ansiedad. Consulta con psicólogo.',
            patientStatus: 'improved',
            additionalNotes:
              'Paciente refiere episodios de ansiedad por estrés laboral. Se recomienda seguimiento médico.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-12-20T15:15:00.000Z'
          },
          {
            id: 'med_dor_001_002',
            emergencyId: 'emg_dor_002',
            patientId: 'titular',
            date: '2024-12-15T09:45:00.000Z',
            medicalActions:
              'Atención por dolor abdominal agudo. Examen físico completo, toma de signos vitales. Sospecha de gastritis aguda.',
            medications: 'Omeprazol 40mg IV, Butilhioscina 20mg IM',
            recommendedMedications: 'Omeprazol 40mg cada 24h por 7 días. Dieta blanda por 3 días.',
            patientStatus: 'stable',
            additionalNotes:
              'Paciente mejoró significativamente tras medicación. Se sugiere evaluación gastroenterológica.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-12-15T10:30:00.000Z'
          },
          {
            id: 'med_dor_001_003',
            emergencyId: 'emg_dor_008',
            patientId: 'titular',
            date: '2024-12-10T16:20:00.000Z',
            medicalActions:
              'Consulta domiciliaria por control post-tratamiento gastritis. Evaluación de síntomas, tolerancia a medicación.',
            medications: 'Ninguno administrado en consulta',
            recommendedMedications:
              'Continuar con Omeprazol 20mg cada 24h por 10 días más. Probióticos.',
            patientStatus: 'improved',
            additionalNotes:
              'Paciente presenta mejoría significativa. Tolera bien la medicación. Control en 2 semanas.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-12-10T16:45:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Alprazolam',
            dose: '0.25mg',
            frequency: 'cada 12h',
            duration: '3 días',
            prescribed: '2024-12-20',
            status: 'completed'
          },
          {
            name: 'Omeprazol',
            dose: '20mg',
            frequency: 'cada 24h',
            duration: '10 días',
            prescribed: '2024-12-10',
            status: 'active'
          },
          {
            name: 'Probióticos',
            dose: '1 cápsula',
            frequency: 'cada 12h',
            duration: '15 días',
            prescribed: '2024-12-10',
            status: 'active'
          }
        ]
      },
      aff_dor_001: {
        patientInfo: {
          name: 'Fernando Vega',
          relation: 'Cónyuge'
        },
        records: [
          {
            id: 'med_dor_002_001',
            emergencyId: 'emg_dor_003',
            patientId: 'aff_dor_001',
            date: '2024-09-22T16:20:00.000Z',
            medicalActions:
              'Atención por lesión en rodilla derecha tras caída. Evaluación ortopédica, radiografía para descartar fractura. Inmovilización temporal.',
            medications: 'Ketorolaco 30mg IM, Vendaje elástico',
            recommendedMedications:
              'Ibuprofeno 600mg cada 8h por 5 días. Reposo relativo, hielo local.',
            patientStatus: 'stable',
            additionalNotes:
              'No se observa fractura en radiografía. Esguince grado II. Control en 5 días.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-09-22T17:00:00.000Z'
          },
          {
            id: 'med_dor_002_002',
            emergencyId: 'emg_dor_009',
            patientId: 'aff_dor_001',
            date: '2024-12-12T10:30:00.000Z',
            medicalActions:
              'Control post-lesión rodilla. Evaluación de movilidad, dolor residual. Examen físico ortopédico completo.',
            medications: 'Ninguno administrado',
            recommendedMedications:
              'Fisioterapia 3 veces por semana. Sulfato de glucosamina 500mg cada 12h.',
            patientStatus: 'improved',
            additionalNotes:
              'Paciente presenta buena evolución. Movilidad casi completa recuperada. Continuar con ejercicios.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-12-12T11:00:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Ibuprofeno',
            dose: '600mg',
            frequency: 'cada 8h',
            duration: '5 días',
            prescribed: '2024-09-22',
            status: 'completed'
          },
          {
            name: 'Sulfato de glucosamina',
            dose: '500mg',
            frequency: 'cada 12h',
            duration: '30 días',
            prescribed: '2024-12-12',
            status: 'active'
          }
        ]
      },
      aff_dor_002: {
        patientInfo: {
          name: 'Camila Vega',
          relation: 'Hija'
        },
        records: [
          {
            id: 'med_dor_003_001',
            emergencyId: 'emg_dor_004',
            patientId: 'aff_dor_002',
            date: '2024-12-18T11:15:00.000Z',
            medicalActions:
              'Consulta por fiebre alta y dolor de garganta. Examen físico pediátrico, evaluación de amígdalas. Probable faringoamigdalitis viral.',
            medications: 'Paracetamol 250mg, Solución salina para gárgaras',
            recommendedMedications:
              'Paracetamol 250mg cada 6h por fiebre. Abundantes líquidos, reposo.',
            patientStatus: 'improved',
            additionalNotes:
              'Paciente menor presenta mejoría tras medicación. Control si persiste fiebre por más de 3 días.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-12-18T11:45:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Paracetamol',
            dose: '250mg',
            frequency: 'cada 6h',
            duration: 'según fiebre',
            prescribed: '2024-12-18',
            status: 'active'
          }
        ]
      },
      aff_dor_003: {
        patientInfo: {
          name: 'Sebastián Vega',
          relation: 'Hijo'
        },
        records: [
          {
            id: 'med_dor_004_001',
            emergencyId: 'emg_dor_005',
            patientId: 'aff_dor_003',
            date: '2024-10-28T13:30:00.000Z',
            medicalActions:
              'Atención por crisis asmática leve. Evaluación respiratoria, saturación de oxígeno. Nebulización con broncodilatador.',
            medications: 'Salbutamol nebulización 2.5mg, Prednisolona 15mg oral',
            recommendedMedications:
              'Salbutamol inhalador 2 puff cada 6h por 3 días. Control con pediatra.',
            patientStatus: 'improved',
            additionalNotes:
              'Paciente con antecedente de asma bronquial. Crisis desencadenada por ejercicio físico intenso.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-10-28T14:00:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Salbutamol',
            dose: '2 puff',
            frequency: 'cada 6h',
            duration: '3 días',
            prescribed: '2024-10-28',
            status: 'completed'
          }
        ]
      },
      aff_dor_004: {
        patientInfo: {
          name: 'Isabel Mendoza',
          relation: 'Madre'
        },
        records: [
          {
            id: 'med_dor_005_001',
            emergencyId: 'emg_dor_006',
            patientId: 'aff_dor_004',
            date: '2024-11-12T08:45:00.000Z',
            medicalActions:
              'Consulta por hipertensión arterial descompensada. Toma de presión arterial múltiple, evaluación cardiovascular. TA: 180/110 mmHg.',
            medications: 'Captopril 25mg sublingual, Furosemida 40mg oral',
            recommendedMedications:
              'Amlodipino 5mg cada 24h. Control médico en 48h. Dieta hiposódica.',
            patientStatus: 'stable',
            additionalNotes:
              'Paciente adulta mayor con HTA crónica mal controlada. Requiere ajuste de medicación antihipertensiva.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-11-12T09:30:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Amlodipino',
            dose: '5mg',
            frequency: 'cada 24h',
            duration: 'permanente',
            prescribed: '2024-11-12',
            status: 'active'
          }
        ]
      },
      aff_dor_005: {
        patientInfo: {
          name: 'Ricardo Vega',
          relation: 'Padre'
        },
        records: [
          {
            id: 'med_dor_006_001',
            emergencyId: 'emg_dor_007',
            patientId: 'aff_dor_005',
            date: '2024-09-15T19:20:00.000Z',
            medicalActions:
              'Atención por dolor torácico. Electrocardiograma de 12 derivaciones, evaluación cardiológica completa. Descartado síndrome coronario agudo.',
            medications: 'Nitroglicerina sublingual, Aspirina 100mg',
            recommendedMedications:
              'Aspirina 100mg cada 24h. Evaluación cardiológica ambulatoria urgente.',
            patientStatus: 'stable',
            additionalNotes:
              'Dolor torácico de características no anginosas. ECG normal. Se recomienda seguimiento cardiológico por antecedentes familiares.',
            attendedBy: 'Dr. Carlos Mendoza',
            attendedById: 'amb_001',
            completedAt: '2024-09-15T20:15:00.000Z'
          }
        ],
        medications: [
          {
            name: 'Aspirina',
            dose: '100mg',
            frequency: 'cada 24h',
            duration: 'permanente',
            prescribed: '2024-09-15',
            status: 'active'
          }
        ]
      }
    }
  }
]

// Función helper para obtener usuario por username
export const getFamiliarUser = (username) => {
  return FAMILIAR_USERS.find((user) => user.username === username)
}

// Función helper para obtener usuarios por plan
export const getUsersByPlan = (planSubtype) => {
  return FAMILIAR_USERS.filter((user) => user.plan.subtype === planSubtype)
}
