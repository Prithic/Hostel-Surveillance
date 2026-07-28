import { Navigate, useLocation } from 'react-router-dom'
import { getRole } from '../services/guardianApi'
import { canAccessPath } from '../navAccess'
import { useRoleCheck } from '../hooks/useRoleCheck'

/** Blocks URL access to pages outside the signed-in role. */
export default function RequireRole({ children }) {
  const location = useLocation()
  const { role } = useRoleCheck()
  const effective = role || getRole() || 'Student'
  if (!canAccessPath(effective, location.pathname)) {
    return <Navigate to="/dashboard" replace />
  }
  return children
}
