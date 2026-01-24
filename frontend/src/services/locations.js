const API_URL = import.meta.env.VITE_API_URL

const authHeaders = () => {
  const token = localStorage.getItem('jwt')
  return { Authorization: `Bearer ${token}` }
}

export async function getLocations() {
  const res = await fetch(`${API_URL}/locations`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch locations')
  return data.locations || []
}

const allowedLights = new Set(['Low light', 'Medium light', 'Bright light', 'Direct light'])

const normalizeLight = (v) => {
  const raw = typeof v === 'string' ? v : (v?.value ?? v?.title ?? v?.label ?? v?.text ?? '')

  const t = String(raw ?? '').trim()

  if (allowedLights.has(t)) return t

  const l = t.toLowerCase()
  if (l === 'low') return 'Low light'
  if (l === 'medium') return 'Medium light'
  if (l === 'bright') return 'Bright light'
  if (l === 'direct') return 'Direct light'
  if (l === 'low light') return 'Low light'
  if (l === 'medium light') return 'Medium light'
  if (l === 'bright light') return 'Bright light'
  if (l === 'direct light') return 'Direct light'

  return ''
}

const normalizePayload = (payload) => {
  const clean = {
    ...payload,
    name: String(payload?.name ?? '').trim(),
    room: String(payload?.room ?? '').trim(),
    notes: String(payload?.notes ?? '').trim(),
    light: normalizeLight(payload?.light),
  }

  return clean
}

export async function addLocation(payload) {
  const clean = normalizePayload(payload)

  const res = await fetch(`${API_URL}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(clean),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to add location')
  return data.location
}

export async function updateLocation(id, payload) {
  const clean = normalizePayload(payload)

  const res = await fetch(`${API_URL}/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(clean),
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update location')
  return data.location
}

export async function deleteLocation(id) {
  const res = await fetch(`${API_URL}/locations/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (res.status === 204) return true
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to delete location')
  return true
}
