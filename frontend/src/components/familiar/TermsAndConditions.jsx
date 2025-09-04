import { useState } from 'react'

const TermsAndConditions = ({ planType, onAccept, onDecline }) => {
  const [hasRead, setHasRead] = useState(false)
  const [scrolledToBottom, setScrolledToBottom] = useState(false)

  const handleScroll = (e) => {
    const element = e.target
    const isAtBottom = element.scrollHeight - element.scrollTop <= element.clientHeight + 10
    if (isAtBottom) {
      setScrolledToBottom(true)
    }
  }

  const termsContent = {
    FAMILIAR: {
      title: 'Términos y Condiciones - Plan Familiar HelpMED',
      sections: [
        {
          title: '1. CLASIFICACIÓN DE SERVICIOS',
          content: `Los servicios médicos se clasifican en:
          
          • EMERGENCIA: Situación crítica que pone en riesgo la vida del paciente y requiere atención inmediata.
          • URGENCIA: Condición médica que requiere atención pronta pero no representa riesgo vital inmediato.
          • MÉDICO A DOMICILIO: Consulta médica programada en el domicilio del afiliado.
          
          La clasificación final del servicio será determinada por el personal médico de la ambulancia según la evaluación clínica del paciente.`
        },
        {
          title: '2. USO CORRECTO DE EMERGENCIAS',
          content: `Las emergencias ilimitadas están destinadas EXCLUSIVAMENTE para situaciones que comprometan la vida del paciente, tales como:
          
          • Pérdida de conocimiento
          • Dificultad respiratoria severa
          • Dolor torácico con signos de infarto
          • Hemorragias severas
          • Traumatismos graves
          • Convulsiones
          • Intoxicaciones graves
          
          El uso indebido del servicio de emergencia puede resultar en la reclasificación del servicio.`
        },
        {
          title: '3. RECLASIFICACIÓN DE SERVICIOS',
          content: `HelpMED se reserva el derecho de reclasificar el tipo de servicio solicitado:
          
          • Si al llegar la ambulancia, el personal médico determina que la situación NO constituye una emergencia real, el servicio será reclasificado como URGENCIA o MÉDICO A DOMICILIO según corresponda.
          
          • La reclasificación se realizará basándose en criterios médicos objetivos y protocolos internacionales de triaje.
          
          • En caso de reclasificación, se descontará del límite correspondiente al tipo de servicio reclasificado.`
        },
        {
          title: '4. CONSECUENCIAS DEL MAL USO',
          content: `El uso reiterado e indebido del servicio de emergencias puede resultar en:
          
          • Advertencia formal al titular del plan
          • Revisión de los términos del contrato
          • Aplicación de cargos adicionales por servicios mal clasificados
          • En casos graves, suspensión temporal o cancelación del servicio
          
          Se considera mal uso: solicitar ambulancia de emergencia para situaciones no urgentes como controles médicos, resfriados comunes, dolores leves, etc.`
        },
        {
          title: '5. ACEPTACIÓN DE TÉRMINOS',
          content: `Al aceptar estos términos, el afiliado reconoce que:
          
          • Ha leído y comprendido la clasificación de servicios
          • Utilizará el servicio de emergencias de manera responsable
          • Acepta la reclasificación de servicios según criterio médico
          • Comprende las consecuencias del mal uso del servicio
          
          HelpMED se compromete a brindar atención médica de calidad, priorizando siempre las verdaderas emergencias para salvar vidas.`
        }
      ]
    }
  }

  const terms = termsContent[planType] || termsContent.FAMILIAR

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{terms.title}</h2>
          <p className="text-sm text-gray-600 mt-2">
            Por favor, lea cuidadosamente estos términos antes de continuar con su suscripción
          </p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6" onScroll={handleScroll}>
          {terms.sections.map((section, index) => (
            <div key={index} className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-800">{section.title}</h3>
              <div className="text-gray-600 whitespace-pre-line text-sm leading-relaxed">
                {section.content}
              </div>
            </div>
          ))}

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-start space-x-3">
              <i className="fas fa-exclamation-triangle text-yellow-600 mt-1"></i>
              <div>
                <h4 className="font-semibold text-yellow-800">Importante</h4>
                <p className="text-sm text-yellow-700 mt-1">
                  El personal médico de la ambulancia tiene la autoridad final para determinar el
                  tipo de servicio según la evaluación clínica del paciente. Esta decisión se basa
                  en protocolos médicos establecidos y busca garantizar el uso adecuado de los
                  recursos de emergencia.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 border-t bg-gray-50">
          <div className="flex items-center justify-between mb-4">
            <label className="flex items-center space-x-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasRead}
                onChange={(e) => setHasRead(e.target.checked)}
                className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
                disabled={!scrolledToBottom}
              />
              <span className={`text-sm ${scrolledToBottom ? 'text-gray-700' : 'text-gray-400'}`}>
                He leído y acepto los términos y condiciones
              </span>
            </label>
            {!scrolledToBottom && (
              <span className="text-xs text-gray-500">
                <i className="fas fa-arrow-down mr-1"></i>
                Desplace hasta el final para continuar
              </span>
            )}
          </div>

          <div className="flex space-x-3">
            <button
              onClick={onDecline}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={onAccept}
              disabled={!hasRead || !scrolledToBottom}
              className={`flex-1 px-4 py-3 rounded-lg font-medium transition-colors ${
                hasRead && scrolledToBottom
                  ? 'bg-blue-600 text-white hover:bg-blue-700'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
            >
              Aceptar y Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsAndConditions
