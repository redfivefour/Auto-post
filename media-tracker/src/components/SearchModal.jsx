import { useState, useRef, useEffect, useCallback } from 'react'
import { Search, X, Plus, Check, Loader2, AlertCircle, ExternalLink } from 'lucide-react'
import { tmdb } from '../services/tmdb.js'
import { openLibrary } from '../services/openLibrary.js'

function ResultCard({ item, onAdd, isAdded, type }) {
  const poster = item.poster_path
    ? `https://image.tmdb.org/t/p/w154${item.poster_path}`
    : item.cover_i
    ? `https://covers.openlibrary.org/b/id/${item.cover_i}-S.jpg`
    : null
  const title = item.title || item.name
  const year = item.release_date?.slice(0, 4) || item.first_air_date?.slice(0, 4) || item.first_publish_year
  const sub = type === 'book' ? item.author_name?.[0] : (item.overview?.slice(0, 80) + (item.overview?.length > 80 ? '…' : ''))

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/5 transition-colors group">
      <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-[#1e1e35]">
        {poster
          ? <img src={poster} alt={title} className="w-full h-full object-cover" />
          : <div className="w-full h-full flex items-center justify-center text-gray-700 text-xs text-center px-1 leading-tight">{title?.slice(0, 10)}</div>
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-medium text-white text-sm leading-tight line-clamp-1">{title}</p>
        {year && <p className="text-xs text-gray-500 mt-0.5">{year}</p>}
        {sub && <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{sub}</p>}
      </div>
      <button
        onClick={() => onAdd(item)}
        disabled={isAdded}
        className={`shrink-0 p-2 rounded-xl transition-all duration-200
          ${isAdded
            ? 'bg-emerald-500/20 text-emerald-400 cursor-default'
            : 'bg-violet-600/20 text-violet-400 hover:bg-violet-600/40 active:scale-95'
          }`}
      >
        {isAdded ? <Check size={16} /> : <Plus size={16} />}
      </button>
    </div>
  )
}

export default function SearchModal({ type, apiKey, onAdd, onClose, hasItem }) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  const noApiKey = (type === 'movie' || type === 'show') && !apiKey

  const typeLabel = { movie: 'Movies', show: 'TV Shows', book: 'Books' }[type]

  useEffect(() => { inputRef.current?.focus() }, [])

  const doSearch = useCallback(async (q) => {
    if (!q.trim() || noApiKey) { setResults([]); return }
    setLoading(true)
    setError(null)
    try {
      let raw = []
      if (type === 'movie') raw = await tmdb.searchMovies(q, apiKey)
      else if (type === 'show') raw = await tmdb.searchShows(q, apiKey)
      else raw = await openLibrary.search(q)
      setResults(raw.slice(0, 10))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }, [type, apiKey, noApiKey])

  useEffect(() => {
    clearTimeout(timerRef.current)
    if (!query.trim()) { setResults([]); return }
    timerRef.current = setTimeout(() => doSearch(query), 400)
    return () => clearTimeout(timerRef.current)
  }, [query, doSearch])

  function handleAdd(raw) {
    let normalized
    if (type === 'movie') normalized = tmdb.normalizeMovie(raw)
    else if (type === 'show') normalized = tmdb.normalizeShow(raw)
    else normalized = openLibrary.normalize(raw)
    onAdd(normalized)
  }

  function isAdded(item) {
    if (type === 'movie' || type === 'show') return hasItem(item.id)
    return hasItem(item.key)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:max-w-lg bg-[#141425] rounded-t-2xl sm:rounded-2xl border border-white/[0.08] shadow-2xl animate-slide-up flex flex-col max-h-[85dvh]">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-white/[0.06]">
          <div className="flex-1 flex items-center gap-3 bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 focus-within:border-violet-500 transition-colors">
            {loading ? <Loader2 size={16} className="text-gray-500 shrink-0 animate-spin" /> : <Search size={16} className="text-gray-500 shrink-0" />}
            <input
              ref={inputRef}
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder={`Search ${typeLabel}...`}
              className="flex-1 bg-transparent text-white placeholder-gray-500 focus:outline-none text-sm"
            />
            {query && (
              <button onClick={() => setQuery('')} className="text-gray-500 hover:text-white">
                <X size={14} />
              </button>
            )}
          </div>
          <button onClick={onClose} className="shrink-0 text-gray-400 hover:text-white p-1.5 rounded-xl hover:bg-white/5 transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-3">
          {noApiKey && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-3">
              <AlertCircle size={32} className="text-amber-400" />
              <div>
                <p className="font-semibold text-white">TMDB API Key Required</p>
                <p className="text-sm text-gray-400 mt-1">Add your API key in Settings to search {typeLabel}.</p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              <AlertCircle size={14} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {!noApiKey && !error && results.length === 0 && !loading && (
            <div className="flex flex-col items-center justify-center py-12 text-center gap-2">
              <Search size={32} className="text-gray-700" />
              <p className="text-gray-500 text-sm">{query ? 'No results found' : `Search for ${typeLabel.toLowerCase()} to add to your collection`}</p>
            </div>
          )}

          {results.length > 0 && (
            <div className="space-y-1">
              {results.map(item => (
                <ResultCard
                  key={item.id || item.key}
                  item={item}
                  type={type}
                  onAdd={handleAdd}
                  isAdded={isAdded(item)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
