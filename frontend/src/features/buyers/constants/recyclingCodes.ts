import type { RecyclingCode } from '../types'

export type RecyclingCodeInfo = {
  code: RecyclingCode
  label: string
  className: string
}

export const RECYCLING_CODES: RecyclingCodeInfo[] = [
  { code: 'AZUL', label: 'Papel ou papelão', className: 'bg-blue-100 text-blue-800' },
  { code: 'VERDE', label: 'Vidro', className: 'bg-green-100 text-green-800' },
  { code: 'AMARELO', label: 'Metal', className: 'bg-yellow-100 text-yellow-800' },
  { code: 'PRETO', label: 'Madeira', className: 'bg-stone-200 text-stone-800' },
  { code: 'LARANJA', label: 'Resíduos perigosos', className: 'bg-orange-100 text-orange-800' },
  { code: 'BRANCO', label: 'Resíduos de saúde', className: 'bg-slate-100 text-slate-700' },
  { code: 'ROXO', label: 'Resíduos radioativos', className: 'bg-purple-100 text-purple-800' },
  { code: 'MARROM', label: 'Resíduos orgânicos', className: 'bg-amber-100 text-amber-900' },
  { code: 'PET', label: 'PET', className: 'bg-cyan-100 text-cyan-800' },
  { code: 'PEAD', label: 'PEAD', className: 'bg-teal-100 text-teal-800' },
  { code: 'PVC', label: 'PVC', className: 'bg-indigo-100 text-indigo-800' },
  { code: 'PEBD', label: 'PEBD', className: 'bg-sky-100 text-sky-800' },
  { code: 'PP', label: 'Polipropileno', className: 'bg-lime-100 text-lime-800' },
  { code: 'PS', label: 'Poliestireno', className: 'bg-pink-100 text-pink-800' },
  { code: 'O', label: 'Outros', className: 'bg-stone-100 text-stone-700' },
]

const recyclingCodeMap = new Map(RECYCLING_CODES.map((item) => [item.code, item]))

export function getRecyclingCode(code: RecyclingCode): RecyclingCodeInfo {
  return recyclingCodeMap.get(code) ?? { code, label: code, className: 'bg-stone-100 text-stone-700' }
}
