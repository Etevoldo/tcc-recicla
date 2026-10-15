import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { ReactNode } from 'react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ResultsPage } from './ResultsPage'

function wrapper({ children, path }: { children: ReactNode; path: string }) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={client}>
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/compradores" element={children} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
}

function mockFetch(handler: (url: string) => Response | Promise<Response>) {
  vi.stubGlobal(
    'fetch',
    vi.fn(async (input: RequestInfo | URL) => handler(String(input))),
  )
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('ResultsPage', () => {
  it('mostra estado vazio quando não há compradores', async () => {
    mockFetch(async (url) => {
      if (url.includes('/addresses/searchBuyers/')) {
        return new Response(JSON.stringify({ compradoresProximos: [], raio: '15Km' }), { status: 200 })
      }
      return new Response('not found', { status: 404 })
    })

    render(<ResultsPage />, { wrapper: ({ children }) => wrapper({ children, path: '/compradores?cep=05424020&raio=15' }) })

    expect(await screen.findByText('Nenhum comprador neste raio')).toBeTruthy()
  })

  it('mostra erro quando o CEP não é encontrado', async () => {
    mockFetch(async () => new Response(JSON.stringify({ message: '' }), { status: 404 }))

    render(<ResultsPage />, { wrapper: ({ children }) => wrapper({ children, path: '/compradores?cep=00000000&raio=15' }) })

    expect(await screen.findByText('Não foi possível buscar compradores')).toBeTruthy()
    expect(screen.getByText('CEP não encontrado ou inválido.')).toBeTruthy()
  })

  it('lista compradores e filtra por material', async () => {
    mockFetch(async (url) => {
      if (url.includes('/addresses/searchBuyers/')) {
        return new Response(
          JSON.stringify({
            compradoresProximos: [
              { id: 1, name: 'Ana Silva', email: 'ana@email.com', phoneNumber: '11987654321', cep: '05424020', address: 'Rua A', addressNumber: '100' },
              { id: 2, name: 'Bruno Costa', email: 'bruno@email.com', phoneNumber: '21976543210', cep: '05424020', address: 'Rua B', addressNumber: '200' },
            ],
            raio: '15Km',
          }),
          { status: 200 },
        )
      }
      if (url.includes('/buyers/1/products')) {
        return new Response(
          JSON.stringify([{ id: 1, name: 'Garrafa PET', recicling_code: 'PET', Offer: { price: 150 } }]),
          { status: 200 },
        )
      }
      if (url.includes('/buyers/2/products')) {
        return new Response(
          JSON.stringify([{ id: 2, name: 'Papelão', recicling_code: 'AZUL', Offer: { price: 80 } }]),
          { status: 200 },
        )
      }
      return new Response('not found', { status: 404 })
    })

    const user = userEvent.setup()
    render(<ResultsPage />, { wrapper: ({ children }) => wrapper({ children, path: '/compradores?cep=05424020&raio=15' }) })

    expect(await screen.findByText('Ana Silva')).toBeTruthy()
    expect(screen.getByText('Bruno Costa')).toBeTruthy()
    expect(screen.getByText(/2 comprador\(es\) no raio de 15Km/)).toBeTruthy()

    await user.click(screen.getByRole('button', { name: 'PET' }))
    await waitFor(() => {
      expect(screen.getByText('Ana Silva')).toBeTruthy()
      expect(screen.queryByText('Bruno Costa')).toBeNull()
    })
  })
})
