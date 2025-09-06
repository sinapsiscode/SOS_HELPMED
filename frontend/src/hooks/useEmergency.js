import { useApiData, useApiMutation } from './useApiData'
import emergencyService from '../services/emergency.service'

/**
 * Hook para gestionar emergencias
 */
export const useEmergencies = () => {
  return useApiData(() => emergencyService.getEmergencies())
}

export const useEmergency = (id) => {
  return useApiData(() => emergencyService.getEmergencyById(id), [id])
}

export const useCreateEmergency = () => {
  return useApiMutation(emergencyService.createEmergency)
}

export const useUpdateEmergency = () => {
  return useApiMutation(emergencyService.updateEmergency)
}

export const useAssignEmergency = () => {
  return useApiMutation(emergencyService.assignEmergency)
}

export const useCompleteEmergency = () => {
  return useApiMutation(emergencyService.completeEmergency)
}

export const useCancelEmergency = () => {
  return useApiMutation(emergencyService.cancelEmergency)
}

export const useTrackEmergency = (id) => {
  return useApiData(() => emergencyService.trackEmergency(id), [id])
}