import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '../../../lib/cn'
import { useAuth } from '../../auth/AuthContext'

export function AdminLayout() {
  const { isAdmin } = useAuth()
  const links = isAdmin
    ? [
        { to: '/gestao/compradores', label: 'Compradores' },
        { to: '/gestao/produtos', label: 'Produtos' },
        { to: '/gestao/usuarios', label: 'Usuários' },
      ]
    : [{ to: '/gestao/minha-area', label: 'Minha área' }]

  return (
    <div className="grid gap-8">
      <div>
        <p className="text-xs font-bold uppercase tracking-widest text-green-700">Área interna</p>
        <h1 className="mt-2 text-3xl font-bold text-green-950">Gestão</h1>
        <p className="mt-2 text-sm text-stone-500">
          {isAdmin ? 'Visão de administrador.' : 'Você vê e edita apenas os seus dados.'}
        </p>
      </div>
      <nav className="flex flex-wrap gap-2 border-b border-stone-200 pb-3">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) =>
              cn(
                'rounded-full px-4 py-2 text-sm font-semibold',
                isActive ? 'bg-green-900 text-white' : 'text-stone-600 hover:bg-stone-100',
              )
            }
          >
            {link.label}
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  )
}
