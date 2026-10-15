import type { HTMLAttributes } from 'react'
import { cn } from '../../lib/cn'

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-3xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8', className)}
      {...props}
    />
  )
}
