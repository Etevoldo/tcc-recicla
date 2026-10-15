export class ApiError extends Error {
  status: number

  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

const BASE = '/api'

async function parseBody(response: Response): Promise<unknown> {
  const text = await response.text()
  if (!text) return null
  try {
    return JSON.parse(text)
  } catch {
    return text
  }
}

function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === 'object' && 'message' in body) {
    const message = (body as { message: unknown }).message
    if (typeof message === 'string' && message.trim()) return message
  }
  return fallback
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const hasBody = init?.body != null
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      ...(hasBody ? { 'Content-Type': 'application/json' } : {}),
      ...init?.headers,
    },
  })

  const body = await parseBody(response)

  if (!response.ok) {
    const fallback =
      response.status >= 500
        ? 'Não foi possível conectar à API.'
        : response.statusText || `Erro ${response.status}`
    throw new ApiError(response.status, errorMessage(body, fallback))
  }

  return body as T
}
