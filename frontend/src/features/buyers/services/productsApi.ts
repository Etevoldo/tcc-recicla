import { api, ApiError } from '../../../lib/api'
import type { Product, ProductInput } from '../types'

export async function getProducts(): Promise<Product[]> {
  const products = await api<Product[] | null>('/products')
  return products ?? []
}

export async function getProduct(id: number): Promise<Product> {
  const product = await api<Product | null>(`/products/${id}`)
  if (product == null) throw new ApiError(404, 'Produto não encontrado')
  return product
}

export async function createProduct(input: ProductInput): Promise<Product> {
  return api<Product>('/products', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateProduct(id: number, input: ProductInput): Promise<void> {
  await api<null>(`/products/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function deleteProduct(id: number): Promise<void> {
  await api<null>(`/products/${id}`, { method: 'DELETE' })
}
