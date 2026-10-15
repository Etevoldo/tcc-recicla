import type { InputHTMLAttributes, ReactNode, Ref } from 'react'
import { cn } from '../../lib/cn'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  error?: string
  hint?: string
  trailing?: ReactNode
  ref?: Ref<HTMLInputElement>
}

export function Input({ id, label, error, hint, trailing, className, ref, ...props }: InputProps) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-semibold">
        {label}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            'min-h-12 w-full rounded-xl border bg-white px-4 py-3 text-base',
            error ? 'border-red-600' : 'border-stone-300',
            trailing ? 'pr-12' : undefined,
            className,
          )}
          {...props}
        />
        {trailing}
      </div>
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-2 text-xs text-stone-500">
          {hint}
        </p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-2 text-sm text-red-700">
          {error}
        </p>
      )}
    </div>
  )
}
