import { formatRecyclingOption, RECYCLING_CODES } from '../constants/recyclingCodes'
import type { RecyclingCode } from '../types'
import { FilterSelect } from './FilterSelect'

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
        })),
      ]}
    />
  )
}
