import { RECYCLING_CODE_VALUES, type RecyclingCode } from '../types'

export type RecyclingCodeInfo = {
  code: RecyclingCode
  colorLabel: string
  label: string
  className: string
}

export const RECYCLING_CODES: RecyclingCodeInfo[] = [
  { code: 'AZUL', colorLabel: 'Azul', label: 'Papel ou papelão', className: 'bg-blue-100 text-blue-800' },
  { code: 'VERDE', colorLabel: 'Verde', label: 'Vidro', className: 'bg-green-100 text-green-800' },
  { code: 'AMARELO', colorLabel: 'Amarelo', label: 'Metal', className: 'bg-yellow-100 text-yellow-800' },
  { code: 'PRETO', colorLabel: 'Preto', label: 'Madeira', className: 'bg-stone-200 text-stone-800' },
  { code: 'LARANJA', colorLabel: 'Laranja', label: 'Resíduos perigosos', className: 'bg-orange-100 text-orange-800' },
  { code: 'BRANCO', colorLabel: 'Branco', label: 'Resíduos ambulatoriais e de serviços de saúde', className: 'bg-slate-100 text-slate-700' },
  { code: 'ROXO', colorLabel: 'Roxo', label: 'Resíduos radioativos', className: 'bg-purple-100 text-purple-800' },
  { code: 'MARROM', colorLabel: 'Marrom', label: 'Resíduos orgânicos', className: 'bg-amber-100 text-amber-900' },
  { code: 'PET', colorLabel: 'PET', label: 'Polietileno tereftalato', className: 'bg-cyan-100 text-cyan-800' },
  { code: 'PEAD', colorLabel: 'PEAD', label: 'Polietileno de alta densidade', className: 'bg-teal-100 text-teal-800' },
  { code: 'PVC', colorLabel: 'PVC', label: 'Policloreto de vinila', className: 'bg-indigo-100 text-indigo-800' },
  { code: 'PEBD', colorLabel: 'PEBD', label: 'Polietileno de baixa densidade', className: 'bg-sky-100 text-sky-800' },
  { code: 'PP', colorLabel: 'PP', label: 'Polipropileno', className: 'bg-lime-100 text-lime-800' },
  { code: 'PS', colorLabel: 'PS', label: 'Poliestireno', className: 'bg-pink-100 text-pink-800' },
  { code: 'O', colorLabel: 'Outros', label: 'Outros', className: 'bg-stone-100 text-stone-700' },
]

const recyclingCodeMap = new Map(RECYCLING_CODES.map((item) => [item.code, item]))

export function getRecyclingCode(code: RecyclingCode): RecyclingCodeInfo {
  return recyclingCodeMap.get(code) ?? { code, colorLabel: code, label: code, className: 'bg-stone-100 text-stone-700' }
}

export function formatRecyclingOption(info: RecyclingCodeInfo): string {
  if (info.code === 'O') return info.label
  return `${info.code} — ${info.label}`
}

export function formatRecyclingColor(info: RecyclingCodeInfo): string {
  if (info.colorLabel.localeCompare(info.label, 'pt-BR', { sensitivity: 'accent' }) === 0) {
    return info.colorLabel
  }
  return `${info.colorLabel} · ${info.label}`
}

export function parseRecyclingCode(value: string | null | undefined): RecyclingCode | 'ALL' {
  const code = value?.trim().toUpperCase()
  if (!code) return 'ALL'
  if ((RECYCLING_CODE_VALUES as readonly string[]).includes(code)) return code as RecyclingCode
  return 'ALL'
}
