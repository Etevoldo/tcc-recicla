import { isValidCpf, isValidEmail, isValidPhone, normalizeCpf } from '../../../lib/format'
import { isValidCep, normalizeCep } from '../../buyers/services/cep'
import type { BuyerInput } from '../../buyers/types'

export type BuyerFormValues = {
  name: string
  cpf: string
  email: string
  phoneNumber: string
  cep: string
  address: string
  addressNumber: string
}

export type BuyerFormErrors = Partial<Record<keyof BuyerFormValues, string>>

export const emptyBuyerForm: BuyerFormValues = {
  name: '',
  cpf: '',
  email: '',
  phoneNumber: '',
  cep: '',
  address: '',
  addressNumber: '',
}

export function validateBuyerForm(values: BuyerFormValues): BuyerFormErrors {
  const errors: BuyerFormErrors = {}
  if (!values.name.trim()) errors.name = 'Informe o nome.'
  if (!isValidCpf(values.cpf)) errors.cpf = 'Informe um CPF válido.'
  if (!isValidEmail(values.email)) errors.email = 'Informe um e-mail válido.'
  if (!isValidPhone(values.phoneNumber)) errors.phoneNumber = 'Informe um telefone válido.'
  if (!isValidCep(values.cep)) errors.cep = 'Informe os oito dígitos do CEP.'
  if (!values.address.trim()) errors.address = 'Informe o endereço.'
  if (!values.addressNumber.trim()) errors.addressNumber = 'Informe o número.'
  return errors
}

export function toBuyerInput(values: BuyerFormValues): BuyerInput {
  return {
    name: values.name.trim(),
    cpf: normalizeCpf(values.cpf),
    email: values.email.trim(),
    phoneNumber: values.phoneNumber.trim(),
    cep: normalizeCep(values.cep),
    address: values.address.trim(),
    addressNumber: values.addressNumber.trim(),
  }
}
