import { getRecyclingCode } from '../constants/recyclingCodes'
import type { BuyerWithProducts, Product, RecyclingCode } from '../types'

export type NearbyProductMatch = {
  product: Product
  buyer: BuyerWithProducts
}

function fold(value: string): string {
  return value
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function matchesProductQuery(product: Product, query: string): boolean {
  const raw = query.trim()
  if (!raw) return true

  const withoutHash = raw.replace(/^#/, '').trim()
  if (/^\d+$/.test(withoutHash)) {
    return product.id === Number(withoutHash)
  }

  const q = fold(raw)
  if (!q) return true
  if (fold(product.recicling_code).includes(q)) return true
  if (fold(getRecyclingCode(product.recicling_code).label).includes(q)) return true
  if (fold(product.name).includes(q)) return true
  return false
}

export function matchesProductFilters(
  product: Product,
  material: RecyclingCode | 'ALL',
  query: string,
): boolean {
  if (material !== 'ALL' && product.recicling_code !== material) return false
  return matchesProductQuery(product, query)
}

export function filterBuyersByProduct(
  buyers: BuyerWithProducts[],
  material: RecyclingCode | 'ALL',
  query: string,
): BuyerWithProducts[] {
  const hasFilter = material !== 'ALL' || query.trim() !== ''
  if (!hasFilter) return buyers

  return buyers
    .map((buyer) => ({
      ...buyer,
      products: buyer.products.filter((product) => matchesProductFilters(product, material, query)),
    }))
    .filter((buyer) => buyer.products.length > 0)
}

export function nearbyProductMatches(buyers: BuyerWithProducts[]): NearbyProductMatch[] {
  return buyers.flatMap((buyer) => buyer.products.map((product) => ({ product, buyer })))
}
