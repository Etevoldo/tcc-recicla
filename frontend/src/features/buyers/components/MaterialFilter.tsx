import { cn } from '../../../lib/cn'
import { getRecyclingCode } from '../constants/recyclingCodes'
import type { RecyclingCode } from '../types'

export function MaterialFilter({
  codes,
  value,
  onChange,
}: {
  codes: RecyclingCode[]
  value: RecyclingCode | 'ALL'
  onChange: (value: RecyclingCode | 'ALL') => void
}) {
  if (codes.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por material">
      <button
        type="button"
        onClick={() => onChange('ALL')}
        className={cn(
          'rounded-full px-3 py-1 text-xs font-semibold',
          value === 'ALL' ? 'bg-green-900 text-white' : 'bg-stone-100 text-stone-700 hover:bg-stone-200',
        )}
      >
        Todos
      </button>
      {codes.map((code) => {
        const info = getRecyclingCode(code)
        return (
          <button
            key={code}
            type="button"
            onClick={() => onChange(code)}
            className={cn(
              'rounded-full px-3 py-1 text-xs font-semibold',
              value === code ? 'ring-2 ring-green-800 ring-offset-2' : '',
              info.className,
            )}
          >
            {info.label}
          </button>
        )
      })}
    </div>
  )
}
