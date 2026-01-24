//profile
export const isValidEmail = (email = '') => {
  const value = email.trim()
  if (!value) return false

  return /^[^\s@]+@[^\s@]+\.(com|ro|net|org|edu|info)$/i.test(value)
}

export const isStrongPassword = (password = '') => {
  return password.length >= 6
}

export const doPasswordsMatch = (password = '', confirm = '') => {
  return password === confirm
}

export const isValidDisplayName = (name = '') => {
  return name.trim().length >= 3
}

export const isValidAddress = (address = '') => {
  return address.trim().length >= 3
}

// locations
export const isValidLocationName = (name = '') => name.trim().length >= 3

export const isValidRoom = (room = '') => !!room && String(room).trim().length > 0

export const isValidLight = (light = '') => !!light && String(light).trim().length > 0
