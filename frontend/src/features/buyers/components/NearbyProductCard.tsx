import { Link } from 'react-router-dom'
import { formatPhone, formatPrice } from '../../../lib/format'
import { formatCep } from '../services/cep'
import type { NearbyProductMatch } from '../services/productSearch'
import { productPrice } from '../types'
import { MaterialBadge } from './MaterialBadge'

export function NearbyProductCard({ product, buyer }: NearbyProductMatch) {
  const price = productPrice(product)

  return (
    <article className="rounded-3xl border border-stone-200 bg-white p-6 shadow-sm">
      <p className="text-xs font-bold uppercase tracking-widest text-stone-500">Código {product.id}</p>
      <h2 className="mt-2 text-xl font-bold text-green-950">{product.name}</h2>
      <div className="mt-3">
        <MaterialBadge
          code={product.recicling_code}
          priceLabel={price != null ? formatPrice(price) : undefined}
        />
      </div>
      <p className="mt-4 text-sm text-stone-600">
        Comprador próximo: <span className="font-semibold text-green-950">{buyer.name}</span>
      </p>
      <p className="mt-1 text-sm text-stone-600">
        {buyer.address}, {buyer.addressNumber} · CEP {formatCep(buyer.cep)}
      </p>
      <p className="mt-1 text-sm text-stone-600">{formatPhone(buyer.phoneNumber)}</p>
      <Link
        to={`/compradores/${buyer.id}`}
        className="mt-5 inline-flex font-semibold text-green-800 hover:text-green-950"
      >
        Ver comprador
      </Link>
    </article>
  )
}
