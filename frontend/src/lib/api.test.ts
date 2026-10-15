import { afterEach, describe, expect, it, vi } from 'vitest'
import { api, ApiError } from './api'

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
})
