import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import { CepForm } from './CepForm'

function LocationDisplay() {
  const location = useLocation()
  return <div data-testid="location">{`${location.pathname}${location.search}`}</div>
}

describe('CepForm', () => {
  it('navega para a lista com CEP normalizado e raio padrão', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CepForm />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Seu CEP'), '05424020')
    await user.click(screen.getByRole('button', { name: /buscar próximos/i }))

    expect(screen.getByTestId('location').textContent).toBe('/compradores?cep=05424020&raio=15')
  })

  it('inclui o produto na busca quando informado', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <CepForm />
        <LocationDisplay />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Seu CEP'), '05424-020')
    await user.type(screen.getByLabelText('Produto (opcional)'), 'PET')
    await user.click(screen.getByRole('button', { name: /buscar próximos/i }))

    expect(screen.getByTestId('location').textContent).toBe(
      '/compradores?cep=05424020&raio=15&produto=PET',
    )
  })

  it('mostra erro quando o CEP está incompleto', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter>
        <Routes>
          <Route path="/" element={<CepForm />} />
        </Routes>
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText('Seu CEP'), '05424')
    await user.click(screen.getByRole('button', { name: /buscar próximos/i }))

    expect(screen.getByRole('alert').textContent).toBe('Informe os oito dígitos do CEP.')
  })
})
