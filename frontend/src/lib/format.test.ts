import { describe, expect, it } from 'vitest'
import {
  centsToReaisInput,
  formatCpf,
  formatPhone,
  formatPrice,
  isValidCpf,
  isValidEmail,
  isValidPhone,
  reaisToCents,
} from './format'

describe('preço', () => {
  it('formata centavos em BRL', () => {
    expect(formatPrice(150)).toMatch(/R\$\s*1,50/)
    expect(formatPrice(0)).toMatch(/R\$\s*0,00/)
  })

  it('converte reais digitados para centavos', () => {
    expect(reaisToCents('1,50')).toBe(150)
    expect(reaisToCents('1.50')).toBe(150)
    expect(reaisToCents('R$ 10,00')).toBe(1000)
    expect(reaisToCents('1.234,56')).toBe(123456)
    expect(Number.isNaN(reaisToCents(''))).toBe(true)
  })

  it('converte centavos para input em reais', () => {
    expect(centsToReaisInput(150)).toBe('1,50')
  })
})

describe('CPF', () => {
  it('formata e valida dígitos verificadores', () => {
    expect(formatCpf('52998224725')).toBe('529.982.247-25')
    expect(isValidCpf('529.982.247-25')).toBe(true)
    expect(isValidCpf('11111111111')).toBe(false)
    expect(isValidCpf('123')).toBe(false)
  })
})

describe('telefone e e-mail', () => {
  it('formata telefone celular e fixo', () => {
    expect(formatPhone('11987654321')).toBe('(11) 98765-4321')
    expect(formatPhone('1133334444')).toBe('(11) 3333-4444')
    expect(isValidPhone('(11) 98765-4321')).toBe(true)
    expect(isValidPhone('1198765')).toBe(false)
  })

  it('valida e-mail', () => {
    expect(isValidEmail('ana@email.com')).toBe(true)
    expect(isValidEmail('ana@')).toBe(false)
  })
})
