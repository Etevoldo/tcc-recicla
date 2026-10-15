import { describe, expect, it } from 'vitest'
import { formatCep, isValidCep, normalizeCep } from './cep'

describe('entrada de CEP', () => {
  it('preserva zero inicial e aceita colagem com máscara', () => {
    expect(normalizeCep('07177-749')).toBe('07177749')
    expect(formatCep('07177749')).toBe('07177-749')
  })
  it('formata entrada parcial e limita a oito dígitos', () => {
    expect(formatCep('0717')).toBe('0717')
    expect(formatCep('071777')).toBe('07177-7')
    expect(formatCep('0717774912')).toBe('07177-749')
    expect(formatCep('abc')).toBe('')
  })
  it('valida oito dígitos com ou sem hífen', () => {
    expect(isValidCep('07177749')).toBe(true)
    expect(isValidCep('07177-749')).toBe(true)
    for (const value of ['', '07177', '071777491', 'abcdefgh', 'abc07177749']) {
      expect(isValidCep(value)).toBe(false)
    }
  })
})
