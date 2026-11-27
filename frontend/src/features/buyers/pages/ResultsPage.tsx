import { useEffect, useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { ApiError } from '../../../lib/api'
import { BuyerCard } from '../components/BuyerCard'
import { ItemFilter } from '../components/ItemFilter'
import { MaterialFilter } from '../components/MaterialFilter'
import { NearbyProductCard } from '../components/NearbyProductCard'
import { RadiusSelect } from '../components/RadiusSelect'
import { parseRecyclingCode } from '../constants/recyclingCodes'
import { formatCep, isValidCep, normalizeCep } from '../services/cep'
import { collectItemNames, filterBuyersByProduct, nearbyProductMatches, sameItemName } from '../services/productSearch'
import { parseRadiusKm, searchNearbyBuyers } from '../services/searchApi'
import type { RecyclingCode } from '../types'

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cep = normalizeCep(searchParams.get('cep') ?? '')
  const radius = parseRadiusKm(searchParams.get('raio'))
  const productQuery = searchParams.get('produto') ?? ''
  const material = parseRecyclingCode(searchParams.get('cor'))
  const [item, setItem] = useState('ALL')

  const query = useQuery({
    queryKey: ['search', cep, radius],
    queryFn: () => searchNearbyBuyers(cep, radius),
    enabled: isValidCep(cep),
  })

  const itemNames = useMemo(
    () => collectItemNames(query.data?.buyers ?? [], material, productQuery),
    [material, productQuery, query.data],
  )

  useEffect(() => {
    if (item === 'ALL') return
    if (!itemNames.some((name) => sameItemName(name, item))) setItem('ALL')
  }, [item, itemNames])

  const filteredBuyers = useMemo(
    () => filterBuyersByProduct(query.data?.buyers ?? [], material, productQuery, item),
    [item, material, productQuery, query.data],
  )
  const productMatches = useMemo(() => nearbyProductMatches(filteredBuyers), [filteredBuyers])
  const hasProductFilter = productQuery.trim() !== '' || material !== 'ALL' || item !== 'ALL'

  function replaceParams(nextRadius: string, nextMaterial: RecyclingCode | 'ALL') {
    const params = new URLSearchParams()
    params.set('cep', cep)
    params.set('raio', nextRadius)
    if (productQuery.trim()) params.set('produto', productQuery.trim())
    if (nextMaterial !== 'ALL') params.set('cor', nextMaterial)
    setSearchParams(params)
  }

  if (!isValidCep(cep)) {
    return (
      <EmptyState
        title="Informe um CEP para buscar"
        description="A busca de compradores e produtos começa pelo CEP da sua região."
        action={
          <Link to="/" className="font-semibold text-green-800 hover:text-green-950">
            Voltar para a busca
          </Link>
        }
      />
    )
  }

  return (
    <section className="grid gap-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-green-700">Resultados</p>
          <h1 className="mt-2 text-3xl font-bold text-green-950">
            {hasProductFilter ? 'Produtos e compradores' : 'Compradores'} próximos ao CEP{' '}
            {formatCep(cep)}
          </h1>
          {query.data && (
            <p className="mt-2 text-sm text-stone-600">
              {query.data.buyers.length} comprador(es) no raio de {query.data.radiusLabel}
              {hasProductFilter ? ` · ${productMatches.length} produto(s) encontrado(s)` : ''}.
            </p>
          )}
        </div>
        <div className="w-full sm:max-w-48">
          <RadiusSelect
            value={radius}
            onChange={(next) => {
              setItem('ALL')
              replaceParams(String(next), 'ALL')
            }}
          />
        </div>
      </div>

      {query.isLoading && <Spinner label="Buscando compradores próximos..." />}

      {query.isError && (
        <ErrorState
          title="Não foi possível buscar compradores"
          message={query.error instanceof ApiError ? query.error.message : 'Tente novamente em instantes.'}
          onRetry={() => void query.refetch()}
          action={
            <Link to="/" className="inline-flex min-h-11 items-center font-semibold text-green-800">
              Alterar CEP
            </Link>
          }
        />
      )}

      {query.data && query.data.buyers.length === 0 && (
        <EmptyState
          title="Nenhum comprador neste raio"
          description="Tente aumentar o raio de busca ou informar outro CEP."
          action={
            <Link to="/" className="font-semibold text-green-800 hover:text-green-950">
              Nova busca
            </Link>
          }
        />
      )}

      {query.data && query.data.buyers.length > 0 && (
        <>
          <div className="grid gap-4 rounded-3xl border border-stone-200 bg-white p-5 shadow-sm sm:grid-cols-2">
            <MaterialFilter value={material} onChange={(next) => replaceParams(String(radius), next)} />
            <ItemFilter names={itemNames} value={item} onChange={setItem} />
          </div>
          {filteredBuyers.length === 0 ? (
            <EmptyState
              title={hasProductFilter ? 'Nenhum produto próximo com essa cor ou item' : 'Nenhum comprador para este material'}
              description="Limpe o filtro, escolha outra cor ou outro item."
            />
          ) : (
            <div className="grid gap-10">
              {hasProductFilter && productMatches.length > 0 && (
                <section className="grid gap-4">
                  <h2 className="text-lg font-bold text-green-950">Produtos próximos</h2>
                  <div className="grid gap-4 md:grid-cols-2">
                    {productMatches.map(({ product, buyer }) => (
                      <NearbyProductCard key={`${buyer.id}-${product.id}`} product={product} buyer={buyer} />
                    ))}
                  </div>
                </section>
              )}
              <section className="grid gap-4">
                {hasProductFilter && <h2 className="text-lg font-bold text-green-950">Compradores próximos</h2>}
                <div className="grid gap-4 md:grid-cols-2">
                  {filteredBuyers.map((buyer) => (
                    <BuyerCard key={buyer.id} buyer={buyer} />
                  ))}
                </div>
              </section>
            </div>
          )}
        </>
      )}
    </section>
  )
}
