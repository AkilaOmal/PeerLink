import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './Pages/Home'
import Login from './Pages/Login'
import Register from './Pages/Register'
import Admin from './Pages/Admin'
import User from './Pages/User'

function RoleRoute({ role, children }) {
  const currentRole = localStorage.getItem('peerlinkRole')

  if (currentRole !== 'USER' && currentRole !== 'ADMIN') {
    return <Navigate to="/login" replace />
  }

  if (currentRole !== role) {
    return <Navigate to={currentRole === 'ADMIN' ? '/admin' : '/user'} replace />
  }

  return children
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/admin" element={<RoleRoute role="ADMIN"><Admin /></RoleRoute>} />
      <Route path="/user" element={<RoleRoute role="USER"><User /></RoleRoute>} />
    </Routes>
  )
}

export default App
