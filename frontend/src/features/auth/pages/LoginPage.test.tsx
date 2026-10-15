import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { AuthProvider } from '../AuthContext'
import { LoginPage } from './LoginPage'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('LoginPage', () => {
  it('mostra erro quando as credenciais são inválidas', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Credenciais inválidas' }), { status: 401 }),
      ),
    )
    const user = userEvent.setup()
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={['/login']}>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
          </Routes>
        </MemoryRouter>
      </AuthProvider>,
    )

    await user.type(screen.getByLabelText('E-mail'), 'ana.silva@email.com')
    await user.type(screen.getByLabelText('Senha'), 'errada')
    await user.click(screen.getByRole('button', { name: 'Entrar' }))

    expect(await screen.findByRole('alert')).toBeTruthy()
    expect(screen.getByRole('alert').textContent).toBe('E-mail ou senha inválidos.')
  })
})
