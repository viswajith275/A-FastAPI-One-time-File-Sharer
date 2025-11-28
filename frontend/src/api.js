const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

async function postJson(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res
}

async function postForm(path, form, token) {
  const headers = {}
  if (token) headers['Authorization'] = `Bearer ${token}`
  const res = await fetch(`${API_BASE}${path}`, {
    method: 'POST',
    headers,
    body: form,
  })
  return res
}

async function login(formData) {
  // OAuth2 password grant expects form-encoded data
  const body = new URLSearchParams()
  body.append('username', formData.username)
  body.append('password', formData.password)
  const res = await fetch(`${API_BASE}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  })
  return res
}

// Upload with progress using XMLHttpRequest to provide progress events
function uploadWithProgress(path, formData, token, onProgress) {
  const url = `${API_BASE}${path}`
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()
    xhr.open('POST', url)
    if (token) xhr.setRequestHeader('Authorization', `Bearer ${token}`)
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && typeof onProgress === 'function') {
        onProgress(Math.round((e.loaded / e.total) * 100))
      }
    }
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) {
        const contentType = xhr.getResponseHeader('Content-Type') || ''
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            const json = contentType.includes('application/json') ? JSON.parse(xhr.responseText) : { message: xhr.responseText }
            resolve({ status: xhr.status, data: json })
          } catch (err) {
            resolve({ status: xhr.status, data: { message: xhr.responseText } })
          }
        } else {
          reject({ status: xhr.status, message: xhr.responseText })
        }
      }
    }
    xhr.onerror = () => reject({ status: xhr.status, message: 'Network error' })
    xhr.send(formData)
  })
}

export { API_BASE, postJson, postForm, login, uploadWithProgress }
