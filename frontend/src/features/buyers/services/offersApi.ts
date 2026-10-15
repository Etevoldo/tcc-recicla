import { api, ApiError } from '../../../lib/api'
import type { Offer } from '../types'

export async function getOffersByBuyer(buyerId: number): Promise<Offer[]> {
  try {
    const offers = await api<Offer[] | null>(`/offers/buyer/${buyerId}`)
    return offers ?? []
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return []
    throw error
  }
}

export async function createOffer(input: {
  buyerId: number
  productId: number
  price: number
}): Promise<Offer> {
  return api<Offer>('/offers', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateOfferPrice(
  buyerId: number,
  productId: number,
  price: number,
): Promise<void> {
  await api<null>(`/offers/${buyerId}/${productId}`, {
    method: 'PUT',
    body: JSON.stringify({ price }),
  })
}

export async function deleteBuyerOffer(buyerId: number, productId: number): Promise<void> {
  const offers = await getOffersByBuyer(buyerId)
  const remaining = offers.filter((offer) => Number(offer.ProductId) !== Number(productId))
  await api<null>(`/offers/${buyerId}`, { method: 'DELETE' })
  for (const offer of remaining) {
    await createOffer({
      buyerId,
      productId: offer.ProductId,
      price: offer.price,
    })
  }
}
