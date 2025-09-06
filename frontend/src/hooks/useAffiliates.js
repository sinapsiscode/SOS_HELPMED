import { useApiData, useApiMutation } from './useApiData'
import affiliateService from '../services/affiliate.service'

/**
 * Hook para obtener lista de afiliados
 */
export const useAffiliates = () => {
  return useApiData(() => affiliateService.getAffiliates())
}

/**
 * Hook para obtener un afiliado por ID
 */
export const useAffiliate = (id) => {
  return useApiData(() => affiliateService.getAffiliateById(id), [id])
}

/**
 * Hook para crear afiliado
 */
export const useCreateAffiliate = () => {
  return useApiMutation(affiliateService.createAffiliate.bind(affiliateService))
}

/**
 * Hook para actualizar afiliado
 */
export const useUpdateAffiliate = () => {
  return useApiMutation(affiliateService.updateAffiliate.bind(affiliateService))
}

/**
 * Hook para eliminar afiliado
 */
export const useDeleteAffiliate = () => {
  return useApiMutation(affiliateService.deleteAffiliate.bind(affiliateService))
}

/**
 * Hook para cambiar estado de afiliado
 */
export const useToggleAffiliateStatus = () => {
  return useApiMutation(affiliateService.toggleAffiliateStatus.bind(affiliateService))
}

/**
 * Hook para validar DNI
 */
export const useValidateDNI = () => {
  return useApiMutation(affiliateService.validateDNI.bind(affiliateService))
}

/**
 * Hook para obtener límite de afiliados
 */
export const useAffiliateLimit = (planType) => {
  return useApiData(() => affiliateService.getAffiliateLimit(planType), [planType])
}