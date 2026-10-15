import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { BuyerFormPage } from './BuyerFormPage'

function wrap(children: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={['/gestao/compradores/novo']}>
        <Routes>
          <Route path="/gestao/compradores/novo" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('BuyerFormPage', () => {
  it('valida campos obrigatórios e formatos', async () => {
    const user = userEvent.setup()
    render(<BuyerFormPage />, { wrapper: ({ children }) => wrap(children) })

    await user.click(screen.getByRole('button', { name: 'Salvar' }))

    expect(screen.getByText('Informe o nome.')).toBeTruthy()
    expect(screen.getByText('Informe um CPF válido.')).toBeTruthy()
    expect(screen.getByText('Informe um e-mail válido.')).toBeTruthy()
    expect(screen.getByText('Informe um telefone válido.')).toBeTruthy()
    expect(screen.getByText('Informe os oito dígitos do CEP.')).toBeTruthy()
    expect(screen.getByText('Informe o endereço.')).toBeTruthy()
    expect(screen.getByText('Informe o número.')).toBeTruthy()
  })
})
