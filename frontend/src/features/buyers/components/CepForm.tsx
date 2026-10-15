import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { formatCep, isValidCep, normalizeCep } from '../services/cep'
import { type SearchRadiusKm } from '../services/searchApi'
import { RadiusSelect } from './RadiusSelect'

export function CepForm() {
  const navigate = useNavigate()
  const [cep, setCep] = useState('')
  const [radius, setRadius] = useState<SearchRadiusKm>(15)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!isValidCep(cep)) {
      setError('Informe os oito dígitos do CEP.')
      inputRef.current?.focus()
      return
    }
    setError('')
    navigate(`/compradores?cep=${normalizeCep(cep)}&raio=${radius}`)
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} noValidate className="grid gap-5">
        <div>
          <h2 className="text-xl font-bold text-green-950">Comece pela sua região</h2>
          <p className="mt-2 text-sm leading-relaxed text-stone-600">
            Informe o CEP onde deseja encontrar compradores de recicláveis.
          </p>
        </div>
        <Input
          ref={inputRef}
          id="cep"
          name="cep"
          type="text"
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          label="Seu CEP"
          hint="Você pode digitar ou colar o CEP com ou sem hífen."
          value={cep}
          error={error}
          onChange={(event) => {
            setCep(formatCep(event.target.value))
            setError('')
          }}
        />
        <RadiusSelect value={radius} onChange={setRadius} />
        <Button type="submit" className="min-h-12 w-full text-base">
          Buscar compradores <span aria-hidden="true" className="ml-2">→</span>
        </Button>
      </form>
    </Card>
  )
}
