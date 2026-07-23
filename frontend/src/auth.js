// ---------------------------------------------------------------------------
// Admin auth — intentionally separate from the student login in Login.jsx.
// The Security Dashboard is the only thing gated by this. Swap the constants
// and storage calls below for a real auth endpoint + token when the backend
// is ready; every consumer of this file (RequireAdmin, AdminLogin) only
// depends on isAdminAuthed() / loginAdmin() / logoutAdmin(), so the swap is
// contained to this one file.
// ---------------------------------------------------------------------------

export const ADMIN_EMAIL = 'admin@nestos.in'
export const ADMIN_PASSWORD = 'Warden@2026'

const SESSION_KEY = 'nestos_admin_session'

export function isAdminAuthed() {
  return sessionStorage.getItem(SESSION_KEY) === 'true'
}

export function loginAdmin(email, password) {
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    sessionStorage.setItem(SESSION_KEY, 'true')
    return true
  }
  return false
}

export function logoutAdmin() {
  sessionStorage.removeItem(SESSION_KEY)
}
