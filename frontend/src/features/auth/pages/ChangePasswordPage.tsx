import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { Button } from '../../../components/ui/Button'
import { Card } from '../../../components/ui/Card'
import { Input } from '../../../components/ui/Input'
import { ApiError } from '../../../lib/api'
import { useAuth } from '../AuthContext'
import { changePassword } from '../services/authApi'

export function ChangePasswordPage() {
  const { user, setSessionUser } = useAuth()
  const navigate = useNavigate()
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  if (!user) return <Navigate to="/login" replace />

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError('')
    if (newPassword.length < 6) {
      setError('A nova senha deve ter no mínimo 6 caracteres.')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('A confirmação não confere com a nova senha.')
      return
    }
    setBusy(true)
    try {
      const updated = await changePassword(currentPassword, newPassword)
      setSessionUser(updated)
      navigate('/gestao', { replace: true })
    } catch (caught) {
      setError(
        caught instanceof ApiError ? caught.message : 'Não foi possível alterar a senha. Tente novamente.',
      )
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="mx-auto grid w-full max-w-md gap-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Primeiro acesso</p>
        <h1 className="mt-2 text-3xl font-bold text-green-950">Trocar senha</h1>
        <p className="mt-2 text-sm text-stone-600">
          Defina uma senha própria para continuar. Use pelo menos 6 caracteres.
        </p>
      </div>
      <Card>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            id="current-password"
            label="Senha atual"
            type="password"
            autoComplete="current-password"
            value={currentPassword}
            onChange={(event) => {
              setCurrentPassword(event.target.value)
              setError('')
            }}
          />
          <Input
            id="new-password"
            label="Nova senha"
            type="password"
            autoComplete="new-password"
            value={newPassword}
            onChange={(event) => {
              setNewPassword(event.target.value)
              setError('')
            }}
          />
          <Input
            id="confirm-password"
            label="Confirmar nova senha"
            type="password"
            autoComplete="new-password"
            value={confirmPassword}
            onChange={(event) => {
              setConfirmPassword(event.target.value)
              setError('')
            }}
          />
          {error && (
            <p role="alert" className="text-sm text-red-700">
              {error}
            </p>
          )}
          <Button type="submit" disabled={busy}>
            {busy ? 'Salvando...' : 'Salvar senha'}
          </Button>
        </form>
      </Card>
    </section>
  )
}
