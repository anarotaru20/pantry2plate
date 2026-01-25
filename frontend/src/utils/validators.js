// profile
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

// auth
export const isValidAuthEmail = (email = '') => isValidEmail(email)

export const isValidAuthPassword = (password = '') => {
  const v = String(password || '')
  return v.length >= 6
}

export const isValidRegisterDisplayName = (name = '') => isValidDisplayName(name)

export const isValidRegisterConfirmPassword = (password = '', confirm = '') =>
  doPasswordsMatch(password, confirm)

export const isValidLoginForm = ({ email = '', password = '' } = {}) =>
  isValidAuthEmail(email) && isValidAuthPassword(password)

export const isValidRegisterForm = ({
  email = '',
  password = '',
  confirmPassword = '',
  displayName = '',
} = {}) =>
  isValidAuthEmail(email) &&
  isValidAuthPassword(password) &&
  isValidRegisterConfirmPassword(password, confirmPassword) &&
  isValidRegisterDisplayName(displayName)

// locations
export const isValidLocationName = (name = '') => name.trim().length >= 3

export const isValidRoom = (room = '') => !!room && String(room).trim().length > 0

export const isValidLight = (light = '') => !!light && String(light).trim().length > 0

// care
export const isValidCarePlant = (plantId = '') => !!plantId && String(plantId).trim().length > 0

export const isValidCareAction = (action = '') => !!action && String(action).trim().length > 0

export const isValidCareDate = (date = '') => {
  const v = String(date || '').trim()
  if (!v) return false
  return /^\d{4}-\d{2}-\d{2}$/.test(v)
}

export const isValidCareNotes = (notes = '') => {
  const v = String(notes || '').trim()
  return v.length === 0 || v.length >= 3
}

// plants
export const isValidPlantLocation = (location = '') =>
  !!location && String(location).trim().length > 0

export const isValidWaterEveryDays = (days) => {
  const n = Number(days)
  return Number.isFinite(n) && n >= 1 && n <= 365
}

export const isValidPhotoUrl = (url = '') => {
  const v = String(url || '').trim()
  if (!v) return true
  try {
    const u = new URL(v)
    return u.protocol === 'http:' || u.protocol === 'https:'
  } catch {
    return false
  }
}

export const isValidPlantNotes = (notes = '') => {
  const v = String(notes || '').trim()
  return v.length === 0 || v.length >= 3
}
