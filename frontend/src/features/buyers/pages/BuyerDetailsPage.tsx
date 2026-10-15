import { Link, useNavigate, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { ApiError } from '../../../lib/api'
import { formatPhone, formatPrice, whatsappLink } from '../../../lib/format'
import { getRecyclingCode } from '../constants/recyclingCodes'
import { formatCep } from '../services/cep'
import { getBuyer, getBuyerProducts } from '../services/buyersApi'
import { productPrice } from '../types'

export function BuyerDetailsPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const buyerId = Number(id)

  const buyerQuery = useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: () => getBuyer(buyerId),
    enabled: Number.isInteger(buyerId) && buyerId > 0,
  })

  const productsQuery = useQuery({
    queryKey: ['buyerProducts', buyerId],
    queryFn: () => getBuyerProducts(buyerId),
    enabled: Number.isInteger(buyerId) && buyerId > 0,
  })

  if (!Number.isInteger(buyerId) || buyerId <= 0) {
    return <EmptyState title="Comprador inválido" action={<Link to="/">Voltar</Link>} />
  }

  if (buyerQuery.isLoading) return <Spinner label="Carregando comprador..." />

  if (buyerQuery.isError) {
    const notFound = buyerQuery.error instanceof ApiError && buyerQuery.error.status === 404
    return (
      <ErrorState
        title={notFound ? 'Comprador não encontrado' : 'Não foi possível carregar o comprador'}
        message={buyerQuery.error instanceof ApiError ? buyerQuery.error.message : undefined}
        onRetry={notFound ? undefined : () => void buyerQuery.refetch()}
        action={
          <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-green-800">
            Voltar à busca
          </Link>
        }
      />
    )
  }

  const buyer = buyerQuery.data
  if (!buyer) return null

  const products = productsQuery.data ?? []

  return (
    <article className="grid gap-8">
      <div>
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="text-sm font-semibold text-green-800 hover:text-green-950"
        >
          ← Voltar
        </button>
        <h1 className="mt-3 text-3xl font-bold text-green-950">{buyer.name}</h1>
        <p className="mt-2 text-stone-600">
          {buyer.address}, {buyer.addressNumber} · CEP {formatCep(buyer.cep)}
        </p>
      </div>

      <section className="rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-green-950">Contato</h2>
        <ul className="mt-4 grid gap-2 text-sm">
          <li>
            Telefone:{' '}
            <a className="font-semibold text-green-800" href={`tel:${buyer.phoneNumber}`}>
              {formatPhone(buyer.phoneNumber)}
            </a>
          </li>
          <li>
            E-mail:{' '}
            <a className="font-semibold text-green-800" href={`mailto:${buyer.email}`}>
              {buyer.email}
            </a>
          </li>
          <li>
            <a
              className="font-semibold text-green-800"
              href={whatsappLink(buyer.phoneNumber)}
              target="_blank"
              rel="noreferrer"
            >
              Conversar no WhatsApp
            </a>
          </li>
        </ul>
      </section>

      <section className="rounded-3xl border border-stone-200 bg-white p-6">
        <h2 className="text-lg font-bold text-green-950">Materiais e preços</h2>
        {productsQuery.isLoading && <Spinner label="Carregando materiais..." />}
        {productsQuery.isError && (
          <p className="mt-3 text-sm text-red-700">Não foi possível carregar os materiais.</p>
        )}
        {!productsQuery.isLoading && products.length === 0 && (
          <p className="mt-3 text-sm text-stone-600">Este comprador ainda não cadastrou ofertas.</p>
        )}
        {products.length > 0 && (
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4 font-semibold">Material</th>
                  <th className="py-2 pr-4 font-semibold">Código</th>
                  <th className="py-2 font-semibold">Preço</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => {
                  const info = getRecyclingCode(product.recicling_code)
                  const price = productPrice(product)
                  return (
                    <tr key={product.id} className="border-b border-stone-100">
                      <td className="py-3 pr-4 font-medium text-green-950">{product.name}</td>
                      <td className="py-3 pr-4">{info.label}</td>
                      <td className="py-3">{price != null ? formatPrice(price) : '—'}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </article>
  )
}
