import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Modal } from '../../../components/ui/Modal'
import { Spinner } from '../../../components/ui/Spinner'
import { formatPrice } from '../../../lib/format'
import { getRecyclingCode } from '../../buyers/constants/recyclingCodes'
import { deleteProduct, getProducts, updateProduct } from '../../buyers/services/productsApi'
import type { Product, ProductInput } from '../../buyers/types'
import { productPrice } from '../../buyers/types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProductForm } from '../components/ProductForm'

export function ProductsAdminPage() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Product | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) => updateProduct(id, input),
    onSuccess: async () => {
      setEditing(null)
      await invalidate()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      setPendingId(null)
      await invalidate()
    },
  })

  if (query.isLoading) return <Spinner label="Carregando produtos..." />
  if (query.isError) return <ErrorState onRetry={() => void query.refetch()} />

  const products = query.data ?? []

  return (
    <section className="grid gap-6">
      <h2 className="text-xl font-bold text-green-950">Produtos</h2>

      {products.length === 0 ? (
        <EmptyState title="Nenhum produto cadastrado" />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-4 py-3 font-semibold">Produto</th>
                <th className="px-4 py-3 font-semibold">Tipo</th>
                <th className="px-4 py-3 font-semibold">Comprador</th>
                <th className="px-4 py-3 font-semibold">Preço</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const info = getRecyclingCode(product.recicling_code)
                const price = productPrice(product)
                return (
                  <tr key={product.id} className="border-b border-stone-100">
                    <td className="px-4 py-3 font-medium text-green-950">{product.name}</td>
                    <td className="px-4 py-3">{info.label}</td>
                    <td className="px-4 py-3">{product.owner?.name ?? '—'}</td>
                    <td className="px-4 py-3">{price != null ? formatPrice(price) : '—'}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="font-semibold text-green-800"
                          onClick={() => setEditing(product)}
                        >
                          Editar
                        </button>
                        <button
                          type="button"
                          className="font-semibold text-red-700"
                          onClick={() => setPendingId(product.id)}
                        >
                          Excluir
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <Modal open={editing != null} title="Editar produto" onClose={() => setEditing(null)}>
        {editing && (
          <ProductForm
            key={editing.id}
            initial={editing}
            submitLabel="Salvar alterações"
            busy={updateMutation.isPending}
            onCancel={() => setEditing(null)}
            onSubmit={(input) => updateMutation.mutate({ id: editing.id, input })}
          />
        )}
      </Modal>

      <ConfirmDialog
        open={pendingId != null}
        title="Excluir produto"
        message="Deseja excluir este produto?"
        confirmLabel="Excluir"
        danger
        busy={deleteMutation.isPending}
        onCancel={() => setPendingId(null)}
        onConfirm={() => pendingId != null && deleteMutation.mutate(pendingId)}
      />
    </section>
  )
}
