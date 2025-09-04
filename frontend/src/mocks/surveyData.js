/**
 * Datos mock para encuestas de satisfacción
 */
export const MOCK_SURVEY_RESPONSES = [
  {
    id: 1,
    userId: 'user-001',
    userName: 'Juan Pérez',
    userPlan: 'premium',
    date: new Date('2024-01-15T10:30:00'),
    rating: 5,
    improvementArea: 'Tiempo de respuesta',
    comments: 'Excelente servicio, muy rápida la atención',
    serviceType: 'emergency',
    completed: true
  },
  {
    id: 2,
    userId: 'user-002',
    userName: 'María García',
    userPlan: 'basic',
    date: new Date('2024-01-14T14:20:00'),
    rating: 4,
    improvementArea: 'Facilidad de uso',
    comments: 'La app podría ser más intuitiva',
    serviceType: 'medical_visit',
    completed: true
  },
  {
    id: 3,
    userId: 'user-003',
    userName: 'Carlos López',
    userPlan: 'corporate',
    date: new Date('2024-01-13T09:15:00'),
    rating: 5,
    improvementArea: 'Cobertura',
    comments: 'Necesitan más cobertura en zonas rurales',
    serviceType: 'telemedicine',
    completed: true
  },
  {
    id: 4,
    userId: 'user-004',
    userName: 'Ana Martínez',
    userPlan: 'premium',
    date: new Date('2024-01-12T16:45:00'),
    rating: 3,
    improvementArea: 'Atención del personal',
    comments: 'El personal podría ser más amable',
    serviceType: 'emergency',
    completed: true
  },
  {
    id: 5,
    userId: 'user-005',
    userName: 'Pedro Rodríguez',
    userPlan: 'basic',
    date: new Date('2024-01-11T11:00:00'),
    rating: 4,
    improvementArea: 'Precios',
    comments: 'Los precios son un poco elevados para el plan básico',
    serviceType: 'medical_visit',
    completed: true
  },
  {
    id: 6,
    userId: 'user-006',
    userName: 'Laura Sánchez',
    userPlan: 'corporate',
    date: new Date('2024-01-10T13:30:00'),
    rating: 5,
    improvementArea: 'Comunicación',
    comments: 'Todo perfecto, excelente comunicación',
    serviceType: 'emergency',
    completed: true
  },
  {
    id: 7,
    userId: 'user-007',
    userName: 'Diego Fernández',
    userPlan: 'premium',
    date: new Date('2024-01-09T08:20:00'),
    rating: 4,
    improvementArea: 'Tiempo de respuesta',
    comments: 'Podrían mejorar los tiempos de espera',
    serviceType: 'telemedicine',
    completed: true
  },
  {
    id: 8,
    userId: 'user-008',
    userName: 'Sofía González',
    userPlan: 'basic',
    date: new Date('2024-01-08T17:10:00'),
    rating: 2,
    improvementArea: 'Atención del personal',
    comments: 'Mala experiencia con el servicio de atención',
    serviceType: 'medical_visit',
    completed: true
  },
  {
    id: 9,
    userId: 'user-009',
    userName: 'Roberto Díaz',
    userPlan: 'corporate',
    date: new Date('2024-01-07T12:00:00'),
    rating: 5,
    improvementArea: 'Facilidad de uso',
    comments: 'Muy fácil de usar, interfaz intuitiva',
    serviceType: 'emergency',
    completed: true
  },
  {
    id: 10,
    userId: 'user-010',
    userName: 'Isabel Morales',
    userPlan: 'premium',
    date: new Date('2024-01-06T15:40:00'),
    rating: 4,
    improvementArea: 'Cobertura',
    comments: 'Buen servicio pero falta cobertura en mi zona',
    serviceType: 'telemedicine',
    completed: true
  }
]

/**
 * Preguntas de encuesta por defecto
 */
export const DEFAULT_SURVEY_QUESTIONS = [
  {
    id: 1,
    text: '¿Cómo calificarías la calidad del servicio recibido?',
    type: 'rating',
    required: true,
    options: ['1', '2', '3', '4', '5'],
    order: 1
  },
  {
    id: 2,
    text: '¿Qué aspecto consideras más importante mejorar?',
    type: 'select',
    required: true,
    options: [
      'Tiempo de respuesta',
      'Atención del personal',
      'Facilidad de uso de la app',
      'Comunicación durante el servicio',
      'Cobertura geográfica',
      'Precios y planes'
    ],
    order: 2
  },
  {
    id: 3,
    text: '¿Recomendarías nuestro servicio a familiares o amigos?',
    type: 'rating',
    required: true,
    options: ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
    order: 3
  },
  {
    id: 4,
    text: 'Comentarios y sugerencias para mejorar',
    type: 'text',
    required: false,
    maxLength: 500,
    order: 4
  }
]

/**
 * Estadísticas de encuestas
 */
export const SURVEY_STATS = {
  totalSent: 1250,
  totalCompleted: 1180,
  completionRate: 94.4,
  averageRating: 4.2,
  npsScore: 45,
  monthlyTrend: [
    { month: 'Ene', responses: 95, rating: 4.1 },
    { month: 'Feb', responses: 110, rating: 4.3 },
    { month: 'Mar', responses: 120, rating: 4.2 },
    { month: 'Abr', responses: 105, rating: 4.4 },
    { month: 'May', responses: 115, rating: 4.3 },
    { month: 'Jun', responses: 125, rating: 4.5 }
  ],
  ratingDistribution: {
    '5': 45,
    '4': 30,
    '3': 15,
    '2': 7,
    '1': 3
  },
  improvementAreas: {
    'Tiempo de respuesta': 35,
    'Atención del personal': 25,
    'Facilidad de uso': 20,
    'Cobertura': 10,
    'Precios': 7,
    'Comunicación': 3
  }
}