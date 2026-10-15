import { api } from '../../../lib/api'
import type { AuthUser, LoginResponse } from '../types'

export async function loginRequest(email: string, password: string): Promise<LoginResponse> {
  return api<LoginResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  })
}

export async function getMe(): Promise<AuthUser> {
  return api<AuthUser>('/auth/me')
}

export async function changePassword(currentPassword: string, newPassword: string): Promise<AuthUser> {
  return api<AuthUser>('/auth/change-password', {
    method: 'POST',
    body: JSON.stringify({ currentPassword, newPassword }),
  })
}
