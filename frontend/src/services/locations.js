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

export async function addLocation(payload) {
  const res = await fetch(`${API_URL}/locations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to add location')
  return data.location
}

export async function updateLocation(id, payload) {
  const res = await fetch(`${API_URL}/locations/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
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
