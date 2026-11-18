export const RECYCLING_CODE_VALUES = [
  'AZUL',
  'VERDE',
  'AMARELO',
  'PRETO',
  'LARANJA',
  'BRANCO',
  'ROXO',
  'MARROM',
  'PET',
  'PEAD',
  'PVC',
  'PEBD',
  'PP',
  'PS',
  'O',
] as const

export type RecyclingCode = (typeof RECYCLING_CODE_VALUES)[number]

export type Buyer = {
  id: number
  name: string
  cpf: string
  email: string
  phoneNumber: string
  cep: string
  address: string
  addressNumber: string
}

export type ProductOwner = {
  id: number
  name: string
}

export type Product = {
  id: number
  name: string
  recicling_code: RecyclingCode
  ownerId?: number | null
  owner?: ProductOwner | null
  price?: number | null
}

export type BuyerInput = Omit<Buyer, 'id'>

export type ProductInput = {
  name: string
  recicling_code: RecyclingCode
  price: number
}

export type BuyerWithProducts = Buyer & {
  products: Product[]
}

export type SearchResult = {
  buyers: BuyerWithProducts[]
  radiusLabel: string
}

export function productPrice(product: Product): number | undefined {
  return typeof product.price === 'number' ? product.price : undefined
}
