import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { formatCep, isValidCep, normalizeCep } from '../services/cep'

export function CepForm() {
  const [cep, setCep] = useState('')
  const [error, setError] = useState('')
  const [submittedCep, setSubmittedCep] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSubmittedCep('')
    if (!isValidCep(cep)) {
      setError('Informe os oito dígitos do CEP.')
      inputRef.current?.focus()
      return
    }
    setError('')
    setSubmittedCep(normalizeCep(cep))
  }

  return <form onSubmit={handleSubmit} noValidate className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8">
    <h2 className="text-xl font-bold text-green-950">Comece pela sua região</h2>
    <p className="mt-2 text-sm leading-relaxed text-stone-600">Informe o CEP onde deseja encontrar materiais.</p>
    <label htmlFor="cep" className="mb-2 mt-7 block text-sm font-semibold">Seu CEP</label>
    <input ref={inputRef} id="cep" name="cep" type="text" inputMode="numeric" autoComplete="postal-code" placeholder="00000-000" value={cep}
      onChange={event => { setCep(formatCep(event.target.value)); setError(''); setSubmittedCep('') }}
      aria-invalid={!!error} aria-describedby={error ? 'cep-error' : 'cep-hint'}
      className={`min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-lg tracking-wider ${error ? 'border-red-600' : 'border-stone-300'}`} />
    <p id="cep-hint" className="mt-2 text-xs text-stone-500">Você pode digitar ou colar o CEP com ou sem hífen.</p>
    {error && <p id="cep-error" role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
    <button type="submit" className="mt-6 min-h-12 w-full cursor-pointer rounded-xl bg-green-900 px-5 py-3 font-semibold text-white transition-colors hover:bg-green-800">Confirmar CEP <span aria-hidden="true" className="ml-2">→</span></button>
    <div role="status" aria-live="polite">
      {submittedCep && <p className="mt-5 rounded-xl bg-green-50 p-4 text-sm leading-relaxed text-green-950">CEP {formatCep(submittedCep)} informado. A busca de vendedores ainda não está disponível.</p>}
    </div>
  </form>
}
