import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import './Login.css'
import axios from 'axios'

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(event) {
    event.preventDefault()
    setMessage('')
    setIsSubmitting(true)

    try {
      const response = await axios.post('http://localhost:8080/api/login', { email, password })
      const { role } = response.data

      if (role !== 'ADMIN' && role !== 'USER') {
        setMessage('Unable to verify your account role. Please contact support.')
        return
      }

      localStorage.setItem('peerlinkRole', role)
      navigate(role === 'ADMIN' ? '/admin' : '/user', { replace: true })
    } catch (error) {
      if (error.response?.status === 401) {
        setMessage('The email or password is incorrect.')
      } else {
        setMessage('Unable to log in right now. Please try again later.')
      }
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="login-page">
      <section className="login-card" aria-labelledby="login-title">
        <header className="login-card-header">
          <Link className="login-brand" to="/" aria-label="PeerLink home">
            PeerLink
          </Link>
          <Link className="login-signup-link" to="/register">
            Sign up
          </Link>
        </header>

        <div className="login-card-content">
          <div className="login-form-panel">
            <p className="login-eyebrow">WELCOME BACK</p>
            <h1 id="login-title">Login</h1>
            <p className="login-intro">Log in to access your PeerLink account.</p>

            <form className="login-form" onSubmit={onSubmit}>
              <label htmlFor="login-email">Email</label>
              <input
                id="login-email"
                name="email"
                type="email"
                placeholder="you@example.com"
                autoComplete="email"
                onChange={(e)=>setEmail(e.target.value)}
                required
              />

              <label htmlFor="login-password">Password</label>
              <input
                id="login-password"
                name="password"
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                onChange={(e)=>setPassword(e.target.value)}
                required
              />

              <div className="login-form-options">
                <label className="login-remember">
                  <input type="checkbox" name="remember" />
                  <span>Remember me</span>
                </label>
                <button className="login-text-button" type="button" disabled>
                  Forgot password?
                </button>
              </div>

              <button className="login-submit" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {message && (
              <p className="login-message" role="status">
                {message}
              </p>
            )}
            <p className="login-register-prompt">
              Don&apos;t have an account? <Link to="/register">Sign up</Link>
            </p>
            <Link className="login-home-link" to="/">
              Back to home
            </Link>
          </div>

          <aside className="login-illustration" aria-label="Secure learning">
            <div className="login-illustration-glow" />
            <div className="login-orbit login-orbit-one" />
            <div className="login-orbit login-orbit-two" />
            <div className="login-shield">
              <svg viewBox="0 0 120 140" role="img" aria-label="Security shield">
                <path
                  d="M60 8 105 25v36c0 31-18 55-45 70C33 116 15 92 15 61V25L60 8Z"
                  fill="#f8fff9"
                  stroke="#d5e9dc"
                  strokeWidth="4"
                />
                <path
                  d="m39 69 14 14 30-32"
                  fill="none"
                  stroke="#74bd63"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="11"
                />
              </svg>
            </div>
            <div className="login-illustration-caption">
              <span className="login-caption-check" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Your learning journey,</strong>
                <br />
                safe and secure.
              </span>
            </div>
            <p className="login-illustration-note">
              A welcoming space to keep learning, growing, and moving forward.
            </p>
          </aside>
        </div>
      </section>
    </main>
  )
}

export default Login