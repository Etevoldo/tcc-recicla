import { useEffect, useId, useRef, useState } from 'react'
import { cn } from '../../../lib/cn'

export type FilterOption = {
  value: string
  label: string
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
      <label id={labelId} htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <button
        id={id}
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-labelledby={labelId}
        onClick={() => setOpen((current) => !current)}
        className="flex min-h-12 w-full items-center justify-between gap-3 rounded-xl border border-stone-300 bg-white px-4 py-3 text-left text-base"
      >
        <span className="truncate">{selected?.label ?? 'Todos'}</span>
        <span aria-hidden="true" className="text-stone-500">
          ▾
        </span>
      </button>
      {open && (
        <ul
          role="listbox"
          aria-labelledby={labelId}
          className="absolute top-full z-30 mt-1 max-h-60 w-full overflow-y-auto rounded-xl border border-stone-200 bg-white py-1 shadow-lg"
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
                    'w-full px-4 py-2 text-left text-sm',
                    active ? 'bg-green-900 font-semibold text-white' : 'text-stone-800 hover:bg-stone-100',
                  )}
                >
                  {option.label}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
