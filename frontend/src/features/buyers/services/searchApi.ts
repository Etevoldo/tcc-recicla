import { api, ApiError } from '../../../lib/api'
import type { Buyer, SearchResult } from '../types'
import { getBuyerProducts } from './buyersApi'

export const SEARCH_RADIUS_KM = [5, 15, 30, 50] as const
export type SearchRadiusKm = (typeof SEARCH_RADIUS_KM)[number]

export function parseRadiusKm(value: string | null): SearchRadiusKm {
  const parsed = Number(value)
  return SEARCH_RADIUS_KM.includes(parsed as SearchRadiusKm) ? (parsed as SearchRadiusKm) : 15
}

export async function searchNearbyBuyers(cep: string, radiusKm: number): Promise<SearchResult> {
  const meters = radiusKm * 1000
  try {
    const data = await api<{ compradoresProximos: Buyer[]; raio: string }>(
      `/addresses/searchBuyers/${cep}/${meters}`,
    )
    const buyers = await Promise.all(
      (data.compradoresProximos ?? []).map(async (buyer) => ({
        ...buyer,
        products: await getBuyerProducts(buyer.id),
      })),
    )
    return { buyers, radiusLabel: data.raio }
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) {
      throw new ApiError(404, 'CEP não encontrado ou inválido.')
    }
    throw error
  }
}
