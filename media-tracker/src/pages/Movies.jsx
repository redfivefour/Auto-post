import { useState, useMemo } from 'react'
import { Film, SlidersHorizontal } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'
import PageHeader from '../components/PageHeader.jsx'
import MediaCard from '../components/MediaCard.jsx'
import SearchModal from '../components/SearchModal.jsx'
import MediaDetailModal from '../components/MediaDetailModal.jsx'

const FILTERS = [
  { key: 'all', label: 'All' },
  { key: 'watched', label: 'Watched' },
  { key: 'watching', label: 'Watching' },
  { key: 'want_to_watch', label: 'Watchlist' },
  { key: 'on_hold', label: 'On Hold' },
  { key: 'dropped', label: 'Dropped' },
]

const SORT = [
  { key: 'addedAt_desc', label: 'Recently Added' },
  { key: 'addedAt_asc', label: 'Oldest First' },
  { key: 'title_asc', label: 'Title A–Z' },
  { key: 'rating_desc', label: 'Highest Rated' },
  { key: 'year_desc', label: 'Newest Release' },
]

export default function Movies() {
  const { movies, settings, addMovie, updateMovie, removeMovie, hasMovie } = useStore()
  const [showSearch, setShowSearch] = useState(false)
  const [selected, setSelected] = useState(null)
  const [filter, setFilter] = useState('all')
  const [sort, setSort] = useState('addedAt_desc')
  const [search, setSearch] = useState('')

  const filtered = useMemo(() => {
    let list = movies.filter(m => {
      if (filter !== 'all' && m.watchStatus !== filter) return false
      if (search && !m.title.toLowerCase().includes(search.toLowerCase())) return false
      return true
    })
    const [field, dir] = sort.split('_')
    list.sort((a, b) => {
      let va = field === 'rating' ? (a.userRating ?? -1) : field === 'year' ? (a.year ?? '') : field === 'title' ? a.title : a.addedAt
      let vb = field === 'rating' ? (b.userRating ?? -1) : field === 'year' ? (b.year ?? '') : field === 'title' ? b.title : b.addedAt
      if (va < vb) return dir === 'asc' ? -1 : 1
      if (va > vb) return dir === 'asc' ? 1 : -1
      return 0
    })
    return list
  }, [movies, filter, sort, search])

  return (
    <div className="min-h-full">
      <PageHeader
        title="Movies"
        subtitle={`${movies.length} in collection`}
        onAdd={() => setShowSearch(true)}
        addLabel="Add Movie"
      />

      {/* Filters + Search */}
      <div className="px-4 sm:px-6 py-4 space-y-3 border-b border-white/[0.04]">
        {/* Search bar */}
        <div className="flex items-center gap-2 bg-white/5 border border-white/8 rounded-xl px-3 py-2.5">
          <Film size={14} className="text-gray-600 shrink-0" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Filter collection..."
            className="flex-1 bg-transparent text-sm text-white placeholder-gray-600 focus:outline-none"
          />
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200
                ${filter === f.key
                  ? 'bg-violet-600/20 text-violet-400 border-violet-500/30'
                  : 'text-gray-500 border-white/[0.06] hover:text-gray-300 hover:border-white/10'
                }`}
            >
              {f.label}
              {f.key !== 'all' && movies.filter(m => m.watchStatus === f.key).length > 0 && (
                <span className="ml-1.5 text-[10px] opacity-70">{movies.filter(m => m.watchStatus === f.key).length}</span>
              )}
            </button>
          ))}
          {/* Sort */}
          <div className="relative ml-auto shrink-0">
            <select
              value={sort}
              onChange={e => setSort(e.target.value)}
              className="text-xs text-gray-400 bg-white/5 border border-white/8 rounded-full px-3 py-1.5 pr-6 appearance-none focus:outline-none cursor-pointer"
            >
              {SORT.map(s => <option key={s.key} value={s.key} className="bg-[#1a1a2e]">{s.label}</option>)}
            </select>
            <SlidersHorizontal size={10} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid */}
      <div className="p-4 sm:p-6">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
              <Film size={28} className="text-gray-700" />
            </div>
            <div>
              <p className="text-gray-300 font-semibold">
                {movies.length === 0 ? 'No movies yet' : 'No matches'}
              </p>
              <p className="text-sm text-gray-600 mt-1">
                {movies.length === 0 ? 'Search and add movies to start tracking' : 'Try a different filter or search term'}
              </p>
            </div>
            {movies.length === 0 && (
              <button onClick={() => setShowSearch(true)} className="btn-primary text-sm">
                Add your first movie
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-3 sm:gap-4">
            {filtered.map(m => (
              <MediaCard key={m.id} item={m} type="movie" onClick={() => setSelected(m)} />
            ))}
          </div>
        )}
      </div>

      {showSearch && (
        <SearchModal
          type="movie"
          apiKey={settings.tmdbApiKey}
          onAdd={(meta) => { addMovie(meta); }}
          onClose={() => setShowSearch(false)}
          hasItem={(id) => hasMovie(id)}
        />
      )}

      {selected && (
        <MediaDetailModal
          item={selected}
          type="movie"
          onClose={() => setSelected(null)}
          onUpdate={(id, patch) => { updateMovie(id, patch); setSelected(prev => ({ ...prev, ...patch })) }}
          onRemove={removeMovie}
        />
      )}
    </div>
  )
}
