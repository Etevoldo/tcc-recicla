import { api } from '../../../lib/api'
import type { AuthUser, UserRole } from '../types'

export type UserInput = {
  name: string
  email: string
  password: string
  role: UserRole
}

export type UserUpdate = {
  role: UserRole
}

export async function getUsers(): Promise<AuthUser[]> {
  const users = await api<AuthUser[] | null>('/users')
  return users ?? []
}

export async function createUser(input: UserInput): Promise<AuthUser> {
  return api<AuthUser>('/users', {
    method: 'POST',
    body: JSON.stringify(input),
  })
}

export async function updateUser(id: number, input: UserUpdate): Promise<AuthUser> {
  return api<AuthUser>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(input),
  })
}

export async function deleteUser(id: number): Promise<void> {
  await api<null>(`/users/${id}`, { method: 'DELETE' })
}
