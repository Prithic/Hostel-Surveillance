/**
 * Single GuardianAI API client. No mock fallbacks. No baked-in passwords.
 */
const API = import.meta.env.VITE_GUARDIAN_API_URL || 'http://127.0.0.1:8000'
const TOKEN_KEY = 'guardian_token'
const EMAIL_KEY = 'guardian_email'
const ROLE_KEY = 'guardian_role'
const NAME_KEY = 'guardian_name'

export function apiBase() {
  return API
}

export function getToken() {
  return sessionStorage.getItem(TOKEN_KEY) || ''
}

export function getEmail() {
  return sessionStorage.getItem(EMAIL_KEY) || ''
}

export function getRole() {
  return sessionStorage.getItem(ROLE_KEY) || ''
}

export function getDisplayName() {
  return sessionStorage.getItem(NAME_KEY) || ''
}

export function clearSession() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(EMAIL_KEY)
  sessionStorage.removeItem(ROLE_KEY)
  sessionStorage.removeItem(NAME_KEY)
}

function authHeaders(extra = {}) {
  const token = getToken()
  return {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  }
}

async function parse(res) {
  const text = await res.text()
  let data = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = { detail: text }
  }
  if (!res.ok) {
    const detail = data?.detail || data?.error || `HTTP ${res.status}`
    throw new Error(typeof detail === 'string' ? detail : JSON.stringify(detail))
  }
  return data
}

function persistUser(data, fallbackEmail) {
  if (data?.token) sessionStorage.setItem(TOKEN_KEY, data.token)
  sessionStorage.setItem(EMAIL_KEY, data.email || fallbackEmail || '')
  if (data?.role) sessionStorage.setItem(ROLE_KEY, data.role)
  if (data?.name) sessionStorage.setItem(NAME_KEY, data.name)
}

export async function login(email, password) {
  const res = await fetch(`${API}/api/auth/login`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  const data = await parse(res)
  if (!data?.token) throw new Error('Login response missing token')
  persistUser(data, email)
  return data
}

export async function logout() {
  const token = getToken()
  try {
    if (token) {
      await fetch(`${API}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include',
        headers: authHeaders({ 'Content-Type': 'application/json' }),
      })
    }
  } finally {
    clearSession()
  }
}

export async function me() {
  const res = await fetch(`${API}/api/auth/me`, {
    credentials: 'include',
    headers: authHeaders(),
  })
  const data = await parse(res)
  persistUser({ ...data, token: getToken() }, data.email)
  return data
}

export async function apiGet(path) {
  const res = await fetch(`${API}${path}`, {
    credentials: 'include',
    headers: authHeaders(),
  })
  return parse(res)
}

export async function apiPatch(path) {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
  })
  return parse(res)
}

export async function apiPost(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'POST',
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  })
  return parse(res)
}

export async function apiPut(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PUT',
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  })
  return parse(res)
}

export async function apiPatchJson(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: 'PATCH',
    credentials: 'include',
    headers: authHeaders({ 'Content-Type': 'application/json' }),
    body: JSON.stringify(body),
  })
  return parse(res)
}

export function streamUrl() {
  const t = getToken()
  return t ? `${API}/api/stream?token=${encodeURIComponent(t)}` : `${API}/api/stream`
}

export function alertsWsUrl() {
  const token = encodeURIComponent(getToken())
  const base = API.replace(/^http/, 'ws')
  return `${base}/ws/alerts?token=${token}`
}
