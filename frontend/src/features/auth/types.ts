export type UserRole = 'ADMIN' | 'BUYER'

export type AuthUser = {
  id: number
  name: string
  email: string
  role: UserRole
  buyerId: number | null
  buyerName?: string | null
  mustChangePassword: boolean
}

export type LoginResponse = {
  token: string
  user: AuthUser
}
