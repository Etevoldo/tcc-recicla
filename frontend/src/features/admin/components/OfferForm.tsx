import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { reaisToCents } from '../../../lib/format'
import type { Product } from '../../buyers/types'

export function OfferForm({
  products,
  busy,
  onSubmit,
}: {
  products: Product[]
  busy?: boolean
  onSubmit: (productId: number, priceCents: number) => void
}) {
  const [productId, setProductId] = useState(products[0] ? String(products[0].id) : '')
  const [price, setPrice] = useState('')
  const [errors, setErrors] = useState<{ product?: string; price?: string }>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: { product?: string; price?: string } = {}
    if (!productId) nextErrors.product = 'Selecione um produto.'
    const cents = reaisToCents(price)
    if (!Number.isFinite(cents) || cents <= 0) nextErrors.price = 'Informe um preço maior que zero.'
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    onSubmit(Number(productId), cents)
    setPrice('')
  }

  if (products.length === 0) {
    return <p className="text-sm text-stone-600">Todos os produtos já possuem oferta para este comprador.</p>
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-[1fr_160px_auto] md:items-end">
      <Select
        id="offer-product"
        label="Produto"
        value={productId}
        error={errors.product}
        onChange={(event) => setProductId(event.target.value)}
      >
        {products.map((product) => (
          <option key={product.id} value={product.id}>
            {product.name}
          </option>
        ))}
      </Select>
      <Input
        id="offer-price"
        label="Preço (R$)"
        inputMode="decimal"
        placeholder="1,50"
        value={price}
        error={errors.price}
        onChange={(event) => setPrice(event.target.value)}
      />
      <Button type="submit" disabled={busy} className="md:mb-0">
        {busy ? 'Adicionando...' : 'Adicionar oferta'}
      </Button>
    </form>
  )
}
