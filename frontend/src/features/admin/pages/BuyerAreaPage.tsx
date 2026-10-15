import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { EmptyState } from '../../../components/ui/EmptyState'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Input } from '../../../components/ui/Input'
import { Modal } from '../../../components/ui/Modal'
import { Spinner } from '../../../components/ui/Spinner'
import { formatPhone, formatPrice } from '../../../lib/format'
import { useAuth } from '../../auth/AuthContext'
import { getRecyclingCode } from '../../buyers/constants/recyclingCodes'
import { formatCep, isValidCep } from '../../buyers/services/cep'
import { getBuyer, getBuyerProducts, updateBuyer } from '../../buyers/services/buyersApi'
import { createProduct, deleteProduct, updateProduct } from '../../buyers/services/productsApi'
import type { Product, ProductInput } from '../../buyers/types'
import { productPrice } from '../../buyers/types'
import { ConfirmDialog } from '../components/ConfirmDialog'
import { ProductForm } from '../components/ProductForm'
import {
  emptyBuyerForm,
  toBuyerInput,
  validateBuyerForm,
  type BuyerFormErrors,
  type BuyerFormValues,
} from '../validation/buyerForm'

export function BuyerAreaPage() {
  const { user } = useAuth()
  const buyerId = user?.buyerId
  const queryClient = useQueryClient()
  const [values, setValues] = useState<BuyerFormValues>(emptyBuyerForm)
  const [errors, setErrors] = useState<BuyerFormErrors>({})
  const [submitError, setSubmitError] = useState('')
  const [saved, setSaved] = useState(false)
  const [editingProfile, setEditingProfile] = useState(false)
  const [creating, setCreating] = useState(false)
  const [editing, setEditing] = useState<Product | null>(null)
  const [pendingId, setPendingId] = useState<number | null>(null)

  const buyerQuery = useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: () => getBuyer(buyerId as number),
    enabled: buyerId != null,
  })
  const productsQuery = useQuery({
    queryKey: ['buyerProducts', buyerId],
    queryFn: () => getBuyerProducts(buyerId as number),
    enabled: buyerId != null,
  })

  useEffect(() => {
    if (!buyerQuery.data) return
    const buyer = buyerQuery.data
    setValues({
      name: buyer.name ?? '',
      phoneNumber: formatPhone(buyer.phoneNumber ?? ''),
      cep: formatCep(buyer.cep ?? ''),
      address: buyer.address ?? '',
      addressNumber: buyer.addressNumber ?? '',
    })
  }, [buyerQuery.data])

  const profileMutation = useMutation({
    mutationFn: async (input: BuyerFormValues) => {
      if (buyerId == null || !buyerQuery.data) return
      await updateBuyer(
        buyerId,
        toBuyerInput(input, {
          email: buyerQuery.data.email ?? '',
          cpf: buyerQuery.data.cpf ?? '',
        }),
      )
    },
    onSuccess: async () => {
      setSaved(true)
      setSubmitError('')
      setEditingProfile(false)
      await queryClient.invalidateQueries({ queryKey: ['buyer', buyerId] })
      await queryClient.invalidateQueries({ queryKey: ['buyers'] })
    },
    onError: () => {
      setSaved(false)
      setSubmitError('Não foi possível salvar os dados.')
    },
  })

  async function invalidateProducts() {
    await queryClient.invalidateQueries({ queryKey: ['buyerProducts', buyerId] })
    await queryClient.invalidateQueries({ queryKey: ['products'] })
  }

  const createMutation = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      setCreating(false)
      await invalidateProducts()
    },
  })
  const updateMutation = useMutation({
    mutationFn: ({ id, input }: { id: number; input: ProductInput }) => updateProduct(id, input),
    onSuccess: async () => {
      setEditing(null)
      await invalidateProducts()
    },
  })
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      setPendingId(null)
      await invalidateProducts()
    },
  })

  function updateField<K extends keyof BuyerFormValues>(field: K, value: BuyerFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSaved(false)
  }

  function fillProfileFromBuyer() {
    const buyer = buyerQuery.data
    if (!buyer) return
    setValues({
      name: buyer.name ?? '',
      phoneNumber: formatPhone(buyer.phoneNumber ?? ''),
      cep: formatCep(buyer.cep ?? ''),
      address: buyer.address ?? '',
      addressNumber: buyer.addressNumber ?? '',
    })
    setErrors({})
    setSubmitError('')
    setSaved(false)
  }

  function openProfileModal() {
    fillProfileFromBuyer()
    setEditingProfile(true)
  }

  function closeProfileModal() {
    fillProfileFromBuyer()
    setEditingProfile(false)
  }

  function handleProfileSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateBuyerForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    profileMutation.mutate(values)
  }

  if (buyerId == null) {
    return <ErrorState title="Esta conta não está vinculada a um comprador." />
  }
  if (buyerQuery.isLoading) return <Spinner label="Carregando sua área..." />
  if (buyerQuery.isError) return <ErrorState onRetry={() => void buyerQuery.refetch()} />

  const products = productsQuery.data ?? []
  const buyer = buyerQuery.data
  const profileComplete = isValidCep(buyer?.cep ?? '')

  return (
    <section className="grid gap-10">
      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-green-950">Meus dados</h2>
          <Button type="button" onClick={openProfileModal}>
            Editar dados
          </Button>
        </div>
        {!profileComplete && (
          <p className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            Complete seus dados para aparecer na busca.
          </p>
        )}
        <div className="grid gap-3 rounded-3xl border border-stone-200 bg-white p-6 text-sm">
          <p>
            <span className="font-semibold text-stone-500">Nome: </span>
            <span className="text-green-950">{buyer?.name || '—'}</span>
          </p>
          <p>
            <span className="font-semibold text-stone-500">Telefone: </span>
            <span className="text-green-950">
              {buyer?.phoneNumber ? formatPhone(buyer.phoneNumber) : '—'}
            </span>
          </p>
          <p>
            <span className="font-semibold text-stone-500">CEP: </span>
            <span className="text-green-950">{buyer?.cep ? formatCep(buyer.cep) : '—'}</span>
          </p>
          <p>
            <span className="font-semibold text-stone-500">Endereço: </span>
            <span className="text-green-950">
              {buyer?.address
                ? `${buyer.address}${buyer.addressNumber ? `, ${buyer.addressNumber}` : ''}`
                : '—'}
            </span>
          </p>
        </div>
      </div>

      <div className="grid gap-4">
        <div className="flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-green-950">Meus produtos</h2>
          <Button type="button" onClick={() => setCreating(true)}>
            Novo produto
          </Button>
        </div>
        {productsQuery.isLoading ? (
          <Spinner label="Carregando produtos..." />
        ) : products.length === 0 ? (
          <EmptyState title="Nenhum produto cadastrado" />
        ) : (
          <div className="overflow-x-auto rounded-3xl border border-stone-200 bg-white">
            <table className="min-w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="px-4 py-3 font-semibold">Nome</th>
                  <th className="px-4 py-3 font-semibold">Tipo</th>
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
      </div>

      <Modal open={editingProfile} title="Editar dados" onClose={closeProfileModal}>
        <form onSubmit={handleProfileSubmit} className="grid gap-4">
          <Input
            id="buyer-name"
            label="Nome"
            value={values.name}
            error={errors.name}
            onChange={(event) => updateField('name', event.target.value)}
          />
          <Input
            id="buyer-phone"
            label="Telefone"
            value={values.phoneNumber}
            error={errors.phoneNumber}
            onChange={(event) => updateField('phoneNumber', formatPhone(event.target.value))}
          />
          <Input
            id="buyer-cep"
            label="CEP"
            value={values.cep}
            error={errors.cep}
            onChange={(event) => updateField('cep', formatCep(event.target.value))}
          />
          <Input
            id="buyer-address"
            label="Endereço"
            value={values.address}
            error={errors.address}
            onChange={(event) => updateField('address', event.target.value)}
          />
          <Input
            id="buyer-number"
            label="Número"
            value={values.addressNumber}
            error={errors.addressNumber}
            onChange={(event) => updateField('addressNumber', event.target.value)}
          />
          {submitError && (
            <p role="alert" className="text-sm text-red-700">
              {submitError}
            </p>
          )}
          {saved && (
            <p className="text-sm text-green-800" role="status">
              Dados salvos.
            </p>
          )}
          <div className="flex gap-3">
            <Button type="submit" disabled={profileMutation.isPending}>
              {profileMutation.isPending ? 'Salvando...' : 'Salvar dados'}
            </Button>
            <Button type="button" variant="secondary" onClick={closeProfileModal} disabled={profileMutation.isPending}>
              Cancelar
            </Button>
          </div>
        </form>
      </Modal>

      <Modal open={creating} title="Novo produto" onClose={() => setCreating(false)}>
        <ProductForm
          submitLabel="Cadastrar"
          busy={createMutation.isPending}
          onCancel={() => setCreating(false)}
          onSubmit={(input) => createMutation.mutate(input)}
        />
      </Modal>

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
