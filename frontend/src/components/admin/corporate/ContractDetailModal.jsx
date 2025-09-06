import Swal from 'sweetalert2'
import { LABELS } from '../../../config/labels'
import { DATE_FORMATS } from '../../../config/constants'

/**
 * Utility para mostrar detalles de contrato en modal
 * ENFOQUE BALANCEADO: Lógica de presentación extraída
 */
export const showContractDetail = (contract, onEdit) => {
  if (!contract) return

  const labels = LABELS.admin.corporate.contracts.detail
  const renewalDate = new Date(contract.plan?.renewal_date)
  const startDate = new Date(contract.plan?.start_date)
  const isExpiring = renewalDate <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)

  Swal.fire({
    title: `${labels.title}: ${contract.company?.name}`,
    html: `
      <div class="text-left space-y-4">
        <div class="bg-gray-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-800 mb-2">${labels.sections.contractInfo}</h4>
          <div class="grid grid-cols-2 gap-2 text-sm">
            <div><strong>${labels.fields.contractId}:</strong> ${contract.plan?.contract_id || labels.defaults.notAvailable}</div>
            <div><strong>${labels.fields.plan}:</strong> ${contract.plan?.name || labels.defaults.notAvailable}</div>
            <div><strong>${labels.fields.services}:</strong> ${contract.plan?.contract_services || 0}</div>
            <div><strong>${labels.fields.startDate}:</strong> ${startDate.toLocaleDateString(DATE_FORMATS.locale)}</div>
            <div><strong>${labels.fields.renewalDate}:</strong> ${renewalDate.toLocaleDateString(DATE_FORMATS.locale)}</div>
            <div><strong>${labels.fields.monthlyCost}:</strong> ${labels.defaults.currencySymbol} ${contract.billing?.monthly_cost?.toLocaleString() || 0}</div>
          </div>
        </div>
        
        <div class="bg-blue-50 p-4 rounded-lg">
          <h4 class="font-bold text-gray-800 mb-2">${labels.sections.companyInfo}</h4>
          <div class="text-sm space-y-1">
            <div><strong>${labels.fields.company}:</strong> ${contract.company?.name || labels.defaults.notAvailable}</div>
            <div><strong>${labels.fields.ruc}:</strong> ${contract.company?.rut || labels.defaults.notAvailable}</div>
            <div><strong>${labels.fields.industry}:</strong> ${contract.company?.industry || labels.defaults.notAvailable}</div>
            <div><strong>${labels.fields.contact}:</strong> ${contract.company?.contact_person?.name || labels.defaults.notAvailable}</div>
          </div>
        </div>

        ${
          isExpiring
            ? `
          <div class="bg-red-50 border border-red-200 p-4 rounded-lg">
            <h4 class="font-bold text-red-800 mb-2">${labels.sections.expiringWarning}</h4>
            <p class="text-red-700 text-sm">${labels.messages.contractExpiring.replace('{date}', renewalDate.toLocaleDateString(DATE_FORMATS.locale))}</p>
          </div>
        `
            : ''
        }
      </div>
    `,
    width: 600,
    showCloseButton: true,
    showCancelButton: true,
    confirmButtonText: labels.buttons.edit,
    cancelButtonText: labels.buttons.close,
    confirmButtonColor: '#3B82F6'
  }).then((result) => {
    if (result.isConfirmed && onEdit) {
      onEdit()
    }
  })
}
