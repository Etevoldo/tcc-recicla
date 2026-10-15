import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'

export function AppLayout() {
  const location = useLocation()
  const isHome = location.pathname === '/'
  const isAdmin = location.pathname.startsWith('/gestao')

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <Link to="/" aria-label="Recicla, página inicial" className="text-2xl font-extrabold tracking-tight text-green-950">
            recicla<span className="text-green-600">.</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            <span className="hidden text-right text-xs text-stone-500 sm:inline sm:text-sm">
              Conectando novos ciclos
            </span>
            <Link
              to="/gestao/compradores"
              className={cn(
                'font-semibold text-green-800 hover:text-green-950',
                isAdmin && 'underline decoration-2 underline-offset-4',
              )}
            >
              Gestão
            </Link>
          </nav>
        </div>
      </header>
      <main
        className={cn(
          'mx-auto flex w-full max-w-6xl flex-1 flex-col px-6 py-10',
          isHome && 'justify-center py-14 sm:py-24',
        )}
      >
        <Outlet />
      </main>
      <footer className="border-t border-stone-200 px-6 py-6 text-center text-sm text-stone-500">
        Um novo destino para cada material.
      </footer>
    </div>
  )
}
