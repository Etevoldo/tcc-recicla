import { describe, expect, it } from 'vitest'
import type { BuyerWithProducts, Product } from '../types'
import { filterBuyersByProduct, matchesProductQuery, nearbyProductMatches } from './productSearch'

function product(partial: Partial<Product> & Pick<Product, 'id' | 'name' | 'recicling_code'>): Product {
  return partial
}

const pet = product({ id: 1, name: 'Garrafa PET', recicling_code: 'PET' })
const paper = product({ id: 12, name: 'Papelão', recicling_code: 'AZUL' })
const glass = product({ id: 3, name: 'Garrafa de Vidro', recicling_code: 'VERDE' })

const ana: BuyerWithProducts = {
  id: 1,
  name: 'Ana Silva',
  cpf: '',
  email: 'ana@email.com',
  phoneNumber: '11987654321',
  cep: '05424020',
  address: 'Rua A',
  addressNumber: '100',
  products: [pet, paper],
}

const bruno: BuyerWithProducts = {
  id: 2,
  name: 'Bruno Costa',
  cpf: '',
  email: 'bruno@email.com',
  phoneNumber: '21976543210',
  cep: '05424020',
  address: 'Rua B',
  addressNumber: '200',
  products: [glass],
}

describe('matchesProductQuery', () => {
  it('aceita query vazia', () => {
    expect(matchesProductQuery(pet, '')).toBe(true)
    expect(matchesProductQuery(pet, '   ')).toBe(true)
  })

  it('filtra por código de reciclagem', () => {
    expect(matchesProductQuery(pet, 'PET')).toBe(true)
    expect(matchesProductQuery(pet, 'pet')).toBe(true)
    expect(matchesProductQuery(paper, 'PET')).toBe(false)
  })

  it('filtra pelo rótulo do material', () => {
    expect(matchesProductQuery(paper, 'papel')).toBe(true)
    expect(matchesProductQuery(paper, 'papelao')).toBe(true)
    expect(matchesProductQuery(pet, 'papel')).toBe(false)
  })

  it('filtra pelo nome do produto', () => {
    expect(matchesProductQuery(pet, 'garrafa')).toBe(true)
    expect(matchesProductQuery(paper, 'garrafa')).toBe(false)
  })

  it('filtra pelo código do produto', () => {
    expect(matchesProductQuery(paper, '12')).toBe(true)
    expect(matchesProductQuery(paper, '#12')).toBe(true)
    expect(matchesProductQuery(pet, '12')).toBe(false)
    expect(matchesProductQuery(paper, '1')).toBe(false)
  })
})

describe('filterBuyersByProduct', () => {
  it('mantém todos os compradores sem filtro', () => {
    expect(filterBuyersByProduct([ana, bruno], 'ALL', '')).toEqual([ana, bruno])
  })

  it('deixa só compradores com o produto próximo pedido', () => {
    const filtered = filterBuyersByProduct([ana, bruno], 'ALL', 'PET')
    expect(filtered).toHaveLength(1)
    expect(filtered[0]?.name).toBe('Ana Silva')
    expect(filtered[0]?.products).toEqual([pet])
  })
})

describe('nearbyProductMatches', () => {
  it('lista cada produto com o comprador próximo', () => {
    const matches = nearbyProductMatches(filterBuyersByProduct([ana, bruno], 'ALL', 'garrafa'))
    expect(matches.map((item) => item.product.id)).toEqual([1, 3])
    expect(matches.map((item) => item.buyer.name)).toEqual(['Ana Silva', 'Bruno Costa'])
  })
})
