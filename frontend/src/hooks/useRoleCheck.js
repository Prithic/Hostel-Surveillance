import { useState, useEffect } from 'react'

export function useRoleCheck() {
  const [role, setRole] = useState('')

  useEffect(() => {
    try {
      const stored = localStorage.getItem('nestos_user')
      if (stored && stored !== 'undefined') {
        const u = JSON.parse(stored)
        setRole(u?.role || 'Student')
      } else {
        setRole('Student')
      }
    } catch (e) {
      setRole('Student')
    }
  }, [])

  const isAdminRole = ['Admin', 'Super Admin', 'Chief Warden', 'Warden'].includes(role)

  return { role, isAdminRole }
}
