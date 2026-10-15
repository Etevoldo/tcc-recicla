import type { ReactNode } from 'react'

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description?: string
  action?: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-dashed border-stone-300 bg-white px-6 py-12 text-center">
      <h2 className="text-lg font-bold text-green-950">{title}</h2>
      {description && <p className="mt-2 text-sm leading-relaxed text-stone-600">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
