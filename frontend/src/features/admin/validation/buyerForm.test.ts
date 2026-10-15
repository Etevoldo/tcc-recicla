import { describe, expect, it } from 'vitest'
import { emptyBuyerForm, toBuyerInput, validateBuyerForm } from './buyerForm'

describe('validateBuyerForm', () => {
  it('exige nome, telefone, CEP, endereço e número', () => {
    expect(validateBuyerForm(emptyBuyerForm)).toEqual({
      name: 'Informe o nome.',
      phoneNumber: 'Informe um telefone válido.',
      cep: 'Informe os oito dígitos do CEP.',
      address: 'Informe o endereço.',
      addressNumber: 'Informe o número.',
    })
  })

  it('aceita um perfil completo', () => {
    expect(
      validateBuyerForm({
        name: 'Ana Silva',
        phoneNumber: '(11) 98765-4321',
        cep: '05424-020',
        address: 'Rua Exemplo',
        addressNumber: '100',
      }),
    ).toEqual({})
  })

  it('monta o payload sem CPF', () => {
    expect(
      toBuyerInput(
        {
          name: 'Ana Silva',
          phoneNumber: '(11) 98765-4321',
          cep: '05424-020',
          address: 'Rua Exemplo',
          addressNumber: '100',
        },
        { email: 'ana.silva@email.com', cpf: '' },
      ),
    ).toEqual({
      name: 'Ana Silva',
      cpf: '',
      email: 'ana.silva@email.com',
      phoneNumber: '(11) 98765-4321',
      cep: '05424020',
      address: 'Rua Exemplo',
      addressNumber: '100',
    })
  })
})
