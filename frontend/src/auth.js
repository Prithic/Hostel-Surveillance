import { clearSession, getToken, logout as apiLogout, me } from './services/guardianApi'

/** True if a session token is present (validated on protected route mount). */
export function isWardenAuthed() {
  return Boolean(getToken())
}

export async function ensureWardenSession() {
  if (!getToken()) return false
  try {
    await me()
    return true
  } catch {
    clearSession()
    return false
  }
}

export async function logoutWarden() {
  await apiLogout()
}
