const BASE = 'https://openlibrary.org'
const COVERS = 'https://covers.openlibrary.org/b'

export const openLibrary = {
  coverUrl: (coverId, size = 'M') => coverId ? `${COVERS}/id/${coverId}-${size}.jpg` : null,
  isbnCoverUrl: (isbn, size = 'M') => isbn ? `${COVERS}/isbn/${isbn}-${size}.jpg` : null,
  bookUrl: (key) => key ? `${BASE}${key}` : null,

  async search(query) {
    if (!query.trim()) return []
    const url = `${BASE}/search.json?q=${encodeURIComponent(query)}&limit=15&fields=key,title,author_name,first_publish_year,cover_i,number_of_pages_median,subject,isbn,edition_count`
    const res = await fetch(url)
    if (!res.ok) throw new Error('Open Library request failed')
    const data = await res.json()
    return data.docs || []
  },

  normalize(doc) {
    const isbn = doc.isbn?.[0] || null
    const coverId = doc.cover_i || null
    return {
      openLibraryKey: doc.key,
      title: doc.title,
      author: doc.author_name?.[0] || 'Unknown Author',
      allAuthors: doc.author_name || [],
      year: doc.first_publish_year || null,
      cover: coverId
        ? `${COVERS}/id/${coverId}-M.jpg`
        : (isbn ? `${COVERS}/isbn/${isbn}-M.jpg` : null),
      coverLarge: coverId
        ? `${COVERS}/id/${coverId}-L.jpg`
        : (isbn ? `${COVERS}/isbn/${isbn}-L.jpg` : null),
      pages: doc.number_of_pages_median || null,
      genres: (doc.subject || []).slice(0, 5),
      isbn,
      editions: doc.edition_count || null,
      externalUrl: doc.key ? `${BASE}${doc.key}` : null,
    }
  },
}
