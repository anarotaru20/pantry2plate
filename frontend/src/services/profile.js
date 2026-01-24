const API_URL = import.meta.env.VITE_API_URL

const authHeaders = () => {
  const token = localStorage.getItem('jwt')
  return {
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json',
  }
}

export async function getProfile() {
  const response = await fetch(`${API_URL}/profile`, {
    headers: authHeaders(),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to load profile')
  return data
}

export async function updateProfile(payload) {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify(payload || {}),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update profile')
  return data
}

export async function updateEmail(idToken, email) {
  const response = await fetch(`${API_URL}/profile/email`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ idToken, email }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update email')
  return data
}

export async function updatePassword(idToken, password) {
  const response = await fetch(`${API_URL}/profile/password`, {
    method: 'PATCH',
    headers: authHeaders(),
    body: JSON.stringify({ idToken, password }),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to update password')
  return data
}

export async function deleteAccount() {
  const response = await fetch(`${API_URL}/profile`, {
    method: 'DELETE',
    headers: authHeaders(),
  })

  const data = await response.json()
  if (!response.ok) throw new Error(data.message || 'Failed to delete account')
  return data
}
