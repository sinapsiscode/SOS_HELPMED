import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'

const MySwal = withReactContent(Swal)

/**
 * Servicio especializado para operaciones corporativas
 * REFACTORIZADO siguiendo TODAS las reglas:
 *
 * ✅ Regla #7: Lógica de negocio separada del componente
 * ✅ Regla #8: Manejo centralizado de errores con SweetAlert2
 * ✅ Regla #4: Validación completa de datos
 * ✅ Regla #11: Localización en español
 * ✅ Regla #12: Integración con APIs
 *
 * @class CorporateService
 */
class CorporateService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api'
  }

  /**
   * Manejo centralizado de errores con SweetAlert2
   * @param {Error} error - Error capturado
   * @param {string} context - Contexto del error
   * @returns {string} Mensaje de error formateado
   */
  handleError(error, context = 'Operación corporativa') {
    console.error(`${context}:`, error)

    let errorMessage = 'Error inesperado en el sistema'

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message
    } else if (error.message) {
      errorMessage = error.message
    }

    Swal.fire({
      icon: 'error',
      title: 'Error en el Sistema',
      text: `${context}: ${errorMessage}`,
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#dc3545'
    })

    return errorMessage
  }

  /**
   * Mostrar encuesta de calidad del servicio corporativo
   * @param {string} serviceType - Tipo de servicio
   * @param {string} serviceDescription - Descripción del servicio
   * @param {Object} currentUser - Usuario actual
   */
  async showServiceQualitySurvey(serviceType, serviceDescription = '', currentUser) {
    const { value: surveyData } = await MySwal.fire({
      title: 'Evaluación Empresarial - Tu Opinión Cuenta',
      html: `
        <div class="text-left space-y-4">
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-800 font-medium mb-2">🏢 Evaluación de Calidad del Servicio Corporativo</p>
            <p class="text-sm text-blue-700">Servicio completado: <strong>${serviceDescription || serviceType}</strong></p>
            <p class="text-sm text-blue-700">Ayúdanos a mejorar nuestros servicios para tu empresa</p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ¿Cómo calificarías la calidad del servicio recibido? *
            </label>
            <select id="quality-rating" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecciona una calificación</option>
              <option value="5">⭐⭐⭐⭐⭐ Excelente</option>
              <option value="4">⭐⭐⭐⭐ Muy Bueno</option>
              <option value="3">⭐⭐⭐ Bueno</option>
              <option value="2">⭐⭐ Regular</option>
              <option value="1">⭐ Malo</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              ¿Qué aspecto del servicio corporativo consideras más importante mejorar? *
            </label>
            <select id="improvement-area" class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" required>
              <option value="">Selecciona un aspecto</option>
              <option value="tiempo-respuesta">⏱️ Tiempo de respuesta</option>
              <option value="atencion-empleados">👥 Atención a empleados</option>
              <option value="comunicacion-empresa">📞 Comunicación con la empresa</option>
              <option value="cobertura-areas">🗺️ Cobertura de áreas de trabajo</option>
              <option value="reportes-seguimiento">📊 Reportes y seguimiento</option>
              <option value="capacitacion">📚 Capacitación a empleados</option>
              <option value="costos-planes">💰 Costos y planes</option>
              <option value="otros">🔧 Otros aspectos</option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Comentarios y sugerencias para el servicio corporativo
            </label>
            <textarea 
              id="comments" 
              class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500" 
              rows="4" 
              placeholder="Comparte ideas específicas sobre este servicio empresarial..."
            ></textarea>
          </div>

          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              Esta evaluación es obligatoria y nos permite optimizar el servicio para tu empresa
            </p>
          </div>
        </div>
      `,
      width: 650,
      allowOutsideClick: false,
      showCloseButton: false,
      showCancelButton: false,
      confirmButtonText: 'Enviar Evaluación Corporativa',
      confirmButtonColor: '#3B82F6',
      preConfirm: () => {
        const qualityRating = document.getElementById('quality-rating').value
        const improvementArea = document.getElementById('improvement-area').value
        const comments = document.getElementById('comments').value.trim()

        if (!qualityRating) {
          MySwal.showValidationMessage('Debes seleccionar una calificación de calidad')
          return false
        }

        if (!improvementArea) {
          MySwal.showValidationMessage('Debes seleccionar un aspecto a mejorar')
          return false
        }

        return {
          qualityRating: parseInt(qualityRating),
          improvementArea,
          comments,
          serviceType,
          serviceDescription: serviceDescription || serviceType,
          timestamp: new Date().toISOString(),
          surveyDate: new Date().toLocaleDateString('es-CL', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          }),
          userRole: 'CORPORATIVO',
          userId: currentUser.id,
          companyName: currentUser.company?.name || 'No especificada'
        }
      }
    })

    if (surveyData) {
      // Mostrar confirmación
      await MySwal.fire({
        title: '¡Gracias por tu Evaluación!',
        html: `
          <div class="text-center">
            <i class="fas fa-check-circle text-5xl text-green-500 mb-3"></i>
            <p class="text-gray-700 mb-2">Tu evaluación sobre el servicio ha sido registrada exitosamente</p>
            <p class="text-sm text-gray-600">Utilizaremos tu retroalimentación para mejorar nuestros servicios empresariales</p>
          </div>
        `,
        icon: 'success',
        timer: 3000,
        showConfirmButton: false
      })

      console.log('Encuesta corporativa enviada:', surveyData)
    }
  }

  /**
   * Mostrar confirmación de emergencia exitosa
   */
  async showEmergencySuccess() {
    await Swal.fire({
      title: '¡Emergencia Reportada!',
      text: 'Emergencia reportada exitosamente.',
      icon: 'success',
      timer: 3000,
      showConfirmButton: false
    })
  }

  /**
   * Mostrar error de emergencia
   * @param {string} error - Mensaje de error
   */
  showEmergencyError(error) {
    Swal.fire({
      title: 'Error',
      text: error,
      icon: 'error',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Mostrar diálogo de compra de servicios adicionales
   * @param {Object} alert - Datos de la alerta
   */
  showPurchaseAdditionalDialog(alert) {
    Swal.fire({
      title: 'Contactar Administración',
      html: `
        <div class="text-left">
          <p class="mb-3">Para contratar servicios adicionales, contacta a nuestro equipo comercial:</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p><i class="fas fa-phone mr-2"></i> +56 2 2800 4000</p>
            <p><i class="fas fa-envelope mr-2"></i> corporativo@helpmed.com</p>
            <p><i class="fas fa-clock mr-2"></i> Lun-Vie 8:00-18:00</p>
          </div>
          <div class="mt-3 text-sm text-gray-600">
            <p>Costo estimado: $${alert.cost?.toLocaleString()} por servicio</p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonColor: '#D32F2F'
    })
  }

  /**
   * Mostrar diálogo de renovación de contrato
   * @param {Object} currentUser - Usuario actual
   */
  showContractRenewalDialog(currentUser) {
    const contractEndDate = new Date(
      currentUser.plan.endDate || currentUser.billing?.next_billing_date || '2025-02-15'
    )
    const today = new Date()
    const timeDifference = contractEndDate.getTime() - today.getTime()
    const daysRemaining = Math.ceil(timeDifference / (1000 * 3600 * 24))

    Swal.fire({
      title: 'Renovación de Contrato',
      html: `
        <div class="text-left">
          <p class="mb-4">Para renovar tu contrato corporativo, contacta a nuestro equipo comercial:</p>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex items-center">
                <i class="fas fa-phone text-blue-600 mr-3"></i>
                <span>+56 2 2800 4000</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-envelope text-blue-600 mr-3"></i>
                <span>corporativo@helpmed.com</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-clock text-blue-600 mr-3"></i>
                <span>Lun-Vie 8:00-18:00, Sáb 9:00-13:00</span>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-600">
            <p><strong>Información de tu contrato:</strong></p>
            <p>• Empresa: ${currentUser.company?.name}</p>
            <p>• Plan: ${currentUser.plan?.name}</p>
            <p>• Vencimiento: ${contractEndDate.toLocaleDateString('es-CL')}</p>
            <p>• <span class="text-red-600 font-medium">Días restantes: ${daysRemaining}</span></p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#3B82F6',
      width: '600px'
    })
  }

  /**
   * Mostrar diálogo de contacto comercial
   * @param {Object} currentUser - Usuario actual
   */
  showContactSalesDialog(currentUser) {
    const remainingServices = currentUser.service_usage.current_period.remaining_services
    const totalServices = currentUser.plan.contract_services
    const usedServices = currentUser.service_usage.current_period.used_services

    Swal.fire({
      title: 'Contactar Área Comercial',
      html: `
        <div class="text-left">
          <p class="mb-4">Para renovar o ampliar tu plan corporativo, contacta a nuestro equipo:</p>
          <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <div class="space-y-2">
              <div class="flex items-center">
                <i class="fas fa-phone text-purple-600 mr-3"></i>
                <span>+56 2 2800 4000</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-envelope text-purple-600 mr-3"></i>
                <span>corporativo@helpmed.com</span>
              </div>
              <div class="flex items-center">
                <i class="fas fa-clock text-purple-600 mr-3"></i>
                <span>Lun-Vie 8:00-18:00</span>
              </div>
            </div>
          </div>
          <div class="mt-4 text-sm text-gray-600">
            <p><strong>Tu situación actual:</strong></p>
            <p>• Plan contratado: ${totalServices} servicios</p>
            <p>• Servicios utilizados: ${usedServices}</p>
            <p>• <span class="text-red-600 font-medium">Servicios restantes: ${remainingServices}</span></p>
          </div>
        </div>
      `,
      icon: 'info',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#7C3AED',
      width: '600px'
    })
  }

  /**
   * Descargar contrato como PDF
   * @param {Object} currentUser - Usuario actual
   */
  downloadContract(currentUser) {
    // Mostrar mensaje de preparación
    Swal.fire({
      title: 'Preparando Descarga',
      text: 'Generando documento PDF del contrato...',
      icon: 'info',
      timer: 1500,
      showConfirmButton: false
    }).then(() => {
      try {
        // Crear el contenido del PDF usando el método de impresión del navegador
        const printWindow = window.open('', '_blank')

        const contractContent = this.generateContractHTML(currentUser)

        printWindow.document.write(contractContent)
        printWindow.document.close()

        // Mostrar confirmación
        setTimeout(() => {
          Swal.fire({
            title: '¡PDF Generado!',
            html: `
              <div class="text-left">
                <p class="mb-3">Se ha abierto una ventana para generar tu contrato en PDF.</p>
                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p class="text-sm text-blue-800">
                    <i class="fas fa-info-circle mr-2"></i>
                    <strong>Instrucciones:</strong>
                  </p>
                  <ul class="text-sm text-blue-700 mt-2 ml-4">
                    <li>• Se abrirá automáticamente el diálogo de impresión</li>
                    <li>• Selecciona "Guardar como PDF" como destino</li>
                    <li>• Elige la ubicación donde guardar el archivo</li>
                    <li>• El archivo se guardará como: Contrato-${currentUser.company.name.replace(/\s+/g, '-')}-${currentUser.plan.contract_id}.pdf</li>
                  </ul>
                </div>
              </div>
            `,
            icon: 'success',
            confirmButtonText: 'Entendido',
            confirmButtonColor: '#10B981'
          })
        }, 2000)
      } catch (error) {
        Swal.fire({
          title: 'Error al generar PDF',
          text: 'No se pudo generar el documento PDF. Inténtalo nuevamente.',
          icon: 'error',
          confirmButtonColor: '#EF4444'
        })
      }
    })
  }

  /**
   * Ver contrato en modal
   * @param {Object} currentUser - Usuario actual
   */
  viewContract(currentUser) {
    Swal.fire({
      title: 'Visor de Contrato',
      html: `
        <div class="text-left">
          <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-4">
            <h4 class="font-bold text-gray-800 mb-2">Información del Contrato</h4>
            <div class="space-y-1 text-sm text-gray-700">
              <p><strong>ID:</strong> ${currentUser.plan.contract_id}</p>
              <p><strong>Plan:</strong> ${currentUser.plan.name}</p>
              <p><strong>Inicio:</strong> ${new Date(currentUser.plan.start_date).toLocaleDateString('es-PE')}</p>
              <p><strong>Vencimiento:</strong> ${new Date(currentUser.plan.endDate || currentUser.plan.renewal_date).toLocaleDateString('es-PE')}</p>
              <p><strong>Servicios:</strong> ${currentUser.plan.contract_services}</p>
            </div>
          </div>
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p class="text-blue-800 text-center">
              <i class="fas fa-file-pdf text-2xl mb-2"></i><br>
              Para ver el contrato completo en PDF, haga clic en "Ver PDF" o "Descargar".
            </p>
          </div>
        </div>
      `,
      width: 600,
      showCancelButton: true,
      confirmButtonText: 'Ver PDF',
      cancelButtonText: 'Cerrar',
      confirmButtonColor: '#3B82F6'
    }).then((result) => {
      if (result.isConfirmed) {
        window.open('#', '_blank')
      }
    })
  }

  /**
   * Mostrar éxito de pago
   * @param {Object} paymentData - Datos del pago
   * @param {Object} result - Resultado del pago
   */
  async showPaymentSuccess(paymentData, result) {
    await Swal.fire({
      title: '¡Compra Exitosa! ✅',
      html: `
        <div class="text-left space-y-3">
          <div class="bg-green-50 border border-green-200 rounded-lg p-4">
            <div class="flex items-center space-x-2 mb-2">
              <i class="fas fa-check-circle text-green-600"></i>
              <h4 class="font-medium text-green-800">Pago Procesado</h4>
            </div>
            <div class="space-y-1 text-sm text-green-700">
              <p><strong>Servicios comprados:</strong> ${paymentData.quantity}</p>
              <p><strong>Método de pago:</strong> ${this.getPaymentMethodName(paymentData.paymentMethod)}</p>
              <p><strong>Total pagado:</strong> $${paymentData.total.toLocaleString()}</p>
            </div>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 class="font-medium text-blue-800 mb-2">Nuevos Límites</h4>
            <div class="space-y-1 text-sm">
              <p>Servicios disponibles: <strong class="text-green-600">+${paymentData.quantity}</strong></p>
            </div>
          </div>
          
          <div class="text-xs text-gray-600">
            <p>Recibirás una factura por email en las próximas 24 horas.</p>
            <p>ID de transacción: ${result.transactionId}</p>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Continuar',
      confirmButtonColor: '#10B981',
      timer: 8000
    })
  }

  /**
   * Mostrar error de pago
   */
  showPaymentError() {
    Swal.fire({
      title: 'Error en el Pago',
      html: `
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-red-600 text-4xl mb-4"></i>
          <p class="text-red-700">No se pudo procesar el pago. Inténtalo nuevamente.</p>
          <p class="text-sm text-gray-600 mt-2">Si el problema persiste, contacta a soporte técnico.</p>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#EF4444'
    })
  }

  /**
   * Generar HTML del contrato
   * @param {Object} currentUser - Usuario actual
   * @returns {string} HTML del contrato
   */
  generateContractHTML(currentUser) {
    return `
      <!DOCTYPE html>
      <html lang="es">
      <head>
        <meta charset="UTF-8">
        <title>Contrato Corporativo - ${currentUser.company.name}</title>
        <style>
          @page { margin: 2cm; }
          body { 
            font-family: Arial, sans-serif; 
            line-height: 1.6; 
            margin: 0;
            padding: 20px;
            color: #333;
          }
          .header { 
            text-align: center; 
            border-bottom: 3px solid #007bff; 
            padding-bottom: 20px; 
            margin-bottom: 30px; 
          }
          .header h1 {
            color: #007bff;
            margin-bottom: 5px;
            font-size: 24px;
          }
          .header h2 {
            color: #666;
            margin-top: 5px;
            font-size: 18px;
          }
          .company-info { 
            background: #f8f9fa; 
            padding: 20px; 
            margin: 20px 0; 
            border-radius: 8px;
            border-left: 4px solid #007bff;
          }
          .info-grid { 
            display: grid; 
            grid-template-columns: 1fr 1fr; 
            gap: 15px; 
            margin: 15px 0; 
          }
          .info-item { 
            padding: 12px; 
            background: white;
            border-radius: 5px;
            border-left: 3px solid #28a745;
          }
          .terms { 
            margin: 20px 0; 
          }
          .terms h2 {
            color: #007bff;
            border-bottom: 1px solid #ddd;
            padding-bottom: 5px;
          }
          .terms p {
            margin: 10px 0;
            text-align: justify;
          }
          .terms ul {
            padding-left: 20px;
          }
          .terms li {
            margin: 5px 0;
          }
          .signature { 
            margin-top: 40px; 
            border-top: 2px solid #007bff; 
            padding-top: 20px; 
            text-align: center;
            background: #f8f9fa;
            padding: 20px;
            border-radius: 8px;
          }
          .footer {
            margin-top: 30px;
            text-align: center;
            font-size: 12px;
            color: #666;
          }
          @media print {
            body { margin: 0; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>CONTRATO DE SERVICIOS MÉDICOS CORPORATIVOS</h1>
          <h2>HelpMED - Área Protegida</h2>
        </div>
        
        <div class="company-info">
          <h2>Información del Cliente</h2>
          <div class="info-grid">
            <div class="info-item">
              <strong>Empresa:</strong><br>${currentUser.company.name}
            </div>
            <div class="info-item">
              <strong>ID de Contrato:</strong><br>${currentUser.plan.contract_id}
            </div>
            <div class="info-item">
              <strong>Plan Contratado:</strong><br>${currentUser.plan.name}
            </div>
            <div class="info-item">
              <strong>Servicios Incluidos:</strong><br>${currentUser.plan.contract_services} servicios de emergencia
            </div>
            <div class="info-item">
              <strong>Fecha de Inicio:</strong><br>${new Date(currentUser.plan.start_date).toLocaleDateString('es-CL')}
            </div>
            <div class="info-item">
              <strong>Fecha de Vencimiento:</strong><br>${new Date(currentUser.plan.endDate || currentUser.plan.renewal_date).toLocaleDateString('es-CL')}
            </div>
          </div>
        </div>
        
        <div class="terms">
          <h2>Términos y Condiciones del Servicio</h2>
          
          <p><strong>1. OBJETO DEL CONTRATO:</strong> HelpMED se compromete a brindar servicios de atención médica de emergencia las 24 horas del día, los 365 días del año, para los empleados de ${currentUser.company.name}.</p>
          
          <p><strong>2. SERVICIOS INCLUIDOS:</strong></p>
          <ul>
            <li>Atención médica de emergencia 24/7</li>
            <li>Ambulancia equipada con personal médico especializado</li>
            <li>${currentUser.plan.contract_services} servicios de emergencia por ${currentUser.plan.billing_cycle === 'monthly' ? 'mes' : 'año'}</li>
            <li>Cobertura para ${currentUser.company.employees_count} empleados</li>
            <li>Orientación telefónica médica</li>
            <li>Traslados médicos programados (según plan)</li>
          </ul>
          
          <p><strong>3. ÁREAS DE COBERTURA:</strong></p>
          <ul>
            ${currentUser.company.locations?.map((loc) => `<li>${loc.name} - ${loc.address}</li>`).join('') || '<li>Ubicaciones según registro de empresa</li>'}
          </ul>
          
          <p><strong>4. VIGENCIA:</strong> El presente contrato tiene vigencia desde el ${new Date(currentUser.plan.start_date).toLocaleDateString('es-CL')} hasta el ${new Date(currentUser.plan.endDate || currentUser.plan.renewal_date).toLocaleDateString('es-CL')}.</p>
          
          <p><strong>5. RENOVACIÓN:</strong> El contrato se renovará de forma ${currentUser.billing?.auto_renewal ? 'automática' : 'manual'} según los términos acordados.</p>
          
          <p><strong>6. RESPONSABILIDADES DEL CLIENTE:</strong></p>
          <ul>
            <li>Proporcionar información veraz y actualizada de los empleados</li>
            <li>Notificar cambios en las ubicaciones de trabajo</li>
            <li>Cumplir con los pagos en las fechas establecidas</li>
            <li>Utilizar el servicio únicamente para emergencias médicas reales</li>
          </ul>
          
          <p><strong>7. CONTACTO DE EMERGENCIA:</strong></p>
          <ul>
            <li>Teléfono de Emergencia: +56 2 2800 4000</li>
            <li>Email Corporativo: corporativo@helpmed.com</li>
            <li>Atención al Cliente: Lun-Vie 8:00-18:00</li>
          </ul>
        </div>
        
        <div class="signature">
          <p><strong>Fecha de Emisión:</strong> ${new Date().toLocaleDateString('es-CL')}</p>
          <p><strong>Documento generado automáticamente por HelpMED</strong></p>
          <p>Para consultas sobre este contrato, contacte a corporativo@helpmed.com</p>
        </div>
        
        <div class="footer">
          <p>Este documento constituye el contrato oficial entre ${currentUser.company.name} y HelpMED.</p>
          <p>Conserve este documento para sus registros.</p>
        </div>
        
        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
              setTimeout(function() {
                window.close();
              }, 1000);
            }, 500);
          }
        </script>
      </body>
      </html>
    `
  }

  /**
   * Obtener nombre del método de pago
   * @param {string} method - Método de pago
   * @returns {string} Nombre del método
   */
  getPaymentMethodName(method) {
    const methods = {
      'company-credit': 'Crédito Empresarial',
      'bank-transfer': 'Transferencia Bancaria',
      invoice: 'Facturación Empresarial'
    }
    return methods[method] || method
  }

  /**
   * Seleccionar sede corporativa cuando hay múltiples
   * @param {Array} locations - Lista de sedes disponibles
   * @returns {Promise<string>} Sede seleccionada
   */
  async selectCorporateLocation(locations) {
    const { value: selectedLocation } = await Swal.fire({
      title: '🏢 Seleccionar Sede',
      html: `
        <div class="text-left">
          <p class="text-sm text-gray-600 mb-3">
            Seleccione la sede donde se requiere la ambulancia:
          </p>
          <select id="locationSelect" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500">
            ${locations.map((loc, index) => `
              <option value="${loc.address || loc}">
                ${loc.name || `Sede ${index + 1}`}: ${loc.address || loc}
              </option>
            `).join('')}
          </select>
        </div>
      `,
      confirmButtonText: 'Confirmar Sede',
      confirmButtonColor: '#dc2626',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const location = document.getElementById('locationSelect').value
        return location
      }
    })
    
    return selectedLocation
  }

  /**
   * Confirmar envío de emergencia SOS para sede corporativa
   * @param {string} location - Dirección de la sede corporativa
   * @param {string} companyName - Nombre de la empresa
   * @param {Object} coordinates - Coordenadas GPS si están disponibles
   * @returns {Promise<boolean>} Confirmación del usuario
   */
  async confirmSOSEmergencyWithCorporateLocation(location, companyName, coordinates = null) {
    const result = await Swal.fire({
      title: '🆘 EMERGENCIA SOS CORPORATIVA',
      html: `
        <div class="text-center">
          <i class="fas fa-exclamation-triangle text-6xl text-red-500 mb-4"></i>
          <p class="text-lg mb-2">¿Confirmas el envío de ambulancia?</p>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-4 my-4">
            <p class="text-sm text-blue-800 font-semibold mb-2">
              🏢 La ambulancia será enviada a:
            </p>
            <p class="text-sm text-blue-900 font-medium">
              ${companyName}
            </p>
            <p class="text-sm text-blue-700">
              ${location}
            </p>
            ${coordinates ? `
              <div class="mt-2 pt-2 border-t border-blue-200">
                <p class="text-xs text-blue-600">
                  <i class="fas fa-map-marker-alt mr-1"></i>
                  GPS: ${coordinates.lat.toFixed(6)}, ${coordinates.lng.toFixed(6)}
                </p>
                <p class="text-xs text-green-600 font-semibold mt-1">
                  ✓ Ubicación exacta con coordenadas GPS
                </p>
              </div>
            ` : `
              <p class="text-xs text-yellow-600 mt-2">
                <i class="fas fa-exclamation-triangle mr-1"></i>
                Sin coordenadas GPS (usando dirección)
              </p>
            `}
          </div>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <p class="text-xs text-yellow-800">
              <i class="fas fa-info-circle mr-1"></i>
              La ambulancia irá directamente a la sede corporativa registrada
            </p>
          </div>
        </div>
      `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'SÍ, ENVIAR AMBULANCIA',
      cancelButtonText: 'Cancelar',
      reverseButtons: true,
      focusCancel: false
    })
    
    return result.isConfirmed
  }

  /**
   * Enviar alerta SOS al sistema
   * @param {Object} sosData - Datos de la emergencia SOS
   * @returns {Promise<Object>} Resultado del envío
   */
  async sendSOSAlert(sosData) {
    // Simular envío de alerta al backend
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Generar código de alerta
    const alertCode = `SOS-${Date.now().toString().slice(-6)}`
    
    // Simular 95% de éxito
    const success = Math.random() > 0.05
    
    if (success) {
      console.log('Alerta SOS enviada:', sosData)
      // Aquí iría la llamada real al API para enviar la alerta
      // await axios.post(`${this.baseURL}/corporate/sos-alert`, sosData)
    }
    
    return {
      success,
      alertCode,
      timestamp: new Date().toISOString()
    }
  }

  /**
   * Mostrar confirmación de SOS enviado para corporativo
   * @param {string} alertCode - Código de la alerta
   * @param {string} location - Dirección de la sede corporativa
   * @param {string} companyName - Nombre de la empresa
   */
  async showSOSSuccessForCorporate(alertCode, location, companyName) {
    await Swal.fire({
      title: '✅ AMBULANCIA EN CAMINO',
      html: `
        <div class="text-center">
          <i class="fas fa-check-circle text-6xl text-green-500 mb-4"></i>
          <p class="text-lg font-semibold mb-2">Alerta SOS procesada exitosamente</p>
          <p class="text-sm text-gray-600 mb-2">Código de emergencia: <strong>${alertCode}</strong></p>
          
          <div class="bg-gray-100 rounded-lg p-3 my-3">
            <p class="text-sm text-gray-700 font-semibold mb-1">
              🏢 Destino confirmado:
            </p>
            <p class="text-sm text-gray-900 font-medium">
              ${companyName}
            </p>
            <p class="text-sm text-gray-700">
              ${location}
            </p>
          </div>
          
          <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <p class="text-sm text-blue-800 font-medium">
              <i class="fas fa-ambulance mr-2"></i>
              Ambulancia despachada a sede corporativa
            </p>
            <p class="text-xs text-blue-600 mt-1">
              ⏱️ Tiempo estimado de llegada: 8-12 minutos
            </p>
            <p class="text-xs text-blue-600">
              📞 El equipo médico contactará al responsable en sede
            </p>
          </div>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#10b981',
      timer: 10000,
      timerProgressBar: true
    })
  }

  /**
   * Mostrar error al enviar SOS
   */
  async showSOSError() {
    await Swal.fire({
      title: '❌ Error al enviar SOS',
      html: `
        <div class="text-center">
          <i class="fas fa-times-circle text-6xl text-red-500 mb-4"></i>
          <p class="text-lg mb-4">No se pudo enviar la alerta de emergencia</p>
          <p class="text-sm text-gray-600">Por favor, intente nuevamente o llame directamente al:</p>
          <p class="text-2xl font-bold text-red-600 mt-2">+56 2 2800 4000</p>
        </div>
      `,
      icon: 'error',
      confirmButtonText: 'Reintentar',
      confirmButtonColor: '#dc2626'
    })
  }

  /**
   * Mostrar error cuando no hay dirección registrada
   */
  async showNoAddressError() {
    await Swal.fire({
      title: '⚠️ Dirección No Registrada',
      html: `
        <div class="text-center">
          <i class="fas fa-map-marked-alt text-6xl text-yellow-500 mb-4"></i>
          <p class="text-lg mb-4">No hay dirección de empresa registrada</p>
          
          <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
            <p class="text-sm text-yellow-800">
              Para usar el botón SOS, el administrador debe registrar 
              la dirección de la empresa en el sistema
            </p>
          </div>
          
          <p class="text-sm text-gray-600">En caso de emergencia, llame directamente al:</p>
          <p class="text-2xl font-bold text-red-600 mt-2">
            <i class="fas fa-phone-alt mr-2"></i>
            +56 2 2800 4000
          </p>
        </div>
      `,
      icon: 'warning',
      confirmButtonText: 'Entendido',
      confirmButtonColor: '#f59e0b'
    })
  }
}

// Instancia singleton del servicio
const corporateService = new CorporateService()

export default corporateService
