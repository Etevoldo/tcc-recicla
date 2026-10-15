import { getRecyclingCode } from '../constants/recyclingCodes'
import type { RecyclingCode } from '../types'
import { cn } from '../../../lib/cn'

export function MaterialBadge({
  code,
  priceLabel,
}: {
  code: RecyclingCode
  priceLabel?: string
}) {
  const info = getRecyclingCode(code)
  return (
    <span className={cn('inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold', info.className)}>
      <span>{info.label}</span>
      {priceLabel && <span>{priceLabel}</span>}
    </span>
  )
}
