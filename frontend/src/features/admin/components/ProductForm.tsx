import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { centsToReaisInput, reaisToCents } from '../../../lib/format'
import { RECYCLING_CODES } from '../../buyers/constants/recyclingCodes'
import type { Product, ProductInput, RecyclingCode } from '../../buyers/types'
import { productPrice } from '../../buyers/types'

export function ProductForm({
  initial,
  submitLabel,
  busy,
  onSubmit,
  onCancel,
}: {
  initial?: Product
  submitLabel: string
  busy?: boolean
  onSubmit: (input: ProductInput) => void
  onCancel?: () => void
}) {
  const [name, setName] = useState(initial?.name ?? '')
  const [code, setCode] = useState<RecyclingCode>(initial?.recicling_code ?? 'PET')
  const [price, setPrice] = useState(() => {
    const cents = initial ? productPrice(initial) : undefined
    return cents != null ? centsToReaisInput(cents) : ''
  })
  const [errors, setErrors] = useState<{ name?: string; price?: string }>({})

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors: { name?: string; price?: string } = {}
    if (!name.trim()) nextErrors.name = 'Informe o nome do produto.'
    const cents = reaisToCents(price)
    if (!Number.isFinite(cents) || cents <= 0) nextErrors.price = 'Informe um preço maior que zero.'
    if (nextErrors.name || nextErrors.price) {
      setErrors(nextErrors)
      return
    }
    onSubmit({ name: name.trim(), recicling_code: code, price: cents })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        id="product-name"
        label="Nome"
        value={name}
        error={errors.name}
        onChange={(event) => {
          setName(event.target.value)
          setErrors((current) => ({ ...current, name: undefined }))
        }}
      />
      <Select
        id="product-code"
        label="Tipo de reciclável"
        value={code}
        onChange={(event) => setCode(event.target.value as RecyclingCode)}
      >
        {RECYCLING_CODES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code} — {item.label}
          </option>
        ))}
      </Select>
      <Input
        id="product-price"
        label="Preço (R$)"
        inputMode="decimal"
        value={price}
        error={errors.price}
        onChange={(event) => {
          setPrice(event.target.value)
          setErrors((current) => ({ ...current, price: undefined }))
        }}
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={busy}>
          {busy ? 'Salvando...' : submitLabel}
        </Button>
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} disabled={busy}>
            Cancelar
          </Button>
        )}
      </div>
    </form>
  )
}
