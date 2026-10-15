import { SEARCH_RADIUS_KM, type SearchRadiusKm } from '../services/searchApi'
import { Select } from '../../../components/ui/Select'

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
    <Select
      id={id}
      label={label}
      value={value}
      onChange={(event) => onChange(Number(event.target.value) as SearchRadiusKm)}
    >
      {SEARCH_RADIUS_KM.map((km) => (
        <option key={km} value={km}>
          {km} km
        </option>
      ))}
    </Select>
  )
}
