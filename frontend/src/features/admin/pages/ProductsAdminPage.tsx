import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { getRecyclingCode } from '../../buyers/constants/recyclingCodes'
import { createProduct, deleteProduct, getProducts, updateProduct } from '../../buyers/services/productsApi'
import type { Product, ProductInput } from '../../buyers/types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProductForm } from '../components/ProductForm'

export function ProductsAdminPage() {
  const queryClient = useQueryClient()
  const [editing, setEditing] = useState<Product | null>(null)
  const [creating, setCreating] = useState(false)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const query = useQuery({ queryKey: ['products'], queryFn: getProducts })

  async function invalidate() {
    await queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      setCreating(false)
      await invalidate()
    },
  })
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
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-green-950">Produtos</h2>
        {!creating && !editing && (
          <Button type="button" onClick={() => setCreating(true)}>
            Novo produto
          </Button>
        )}
      </div>

      {(creating || editing) && (
        <div className="rounded-3xl border border-stone-200 bg-white p-6">
          <h3 className="mb-4 font-bold text-green-950">
            {editing ? 'Editar produto' : 'Novo produto'}
          </h3>
          <ProductForm
            key={editing?.id ?? 'new'}
            initial={editing ?? undefined}
            submitLabel={editing ? 'Salvar alterações' : 'Cadastrar'}
            busy={createMutation.isPending || updateMutation.isPending}
            onCancel={() => {
              setCreating(false)
              setEditing(null)
            }}
            onSubmit={(input) => {
              if (editing) updateMutation.mutate({ id: editing.id, input })
              else createMutation.mutate(input)
            }}
          />
        </div>
      )}

      {products.length === 0 ? (
        <EmptyState title="Nenhum produto cadastrado" />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Código</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => {
                const info = getRecyclingCode(product.recicling_code)
                return (
                  <tr key={product.id} className="border-b border-stone-100">
                    <td className="px-4 py-3 font-medium text-green-950">{product.name}</td>
                    <td className="px-4 py-3">{info.label}</td>
                    <td className="px-4 py-3">
                      <div className="flex gap-3">
                        <button
                          type="button"
                          className="font-semibold text-green-800"
                          onClick={() => {
                            setCreating(false)
                            setEditing(product)
                          }}
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

      <ConfirmDialog
        open={pendingId != null}
        title="Excluir produto"
        message="Deseja excluir este produto? Ofertas associadas podem ser afetadas."
        confirmLabel="Excluir"
        danger
        busy={deleteMutation.isPending}
        onCancel={() => setPendingId(null)}
        onConfirm={() => pendingId != null && deleteMutation.mutate(pendingId)}
      />
    </section>
  )
}
