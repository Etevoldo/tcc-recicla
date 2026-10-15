import { useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Select } from '../../../components/ui/Select'
import { Spinner } from '../../../components/ui/Spinner'
import { ApiError } from '../../../lib/api'
import { useAuth } from '../../auth/AuthContext'
import { createUser, deleteUser, getUsers, updateUser } from '../../auth/services/usersApi'
import type { AuthUser, UserRole } from '../../auth/types'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function UsersAdminPage() {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()
  const [creating, setCreating] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<UserRole>('BUYER')
  const [formError, setFormError] = useState('')
  const [pendingDelete, setPendingDelete] = useState<AuthUser | null>(null)
  const [pendingRole, setPendingRole] = useState<{ user: AuthUser; role: UserRole } | null>(null)

  const usersQuery = useQuery({ queryKey: ['users'], queryFn: getUsers })

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ['users'] })
    await queryClient.invalidateQueries({ queryKey: ['buyers'] })
  }

  function closeCreate() {
    setCreating(false)
    setName('')
    setEmail('')
    setPassword('')
    setRole('BUYER')
    setFormError('')
  }

  const createMutation = useMutation({
    mutationFn: createUser,
    onSuccess: async () => {
      closeCreate()
      await invalidate()
    },
    onError: (error) => {
      setFormError(error instanceof ApiError ? error.message : 'Não foi possível criar o usuário.')
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, role }: { id: number; role: UserRole }) => updateUser(id, { role }),
    onSuccess: async () => {
      setPendingRole(null)
      await invalidate()
    },
  })
  const removeMutation = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      setPendingDelete(null)
      await invalidate()
    },
  })

  function handleCreate(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim()) {
      setFormError('Informe o nome.')
      return
    }
    if (!email.trim()) {
      setFormError('Informe o e-mail.')
      return
    }
    if (password.length < 6) {
      setFormError('A senha deve ter no mínimo 6 caracteres.')
      return
    }
    createMutation.mutate({
      name: name.trim(),
      email: email.trim(),
      password,
      role,
    })
  }

  if (usersQuery.isLoading) return <Spinner label="Carregando usuários..." />
  if (usersQuery.isError) return <ErrorState onRetry={() => void usersQuery.refetch()} />

  const users = usersQuery.data ?? []

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-green-950">Usuários</h2>
        <Button type="button" onClick={() => setCreating(true)}>
          Novo usuário
        </Button>
      </div>

      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="px-4 py-3 font-semibold">Nome</th>
              <th className="px-4 py-3 font-semibold">E-mail</th>
              <th className="px-4 py-3 font-semibold">Tipo de conta</th>
              <th className="px-4 py-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => {
              const isSelf = account.id === currentUser?.id
              return (
                <tr key={account.id} className="border-b border-stone-100">
                  <td className="px-4 py-3 font-medium text-green-950">{account.name}</td>
                  <td className="px-4 py-3">{account.email}</td>
                  <td className="px-4 py-3">{account.role === 'ADMIN' ? 'Administrador' : 'Comprador'}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-3">
                      {account.role === 'BUYER' ? (
                        <button
                          type="button"
                          className="font-semibold text-green-800"
                          onClick={() => setPendingRole({ user: account, role: 'ADMIN' })}
                        >
                          Tornar admin
                        </button>
                      ) : (
                        !isSelf && (
                          <button
                            type="button"
                            className="font-semibold text-green-800"
                            onClick={() => setPendingRole({ user: account, role: 'BUYER' })}
                          >
                            Tornar comprador
                          </button>
                        )
                      )}
                      {!isSelf && (
                        <button
                          type="button"
                          className="font-semibold text-red-700"
                          onClick={() => setPendingDelete(account)}
                        >
                          Excluir
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Modal open={creating} title="Novo usuário" onClose={closeCreate}>
        <form onSubmit={handleCreate} className="grid gap-4">
          <Input
            id="user-name"
            label="Nome"
            value={name}
            onChange={(event) => {
              setName(event.target.value)
              setFormError('')
            }}
          />
          <Input
            id="user-email"
            label="E-mail"
            type="email"
            value={email}
            onChange={(event) => {
              setEmail(event.target.value)
              setFormError('')
            }}
          />
          <Input
            id="user-password"
            label="Senha"
            type="password"
            value={password}
            onChange={(event) => {
              setPassword(event.target.value)
              setFormError('')
            }}
          />
          <Select
            id="user-role"
            label="Tipo de conta"
            value={role}
            onChange={(event) => setRole(event.target.value as UserRole)}
          >
            <option value="BUYER">Comprador</option>
            <option value="ADMIN">Administrador</option>
          </Select>
          <p className="text-sm text-stone-500">
            No primeiro acesso o usuário vai definir uma senha própria.
          </p>
          {formError && (
            <p role="alert" className="text-sm text-red-700">
              {formError}
            </p>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Salvando...' : 'Cadastrar'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeCreate} disabled={createMutation.isPending}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={pendingRole != null}
        title={pendingRole?.role === 'ADMIN' ? 'Tornar administrador' : 'Tornar comprador'}
        message={
          pendingRole?.role === 'ADMIN'
            ? `Deseja tornar ${pendingRole.user.name} administrador?`
            : `Deseja tornar ${pendingRole?.user.name} comprador? Se ainda não houver cadastro, ele será criado com o nome e o e-mail da conta.`
        }
        confirmLabel="Confirmar"
        busy={updateMutation.isPending}
        onCancel={() => setPendingRole(null)}
        onConfirm={() => pendingRole && updateMutation.mutate({ id: pendingRole.user.id, role: pendingRole.role })}
      />

      <ConfirmDialog
        open={pendingDelete != null}
        title="Excluir usuário"
        message="Deseja excluir este usuário? O comprador vinculado e os produtos também serão removidos."
        confirmLabel="Excluir"
        danger
        busy={removeMutation.isPending}
        onCancel={() => setPendingDelete(null)}
        onConfirm={() => pendingDelete != null && removeMutation.mutate(pendingDelete.id)}
      />
    </section>
  )
}
