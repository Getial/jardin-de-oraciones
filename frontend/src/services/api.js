import { supabase } from '../lib/supabase'

const { hostname } = window.location

// - Dev (`npm run dev`): backend en el mismo host, puerto 8000. Así funciona tanto
//   en la PC (localhost) como desde el celular por IP de LAN (192.168.x.x:8000).
// - Producción: debe venir de VITE_API_URL. Si falta, se usa el mismo origen
//   (y se avisa) en vez de inventar `http://host:8000` (mixed-content / puerto inexistente).
const API_URL =
  import.meta.env.VITE_API_URL || (import.meta.env.DEV ? `http://${hostname}:8000` : '')

if (!import.meta.env.VITE_API_URL && !import.meta.env.DEV) {
  console.warn('[api] VITE_API_URL no está definida: las llamadas usarán el mismo origen.')
}

async function getHeaders() {
  const { data: { session } } = await supabase.auth.getSession()
  return {
    'Content-Type': 'application/json',
    ...(session ? { Authorization: `Bearer ${session.access_token}` } : {}),
  }
}

async function request(method, path, body) {
  const headers = await getHeaders()
  const res = await fetch(`${API_URL}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err.detail || Object.values(err)[0] || `Error ${res.status}`)
  }
  if (res.status === 204) return null
  return res.json()
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body),
  patch: (path, body) => request('PATCH', path, body),
  delete: (path) => request('DELETE', path),
}
