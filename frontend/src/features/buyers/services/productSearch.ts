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
  const info = getRecyclingCode(product.recicling_code)
  if (fold(product.recicling_code).includes(q)) return true
  if (fold(info.colorLabel).includes(q)) return true
  if (fold(info.label).includes(q)) return true
  if (fold(product.name).includes(q)) return true
  return false
}

export function sameItemName(left: string, right: string): boolean {
  return fold(left) === fold(right)
}

export function matchesProductFilters(
  product: Product,
  material: RecyclingCode | 'ALL',
  query: string,
  itemName = 'ALL',
): boolean {
  if (material !== 'ALL' && product.recicling_code !== material) return false
  if (itemName !== 'ALL' && !sameItemName(product.name, itemName)) return false
  return matchesProductQuery(product, query)
}

export function filterBuyersByProduct(
  buyers: BuyerWithProducts[],
  material: RecyclingCode | 'ALL',
  query: string,
  itemName = 'ALL',
): BuyerWithProducts[] {
  const hasFilter = material !== 'ALL' || query.trim() !== '' || itemName !== 'ALL'
  if (!hasFilter) return buyers

  return buyers
    .map((buyer) => ({
      ...buyer,
      products: buyer.products.filter((product) => matchesProductFilters(product, material, query, itemName)),
    }))
    .filter((buyer) => buyer.products.length > 0)
}

export function collectItemNames(
  buyers: BuyerWithProducts[],
  material: RecyclingCode | 'ALL',
  query: string,
): string[] {
  const names = new Map<string, string>()
  for (const buyer of buyers) {
    for (const product of buyer.products) {
      if (!matchesProductFilters(product, material, query, 'ALL')) continue
      const key = fold(product.name)
      if (!key || names.has(key)) continue
      names.set(key, product.name.trim())
    }
  }
  return [...names.values()].sort((left, right) => left.localeCompare(right, 'pt-BR'))
}

export function nearbyProductMatches(buyers: BuyerWithProducts[]): NearbyProductMatch[] {
  return buyers.flatMap((buyer) => buyer.products.map((product) => ({ product, buyer })))
}
