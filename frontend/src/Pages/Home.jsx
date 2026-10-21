import { Link } from 'react-router-dom'
import HeroImg from '../assets/HeroImg.png'
import './Home.css'

function Home() {
  return (
    <div className="home-page">
      <header className="home-header">
        <Link className="home-brand" to="/" aria-label="PeerLink home">
          Peer<span>Link</span>
        </Link>

        <nav className="home-nav" aria-label="Main navigation">
          <Link className="home-nav-link" to="/">
            Home
          </Link>
          <a className="home-nav-link" href="#learning">
            Courses
          </a>
          <a className="home-nav-link" href="#about">
            About
          </a>
        </nav>

        <div className="home-header-actions">
          <Link className="home-login-button" to="/login">
            Login
          </Link>
          <Link className="home-register-link" to="/register">
            Go to Register
          </Link>
        </div>
      </header>

      <main>
        <section className="home-hero" id="learning">
          <div className="home-hero-copy">
            <p className="home-eyebrow">LEARN SOMETHING THAT MOVES YOU</p>
            <h1>
              Your next chapter
              <br />
              <span>starts with a skill.</span>
            </h1>
            <p className="home-description">
              Learn from real-world experts, grow your confidence, and turn
              your curiosity into something extraordinary.
            </p>
            <div className="home-hero-actions">
              <Link className="home-primary-button" to="/register">
                Find your next skill
              </Link>
              <a className="home-secondary-link" href="#about">
                Explore PeerLink <span aria-hidden="true">→</span>
              </a>
            </div>
            <div className="home-community">
              <div className="home-avatars" aria-hidden="true">
                <span>J</span>
                <span>M</span>
                <span>A</span>
              </div>
              <p>
                <strong>4,200+ learners</strong>
                <br />
                growing their skills together
              </p>
            </div>
          </div>

          <div className="home-hero-visual">
            <img
              className="home-hero-image"
              src={HeroImg}
              alt="A learner building new skills on her laptop"
            />
            <div className="home-image-label">
              <span className="home-label-icon" aria-hidden="true">
                ✦
              </span>
              <span>
                <strong>Small steps, big progress.</strong>
                <br />
                Your next skill starts here.
              </span>
            </div>
            <div className="home-success-note">
              <span className="home-success-check" aria-hidden="true">
                ✓
              </span>
              <span>
                <strong>Your next skill unlocked.</strong>
                <br />
                Keep up the great work!
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className="home-footer" id="about">
        <div className="home-footer-main">
          <div className="home-footer-about">
            <Link className="home-footer-brand" to="/">
              PeerLink
            </Link>
            <p>
              A little learning goes a long way. Find your next chapter and
              start growing today.
            </p>
            <div className="home-footer-socials" aria-label="PeerLink community">
              <a href="#about" aria-label="PeerLink community">
                in
              </a>
              <a href="#about" aria-label="PeerLink updates">
                x
              </a>
              <a href="#about" aria-label="PeerLink videos">
                ▶
              </a>
            </div>
          </div>

          <div className="home-footer-column">
            <h2>Explore</h2>
            <a href="#learning">Courses</a>
            <a href="#learning">Find a mentor</a>
            <Link to="/register">Join PeerLink</Link>
          </div>

          <div className="home-footer-column">
            <h2>About PeerLink</h2>
            <a href="#about">Our mission</a>
            <a href="#about">Community</a>
            <a href="#about">Get in touch</a>
          </div>

          <div className="home-footer-column">
            <h2>Quick links</h2>
            <Link to="/">Home</Link>
            <Link to="/register">Go to Register</Link>
          </div>
        </div>

        <div className="home-footer-bottom">
          <span>© 2025 PeerLink. Made for curious minds.</span>
          <div>
            <a href="#about">Privacy policy</a>
            <a href="#about">Terms of use</a>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
