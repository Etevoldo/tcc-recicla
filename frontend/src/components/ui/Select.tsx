import type { SelectHTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

type SelectProps = SelectHTMLAttributes<HTMLSelectElement> & {
  label: string
  error?: string
}

export function Select({ id, label, error, className, children, ...props }: SelectProps) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <select
        id={id}
        aria-invalid={!!error}
        className={cn(
          'min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base',
          error ? 'border-red-600' : 'border-stone-300',
          className,
        )}
        {...props}
      >
        {children}
      </select>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
