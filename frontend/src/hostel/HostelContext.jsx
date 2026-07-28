import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiGet, apiPatchJson, apiPost, apiPut } from '../services/guardianApi'

const HostelContext = createContext(null)

export function HostelProvider({ children }) {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refresh = useCallback(async () => {
    try {
      const state = await apiGet('/api/hostel/state')
      setData(state)
      setError('')
      return state
    } catch (e) {
      setError(e.message || 'Failed to load hostel data')
      throw e
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh().catch(() => {})
  }, [refresh])

  const append = useCallback(async (key, item) => {
    const saved = await apiPost('/api/hostel/append', { key, item })
    await refresh()
    return saved
  }, [refresh])

  const patchItem = useCallback(async (key, id, updates) => {
    const saved = await apiPatchJson('/api/hostel/item', { key, id, updates })
    await refresh()
    return saved
  }, [refresh])

  const replaceKey = useCallback(async (key, value) => {
    const saved = await apiPut('/api/hostel/key', { key, value })
    await refresh()
    return saved
  }, [refresh])

  const triggerSos = useCallback(async (payload = {}) => {
    const result = await apiPost('/api/hostel/sos', payload)
    await refresh()
    return result
  }, [refresh])

  const value = useMemo(
    () => ({ data, loading, error, refresh, append, patchItem, replaceKey, triggerSos }),
    [data, loading, error, refresh, append, patchItem, replaceKey, triggerSos],
  )

  return <HostelContext.Provider value={value}>{children}</HostelContext.Provider>
}

export function useHostel() {
  const ctx = useContext(HostelContext)
  if (!ctx) throw new Error('useHostel must be used within HostelProvider')
  return ctx
}
