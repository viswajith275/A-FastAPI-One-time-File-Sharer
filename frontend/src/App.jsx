import React, { useState, useEffect } from 'react'
import { API_BASE, postJson, postForm, login, uploadWithProgress } from './api'
import Toast from './Toast'

function Auth({ onLogin }) {
  const [mode, setMode] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    setError('')
    try {
      if (mode === 'login') {
        const res = await login({ username, password })
        if (!res.ok) throw new Error('Invalid credentials')
        const data = await res.json()
        onLogin(data.access_token)
      } else {
        const res = await postJson('/register', { username, password })
        if (!res.ok) throw new Error('Register failed')
        const data = await res.json()
        // auto-login after register
        const res2 = await login({ username, password })
        const d2 = await res2.json()
        onLogin(d2.access_token)
      }
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h2 className="text-xl font-semibold mb-4">{mode === 'login' ? 'Sign In' : 'Create Account'}</h2>
      <form onSubmit={submit} className="space-y-3">
        <div>
          <label className="text-sm text-gray-300">Username</label>
          <input className="mt-1 w-full rounded-lg p-3 bg-transparent border border-white/5" value={username} onChange={e => setUsername(e.target.value)} required />
        </div>
        <div>
          <label className="text-sm text-gray-300">Password</label>
          <input className="mt-1 w-full rounded-lg p-3 bg-transparent border border-white/5" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-[#5b21b6]" type="submit">{mode === 'login' ? 'Sign In' : 'Register'}</button>
          <button type="button" className="text-sm text-gray-400 hover:text-white" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? 'Register' : 'Sign in'}</button>
        </div>
        {error && <div className="text-sm text-red-400">{error}</div>}
      </form>
    </div>
  )
}

function Upload({ token, onLogout }) {
  const [file, setFile] = useState(null)
  const [result, setResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [progress, setProgress] = useState(0)
    const [toast, setToast] = useState(null)

  async function submit(e) {
    e.preventDefault()
    if (!file) return
    setLoading(true)
    setError('')
    setResult(null)
    try {
      const form = new FormData()
      form.append('file', file)
      setProgress(0)
      const resp = await uploadWithProgress('/files/Uploads', form, token, p => setProgress(p))
      const data = resp.data
      setResult(data)
      setToast({ type: 'success', text: 'Upload succeeded — one-time link created' })
    } catch (err) {
      const msg = err?.message || (err?.message) || 'Upload failed'
      setError(msg)
      setToast({ type: 'error', text: msg })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Upload File</h2>
        <div>
          <button className="text-sm text-gray-400 hover:text-white" onClick={onLogout}>Logout</button>
        </div>
      </div>

      <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 items-center">
        <input className="w-full sm:w-auto" type="file" onChange={e => setFile(e.target.files?.[0] ?? null)} />
        <button className="px-4 py-2 rounded-lg bg-gradient-to-r from-primary to-[#5b21b6]" type="submit" disabled={loading || !file}>
          {loading ? (
            <span className="spinner" aria-hidden></span>
          ) : 'Upload & Create One-Time Link'}
        </button>
      </form>

      {loading && (
        <div className="mt-4">
          <div className="h-3 bg-white/5 rounded overflow-hidden">
            <div className="h-3 bg-gradient-to-r from-primary to-[#5b21b6]" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="text-sm text-gray-400 mt-1">Uploading — {progress}%</div>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="result">
          <div><strong>Filename:</strong> {result.filename}</div>
          <div className="muted">Note: {result.note}</div>
          <div className="mt-4 flex flex-col sm:flex-row gap-3">
            <input readOnly value={result.one_time_link} className="flex-1 rounded-lg p-3 bg-transparent border border-white/5" />
            <div className="flex gap-2">
              <button className="px-3 py-2 rounded-lg bg-white/6" onClick={() => { navigator.clipboard.writeText(result.one_time_link); setToast({ type: 'success', text: 'Link copied' }) }}>Copy</button>
              <a className="px-3 py-2 rounded-lg bg-white/6" href={result.one_time_link} target="_blank" rel="noreferrer">Open</a>
            </div>
          </div>
        </div>
      )}
      {toast && <Toast {...toast} onClose={() => setToast(null)} />}
    </div>
  )
}

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) localStorage.setItem('token', token)
    else localStorage.removeItem('token')
  }, [token])

  function handleLogout() {
    setToken(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-brandbg to-[#041623] text-white flex items-start justify-center py-8 px-4">
      <div className="w-full max-w-3xl">
        <header className="mb-6">
          <div className="text-2xl font-extrabold tracking-tight">Secure File Share</div>
          <div className="text-sm text-gray-400">Create single-use encrypted download links</div>
        </header>

        <main>
          {!token ? (
            <div className="bg-surface/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/5">
              <Auth onLogin={t => setToken(t)} />
            </div>
          ) : (
            <div className="bg-surface/60 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-white/5">
              <Upload token={token} onLogout={handleLogout} />
            </div>
          )}
        </main>

        <footer className="mt-6 text-sm text-gray-400">
          API: <a className="underline" href={API_BASE} target="_blank" rel="noreferrer">{API_BASE}</a>
        </footer>
      </div>
    </div>
  )
}
