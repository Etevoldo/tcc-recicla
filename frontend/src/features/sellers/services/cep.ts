export function normalizeCep(value: string): string {
  return value.replace(/\D/g, '').slice(0, 8)
}

export function formatCep(value: string): string {
  return normalizeCep(value).replace(/^(\d{5})(\d)/, '$1-$2')
}

// Valida o formato; a existência do CEP depende da futura consulta à API.
export function isValidCep(value: string): boolean {
  return /^\d{8}$/.test(value) || /^\d{5}-\d{3}$/.test(value)
}
