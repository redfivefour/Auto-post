const BASE = 'https://api.themoviedb.org/3'
const IMG = 'https://image.tmdb.org/t/p'

export const tmdb = {
  imageUrl: (path, size = 'w500') => path ? `${IMG}/${size}${path}` : null,
  movieUrl: (id) => `https://www.themoviedb.org/movie/${id}`,
  showUrl: (id) => `https://www.themoviedb.org/tv/${id}`,

  async searchMovies(query, apiKey) {
    if (!apiKey || !query.trim()) return []
    const res = await fetch(`${BASE}/search/movie?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`)
    if (!res.ok) throw new Error('TMDB request failed')
    const data = await res.json()
    return data.results || []
  },

  async searchShows(query, apiKey) {
    if (!apiKey || !query.trim()) return []
    const res = await fetch(`${BASE}/search/tv?api_key=${apiKey}&query=${encodeURIComponent(query)}&page=1`)
    if (!res.ok) throw new Error('TMDB request failed')
    const data = await res.json()
    return data.results || []
  },

  async getMovieDetails(id, apiKey) {
    const res = await fetch(`${BASE}/movie/${id}?api_key=${apiKey}&append_to_response=credits`)
    if (!res.ok) throw new Error('TMDB request failed')
    return res.json()
  },

  async getShowDetails(id, apiKey) {
    const res = await fetch(`${BASE}/tv/${id}?api_key=${apiKey}&append_to_response=credits`)
    if (!res.ok) throw new Error('TMDB request failed')
    return res.json()
  },

  normalizeMovie(m) {
    return {
      tmdbId: m.id,
      title: m.title,
      year: m.release_date ? m.release_date.slice(0, 4) : null,
      poster: m.poster_path ? `${IMG}/w500${m.poster_path}` : null,
      backdrop: m.backdrop_path ? `${IMG}/w1280${m.backdrop_path}` : null,
      overview: m.overview || '',
      genres: (m.genres || []).map(g => g.name),
      runtime: m.runtime || null,
      externalUrl: `https://www.themoviedb.org/movie/${m.id}`,
      tmdbRating: m.vote_average ? Math.round(m.vote_average * 10) / 10 : null,
    }
  },

  normalizeShow(s) {
    return {
      tmdbId: s.id,
      title: s.name,
      year: s.first_air_date ? s.first_air_date.slice(0, 4) : null,
      poster: s.poster_path ? `${IMG}/w500${s.poster_path}` : null,
      backdrop: s.backdrop_path ? `${IMG}/w1280${s.backdrop_path}` : null,
      overview: s.overview || '',
      genres: (s.genres || []).map(g => g.name),
      totalEpisodes: s.number_of_episodes || null,
      totalSeasons: s.number_of_seasons || null,
      status: s.status || null,
      externalUrl: `https://www.themoviedb.org/tv/${s.id}`,
      tmdbRating: s.vote_average ? Math.round(s.vote_average * 10) / 10 : null,
    }
  },
}
