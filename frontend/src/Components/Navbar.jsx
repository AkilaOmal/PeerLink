import { Link, useNavigate } from 'react-router-dom'
import '../Pages/Home.css'

function Navbar() {
  const navigate = useNavigate()
  const role = localStorage.getItem('peerlinkRole')
  const isLoggedIn = role === 'USER' || role === 'ADMIN'
  const accountPath = role === 'ADMIN' ? '/admin' : '/user'

  function onLogout() {
    localStorage.removeItem('peerlinkRole')
    navigate('/')
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
        <Link className="home-nav-link" to="/#learning">
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
