import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../../auth/AuthContext'
import { BuyerAreaPage } from './BuyerAreaPage'

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

describe('BuyerAreaPage', () => {
  it('valida os campos de Meus dados', async () => {
    localStorage.setItem(
      'recicla.user',
      JSON.stringify({
        id: 2,
        name: 'Ana Silva',
        email: 'ana.silva@email.com',
        role: 'BUYER',
        buyerId: 1,
        mustChangePassword: false,
      }),
    )
    vi.stubGlobal(
      'fetch',
      vi.fn(async (input: RequestInfo | URL) => {
        const url = String(input)
        if (url.includes('/products')) {
          return new Response(JSON.stringify([]), { status: 200 })
        }
        if (url.includes('/buyers/1')) {
          return new Response(
            JSON.stringify({
              id: 1,
              name: '',
              cpf: '',
              email: 'ana.silva@email.com',
              phoneNumber: '',
              cep: '',
              address: '',
              addressNumber: '',
            }),
            { status: 200 },
          )
        }
        return new Response('not found', { status: 404 })
      }),
    )

    const user = userEvent.setup()
    render(<BuyerAreaPage />, { wrapper: ({ children }) => wrap(children) })

    await user.click(await screen.findByRole('button', { name: 'Editar dados' }))
    await user.click(screen.getByRole('button', { name: 'Salvar dados' }))
    expect(screen.getByText('Informe o nome.')).toBeTruthy()
    expect(screen.getByText('Informe um telefone válido.')).toBeTruthy()
    expect(screen.getByText('Informe os oito dígitos do CEP.')).toBeTruthy()
    expect(screen.getByText('Informe o endereço.')).toBeTruthy()
    expect(screen.getByText('Informe o número.')).toBeTruthy()
  })
})
