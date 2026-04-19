# Vaultlog

A modern, dark-themed media tracking web app for logging the movies, TV shows, and books you consume. Built with React and designed to work beautifully on both mobile and desktop.

![Vaultlog](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-5-646CFF?logo=vite&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38BDF8?logo=tailwindcss&logoColor=white)

---

## Features

### Track Everything
- **Movies** — search, add, and track films with watch status and personal rating
- **TV Shows** — track series with per-show episode progress and season counts
- **Books** — log your reading list with page progress and author info

### Rich Metadata
- Pulls movie and TV metadata from the **TMDB API** (title, year, poster, backdrop, genres, overview, runtime, TMDB community rating)
- Pulls book metadata from the **Open Library API** — completely free, no key required (title, author, year, cover art, page count)
- Every item links back to its source page (TMDB or Open Library)

### Status Tracking
Each item has a status you can update at any time:

| Movies & TV | Books |
|---|---|
| Want to Watch | Want to Read |
| Watching / Watching | Reading |
| Watched / Completed | Read |
| On Hold | On Hold |
| Dropped | Dropped |

### Per-Item Details
- 1–10 star personal rating
- Episode progress bar for TV shows (episodes watched / total)
- Page progress bar for books (current page / total pages)
- Free-text notes field
- Date added tracking

### Dashboard
- Collection counts across all three categories
- Average rating across your entire library
- Visual breakdown bars per category
- Queued-up counts (watchlist / readlist)
- Recently added feed

### UI/UX
- Dark, cinematic theme with purple/violet accent colours
- Responsive layout: collapsible sidebar on desktop, bottom navigation on mobile
- Filter tabs + sort dropdown on every collection page
- In-collection search by title (and author for books)
- Smooth CSS transitions and hover animations
- All data stored in browser `localStorage` — nothing leaves your device

---

## Getting Started

### Prerequisites
- Node.js 18+

### Install & Run

```bash
cd media-tracker
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Build for Production

```bash
npm run build
npm run preview
```

---

## TMDB API Key

Searching for movies and TV shows requires a free TMDB API key.

1. Create a free account at [themoviedb.org](https://www.themoviedb.org/)
2. Go to **Settings → API** and request a key (API v3 auth)
3. Open the app, navigate to **Settings**, paste your key and click **Save Key**

> Books search uses [Open Library](https://openlibrary.org/) which is completely free and requires no key.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 18 |
| Build tool | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router 6 |
| Icons | Lucide React |
| Movie/TV data | [TMDB API](https://developer.themoviedb.org/) |
| Book data | [Open Library API](https://openlibrary.org/developers/api) |
| Persistence | Browser `localStorage` |

---

## Project Structure

```
media-tracker/
├── public/
│   └── favicon.svg
├── src/
│   ├── components/
│   │   ├── Layout.jsx          # App shell, sidebar, bottom nav
│   │   ├── MediaCard.jsx       # Poster card used in all collection grids
│   │   ├── MediaDetailModal.jsx # Edit status, rating, notes, progress
│   │   ├── PageHeader.jsx      # Sticky header with title and add button
│   │   ├── SearchModal.jsx     # Search and add from TMDB / Open Library
│   │   ├── StarRating.jsx      # Interactive and display star rating
│   │   └── StatusBadge.jsx     # Coloured status pill
│   ├── hooks/
│   │   └── useStore.jsx        # Global state via React Context + localStorage
│   ├── pages/
│   │   ├── Dashboard.jsx       # Stats overview and recent activity
│   │   ├── Movies.jsx          # Movie collection with filters and search
│   │   ├── TVShows.jsx         # TV show collection with episode tracking
│   │   ├── Books.jsx           # Book collection with reading progress
│   │   └── Settings.jsx        # API key config and data management
│   ├── services/
│   │   ├── tmdb.js             # TMDB API search and normalisation
│   │   └── openLibrary.js      # Open Library search and normalisation
│   └── utils/
│       └── storage.js          # localStorage read/write helpers
├── index.html
├── tailwind.config.js
├── vite.config.js
└── package.json
```

---

## Data Privacy

All data (your collection, ratings, notes, and API key) is stored exclusively in your browser's `localStorage`. No server, no account, no tracking. Clearing your browser data will erase your collection.

---

## License

MIT
