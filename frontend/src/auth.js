// ---------------------------------------------------------------------------
// Admin auth — intentionally separate from the student login in Login.jsx.
// Credentials are read from .env (VITE_ADMIN_EMAIL / VITE_ADMIN_PASSWORD).
// Never hardcode credentials in source. Copy .env.example → .env to configure.
// ---------------------------------------------------------------------------

export const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL || 'admin@guardian.ai'
export const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || ''

const SESSION_KEY = 'guardian_admin_session'

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
