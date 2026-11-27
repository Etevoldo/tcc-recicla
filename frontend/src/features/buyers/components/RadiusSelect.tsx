import { SEARCH_RADIUS_KM, type SearchRadiusKm } from '../services/searchApi'
import { FilterSelect } from './FilterSelect'

export function RadiusSelect({
  id = 'raio',
  value,
  onChange,
  label = 'Raio de busca',
}: {
  id?: string
  value: SearchRadiusKm
  onChange: (value: SearchRadiusKm) => void
  label?: string
}) {
  return (
    <FilterSelect
      id={id}
      label={label}
      value={String(value)}
      onChange={(next) => onChange(Number(next) as SearchRadiusKm)}
      options={SEARCH_RADIUS_KM.map((km) => ({ value: String(km), label: `${km} km` }))}
    />
  )
}
