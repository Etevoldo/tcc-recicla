import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '../../../components/ui/Button'
import { ErrorState } from '../../../components/ui/ErrorState'
import { Input } from '../../../components/ui/Input'
import { Spinner } from '../../../components/ui/Spinner'
import { formatCpf, formatPhone } from '../../../lib/format'
import { formatCep } from '../../buyers/services/cep'
import { createBuyer, getBuyer, updateBuyer } from '../../buyers/services/buyersApi'
import {
  emptyBuyerForm,
  toBuyerInput,
  validateBuyerForm,
  type BuyerFormErrors,
  type BuyerFormValues,
} from '../validation/buyerForm'

export function BuyerFormPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const buyerId = id ? Number(id) : null
  const isEdit = buyerId != null && Number.isInteger(buyerId)

  const [values, setValues] = useState<BuyerFormValues>(emptyBuyerForm)
  const [errors, setErrors] = useState<BuyerFormErrors>({})
  const [submitError, setSubmitError] = useState('')

  const buyerQuery = useQuery({
    queryKey: ['buyer', buyerId],
    queryFn: () => getBuyer(buyerId as number),
    enabled: isEdit,
  })

  useEffect(() => {
    if (!buyerQuery.data) return
    const buyer = buyerQuery.data
    setValues({
      name: buyer.name,
      cpf: formatCpf(buyer.cpf),
      email: buyer.email,
      phoneNumber: formatPhone(buyer.phoneNumber),
      cep: formatCep(buyer.cep),
      address: buyer.address,
      addressNumber: buyer.addressNumber,
    })
  }, [buyerQuery.data])

  const mutation = useMutation({
    mutationFn: async (input: BuyerFormValues) => {
      const payload = toBuyerInput(input)
      if (isEdit && buyerId != null) await updateBuyer(buyerId, payload)
      else await createBuyer(payload)
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['buyers'] })
      if (isEdit && buyerId != null) {
        await queryClient.invalidateQueries({ queryKey: ['buyer', buyerId] })
      }
      navigate('/gestao/compradores')
    },
    onError: () => {
      setSubmitError('Não foi possível salvar o comprador.')
    },
  })

  function updateField<K extends keyof BuyerFormValues>(field: K, value: BuyerFormValues[K]) {
    setValues((current) => ({ ...current, [field]: value }))
    setErrors((current) => ({ ...current, [field]: undefined }))
    setSubmitError('')
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const nextErrors = validateBuyerForm(values)
    setErrors(nextErrors)
    if (Object.keys(nextErrors).length > 0) return
    mutation.mutate(values)
  }

  if (isEdit && buyerQuery.isLoading) return <Spinner label="Carregando comprador..." />
  if (isEdit && buyerQuery.isError) {
    return (
      <ErrorState
        title="Comprador não encontrado"
        action={
          <Link to="/gestao/compradores" className="font-semibold text-green-800">
            Voltar à lista
          </Link>
        }
      />
    )
  }

  return (
    <section className="mx-auto w-full max-w-xl">
      <h2 className="text-xl font-bold text-green-950">
        {isEdit ? 'Editar comprador' : 'Novo comprador'}
      </h2>
      <form onSubmit={handleSubmit} noValidate className="mt-6 grid gap-4">
        <Input
          id="name"
          label="Nome"
          value={values.name}
          error={errors.name}
          onChange={(event) => updateField('name', event.target.value)}
        />
        <Input
          id="cpf"
          label="CPF"
          inputMode="numeric"
          placeholder="000.000.000-00"
          value={values.cpf}
          error={errors.cpf}
          onChange={(event) => updateField('cpf', formatCpf(event.target.value))}
        />
        <Input
          id="email"
          label="E-mail"
          type="email"
          value={values.email}
          error={errors.email}
          onChange={(event) => updateField('email', event.target.value)}
        />
        <Input
          id="phoneNumber"
          label="Telefone"
          inputMode="tel"
          placeholder="(00) 00000-0000"
          value={values.phoneNumber}
          error={errors.phoneNumber}
          onChange={(event) => updateField('phoneNumber', formatPhone(event.target.value))}
        />
        <Input
          id="cep"
          label="CEP"
          inputMode="numeric"
          placeholder="00000-000"
          value={values.cep}
          error={errors.cep}
          onChange={(event) => updateField('cep', formatCep(event.target.value))}
        />
        <Input
          id="address"
          label="Endereço"
          value={values.address}
          error={errors.address}
          onChange={(event) => updateField('address', event.target.value)}
        />
        <Input
          id="addressNumber"
          label="Número"
          value={values.addressNumber}
          error={errors.addressNumber}
          onChange={(event) => updateField('addressNumber', event.target.value)}
        />
        {submitError && <p role="alert" className="text-sm text-red-700">{submitError}</p>}
        <div className="flex gap-3">
          <Button type="submit" disabled={mutation.isPending}>
            {mutation.isPending ? 'Salvando...' : 'Salvar'}
          </Button>
          <Link
            to="/gestao/compradores"
            className="inline-flex min-h-11 items-center justify-center rounded-xl border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-800 hover:bg-stone-50"
          >
            Cancelar
          </Link>
        </div>
      </form>
    </section>
  )
}
