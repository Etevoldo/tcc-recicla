import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../AuthContext'
import { RequireAuth } from './RequireAuth'

const pendingUser = {
  id: 2,
  name: 'Maria Souza',
  email: 'maria@recicla.com',
  role: 'BUYER' as const,
  buyerId: 30,
  mustChangePassword: true,
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('RequireAuth', () => {
  it('redireciona para login quando não há sessão', () => {
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/gestao']}>
          <Routes>
            <Route path="/login" element={<div>tela de login</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/gestao" element={<div>área interna</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(screen.getByText('tela de login')).toBeTruthy()
    expect(screen.queryByText('área interna')).toBeNull()
  })

  it('redireciona para /trocar-senha quando mustChangePassword é verdadeiro', async () => {
    localStorage.setItem('recicla.token', 'tok')
    localStorage.setItem('recicla.user', JSON.stringify(pendingUser))
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(JSON.stringify(pendingUser), { status: 200 })),
    )

    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/gestao']}>
          <Routes>
            <Route path="/trocar-senha" element={<div>trocar senha</div>} />
            <Route element={<RequireAuth />}>
              <Route path="/gestao" element={<div>área interna</div>} />
            </Route>
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    expect(await screen.findByText('trocar senha')).toBeTruthy()
    expect(screen.queryByText('área interna')).toBeNull()
  })
})

