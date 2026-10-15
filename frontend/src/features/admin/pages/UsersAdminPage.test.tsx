import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../auth/AuthContext'
import { UsersAdminPage } from './UsersAdminPage'

function wrap(children: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('UsersAdminPage', () => {
  it('valida o modal de novo usuário e envia name, email, password e role', async () => {
    const fetchMock = vi.fn(async (_input: RequestInfo | URL, init?: RequestInit) => {
      if (init?.method === 'POST') {
        return new Response(
          JSON.stringify({
            id: 99,
            name: 'Maria Souza',
            email: 'maria@recicla.com',
            role: 'BUYER',
            buyerId: 30,
            mustChangePassword: true,
          }),
          { status: 201 },
        )
      }
      return new Response(JSON.stringify([]), { status: 200 })
    })
    vi.stubGlobal('fetch', fetchMock)

    const user = userEvent.setup()
    render(<UsersAdminPage />, { wrapper: ({ children }) => wrap(children) })

    await user.click(await screen.findByRole('button', { name: 'Novo usuário' }))
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))
    expect(screen.getByRole('alert').textContent).toBe('Informe o nome.')

    await user.type(screen.getByLabelText('Nome'), 'Maria Souza')
    await user.type(screen.getByLabelText('E-mail'), 'maria@recicla.com')
    await user.type(screen.getByLabelText('Senha'), 'temp123')
    await user.selectOptions(screen.getByLabelText('Tipo de conta'), 'BUYER')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    await waitFor(() => {
      const post = fetchMock.mock.calls.find(([, init]) => init?.method === 'POST')
      expect(post).toBeTruthy()
      expect(JSON.parse(String(post?.[1]?.body))).toEqual({
        name: 'Maria Souza',
        email: 'maria@recicla.com',
        password: 'temp123',
        role: 'BUYER',
      })
    })
  })
})
