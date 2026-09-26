import { CepForm } from '../components/CepForm'

export function SearchPage() {
  return <section aria-labelledby="search-title" className="grid w-full gap-12 md:grid-cols-[1.2fr_1fr] md:items-center">
    <div>
      <p className="mb-5 text-xs font-bold uppercase tracking-widest text-green-700">Reciclar aproxima</p>
      <h1 id="search-title" className="max-w-xl text-4xl font-bold leading-tight tracking-tight text-green-950 sm:text-5xl">Materiais para um <span className="text-green-700">novo ciclo.</span></h1>
      <p className="mt-6 max-w-lg text-lg leading-relaxed text-stone-600">O primeiro passo para encontrar vendedores de recicláveis perto de você começa com o seu CEP.</p>
      <p className="mt-8 border-l-2 border-lime-400 pl-4 text-sm leading-relaxed text-stone-500">Conectando pessoas e materiais a novas possibilidades.</p>
    </div>
    <CepForm />
  </section>
}
