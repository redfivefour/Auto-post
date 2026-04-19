import { useState, useEffect } from 'react'
import {
  X, ExternalLink, Trash2, Calendar, Clock, Layers,
  BookOpen, Tv2, Film, ChevronDown, Save
} from 'lucide-react'
import { StarRating } from './StarRating.jsx'
import { STATUS_OPTIONS } from './StatusBadge.jsx'

function Backdrop({ poster, backdrop, title }) {
  return (
    <div className="relative h-48 sm:h-56 overflow-hidden rounded-t-2xl bg-[#1a1a2e]">
      {backdrop && (
        <img src={backdrop} alt="" className="absolute inset-0 w-full h-full object-cover opacity-40" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-[#141425] via-transparent to-transparent" />
      {poster && (
        <div className="absolute bottom-0 left-6 translate-y-1/2 w-20 sm:w-24 aspect-[2/3] rounded-xl overflow-hidden border-2 border-white/10 shadow-2xl">
          <img src={poster} alt={title} className="w-full h-full object-cover" />
        </div>
      )}
    </div>
  )
}

export default function MediaDetailModal({ item, type, onClose, onUpdate, onRemove }) {
  const [form, setForm] = useState({
    userRating: item.userRating ?? null,
    notes: item.notes ?? '',
    watchStatus: item.watchStatus ?? item.readStatus ?? 'want_to_watch',
    watchedEpisodes: item.watchedEpisodes ?? 0,
    currentPage: item.currentPage ?? '',
  })
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [saved, setSaved] = useState(false)

  const statusOptions = STATUS_OPTIONS[type] || STATUS_OPTIONS.movie
  const statusKey = type === 'book' ? 'readStatus' : 'watchStatus'

  function handleSave() {
    const patch = {
      userRating: form.userRating,
      notes: form.notes,
      [statusKey]: form.watchStatus,
    }
    if (type === 'show') patch.watchedEpisodes = Number(form.watchedEpisodes) || 0
    if (type === 'book' && form.currentPage) patch.currentPage = Number(form.currentPage) || null
    if (form.watchStatus === 'watched' || form.watchStatus === 'read') {
      patch[type === 'book' ? 'finishedAt' : 'watchedAt'] = item[type === 'book' ? 'finishedAt' : 'watchedAt'] || new Date().toISOString()
    }
    onUpdate(item.id, patch)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const poster = item.poster || item.cover
  const backdrop = item.backdrop

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-md" onClick={onClose} />
      <div className="relative w-full sm:max-w-xl bg-[#141425] rounded-t-2xl sm:rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl animate-slide-up max-h-[95dvh] flex flex-col">
        <Backdrop poster={poster} backdrop={backdrop} title={item.title} />

        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-gray-300 hover:text-white hover:bg-black/60 transition-colors"
        >
          <X size={16} />
        </button>

        <div className="overflow-y-auto flex-1">
          {/* Header section */}
          <div className={`px-6 pt-4 pb-4 ${poster ? 'mt-10 sm:mt-12' : 'mt-2'}`}>
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1 min-w-0">
                <h2 className="text-xl font-bold text-white leading-tight line-clamp-2">{item.title}</h2>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mt-1 text-sm text-gray-400">
                  {item.year && <span>{item.year}</span>}
                  {item.author && <span>by {item.author}</span>}
                  {item.runtime && <span className="flex items-center gap-1"><Clock size={12} />{item.runtime}m</span>}
                  {item.totalSeasons && <span className="flex items-center gap-1"><Layers size={12} />{item.totalSeasons} seasons</span>}
                  {item.pages && <span className="flex items-center gap-1"><BookOpen size={12} />{item.pages} pages</span>}
                </div>
                {item.tmdbRating && (
                  <div className="mt-1 text-xs text-gray-500">
                    TMDB: <span className="text-amber-400">{item.tmdbRating}/10</span>
                  </div>
                )}
              </div>
              {item.externalUrl && (
                <a
                  href={item.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 p-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  <ExternalLink size={16} />
                </a>
              )}
            </div>

            {item.genres?.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {item.genres.slice(0, 4).map(g => (
                  <span key={g} className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-gray-400 border border-white/8">{g}</span>
                ))}
              </div>
            )}

            {item.overview && (
              <p className="mt-3 text-sm text-gray-400 leading-relaxed line-clamp-3">{item.overview}</p>
            )}
          </div>

          {/* Form */}
          <div className="px-6 pb-6 space-y-5 border-t border-white/[0.06] pt-5">
            {/* Status */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Status</label>
              <div className="relative">
                <select
                  value={form.watchStatus}
                  onChange={e => setForm(f => ({ ...f, watchStatus: e.target.value }))}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white appearance-none focus:outline-none focus:border-violet-500 transition-colors cursor-pointer pr-10"
                >
                  {Object.entries(statusOptions).map(([val, { label }]) => (
                    <option key={val} value={val} className="bg-[#1a1a2e]">{label}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>

            {/* Episodes for shows */}
            {type === 'show' && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Episodes Watched {item.totalEpisodes ? `/ ${item.totalEpisodes}` : ''}
                </label>
                <input
                  type="number"
                  min={0}
                  max={item.totalEpisodes || undefined}
                  value={form.watchedEpisodes}
                  onChange={e => setForm(f => ({ ...f, watchedEpisodes: e.target.value }))}
                  className="input-field"
                  placeholder="0"
                />
                {item.totalEpisodes && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-violet-600 to-purple-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (form.watchedEpisodes / item.totalEpisodes) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((form.watchedEpisodes / item.totalEpisodes) * 100)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Current page for books */}
            {type === 'book' && item.pages && (
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Current Page / {item.pages}
                </label>
                <input
                  type="number"
                  min={0}
                  max={item.pages}
                  value={form.currentPage}
                  onChange={e => setForm(f => ({ ...f, currentPage: e.target.value }))}
                  className="input-field"
                  placeholder="Page number..."
                />
                {form.currentPage && (
                  <div className="mt-2">
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-emerald-600 to-teal-500 rounded-full transition-all duration-300"
                        style={{ width: `${Math.min(100, (form.currentPage / item.pages) * 100)}%` }}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {Math.round((form.currentPage / item.pages) * 100)}% complete
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Rating */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Your Rating</label>
              <StarRating
                value={form.userRating}
                onChange={v => setForm(f => ({ ...f, userRating: v }))}
                max={10}
              />
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Notes</label>
              <textarea
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                rows={3}
                className="input-field resize-none"
                placeholder="Your thoughts..."
              />
            </div>

            {/* Added date */}
            <p className="text-xs text-gray-600 flex items-center gap-1.5">
              <Calendar size={11} />
              Added {new Date(item.addedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="shrink-0 flex items-center gap-3 px-6 py-4 border-t border-white/[0.06] bg-[#0f0f1f]">
          {confirmDelete ? (
            <>
              <span className="text-sm text-red-400 flex-1">Remove from collection?</span>
              <button onClick={() => setConfirmDelete(false)} className="btn-ghost text-sm">Cancel</button>
              <button onClick={() => { onRemove(item.id); onClose() }} className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-colors">
                Remove
              </button>
            </>
          ) : (
            <>
              <button onClick={() => setConfirmDelete(true)} className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-colors">
                <Trash2 size={16} />
              </button>
              <button onClick={onClose} className="flex-1 btn-ghost text-sm">Cancel</button>
              <button onClick={handleSave} className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
                <Save size={15} />
                {saved ? 'Saved!' : 'Save'}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
