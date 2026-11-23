import { Link, Outlet, useLocation } from 'react-router-dom'
import { cn } from '../../lib/cn'
import { useAuth } from '../../features/auth/AuthContext'

const gestaoLinkClass =
  'inline-flex min-h-11 items-center justify-center rounded-xl bg-green-900 px-4 py-2 font-semibold text-white transition-colors hover:bg-green-800'

export function AppLayout() {
  const location = useLocation()
  const { user, logout } = useAuth()
  const isHome = location.pathname === '/'
  const isGestao = location.pathname.startsWith('/gestao') || location.pathname === '/login'

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-stone-200 bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
          <Link to="/" aria-label="Recicla, página inicial" className="text-2xl font-extrabold tracking-tight text-green-950">
            recicla<span className="text-green-600">.</span>
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <span className="hidden text-stone-500 sm:inline">{user.name || user.email}</span>
                <Link
                  to="/gestao"
                  className={cn(gestaoLinkClass, isGestao && 'ring-2 ring-green-700 ring-offset-2')}
                >
                  Gestão
                </Link>
                <button
                  type="button"
                  onClick={logout}
                  className="font-semibold text-stone-600 hover:text-stone-900"
                >
                  Sair
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={cn(gestaoLinkClass, isGestao && 'ring-2 ring-green-700 ring-offset-2')}
              >
                Gestão
              </Link>
            )}
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
