import { Navigate } from 'react-router-dom'
import { isAdminAuthed } from '../auth'

// Wraps the Security Dashboard route. Anyone without an active admin
// session is bounced to /admin-login instead of seeing the page.
export default function RequireAdmin({ children }) {
  if (!isAdminAuthed()) {
    return <Navigate to="/admin-login" replace />
  }
  return children
}
