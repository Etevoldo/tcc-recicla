import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Spinner } from '../../../components/ui/Spinner'
import { formatPhone } from '../../../lib/format'
import { formatCep } from '../../buyers/services/cep'
import { deleteBuyer, getBuyers } from '../../buyers/services/buyersApi'
import { ConfirmDialog } from '../components/ConfirmDialog'

export function BuyersAdminPage() {
  const queryClient = useQueryClient()
  const [pendingId, setPendingId] = useState<number | null>(null)
  const query = useQuery({ queryKey: ['buyers'], queryFn: getBuyers })
  const remove = useMutation({
    mutationFn: deleteBuyer,
    onSuccess: async () => {
      setPendingId(null)
      await queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
  })

  if (query.isLoading) return <Spinner label="Carregando compradores..." />
  if (query.isError) {
    return <ErrorState onRetry={() => void query.refetch()} />
  }

  const buyers = query.data ?? []

  return (
    <section className="grid gap-6">
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-green-950">Compradores</h2>
        <Link
          to="/gestao/compradores/novo"
          className="inline-flex min-h-11 items-center justify-center rounded-xl bg-green-900 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800"
        >
          Novo comprador
        </Link>
      </div>
      {buyers.length === 0 ? (
        <EmptyState title="Nenhum comprador cadastrado" />
      ) : (
        <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-stone-200 text-stone-500">
                <th className="px-4 py-3 font-semibold">Nome</th>
                <th className="px-4 py-3 font-semibold">Contato</th>
                <th className="px-4 py-3 font-semibold">CEP</th>
                <th className="px-4 py-3 font-semibold">Ações</th>
              </tr>
            </thead>
            <tbody>
              {buyers.map((buyer) => (
                <tr key={buyer.id} className="border-b border-stone-100">
                  <td className="px-4 py-3 font-medium text-green-950">{buyer.name}</td>
                  <td className="px-4 py-3">
                    {formatPhone(buyer.phoneNumber)}
                    <br />
                    <span className="text-stone-500">{buyer.email}</span>
                  </td>
                  <td className="px-4 py-3">{formatCep(buyer.cep)}</td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/gestao/compradores/${buyer.id}/editar`} className="font-semibold text-green-800">
                        Editar
                      </Link>
                      <Link to={`/gestao/compradores/${buyer.id}/ofertas`} className="font-semibold text-green-800">
                        Ofertas
                      </Link>
                      <button
                        type="button"
                        className="font-semibold text-red-700"
                        onClick={() => setPendingId(buyer.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <ConfirmDialog
        open={pendingId != null}
        title="Excluir comprador"
        message="Esta ação não pode ser desfeita. Deseja excluir este comprador?"
        confirmLabel="Excluir"
        danger
        busy={remove.isPending}
        onCancel={() => setPendingId(null)}
        onConfirm={() => pendingId != null && remove.mutate(pendingId)}
      />
    </section>
  )
}
