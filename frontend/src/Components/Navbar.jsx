import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import '../Pages/Home.css'

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('peerlinkRole')
  const isLoggedIn = role === 'USER' || role === 'ADMIN'
  const accountPath = role === 'ADMIN' ? '/admin' : '/user'

  async function onLogout() {
    try {
      await axios.post('http://localhost:8080/api/logout', {}, { withCredentials: true })
      localStorage.removeItem('peerlinkRole')
      navigate('/')
    } catch {
      window.alert('Could not end your server session. Please try again.')
    }
  }

  return (
    <header className="home-header">
      <Link className="home-brand" to="/" aria-label="PeerLink home">
        Peer<span>Link</span>
      </Link>

      <nav className="home-nav" aria-label="Main navigation">
        <Link className="home-nav-link" to="/">
          Home
        </Link>
        <Link className="home-nav-link" to="/courses">
          Courses
        </Link>
        <Link className="home-nav-link" to="/#about">
          About
        </Link>
      </nav>

      <div className="home-header-actions">
        {isLoggedIn ? (
          <>
            <Link className="home-login-button" to={accountPath}>
              Account
            </Link>
            <button className="home-register-link" type="button" onClick={onLogout}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link className="home-login-button" to="/login">
              Login
            </Link>
            <Link className="home-register-link" to="/register">
              Go to Register
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

export default Navbar
