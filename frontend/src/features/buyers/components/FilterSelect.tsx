import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'

export type FilterOption = {
  value: string
  label: string
  swatch?: string
}

export function FilterSelect({
  id,
  label,
  value,
  options,
  onChange,
}: {
  id: string
  label: string
  value: string
  options: FilterOption[]
  onChange: (value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)
  const labelId = useId()
  const selected = options.find((option) => option.value === value)

  useEffect(() => {
    if (!open) return

    function closeOnOutside(event: PointerEvent) {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false)
    }

    function closeOnEscape(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false)
    }

    document.addEventListener('pointerdown', closeOnOutside)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutside)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [open])

  return (
    <div ref={rootRef} className="relative">
      <label id={labelId} htmlFor={id} className="mb-2 block text-sm font-semibold text-green-950">
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((current) => !current)}
        className={cn(
          'flex min-h-12 w-full items-center justify-between gap-3 rounded-2xl border bg-white px-4 py-3 text-left text-base shadow-sm transition',
          open ? 'border-green-700 ring-2 ring-green-700/20' : 'border-stone-200 hover:border-green-700',
        )}
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.swatch && <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', selected.swatch)} />}
          <span className="truncate text-stone-800">{selected?.label ?? 'Todos'}</span>
        </span>
        <svg
          viewBox="0 0 20 20"
          aria-hidden="true"
          className={cn('h-5 w-5 shrink-0 text-stone-500 transition', open && 'rotate-180')}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={labelId}
          className="absolute top-full z-30 mt-2 max-h-72 w-full overflow-y-auto rounded-2xl border border-stone-200 bg-white p-1.5 shadow-xl"
        >
          {options.map((option) => {
            const active = option.value === value
            return (
              <li key={option.value} role="presentation">
                <button
                  type="button"
                  role="option"
                  aria-selected={active}
                  onClick={() => {
                    onChange(option.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm',
                    active ? 'bg-green-900 font-semibold text-white' : 'text-stone-800 hover:bg-green-50',
                  )}
                >
                  {option.swatch && (
                    <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', option.swatch, active && 'ring-2 ring-white')} />
                  )}
                  <span className="min-w-0 flex-1 truncate">{option.label}</span>
                  {active && <span aria-hidden="true">✓</span>}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
