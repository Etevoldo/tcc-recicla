import { Link } from 'react-router-dom'
import { formatPhone } from '../../../lib/format'
import { formatCep } from '../services/cep'
import type { BuyerWithProducts } from '../types'
import { productPrice } from '../types'
import { MaterialBadge } from './MaterialBadge'
import { formatPrice } from '../../../lib/format'

export function BuyerCard({ buyer }: { buyer: BuyerWithProducts }) {
  const pricedProducts = buyer.products.filter((product) => productPrice(product) != null)

  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-green-950">{buyer.name}</h2>
      <p className="mt-2 text-sm text-stone-600">
        {buyer.address}, {buyer.addressNumber} · CEP {formatCep(buyer.cep)}
      </p>
      <p className="mt-1 text-sm text-stone-600">{formatPhone(buyer.phoneNumber)}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {pricedProducts.length === 0 ? (
          <span className="text-sm text-stone-500">Sem ofertas cadastradas</span>
        ) : (
          pricedProducts.map((product) => (
            <MaterialBadge
              key={product.id}
              code={product.recicling_code}
              priceLabel={formatPrice(productPrice(product) ?? 0)}
            />
          ))
        )}
      </div>
      <Link
        to={`/compradores/${buyer.id}`}
        className="mt-5 inline-flex font-semibold text-green-800 hover:text-green-950"
      >
        Ver detalhes
      </Link>
    </article>
  )
}
