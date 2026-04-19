import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Film, Tv2, BookOpen, Star, TrendingUp, Clock, CheckCircle2, BookMarked, Eye } from 'lucide-react'
import { useStore } from '../hooks/useStore.jsx'
import { StarDisplay } from '../components/StarRating.jsx'
import { StatusBadge } from '../components/StatusBadge.jsx'

function StatCard({ icon: Icon, label, value, sub, color, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col gap-3 p-5 bg-[#141425] border border-white/[0.06] rounded-2xl text-left card-hover w-full"
    >
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
        <Icon size={20} className="text-white" />
      </div>
      <div>
        <p className="text-2xl font-bold text-white">{value}</p>
        <p className="text-sm text-gray-400 mt-0.5">{label}</p>
        {sub && <p className="text-xs text-gray-600 mt-0.5">{sub}</p>}
      </div>
    </button>
  )
}

function RecentItem({ item, type }) {
  const navigate = useNavigate()
  const poster = item.poster || item.cover

  return (
    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.04] transition-colors cursor-pointer" onClick={() => navigate(`/${type === 'movie' ? 'movies' : type === 'show' ? 'shows' : 'books'}`)}>
      <div className="w-10 h-14 shrink-0 rounded-lg overflow-hidden bg-[#1a1a2e]">
        {poster
          ? <img src={poster} alt={item.title} className="w-full h-full object-cover" loading="lazy" />
          : <div className="w-full h-full bg-gradient-to-br from-violet-900/50 to-purple-900/50" />
        }
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white leading-tight line-clamp-1">{item.title}</p>
        {item.author && <p className="text-xs text-gray-500 mt-0.5">{item.author}</p>}
        {item.year && <p className="text-xs text-gray-600 mt-0.5">{item.year}</p>}
      </div>
      <div className="shrink-0 flex flex-col items-end gap-1.5">
        <StatusBadge
          status={item.watchStatus || item.readStatus}
          type={type === 'book' ? 'book' : type === 'show' ? 'show' : 'movie'}
          size="xs"
        />
        {item.userRating && (
          <div className="flex items-center gap-1 text-amber-400">
            <Star size={10} className="fill-amber-400 stroke-amber-400" />
            <span className="text-xs font-semibold">{item.userRating}</span>
          </div>
        )}
      </div>
    </div>
  )
}

function ActivityBar({ label, count, max, color }) {
  return (
    <div className="flex items-center gap-3">
      <p className="text-xs text-gray-500 w-24 shrink-0 text-right">{label}</p>
      <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color}`}
          style={{ width: max > 0 ? `${(count / max) * 100}%` : '0%' }}
        />
      </div>
      <span className="text-xs font-semibold text-gray-300 w-6 text-right">{count}</span>
    </div>
  )
}

export default function Dashboard() {
  const { movies, shows, books } = useStore()
  const navigate = useNavigate()

  const stats = useMemo(() => {
    const watchedMovies = movies.filter(m => m.watchStatus === 'watched')
    const watchingShows = shows.filter(s => s.watchStatus === 'watching')
    const readBooks = books.filter(b => b.readStatus === 'read')
    const rated = [...movies, ...shows, ...books].filter(x => x.userRating != null)
    const avgRating = rated.length ? (rated.reduce((s, x) => s + x.userRating, 0) / rated.length).toFixed(1) : null

    return {
      totalMovies: movies.length,
      watchedMovies: watchedMovies.length,
      watchlistMovies: movies.filter(m => m.watchStatus === 'want_to_watch').length,
      totalShows: shows.length,
      watchingShows: watchingShows.length,
      watchlistShows: shows.filter(s => s.watchStatus === 'want_to_watch').length,
      completedShows: shows.filter(s => s.watchStatus === 'watched').length,
      totalBooks: books.length,
      readBooks: readBooks.length,
      readingBooks: books.filter(b => b.readStatus === 'reading').length,
      readlistBooks: books.filter(b => b.readStatus === 'want_to_read').length,
      avgRating,
      totalRated: rated.length,
    }
  }, [movies, shows, books])

  const recent = useMemo(() => {
    const all = [
      ...movies.map(m => ({ ...m, _type: 'movie' })),
      ...shows.map(s => ({ ...s, _type: 'show' })),
      ...books.map(b => ({ ...b, _type: 'book' })),
    ]
    return all.sort((a, b) => new Date(b.addedAt) - new Date(a.addedAt)).slice(0, 8)
  }, [movies, shows, books])

  const maxCount = Math.max(stats.totalMovies, stats.totalShows, stats.totalBooks, 1)

  const total = movies.length + shows.length + books.length

  return (
    <div className="p-4 sm:p-6 space-y-6 pb-8">
      {/* Hero greeting */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          Your <span className="gradient-text">Vault</span>
        </h1>
        <p className="text-gray-500 mt-1 text-sm">
          {total === 0
            ? 'Start adding movies, shows, and books to track your journey.'
            : `${total} item${total !== 1 ? 's' : ''} tracked across movies, TV, and books.`
          }
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatCard
          icon={Film}
          label="Movies"
          value={stats.totalMovies}
          sub={stats.watchedMovies > 0 ? `${stats.watchedMovies} watched` : 'Start tracking'}
          color="bg-violet-600/30"
          onClick={() => navigate('/movies')}
        />
        <StatCard
          icon={Tv2}
          label="TV Shows"
          value={stats.totalShows}
          sub={stats.watchingShows > 0 ? `${stats.watchingShows} watching` : 'Start tracking'}
          color="bg-blue-600/30"
          onClick={() => navigate('/shows')}
        />
        <StatCard
          icon={BookOpen}
          label="Books"
          value={stats.totalBooks}
          sub={stats.readBooks > 0 ? `${stats.readBooks} read` : 'Start tracking'}
          color="bg-emerald-600/30"
          onClick={() => navigate('/books')}
        />
        <StatCard
          icon={Star}
          label="Avg Rating"
          value={stats.avgRating ?? '–'}
          sub={stats.totalRated > 0 ? `${stats.totalRated} rated` : 'Rate something!'}
          color="bg-amber-600/30"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Collection breakdown */}
        <div className="bg-[#141425] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <TrendingUp size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Collection Breakdown</h2>
          </div>
          <div className="space-y-3">
            <ActivityBar label="Movies" count={stats.totalMovies} max={maxCount} color="bg-gradient-to-r from-violet-600 to-purple-500" />
            <ActivityBar label="TV Shows" count={stats.totalShows} max={maxCount} color="bg-gradient-to-r from-blue-600 to-cyan-500" />
            <ActivityBar label="Books" count={stats.totalBooks} max={maxCount} color="bg-gradient-to-r from-emerald-600 to-teal-500" />
          </div>

          <div className="pt-3 border-t border-white/[0.06] grid grid-cols-3 gap-2 text-center">
            <div>
              <p className="text-lg font-bold text-violet-400">{stats.watchedMovies}</p>
              <p className="text-[10px] text-gray-600">Watched</p>
            </div>
            <div>
              <p className="text-lg font-bold text-blue-400">{stats.watchingShows}</p>
              <p className="text-[10px] text-gray-600">Watching</p>
            </div>
            <div>
              <p className="text-lg font-bold text-emerald-400">{stats.readingBooks}</p>
              <p className="text-[10px] text-gray-600">Reading</p>
            </div>
          </div>
        </div>

        {/* Watchlist / Readlist summary */}
        <div className="bg-[#141425] border border-white/[0.06] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <BookMarked size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Queued Up</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center gap-2 text-gray-400">
                <Film size={14} className="text-violet-400" />
                <span className="text-sm">Movies to watch</span>
              </div>
              <span className="text-sm font-bold text-white">{stats.watchlistMovies}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center gap-2 text-gray-400">
                <Tv2 size={14} className="text-blue-400" />
                <span className="text-sm">Shows to watch</span>
              </div>
              <span className="text-sm font-bold text-white">{stats.watchlistShows}</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03] border border-white/[0.04]">
              <div className="flex items-center gap-2 text-gray-400">
                <BookOpen size={14} className="text-emerald-400" />
                <span className="text-sm">Books to read</span>
              </div>
              <span className="text-sm font-bold text-white">{stats.readlistBooks}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent activity */}
      {recent.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Clock size={16} className="text-violet-400" />
            <h2 className="font-semibold text-white text-sm">Recently Added</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {recent.map(item => (
              <RecentItem key={item.id} item={item} type={item._type} />
            ))}
          </div>
        </div>
      )}

      {total === 0 && (
        <div className="flex flex-col items-center py-12 gap-6 text-center">
          <div className="flex gap-4">
            {[Film, Tv2, BookOpen].map((Icon, i) => (
              <div key={i} className="w-16 h-16 rounded-2xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center">
                <Icon size={24} className="text-gray-700" />
              </div>
            ))}
          </div>
          <div>
            <p className="text-gray-300 font-semibold">Your vault is empty</p>
            <p className="text-sm text-gray-600 mt-1">Start tracking movies, shows, and books you love.</p>
          </div>
          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => navigate('/movies')} className="btn-primary text-sm">Add a Movie</button>
            <button onClick={() => navigate('/shows')} className="bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm">Add a Show</button>
            <button onClick={() => navigate('/books')} className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2 rounded-xl transition-colors text-sm">Add a Book</button>
          </div>
        </div>
      )}
    </div>
  )
}
