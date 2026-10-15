import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { ApiError } from '../../../lib/api'
import { BuyerCard } from '../components/BuyerCard'
import { MaterialFilter } from '../components/MaterialFilter'
import { RadiusSelect } from '../components/RadiusSelect'
import { formatCep, isValidCep, normalizeCep } from '../services/cep'
import { parseRadiusKm, searchNearbyBuyers } from '../services/searchApi'
import type { RecyclingCode } from '../types'

export function ResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const cep = normalizeCep(searchParams.get('cep') ?? '')
  const radius = parseRadiusKm(searchParams.get('raio'))
  const [material, setMaterial] = useState<RecyclingCode | 'ALL'>('ALL')

  const query = useQuery({
    queryKey: ['search', cep, radius],
    queryFn: () => searchNearbyBuyers(cep, radius),
    enabled: isValidCep(cep),
  })

  const availableCodes = useMemo(() => {
    const codes = new Set<RecyclingCode>()
    for (const buyer of query.data?.buyers ?? []) {
      for (const product of buyer.products) codes.add(product.recicling_code)
    }
    return [...codes]
  }, [query.data])

  const filteredBuyers = useMemo(() => {
    const buyers = query.data?.buyers ?? []
    if (material === 'ALL') return buyers
    return buyers.filter((buyer) =>
      buyer.products.some((product) => product.recicling_code === material),
    )
  }, [material, query.data])

  if (!isValidCep(cep)) {
    return (
      <EmptyState
        title="Informe um CEP para buscar"
        description="A busca de compradores começa pelo CEP da sua região."
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
            Compradores próximos ao CEP {formatCep(cep)}
          </h1>
          {query.data && (
            <p className="mt-2 text-sm text-stone-600">
              {query.data.buyers.length} comprador(es) no raio de {query.data.radiusLabel}.
            </p>
          )}
        </div>
        <div className="w-full sm:max-w-48">
          <RadiusSelect
            value={radius}
            onChange={(next) => {
              setMaterial('ALL')
              setSearchParams({ cep, raio: String(next) })
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
          <MaterialFilter codes={availableCodes} value={material} onChange={setMaterial} />
          {filteredBuyers.length === 0 ? (
            <EmptyState
              title="Nenhum comprador para este material"
              description="Limpe o filtro ou escolha outro tipo de reciclável."
            />
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {filteredBuyers.map((buyer) => (
                <BuyerCard key={buyer.id} buyer={buyer} />
              ))}
            </div>
          )}
        </>
      )}
    </section>
  )
}
