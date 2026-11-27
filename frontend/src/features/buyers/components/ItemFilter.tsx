import { FilterSelect } from './FilterSelect'

export function ItemFilter({
  names,
  value,
  onChange,
}: {
  names: string[]
  value: string
  onChange: (value: string) => void
}) {
  if (names.length === 0) return null

  return (
    <FilterSelect
      id="filtro-item"
      label="Item"
      value={value}
      onChange={onChange}
      options={[{ value: 'ALL', label: 'Todos' }, ...names.map((name) => ({ value: name, label: name }))]}
    />
  )
}
