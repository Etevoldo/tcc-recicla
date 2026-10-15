import { api, ApiError } from '../../../lib/api'
import type { Buyer, BuyerInput, Product } from '../types'

export async function getBuyers(): Promise<Buyer[]> {
  const buyers = await api<Buyer[] | null>('/buyers')
  return buyers ?? []
}

export async function getBuyer(id: number): Promise<Buyer> {
  const buyer = await api<Buyer | null>(`/buyers/${id}`)
  if (buyer == null) throw new ApiError(404, 'Comprador não encontrado')
  return buyer
}

export async function getBuyerProducts(id: number): Promise<Product[]> {
  try {
    const products = await api<Product[] | null>(`/buyers/${id}/products`)
    return products ?? []
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return []
    throw error
  }
}

export async function updateBuyer(id: number, input: BuyerInput): Promise<void> {
  await api<null>(`/buyers/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}
