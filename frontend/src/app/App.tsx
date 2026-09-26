import { SearchPage } from '../features/sellers/pages/SearchPage'

export function App() {
  return <div className="flex min-h-screen flex-col">
    <header className="border-b border-stone-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-6">
        <a href="/" aria-label="Recicla, página inicial" className="text-2xl font-extrabold tracking-tight text-green-950">recicla<span className="text-green-600">.</span></a>
        <span className="text-right text-xs text-stone-500 sm:text-sm">Conectando novos ciclos</span>
      </div>
    </header>
    <main className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-14 sm:py-24"><SearchPage /></main>
    <footer className="border-t border-stone-200 px-6 py-6 text-center text-sm text-stone-500">Um novo destino para cada material.</footer>
  </div>
}
