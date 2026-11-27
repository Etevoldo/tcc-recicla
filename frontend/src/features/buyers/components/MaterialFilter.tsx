import { formatRecyclingOption, RECYCLING_CODES } from '../constants/recyclingCodes'
import type { RecyclingCode } from '../types'
import { FilterSelect } from './FilterSelect'

const SWATCH: Record<RecyclingCode, string> = {
  AZUL: 'bg-blue-500',
  VERDE: 'bg-green-600',
  AMARELO: 'bg-yellow-400',
  PRETO: 'bg-stone-800',
  LARANJA: 'bg-orange-500',
  BRANCO: 'bg-slate-200 ring-1 ring-stone-300',
  ROXO: 'bg-purple-500',
  MARROM: 'bg-amber-800',
  PET: 'bg-cyan-500',
  PEAD: 'bg-teal-500',
  PVC: 'bg-indigo-500',
  PEBD: 'bg-sky-400',
  PP: 'bg-lime-500',
  PS: 'bg-pink-500',
  O: 'bg-stone-400',
}

export function MaterialFilter({
  value,
  onChange,
}: {
  value: RecyclingCode | 'ALL'
  onChange: (value: RecyclingCode | 'ALL') => void
}) {
  return (
    <FilterSelect
      id="filtro-material"
      label="Material"
      value={value}
      onChange={(next) => onChange(next as RecyclingCode | 'ALL')}
      options={[
        { value: 'ALL', label: 'Todos' },
        ...RECYCLING_CODES.map((info) => ({
          value: info.code,
          label: formatRecyclingOption(info),
          swatch: SWATCH[info.code],
        })),
      ]}
    />
  )
}
