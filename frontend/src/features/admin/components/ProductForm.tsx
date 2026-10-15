import { useState } from 'react'
import type { FormEvent } from 'react'
import { Button } from '../../../components/ui/Button'
import { Input } from '../../../components/ui/Input'
import { Select } from '../../../components/ui/Select'
import { RECYCLING_CODES } from '../../buyers/constants/recyclingCodes'
import type { Product, ProductInput, RecyclingCode } from '../../buyers/types'

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
  const [error, setError] = useState('')

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setError('Informe o nome do produto.')
      return
    }
    onSubmit({ name: name.trim(), recicling_code: code })
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-4">
      <Input
        id="product-name"
        label="Nome"
        value={name}
        error={error}
        onChange={(event) => {
          setName(event.target.value)
          setError('')
        }}
      />
      <Select
        id="product-code"
        label="Código de reciclagem"
        value={code}
        onChange={(event) => setCode(event.target.value as RecyclingCode)}
      >
        {RECYCLING_CODES.map((item) => (
          <option key={item.code} value={item.code}>
            {item.code} — {item.label}
          </option>
        ))}
      </Select>
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
