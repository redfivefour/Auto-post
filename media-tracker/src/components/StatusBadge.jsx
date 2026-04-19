const MOVIE_STATUS = {
  watched: { label: 'Watched', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  watching: { label: 'Watching', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  want_to_watch: { label: 'Want to Watch', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

const SHOW_STATUS = {
  watching: { label: 'Watching', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  watched: { label: 'Completed', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  want_to_watch: { label: 'Want to Watch', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

const BOOK_STATUS = {
  reading: { label: 'Reading', color: 'bg-blue-500/20 text-blue-400 border-blue-500/30' },
  read: { label: 'Read', color: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' },
  want_to_read: { label: 'Want to Read', color: 'bg-violet-500/20 text-violet-400 border-violet-500/30' },
  on_hold: { label: 'On Hold', color: 'bg-amber-500/20 text-amber-400 border-amber-500/30' },
  dropped: { label: 'Dropped', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
}

export const STATUS_OPTIONS = { movie: MOVIE_STATUS, show: SHOW_STATUS, book: BOOK_STATUS }

export function StatusBadge({ status, type = 'movie', size = 'sm' }) {
  const map = STATUS_OPTIONS[type] || MOVIE_STATUS
  const { label, color } = map[status] || { label: status, color: 'bg-gray-500/20 text-gray-400 border-gray-500/30' }
  return (
    <span className={`inline-flex items-center border rounded-full font-medium ${color} ${size === 'xs' ? 'text-[10px] px-2 py-0.5' : 'text-xs px-2.5 py-1'}`}>
      {label}
    </span>
  )
}
