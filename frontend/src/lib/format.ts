export function formatPrice(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  })
}

export function reaisToCents(value: string): number {
  const trimmed = value.trim().replace(/[R$\s]/g, '')
  if (!trimmed) return Number.NaN
  const normalized = trimmed.includes(',')
    ? trimmed.replace(/\./g, '').replace(',', '.')
    : trimmed
  const amount = Number(normalized)
  return Number.isFinite(amount) ? Math.round(amount * 100) : Number.NaN
}

export function centsToReaisInput(cents: number): string {
  return (cents / 100).toFixed(2).replace('.', ',')
}

export function normalizeCpf(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function formatCpf(value: string): string {
  return normalizeCpf(value)
    .replace(/^(\d{3})(\d)/, '$1.$2')
    .replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3')
    .replace(/^(\d{3})\.(\d{3})\.(\d{3})(\d)/, '$1.$2.$3-$4')
}

export function isValidCpf(value: string): boolean {
  const cpf = normalizeCpf(value)
  if (!/^\d{11}$/.test(cpf)) return false
  if (/^(\d)\1{10}$/.test(cpf)) return false

  let sum = 0
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i)
  let first = (sum * 10) % 11
  if (first === 10) first = 0
  if (first !== Number(cpf[9])) return false

  sum = 0
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i)
  let second = (sum * 10) % 11
  if (second === 10) second = 0
  return second === Number(cpf[10])
}

export function normalizePhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11)
}

export function formatPhone(value: string): string {
  const digits = normalizePhone(value)
  if (!digits) return ''
  if (digits.length <= 2) return `(${digits}`
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`
  if (digits.length <= 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`
  }
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`
}

export function isValidPhone(value: string): boolean {
  const digits = normalizePhone(value)
  return digits.length === 10 || digits.length === 11
}

export function isValidEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())
}

export function whatsappLink(phone: string): string {
  const digits = normalizePhone(phone)
  const withCountry = digits.startsWith('55') ? digits : `55${digits}`
  return `https://wa.me/${withCountry}`
}
