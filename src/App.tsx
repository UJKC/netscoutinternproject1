import { JSX, useState } from 'react'
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Login from './pages/Login_copy'
import { CacheSystem } from './utility/CachedVersionedData'

// PrivateRoute component to check authentication
const PrivateRoute = ({ element }: { element: JSX.Element }) => {
  const isAuthenticated = localStorage.getItem('isLoggedIn') === 'true'  // Simple check using localStorage
  return isAuthenticated ? element : <Navigate to="/login" />  // Redirect to /login if not authenticated
}

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('isLoggedIn') === 'true')
  const [cacheData, setCacheData] = useState<CacheSystem | null>(null);

  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={<PrivateRoute element={<Dashboard />} />}  // Protect Dashboard route
          />
          <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} setCacheData={setCacheData} />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
