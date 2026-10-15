import { Link } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { formatPhone } from '../../../lib/format'
import { formatCep } from '../../buyers/services/cep'
import { getBuyers } from '../../buyers/services/buyersApi'
import { getProducts } from '../../buyers/services/productsApi'

export function BuyersAdminPage() {
  const buyersQuery = useQuery({ queryKey: ['buyers'], queryFn: getBuyers })
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts })

  if (buyersQuery.isLoading) return <Spinner label="Carregando compradores..." />
  if (buyersQuery.isError) {
    return <ErrorState onRetry={() => void buyersQuery.refetch()} />
  }

  const buyers = buyersQuery.data ?? []
  const products = productsQuery.data ?? []

  function productCount(buyerId: number) {
    return products.filter((product) => product.ownerId === buyerId || product.owner?.id === buyerId).length
  }

  return (
    <section className="grid gap-6">
      <h2 className="text-xl font-bold text-green-950">Compradores</h2>
      {buyers.length === 0 ? (
        <EmptyState title="Nenhum comprador cadastrado" />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">E-mail</th>
                <th className="px-4 py-3 font-semibold">Telefone</th>
                <th className="px-4 py-3 font-semibold">CEP</th>
                <th className="px-4 py-3 font-semibold">Produtos</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="border-b border-stone-100">
                  <td className="px-4 py-3 font-medium text-green-950">{buyer.name}</td>
                  <td className="px-4 py-3">{buyer.email}</td>
                  <td className="px-4 py-3">{buyer.phoneNumber ? formatPhone(buyer.phoneNumber) : '—'}</td>
                  <td className="px-4 py-3">{buyer.cep ? formatCep(buyer.cep) : '—'}</td>
                  <td className="px-4 py-3">{productCount(buyer.id)}</td>
                  <td className="px-4 py-3">
                    <Link to={`/compradores/${buyer.id}`} className="font-semibold text-green-800">
                      Ver página pública
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  )
}
