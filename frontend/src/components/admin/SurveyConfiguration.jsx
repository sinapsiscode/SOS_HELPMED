import React, { useState } from 'react'
import Swal from 'sweetalert2'

const SurveyConfiguration = () => {
  const [editMode, setEditMode] = useState(false)
  
  // Las 5 preguntas de la encuesta
  const [questions, setQuestions] = useState([
    {
      id: 1,
      text: '¿Qué tan satisfecho está con la rapidez de nuestro servicio?',
      category: 'tiempo',
      categoryLabel: 'Tiempo',
      active: true,
      icon: '💙'
    },
    {
      id: 2,
      text: '¿Cómo calificaría la profesionalidad de nuestro personal?',
      category: 'personal',
      categoryLabel: 'Personal',
      active: true,
      icon: '💙'
    },
    {
      id: 3,
      text: '¿Qué tan satisfecho está con la calidad de la atención médica recibida?',
      category: 'calidad',
      categoryLabel: 'Calidad',
      active: true,
      icon: '💙'
    },
    {
      id: 4,
      text: '¿Cómo calificaría la comunicación durante el servicio?',
      category: 'comunicacion',
      categoryLabel: 'Comunicación',
      active: true,
      icon: '💙'
    },
    {
      id: 5,
      text: '¿Recomendaría nuestros servicios a familiares y amigos?',
      category: 'recomendacion',
      categoryLabel: 'Recomendación',
      active: true,
      icon: '⭐'
    }
  ])

  const handleEditQuestions = () => {
    Swal.fire({
      title: 'Editar Preguntas',
      html: `
        <div class="text-left space-y-4">
          ${questions.map(q => `
            <div class="border rounded-lg p-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pregunta ${q.id}</label>
              <textarea 
                id="question-${q.id}" 
                class="w-full px-3 py-2 border rounded-lg text-sm" 
                rows="2"
                placeholder="${q.text}"
              >${q.text}</textarea>
              <div class="flex items-center justify-between mt-3">
                <select id="category-${q.id}" class="text-sm border rounded px-2 py-1">
                  <option value="tiempo" ${q.category === 'tiempo' ? 'selected' : ''}>Tiempo</option>
                  <option value="personal" ${q.category === 'personal' ? 'selected' : ''}>Personal</option>
                  <option value="calidad" ${q.category === 'calidad' ? 'selected' : ''}>Calidad</option>
                  <option value="comunicacion" ${q.category === 'comunicacion' ? 'selected' : ''}>Comunicación</option>
                  <option value="recomendacion" ${q.category === 'recomendacion' ? 'selected' : ''}>Recomendación</option>
                </select>
                <div class="flex items-center gap-2">
                  <input type="checkbox" id="active-${q.id}" ${q.active ? 'checked' : ''}>
                  <label for="active-${q.id}" class="text-sm">Activa</label>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      `,
      width: '700px',
      showCancelButton: true,
      confirmButtonText: 'Guardar Cambios',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3b82f6',
      preConfirm: () => {
        const updatedQuestions = questions.map(q => ({
          ...q,
          text: document.getElementById(`question-${q.id}`).value,
          category: document.getElementById(`category-${q.id}`).value,
          active: document.getElementById(`active-${q.id}`).checked
        }))
        return updatedQuestions
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setQuestions(result.value)
        Swal.fire({
          icon: 'success',
          title: 'Cambios Guardados',
          text: 'Las preguntas han sido actualizadas exitosamente',
          timer: 2000,
          showConfirmButton: false
        })
      }
    })
  }

  const getCategoryColor = (category) => {
    const colors = {
      'tiempo': 'bg-blue-100 text-blue-700',
      'personal': 'bg-purple-100 text-purple-700',
      'calidad': 'bg-green-100 text-green-700',
      'comunicacion': 'bg-orange-100 text-orange-700',
      'recomendacion': 'bg-yellow-100 text-yellow-700'
    }
    return colors[category] || 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="space-y-6">
      {/* Sección Configurar Preguntas */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Configurar Preguntas de Encuesta
            </h3>
            <p className="text-sm text-gray-600">
              Personaliza las 5 preguntas de satisfacción del cliente
            </p>
          </div>
          <button
            onClick={handleEditQuestions}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
          >
            <i className="fas fa-edit"></i>
            Editar Preguntas
          </button>
        </div>

        {/* Lista de Preguntas */}
        <div className="space-y-3">
          {questions.map((question, index) => (
            <div key={question.id} className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-center w-8 h-8 bg-white rounded-full border-2 border-blue-200 text-sm font-semibold text-blue-600">
                {index + 1}
              </div>
              <div className="flex-1">
                <div className="flex items-start gap-2">
                  <span className="text-lg">{question.icon}</span>
                  <div className="flex-1">
                    <p className="text-sm text-gray-700 mb-2">
                      {question.text}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-1 text-xs rounded-full font-medium ${getCategoryColor(question.category)}`}>
                        {question.categoryLabel}
                      </span>
                      {question.active && (
                        <span className="px-2 py-1 text-xs rounded-full font-medium bg-green-100 text-green-700">
                          Activa
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Vista Previa de la Encuesta */}
      <div className="bg-white rounded-xl shadow-sm p-6">
        <div className="mb-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Vista Previa de la Encuesta
          </h3>
          <div className="flex items-center justify-center mb-4">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <i className="fas fa-clipboard-check text-blue-600 text-2xl"></i>
            </div>
          </div>
          <div className="text-center mb-6">
            <h4 className="text-xl font-bold text-gray-800">Encuesta de Satisfacción</h4>
            <p className="text-sm text-gray-600 mt-1">Así verán los usuarios la encuesta</p>
          </div>
        </div>

        {/* Preguntas con estrellas */}
        <div className="space-y-4 max-w-2xl mx-auto">
          {questions.filter(q => q.active).map((question, index) => (
            <div key={question.id} className="border-b pb-4 last:border-0">
              <div className="flex items-start gap-3 mb-3">
                <span className="text-sm font-semibold text-gray-600">
                  {index + 1}.
                </span>
                <p className="text-sm text-gray-700 flex-1">
                  {question.text}
                </p>
              </div>
              <div className="flex items-center gap-2 ml-6">
                {[1, 2, 3, 4, 5].map(star => (
                  <button
                    key={star}
                    className="text-gray-300 hover:text-yellow-400 transition-colors"
                    disabled
                  >
                    <i className="fas fa-star text-xl"></i>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Botón de enviar (deshabilitado) */}
        <div className="flex justify-center mt-6">
          <button
            className="px-6 py-2 bg-gray-300 text-gray-500 rounded-lg font-medium cursor-not-allowed"
            disabled
          >
            Enviar Encuesta
          </button>
        </div>
      </div>
    </div>
  )
}

export default SurveyConfiguration