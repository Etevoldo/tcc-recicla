import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError, setAuthToken, setOnUnauthorized } from './api'

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('api', () => {
  it('retorna null quando a resposta 204 não tem corpo', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response(null, { status: 204 })),
    )
    await expect(api('/buyers/1', { method: 'DELETE' })).resolves.toBeNull()
  })

  it('retorna null quando o JSON é null', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(new Response('null', { status: 200 })),
    )
    await expect(api('/buyers/99')).resolves.toBeNull()
  })

  it('lança ApiError em 404', async () => {
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Comprador não encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }),
      ),
    )
    const error = await api('/buyers/99').catch((caught) => caught)
    expect(error).toBeInstanceOf(ApiError)
    expect(error).toMatchObject({ status: 404, message: 'Comprador não encontrado' })
  })

  it('envia Authorization quando há token', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('null', { status: 200 }))
    vi.stubGlobal('fetch', fetchMock)
    setAuthToken('tok-123')
    await api('/buyers/1')
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/buyers/1',
      expect.objectContaining({
        headers: expect.objectContaining({ Authorization: 'Bearer tok-123' }),
      }),
    )
  })

  it('chama o callback de sessão em 401', async () => {
    const onUnauthorized = vi.fn()
    setOnUnauthorized(onUnauthorized)
    vi.stubGlobal(
      'fetch',
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ message: 'Não autenticado' }), { status: 401 }),
      ),
    )
    await api('/auth/me').catch(() => undefined)
    expect(onUnauthorized).toHaveBeenCalled()
  })
})
