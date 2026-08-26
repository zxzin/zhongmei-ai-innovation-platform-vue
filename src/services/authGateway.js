const PASSWORD_STORAGE_KEY = 'cm-vue-demo-passwords-v1'
const DEFAULT_PASSWORD = 'demo123'
const PASSWORD_ITERATIONS = 210000
const DEMO_ACCOUNTS = ['Admin', 'User']

function encodeBase64(bytes) {
  let text = ''
  bytes.forEach((byte) => { text += String.fromCharCode(byte) })
  return btoa(text)
}

function decodeBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function passwordHash(password, salt, iterations = PASSWORD_ITERATIONS) {
  const key = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits'])
  const derived = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: decodeBase64(salt), iterations }, key, 256)
  return encodeBase64(new Uint8Array(derived))
}

async function passwordRecord(password) {
  const saltBytes = crypto.getRandomValues(new Uint8Array(16))
  const salt = encodeBase64(saltBytes)
  return { salt, hash: await passwordHash(password, salt), iterations: PASSWORD_ITERATIONS }
}

function readRecords() {
  try {
    return JSON.parse(localStorage.getItem(PASSWORD_STORAGE_KEY) || '{}')
  } catch {
    localStorage.removeItem(PASSWORD_STORAGE_KEY)
    return {}
  }
}

function writeRecords(records) {
  localStorage.setItem(PASSWORD_STORAGE_KEY, JSON.stringify(records))
}

async function getRecords() {
  const records = readRecords()
  const missingAccounts = DEMO_ACCOUNTS.filter((account) => !records[account])
  if (missingAccounts.length) {
    await Promise.all(missingAccounts.map(async (account) => { records[account] = await passwordRecord(DEFAULT_PASSWORD) }))
    writeRecords(records)
  }
  return records
}

/**
 * This adapter is the only authentication boundary used by the Vue pages.
 * Replace these local implementations with the future authentication API while
 * preserving the credential verification, password-change, and password-reset
 * method signatures.
 */
export async function verifyCredentials({ account, password }) {
  const records = await getRecords()
  const record = records[account]
  if (!record || !password) return false
  return (await passwordHash(password, record.salt, record.iterations)) === record.hash
}

export async function changeCredentialPassword({ account, currentPassword, newPassword }) {
  if (newPassword.length < 8) return { ok: false, code: 'PASSWORD_TOO_SHORT' }
  if (currentPassword === newPassword) return { ok: false, code: 'PASSWORD_UNCHANGED' }
  if (!await verifyCredentials({ account, password: currentPassword })) return { ok: false, code: 'CURRENT_PASSWORD_INVALID' }

  const records = await getRecords()
  records[account] = await passwordRecord(newPassword)
  writeRecords(records)
  return { ok: true }
}

export async function resetCredentialPassword({ account, newPassword }) {
  if (newPassword.length < 8) return { ok: false, code: 'PASSWORD_TOO_SHORT' }

  const records = await getRecords()
  const record = records[account]
  if (!record) return { ok: false, code: 'ACCOUNT_NOT_FOUND' }
  if ((await passwordHash(newPassword, record.salt, record.iterations)) === record.hash) {
    return { ok: false, code: 'PASSWORD_UNCHANGED' }
  }

  records[account] = await passwordRecord(newPassword)
  writeRecords(records)
  return { ok: true }
}

export async function provisionCredential({ account, password = DEFAULT_PASSWORD }) {
  if (!account) return { ok: false, code: 'ACCOUNT_REQUIRED' }
  const records = await getRecords()
  if (records[account]) return { ok: true, created: false }
  records[account] = await passwordRecord(password)
  writeRecords(records)
  return { ok: true, created: true }
}
