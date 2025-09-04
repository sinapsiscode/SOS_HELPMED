import Swal from 'sweetalert2'

/**
 * Utility para mostrar detalles de contrato en modal
 * ENFOQUE BALANCEADO: Lógica de presentación extraída
 */
export const showContractDetail = (contract, onEdit) => {
  if (!contract) return

  const renewalDate = new Date(contract.plan?.renewal_date)
  const startDate = new Date(contract.plan?.start_date)
  const isExpiring = renewalDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  Swal.fire({
    title: `Contrato: ${contract.company?.name}`,
    html: `
      <div class="text-left space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-800 mb-2">Información del Contrato</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><strong>ID Contrato:</strong> ${contract.plan?.contract_id || 'N/A'}</div>
            <div><strong>Plan:</strong> ${contract.plan?.name || 'N/A'}</div>
            <div><strong>Servicios:</strong> ${contract.plan?.contract_services || 0}</div>
            <div><strong>Inicio:</strong> ${startDate.toLocaleDateString('es-CL')}</div>
            <div><strong>Renovación:</strong> ${renewalDate.toLocaleDateString('es-CL')}</div>
            <div><strong>Costo Mensual:</strong> S/ ${contract.billing?.monthly_cost?.toLocaleString() || 0}</div>
          </div>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-800 mb-2">Información de la Empresa</h4>
          <div class="text-sm space-y-1">
            <div><strong>Empresa:</strong> ${contract.company?.name || 'N/A'}</div>
            <div><strong>RUC:</strong> ${contract.company?.rut || 'N/A'}</div>
            <div><strong>Industria:</strong> ${contract.company?.industry || 'N/A'}</div>
            <div><strong>Contacto:</strong> ${contract.company?.contact_person?.name || 'N/A'}</div>
          </div>
        </div>

        ${
          isExpiring
            ? `
          <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 class="font-bold text-red-800 mb-2">⚠️ Contrato por Vencer</h4>
            <p class="text-red-700 text-sm">Este contrato vence el ${renewalDate.toLocaleDateString('es-CL')}. Contacte al cliente para renovación.</p>
          </div>
        `
            : ''
        }
      </div>
    `,
    width: 600,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: 'Editar Contrato',
    cancelButtonText: 'Cerrar',
    confirmButtonColor: '#3B82F6'
  }).then((result) => {
    if (result.isConfirmed && onEdit) {
      onEdit()
    }
  })
}
