import { Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './hooks/useStore.jsx'
import Layout from './components/Layout.jsx'
import Dashboard from './pages/Dashboard.jsx'
import Movies from './pages/Movies.jsx'
import TVShows from './pages/TVShows.jsx'
import Books from './pages/Books.jsx'
import Settings from './pages/Settings.jsx'

export default function App() {
  return (
    <StoreProvider>
      <Layout>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/shows" element={<TVShows />} />
          <Route path="/books" element={<Books />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Layout>
    </StoreProvider>
  )
}
