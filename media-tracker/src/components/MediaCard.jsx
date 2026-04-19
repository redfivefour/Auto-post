import { Star, MoreVertical, Eye, BookOpen } from 'lucide-react'
import { StatusBadge } from './StatusBadge.jsx'

function PosterPlaceholder({ title, type }) {
  const gradient = type === 'movie'
    ? 'from-violet-900 to-indigo-900'
    : type === 'show'
    ? 'from-blue-900 to-cyan-900'
    : 'from-emerald-900 to-teal-900'

  return (
    <div className={`w-full h-full flex flex-col items-center justify-center bg-gradient-to-br ${gradient} p-2`}>
      {type === 'book'
        ? <BookOpen size={24} className="text-white/20 mb-2" />
        : <Eye size={24} className="text-white/20 mb-2" />
      }
      <p className="text-white/30 text-xs text-center leading-tight line-clamp-3 font-medium">{title}</p>
    </div>
  )
}

export default function MediaCard({ item, type, onClick }) {
  const poster = item.poster || item.cover
  const statusKey = type === 'book' ? item.readStatus : item.watchStatus
  const statusType = type === 'book' ? 'book' : type === 'show' ? 'show' : 'movie'

  return (
    <button
      onClick={onClick}
      className="group relative flex flex-col bg-[#141425] rounded-2xl overflow-hidden border border-white/[0.06] card-hover text-left w-full"
    >
      {/* Poster */}
      <div className="aspect-[2/3] w-full overflow-hidden bg-[#1a1a2e]">
        {poster
          ? <img
              src={poster}
              alt={item.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
            />
          : <PosterPlaceholder title={item.title} type={type} />
        }
        {/* Overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        <div className="absolute inset-x-0 bottom-0 p-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <p className="text-xs text-gray-300 line-clamp-3 leading-relaxed">{item.overview}</p>
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1.5">
        <p className="font-semibold text-white text-sm leading-tight line-clamp-2">{item.title}</p>
        {item.author && <p className="text-xs text-gray-500 line-clamp-1">{item.author}</p>}
        {item.year && <p className="text-xs text-gray-600">{item.year}</p>}

        <div className="mt-auto pt-1 flex items-center justify-between">
          <StatusBadge status={statusKey} type={statusType} size="xs" />
          {item.userRating != null && (
            <div className="flex items-center gap-1 text-amber-400">
              <Star size={10} className="fill-amber-400 stroke-amber-400" />
              <span className="text-xs font-semibold">{item.userRating}</span>
            </div>
          )}
        </div>

        {/* Episode progress bar */}
        {type === 'show' && item.totalEpisodes && item.watchedEpisodes > 0 && (
          <div className="mt-1">
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-violet-500 rounded-full"
                style={{ width: `${Math.min(100, (item.watchedEpisodes / item.totalEpisodes) * 100)}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </button>
  )
}
