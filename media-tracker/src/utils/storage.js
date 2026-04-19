const KEYS = {
  movies: 'vaultlog_movies',
  shows: 'vaultlog_shows',
  books: 'vaultlog_books',
  settings: 'vaultlog_settings',
}

function get(key) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

function set(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    // storage full or unavailable
  }
}

export const storage = {
  getMovies: () => get(KEYS.movies) || [],
  setMovies: (v) => set(KEYS.movies, v),
  getShows: () => get(KEYS.shows) || [],
  setShows: (v) => set(KEYS.shows, v),
  getBooks: () => get(KEYS.books) || [],
  setBooks: (v) => set(KEYS.books, v),
  getSettings: () => get(KEYS.settings) || { tmdbApiKey: '', theme: 'dark' },
  setSettings: (v) => set(KEYS.settings, v),
}
