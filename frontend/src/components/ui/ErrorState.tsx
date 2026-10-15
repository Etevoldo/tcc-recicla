import type { ReactNode } from 'react'
import { Button } from './Button'

export function ErrorState({
  title = 'Não foi possível carregar os dados',
  message,
  onRetry,
  action,
}: {
  title?: string
  message?: string
  onRetry?: () => void
  action?: ReactNode
}) {
  return (
    <div className="rounded-3xl border border-red-200 bg-red-50 px-6 py-10 text-center">
      <h2 className="text-lg font-bold text-red-900">{title}</h2>
      {message && <p className="mt-2 text-sm leading-relaxed text-red-800">{message}</p>}
      <div className="mt-6 flex justify-center gap-3">
        {onRetry && (
          <Button type="button" onClick={onRetry}>
            Tentar novamente
          </Button>
        )}
        {action}
      </div>
    </div>
  )
}
