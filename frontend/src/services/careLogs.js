const API_URL = import.meta.env.VITE_API_URL

const authHeaders = () => {
  const token = localStorage.getItem('jwt')
  return { Authorization: `Bearer ${token}` }
}

export async function getCareLogs() {
  const res = await fetch(`${API_URL}/care-logs`, {
    headers: { ...authHeaders() },
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to fetch care logs')
  return data.careLogs || []
}

export async function addCareLog(payload) {
  const res = await fetch(`${API_URL}/care-logs`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to add care log')
  return data.careLog
}

export async function updateCareLog(id, payload) {
  const res = await fetch(`${API_URL}/care-logs/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json', ...authHeaders() },
    body: JSON.stringify(payload),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'Failed to update care log')
  return data.careLog
}

export async function deleteCareLog(id) {
  const res = await fetch(`${API_URL}/care-logs/${id}`, {
    method: 'DELETE',
    headers: { ...authHeaders() },
  })
  if (res.status === 204) return true
  const data = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(data.message || 'Failed to delete care log')
  return true
}
