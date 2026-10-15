export function Spinner({ label = 'Carregando...' }: { label?: string }) {
  return (
    <div className="flex items-center justify-center gap-3 py-12 text-stone-600" role="status">
      <span className="h-5 w-5 animate-spin rounded-full border-2 border-green-700 border-t-transparent" />
      <span>{label}</span>
    </div>
  )
}
