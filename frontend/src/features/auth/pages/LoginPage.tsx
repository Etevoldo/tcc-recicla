import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useSearchParams } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { ApiError } from '../../../lib/api'
import { useAuth } from '../AuthContext'

function safeNext(value: string | null): string {
  if (value && value.startsWith('/') && !value.startsWith('//')) return value
  return '/gestao'
}

export function LoginPage() {
  const { user, login } = useAuth()
  const [searchParams] = useSearchParams()
  const next = safeNext(searchParams.get('next'))
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (user) {
    if (user.mustChangePassword) return <Navigate to="/trocar-senha" replace />
    return <Navigate to={next} replace />
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    setBusy(true)
    try {
      await login(email, password)
    } catch (caught) {
      setError(
        caught instanceof ApiError && caught.status === 401
          ? 'E-mail ou senha inválidos.'
          : 'Não foi possível entrar. Tente novamente.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Acesso interno</p>
        <h1 className="mt-2 text-3xl font-bold text-green-950">Entrar</h1>
        <p className="mt-2 text-sm text-stone-600">
          Use a conta de administrador ou a de comprador para abrir a gestão.
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            id="email"
            label="E-mail"
            type="email"
            autoComplete="username"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setError('')
            }}
          />
          <Input
            id="password"
            label="Senha"
            type="password"
            autoComplete="current-password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setError('')
            }}
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>
      </Card>
    </section>
  )
}
