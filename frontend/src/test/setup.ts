import { cleanup } from '@testing-library/react'
import { afterEach } from 'vitest'
import { setAuthToken, setOnUnauthorized } from '../lib/api'

afterEach(() => {
  cleanup()
  localStorage.clear()
  setAuthToken(null)
  setOnUnauthorized(null)
})
