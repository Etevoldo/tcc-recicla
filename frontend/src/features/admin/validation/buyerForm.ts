import { isValidPhone } from '../../../lib/format'
import { isValidCep, normalizeCep } from '../../buyers/services/cep'
import type { BuyerInput } from '../../buyers/types'

export type BuyerFormValues = {
  name: string
  phoneNumber: string
  cep: string
  address: string
  addressNumber: string
}

export type BuyerFormErrors = Partial<Record<keyof BuyerFormValues, string>>

export const emptyBuyerForm: BuyerFormValues = {
  name: '',
  phoneNumber: '',
  cep: '',
  address: '',
  addressNumber: '',
}

export function validateBuyerForm(values: BuyerFormValues): BuyerFormErrors {
  const errors: BuyerFormErrors = {}
  if (!values.name.trim()) errors.name = 'Informe o nome.'
  if (!isValidPhone(values.phoneNumber)) errors.phoneNumber = 'Informe um telefone válido.'
  if (!isValidCep(values.cep)) errors.cep = 'Informe os oito dígitos do CEP.'
  if (!values.address.trim()) errors.address = 'Informe o endereço.'
  if (!values.addressNumber.trim()) errors.addressNumber = 'Informe o número.'
  return errors
}

export function toBuyerInput(
  values: BuyerFormValues,
  extras: { email: string; cpf: string },
): BuyerInput {
  return {
    name: values.name.trim(),
    cpf: extras.cpf,
    email: extras.email,
    phoneNumber: values.phoneNumber.trim(),
    cep: normalizeCep(values.cep),
    address: values.address.trim(),
    addressNumber: values.addressNumber.trim(),
  }
}
