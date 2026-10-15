import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Input } from '../../../components/ui/Input'
import { Spinner } from '../../../components/ui/Spinner'
import { centsToReaisInput, formatPrice, reaisToCents } from '../../../lib/format'
import { getBuyer } from '../../buyers/services/buyersApi'
import {
  createOffer,
  deleteBuyerOffer,
  getOffersByBuyer,
  updateOfferPrice,
} from '../../buyers/services/offersApi'
import { getProducts } from '../../buyers/services/productsApi'
import { OfferForm } from '../components/OfferForm'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function BuyerOffersPage() {
  const { id } = useParams()
  const buyerId = Number(id)
  const queryClient = useQueryClient()
  const [pendingProductId, setPendingProductId] = useState<number | null>(null)
  const [editingId, setEditingId] = useState<number | null>(null)
  const [editPrice, setEditPrice] = useState('')
  const [editError, setEditError] = useState('')

  const buyerQuery = useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: () => getBuyer(buyerId),
    enabled: Number.isInteger(buyerId),
  })
  const offersQuery = useQuery({
    queryKey: ['offers', buyerId],
    queryFn: () => getOffersByBuyer(buyerId),
    enabled: Number.isInteger(buyerId),
  })
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getProducts })

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ['offers', buyerId] })
    await queryClient.invalidateQueries({ queryKey: ['buyerProducts', buyerId] })
  }

  const addMutation = useMutation({
    mutationFn: ({ productId, price }: { productId: number; price: number }) =>
      createOffer({ buyerId, productId, price }),
    onSuccess: invalidate,
  })
  const updateMutation = useMutation({
    mutationFn: ({ productId, price }: { productId: number; price: number }) =>
      updateOfferPrice(buyerId, productId, price),
    onSuccess: async () => {
      setEditingId(null)
      await invalidate()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: (productId: number) => deleteBuyerOffer(buyerId, productId),
    onSuccess: async () => {
      setPendingProductId(null)
      await invalidate()
    },
  })

  if (!Number.isInteger(buyerId)) {
    return <ErrorState title="Comprador inválido" />
  }
  if (buyerQuery.isLoading || offersQuery.isLoading || productsQuery.isLoading) {
    return <Spinner label="Carregando ofertas..." />
  }
  if (buyerQuery.isError) {
    return (
      <ErrorState
        title="Comprador não encontrado"
        action={<Link to="/gestao/compradores" className="font-semibold text-green-800">Voltar</Link>}
      />
    )
  }

  const offers = offersQuery.data ?? []
  const products = productsQuery.data ?? []
  const offeredIds = new Set(offers.map((offer) => Number(offer.ProductId)))
  const availableProducts = products.filter((product) => !offeredIds.has(product.id))
  const productName = (productId: number) =>
    products.find((product) => product.id === productId)?.name ?? `Produto ${productId}`

  return (
    <section className="grid gap-6">
      <div>
        <Link to="/gestao/compradores" className="text-sm font-semibold text-green-800">
          ← Compradores
        </Link>
        <h2 className="mt-2 text-xl font-bold text-green-950">
          Ofertas de {buyerQuery.data?.name}
        </h2>
      </div>

      <div className="rounded-3xl border border-stone-200 bg-white p-6">
        <h3 className="mb-4 font-bold text-green-950">Nova oferta</h3>
        <OfferForm
          products={availableProducts}
          busy={addMutation.isPending}
          onSubmit={(productId, price) => addMutation.mutate({ productId, price })}
        />
        {addMutation.isError && (
          <p className="mt-3 text-sm text-red-700">Não foi possível adicionar a oferta.</p>
        )}
      </div>

      <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
        <table className="min-w-full text-left text-sm">
          <thead>
            <tr className="border-b border-stone-200 text-stone-500">
              <th className="px-4 py-3 font-semibold">Produto</th>
              <th className="px-4 py-3 font-semibold">Preço</th>
              <th className="px-4 py-3 font-semibold">Ações</th>
            </tr>
          </thead>
          <tbody>
            {offers.length === 0 && (
              <tr>
                <td colSpan={3} className="px-4 py-6 text-stone-500">
                  Nenhuma oferta cadastrada.
                </td>
              </tr>
            )}
            {offers.map((offer) => (
              <tr key={offer.ProductId} className="border-b border-stone-100">
                <td className="px-4 py-3">{productName(offer.ProductId)}</td>
                <td className="px-4 py-3">
                  {editingId === offer.ProductId ? (
                    <Input
                      id={`price-${offer.ProductId}`}
                      label="Novo preço"
                      value={editPrice}
                      error={editError}
                      onChange={(event) => {
                        setEditPrice(event.target.value)
                        setEditError('')
                      }}
                    />
                  ) : (
                    formatPrice(offer.price)
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex flex-wrap gap-2">
                    {editingId === offer.ProductId ? (
                      <>
                        <Button
                          type="button"
                          disabled={updateMutation.isPending}
                          onClick={() => {
                            const cents = reaisToCents(editPrice)
                            if (!Number.isFinite(cents) || cents <= 0) {
                              setEditError('Informe um preço maior que zero.')
                              return
                            }
                            updateMutation.mutate({ productId: offer.ProductId, price: cents })
                          }}
                        >
                          Salvar
                        </Button>
                        <Button type="button" variant="secondary" onClick={() => setEditingId(null)}>
                          Cancelar
                        </Button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          className="font-semibold text-green-800"
                          onClick={() => {
                            setEditingId(offer.ProductId)
                            setEditPrice(centsToReaisInput(offer.price))
                            setEditError('')
                          }}
                        >
                          Editar preço
                        </button>
                        <button
                          type="button"
                          className="font-semibold text-red-700"
                          onClick={() => setPendingProductId(offer.ProductId)}
                        >
                          Remover
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ConfirmDialog
        open={pendingProductId != null}
        title="Remover oferta"
        message="Deseja remover esta oferta?"
        confirmLabel="Remover"
        danger
        busy={deleteMutation.isPending}
        onCancel={() => setPendingProductId(null)}
        onConfirm={() => pendingProductId != null && deleteMutation.mutate(pendingProductId)}
      />
    </section>
  )
}
