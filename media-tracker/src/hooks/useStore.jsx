import { useState, useCallback, useEffect, createContext, useContext } from 'react'
import { storage } from '../utils/storage.js'

const StoreContext = createContext(null)

export function StoreProvider({ children }) {
  const [movies, setMoviesState] = useState(() => storage.getMovies())
  const [shows, setShowsState] = useState(() => storage.getShows())
  const [books, setBooksState] = useState(() => storage.getBooks())
  const [settings, setSettingsState] = useState(() => storage.getSettings())

  const setMovies = useCallback((updater) => {
    setMoviesState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      storage.setMovies(next)
      return next
    })
  }, [])

  const setShows = useCallback((updater) => {
    setShowsState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      storage.setShows(next)
      return next
    })
  }, [])

  const setBooks = useCallback((updater) => {
    setBooksState(prev => {
      const next = typeof updater === 'function' ? updater(prev) : updater
      storage.setBooks(next)
      return next
    })
  }, [])

  const updateSettings = useCallback((patch) => {
    setSettingsState(prev => {
      const next = { ...prev, ...patch }
      storage.setSettings(next)
      return next
    })
  }, [])

  // --- Movies ---
  const addMovie = useCallback((meta) => {
    const entry = {
      id: `m_${meta.tmdbId}_${Date.now()}`,
      ...meta,
      userRating: null,
      watchStatus: 'want_to_watch',
      notes: '',
      addedAt: new Date().toISOString(),
      watchedAt: null,
    }
    setMovies(prev => [entry, ...prev])
    return entry
  }, [setMovies])

  const updateMovie = useCallback((id, patch) => {
    setMovies(prev => prev.map(m => m.id === id ? { ...m, ...patch } : m))
  }, [setMovies])

  const removeMovie = useCallback((id) => {
    setMovies(prev => prev.filter(m => m.id !== id))
  }, [setMovies])

  const hasMovie = useCallback((tmdbId) => movies.some(m => m.tmdbId === tmdbId), [movies])

  // --- Shows ---
  const addShow = useCallback((meta) => {
    const entry = {
      id: `s_${meta.tmdbId}_${Date.now()}`,
      ...meta,
      userRating: null,
      watchStatus: 'want_to_watch',
      watchedEpisodes: 0,
      notes: '',
      addedAt: new Date().toISOString(),
      finishedAt: null,
    }
    setShows(prev => [entry, ...prev])
    return entry
  }, [setShows])

  const updateShow = useCallback((id, patch) => {
    setShows(prev => prev.map(s => s.id === id ? { ...s, ...patch } : s))
  }, [setShows])

  const removeShow = useCallback((id) => {
    setShows(prev => prev.filter(s => s.id !== id))
  }, [setShows])

  const hasShow = useCallback((tmdbId) => shows.some(s => s.tmdbId === tmdbId), [shows])

  // --- Books ---
  const addBook = useCallback((meta) => {
    const entry = {
      id: `b_${(meta.openLibraryKey || meta.title).replace(/\//g, '_')}_${Date.now()}`,
      ...meta,
      userRating: null,
      readStatus: 'want_to_read',
      notes: '',
      addedAt: new Date().toISOString(),
      finishedAt: null,
      currentPage: null,
    }
    setBooks(prev => [entry, ...prev])
    return entry
  }, [setBooks])

  const updateBook = useCallback((id, patch) => {
    setBooks(prev => prev.map(b => b.id === id ? { ...b, ...patch } : b))
  }, [setBooks])

  const removeBook = useCallback((id) => {
    setBooks(prev => prev.filter(b => b.id !== id))
  }, [setBooks])

  const hasBook = useCallback((key) => books.some(b => b.openLibraryKey === key), [books])

  return (
    <StoreContext.Provider value={{
      movies, shows, books, settings,
      addMovie, updateMovie, removeMovie, hasMovie,
      addShow, updateShow, removeShow, hasShow,
      addBook, updateBook, removeBook, hasBook,
      updateSettings,
    }}>
      {children}
    </StoreContext.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StoreContext)
  if (!ctx) throw new Error('useStore must be used within StoreProvider')
  return ctx
}
