import { useEffect, useState } from 'react'
import { getRole, me } from '../services/guardianApi'

const ADMIN_ROLES = ['Admin', 'Super Admin', 'Chief Warden', 'Warden']
const LAUNDRY_ROLES = [...ADMIN_ROLES, 'Laundry Staff']

export function useRoleCheck() {
  const [role, setRole] = useState(() => getRole())

  useEffect(() => {
    let cancelled = false
    me()
      .then((u) => {
        if (!cancelled) setRole(u?.role || getRole() || 'Student')
      })
      .catch(() => {
        if (!cancelled) setRole(getRole() || 'Student')
      })
    return () => {
      cancelled = true
    }
  }, [])

  const isAdminRole = ADMIN_ROLES.includes(role)
  const isLaundryStaff = LAUNDRY_ROLES.includes(role)

  return { role, isAdminRole, isLaundryStaff }
}
