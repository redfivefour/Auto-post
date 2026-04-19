import { useState } from 'react'
import { Settings as SettingsIcon, Key, ExternalLink, Trash2, AlertCircle, CheckCircle2, Info, Film, Tv2, BookOpen } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'

function Section({ title, icon: Icon, children }) {
  return (
    <div className="bg-[#141425] border border-white/[0.06] rounded-2xl overflow-hidden">
      <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
        <Icon size={16} className="text-violet-400" />
        <h2 className="font-semibold text-white text-sm">{title}</h2>
      </div>
      <div className="p-5 space-y-4">{children}</div>
    </div>
  )
}

export default function Settings() {
  const { settings, updateSettings, movies, shows, books, setMovies, setShows, setBooks } = useStore()
  const [apiKey, setApiKey] = useState(settings.tmdbApiKey || '')
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState(null)
  const [confirmClear, setConfirmClear] = useState(null)

  function handleSaveKey() {
    updateSettings({ tmdbApiKey: apiKey.trim() })
    setSaved(true)
    setTestResult(null)
    setTimeout(() => setSaved(false), 2000)
  }

  async function handleTest() {
    if (!apiKey.trim()) return
    setTesting(true)
    setTestResult(null)
    try {
      const res = await fetch(`https://api.themoviedb.org/3/configuration?api_key=${apiKey.trim()}`)
      if (res.ok) setTestResult({ ok: true, msg: 'API key is valid!' })
      else setTestResult({ ok: false, msg: 'Invalid API key. Please check and try again.' })
    } catch {
      setTestResult({ ok: false, msg: 'Network error — could not reach TMDB.' })
    } finally {
      setTesting(false)
    }
  }

  const total = movies.length + shows.length + books.length

  return (
    <div className="p-4 sm:p-6 space-y-5 pb-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Settings</h1>
        <p className="text-gray-500 text-sm mt-1">Configure your Vaultlog experience</p>
      </div>

      {/* TMDB API Key */}
      <Section title="TMDB API Key" icon={Key}>
        <p className="text-sm text-gray-400 leading-relaxed">
          Required to search movies and TV shows. Get a free API key from The Movie Database.
        </p>
        <a
          href="https://www.themoviedb.org/settings/api"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 text-sm text-violet-400 hover:text-violet-300 transition-colors"
        >
          <ExternalLink size={13} />
          Get your free TMDB API key
        </a>
        <div className="space-y-3">
          <input
            type="password"
            value={apiKey}
            onChange={e => setApiKey(e.target.value)}
            placeholder="Paste your TMDB API key here..."
            className="input-field font-mono text-sm"
            autoComplete="off"
          />
          {testResult && (
            <div className={`flex items-center gap-2 p-3 rounded-xl text-sm ${testResult.ok ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'}`}>
              {testResult.ok ? <CheckCircle2 size={14} /> : <AlertCircle size={14} />}
              {testResult.msg}
            </div>
          )}
          <div className="flex gap-2">
            <button
              onClick={handleTest}
              disabled={!apiKey.trim() || testing}
              className="flex-1 text-sm text-gray-300 border border-white/10 rounded-xl py-2.5 hover:bg-white/5 disabled:opacity-40 transition-colors font-medium"
            >
              {testing ? 'Testing...' : 'Test Key'}
            </button>
            <button
              onClick={handleSaveKey}
              disabled={!apiKey.trim()}
              className="flex-1 btn-primary text-sm disabled:opacity-40"
            >
              {saved ? 'Saved!' : 'Save Key'}
            </button>
          </div>
        </div>

        <div className="flex items-start gap-2 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <Info size={13} className="text-gray-500 shrink-0 mt-0.5" />
          <p className="text-xs text-gray-500 leading-relaxed">
            Your API key is stored locally in your browser and never sent anywhere except directly to TMDB's API servers. Books search uses the free Open Library API — no key needed.
          </p>
        </div>
      </Section>

      {/* Collection stats */}
      <Section title="Collection" icon={SettingsIcon}>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: Film, label: 'Movies', count: movies.length, color: 'text-violet-400' },
            { icon: Tv2, label: 'TV Shows', count: shows.length, color: 'text-blue-400' },
            { icon: BookOpen, label: 'Books', count: books.length, color: 'text-emerald-400' },
          ].map(({ icon: Icon, label, count, color }) => (
            <div key={label} className="flex flex-col items-center gap-1.5 p-4 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <Icon size={20} className={color} />
              <p className="text-xl font-bold text-white">{count}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* Data management */}
      <Section title="Data Management" icon={Trash2}>
        <p className="text-sm text-gray-400">All data is stored locally in your browser's localStorage. Clearing it will permanently delete your collection.</p>

        <div className="space-y-2">
          {[
            { key: 'movies', label: 'Clear Movies', count: movies.length, color: 'text-red-400' },
            { key: 'shows', label: 'Clear TV Shows', count: shows.length, color: 'text-red-400' },
            { key: 'books', label: 'Clear Books', count: books.length, color: 'text-red-400' },
            { key: 'all', label: 'Clear Everything', count: total, color: 'text-red-500' },
          ].map(item => (
            <div key={item.key} className="flex items-center justify-between p-3 rounded-xl bg-white/[0.02] border border-white/[0.04]">
              <div>
                <p className="text-sm text-white font-medium">{item.label}</p>
                <p className="text-xs text-gray-600">{item.count} item{item.count !== 1 ? 's' : ''}</p>
              </div>
              {confirmClear === item.key ? (
                <div className="flex gap-2">
                  <button onClick={() => setConfirmClear(null)} className="text-xs px-3 py-1.5 rounded-lg bg-white/5 text-gray-400 hover:text-white transition-colors">Cancel</button>
                  <button
                    onClick={() => {
                      if (item.key === 'movies' || item.key === 'all') { localStorage.removeItem('vaultlog_movies'); window.location.reload() }
                      if (item.key === 'shows' || item.key === 'all') { localStorage.removeItem('vaultlog_shows'); }
                      if (item.key === 'books' || item.key === 'all') { localStorage.removeItem('vaultlog_books'); }
                      if (item.key === 'all') window.location.reload()
                      setConfirmClear(null)
                      window.location.reload()
                    }}
                    className="text-xs px-3 py-1.5 rounded-lg bg-red-500/20 text-red-400 hover:bg-red-500/30 transition-colors font-semibold"
                  >
                    Confirm
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setConfirmClear(item.key)}
                  disabled={item.count === 0}
                  className={`text-xs px-3 py-1.5 rounded-lg border border-red-500/20 ${item.count > 0 ? 'text-red-400 hover:bg-red-500/10' : 'text-gray-700 cursor-not-allowed'} transition-colors`}
                >
                  Clear
                </button>
              )}
            </div>
          ))}
        </div>
      </Section>

      <div className="text-center py-2">
        <p className="text-xs text-gray-700">Vaultlog · Built with React + TMDB + Open Library</p>
      </div>
    </div>
  )
}
