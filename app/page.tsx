'use client'

import { useEffect, useMemo, useState } from 'react'

type Link = {
  id: string
  code: string
  url: string
  clicks: number
  lastClickedAt: string | null
  createdAt: string
}

const CODE_REGEX = /^[A-Za-z0-9]{6,8}$/

export default function DashboardPage() {
  const [links, setLinks] = useState<Link[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [url, setUrl] = useState('')
  const [code, setCode] = useState('')
  const [filter, setFilter] = useState('')
  const [createdShortUrl, setCreatedShortUrl] = useState<string | null>(null)
  const [creating, setCreating] = useState(false)

  const baseUrl = (
    typeof window !== 'undefined'
      ? (process.env.NEXT_PUBLIC_BASE_URL || window.location.origin)
      : (process.env.NEXT_PUBLIC_BASE_URL || '')
  )

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return links
    return links.filter(l => l.code.toLowerCase().includes(q) || l.url.toLowerCase().includes(q))
  }, [filter, links])

  async function fetchLinks() {
    setLoading(true)
    const res = await fetch('/api/links')
    if (!res.ok) {
      setError('Failed to load links')
    } else {
      const data = await res.json()
      setLinks(data)
    }
    setLoading(false)
  }

  useEffect(() => { fetchLinks() }, [])

  async function onCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setCreatedShortUrl(null)
    setCreating(true)

    if (!url) return setError('URL is required')
    try { new URL(url) } catch { return setError('Invalid URL') }
    if (code && !CODE_REGEX.test(code)) return setError('Code must match [A-Za-z0-9]{6,8}')

    const res = await fetch('/api/links', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, code: code || undefined })
    })
    if (res.status === 409) {
      setError('Custom code already exists')
      setCreating(false)
      return
    }
    if (!res.ok) {
      setError('Failed to create link')
      setCreating(false)
      return
    }
    const created: Link = await res.json()
    setUrl('')
    setCode('')
    setCreatedShortUrl(`${baseUrl}/${created.code}`)
    await fetchLinks()
    setCreating(false)
  }

  async function onDelete(code: string) {
    if (!confirm(`Delete ${code}?`)) return
    const res = await fetch(`/api/links/${code}`, { method: 'DELETE' })
    if (!res.ok) {
      alert('Failed to delete')
      return
    }
    await fetchLinks()
  }

  function copy(text: string) {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-8">
      {createdShortUrl && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm flex items-center justify-between">
          <div>
            <span className="font-medium text-emerald-900">Short link created: </span>
            <a className="underline text-emerald-700" href={createdShortUrl} target="_blank" rel="noreferrer">{createdShortUrl}</a>
          </div>
          <div className="flex items-center gap-2">
            <button className="btn btn-outline" onClick={() => copy(createdShortUrl)}>Copy</button>
            <a className="btn btn-primary" href={createdShortUrl} target="_blank" rel="noreferrer">Open</a>
          </div>
        </div>
      )}

      <section className="card p-5 shadow-sm">
        <h2 className="text-lg font-semibold mb-4">Create Short Link</h2>
        <form className="grid gap-4 sm:grid-cols-6" onSubmit={onCreate}>
          <div className="sm:col-span-4">
            <label className="label">Original URL</label>
            <input className="input" placeholder="https://example.com/very/long/url" value={url} onChange={e => setUrl(e.target.value)} />
          </div>
          <div className="sm:col-span-2">
            <label className="label">Custom Code (optional)</label>
            <input className="input" placeholder="6-8 letters/numbers" value={code} onChange={e => setCode(e.target.value)} />
          </div>
          <div className="sm:col-span-6 flex items-end gap-3">
            <button className="btn btn-primary disabled:opacity-60 disabled:cursor-not-allowed inline-flex items-center gap-2" type="submit" disabled={creating}>
              {creating && (
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M12 3v3m0 12v3m9-9h-3M6 12H3m15.364 6.364-2.121-2.121M8.757 8.757 6.636 6.636m10.607 0-2.121 2.121M8.757 15.243l-2.121 2.121"/>
                </svg>
              )}
              Shorten
            </button>
            {error && <p className="text-sm text-red-600">{error}</p>}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <h2 className="text-lg font-semibold">All Links</h2>
          <input className="input max-w-xs" placeholder="Search by URL or code" value={filter} onChange={e => setFilter(e.target.value)} />
        </div>
        <div className="overflow-x-auto card shadow-sm">
          <table className="table">
            <thead>
              <tr>
                <th className="th">Short Code</th>
                <th className="th">Target URL</th>
                <th className="th">Clicks</th>
                <th className="th hidden sm:table-cell">Last Clicked</th>
                <th className="th">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td className="td" colSpan={5}>Loading...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td className="td" colSpan={5}>No links</td></tr>
              ) : (
                filtered.map(l => (
                  <tr key={l.id}>
                    <td className="td font-mono"><a className="underline" href={`/code/${l.code}`}>{l.code}</a></td>
                    <td className="td max-w-[240px] sm:max-w-[360px] truncate"><a className="underline" href={l.url} target="_blank" rel="noreferrer">{l.url}</a></td>
                    <td className="td">{l.clicks}</td>
                    <td className="td hidden sm:table-cell">{l.lastClickedAt ? new Date(l.lastClickedAt).toLocaleString() : '-'}</td>
                    <td className="td">
                      <div className="flex flex-wrap gap-2">
                        <button className="btn btn-outline" onClick={() => copy(`${baseUrl}/${l.code}`)}>Copy</button>
                        <a className="btn btn-outline" href={`${baseUrl}/${l.code}`} target="_blank" rel="noreferrer">Open</a>
                        <button className="btn btn-outline" onClick={() => onDelete(l.code)}>Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}