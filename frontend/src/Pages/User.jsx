import { Link } from 'react-router-dom'
import './Home.css'
import './User.css'

const sidebarItems = [
  { label: 'Profile', icon: 'profile', active: true },
  { label: 'Enrolled Courses', icon: 'course' },
  { label: 'Uploaded Notes', icon: 'notes' },
  { label: 'Payments', icon: 'payments' },
  { label: 'Logout', icon: 'logout' },
]

const notificationItems = [
  { label: 'Video Upload Review', meta: '1 day ago' },
  { label: 'New Assignment Request', meta: '1 day ago' },
  { label: 'New Message', meta: '1 day ago' },
  { label: 'Note Requested', meta: '3 days ago' },
  { label: 'Payment Update', meta: '5 days ago' },
]

const courseCards = [
  { title: 'Learn the Learning Course', progress: 20 },
  { title: 'Learn the Learning Course', progress: 50 },
  { title: 'How to Train Online Learning', progress: 50 },
  { title: 'How to Train Online Learning', progress: 50 },
  { title: 'How to Train Online Learning', progress: 50 },
  { title: 'How to Train Online Learning', progress: 50 },
]

const paymentRows = [
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Khan Heorat', category: 'Category', quantity: '3,500', income: '$1,250.40' },
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Nick Jorkev', category: 'Co-serting', quantity: '3,500', income: '$250.40' },
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Nick Jorkev', category: 'Co-serting', quantity: '3,500', income: '$250.40' },
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Nick Jorkev', category: 'Co-serting', quantity: '3,500', income: '$250.40' },
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Nick Jorkev', category: 'Co-serting', quantity: '3,500', income: '$250.40' },
  { date: 'Jul 17, 2023 10:30 AM', instructor: 'Nick Jorkev', category: 'Co-serting', quantity: '3,500', income: '$250.40' },
]

const notesList = ['File.m1', 'Document #2', 'File.m3', 'Document #2', 'File.m5', 'Lecture Notes']

function UserIcon({ name }) {
  const common = {
    width: 20,
    height: 20,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const icons = {
    profile: (
      <>
        <circle cx="12" cy="7.5" r="3.5" />
        <path d="M5 19.5v-1.6A7 7 0 0 1 19 18v1.5" />
      </>
    ),
    course: (
      <>
        <path d="M3 7.8 12 4l9 3.8-9 3.8L3 7.8Z" />
        <path d="M7 9.8v4.8c2.4 1.8 6.6 1.8 9 0V9.8" />
        <path d="M21 8v7" />
      </>
    ),
    notes: (
      <>
        <path d="M8 3.5h7l4 4v12.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 7 20.1V5a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M15 3.5v4h4" />
        <path d="M9 12h6M9 15h6" />
      </>
    ),
    payments: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h5" />
      </>
    ),
    logout: (
      <>
        <path d="M10 4H5.5A1.5 1.5 0 0 0 4 5.5v13A1.5 1.5 0 0 0 5.5 20H10" />
        <path d="M14 8l5 4-5 4" />
        <path d="M8 12h11" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="m16 16 4.5 4.5" />
      </>
    ),
    cart: (
      <>
        <circle cx="9" cy="18" r="1.3" />
        <circle cx="17" cy="18" r="1.3" />
        <path d="M3 4h2l2.3 10.4h8.9l2.2-7.8H6.1" />
      </>
    ),
    bell: (
      <>
        <path d="M18 9a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
        <path d="M10 21a2 2 0 0 0 4 0" />
      </>
    ),
    upload: (
      <>
        <path d="M8 15.5v2.5h8v-2.5" />
        <path d="M12 4v9" />
        <path d="m8.8 7.5 3.2-3.2 3.2 3.2" />
      </>
    ),
    download: (
      <>
        <path d="M12 4v9" />
        <path d="m8.5 19.5 3.5 3.5 3.5-3.5" />
        <path d="M4 18.5h16" />
      </>
    ),
    notification: (
      <>
        <path d="M8 18.5h8" />
        <path d="M10 18.5V9.8A2 2 0 0 1 12 8a2 2 0 0 1 2 1.8v8.7" />
        <path d="M7.5 9.5a4.5 4.5 0 0 1 9 0" />
      </>
    ),
  }

  return <svg {...common}>{icons[name]}</svg>
}

function User() {
  return (
    <div className="peerlink-user-page">
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
          <Link className="home-login-button" to="/login">
            Login
          </Link>
          <Link className="home-register-link" to="/register">
            Go to Register
          </Link>
        </div>
      </header>

      <main className="peerlink-user-main">
        <h1 className="peerlink-page-title">User Dashboard</h1>

        <div className="peerlink-content-grid">
          <aside className="peerlink-sidebar">
            <nav className="peerlink-sidebar-nav">
              {sidebarItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={`peerlink-sidebar-item${item.active ? ' active' : ''}`}
                >
                  <span className="peerlink-sidebar-icon">
                    <UserIcon name={item.icon} />
                  </span>
                  <span>{item.label}</span>
                </button>
              ))}
            </nav>

            <div className="peerlink-notification-box">
              <div className="peerlink-box-header">
                <span className="peerlink-bell-mini">
                  <UserIcon name="notification" />
                </span>
                <span>Notifications</span>
                <button type="button" className="peerlink-view-all">
                  View All
                </button>
              </div>

              {notificationItems.map((item) => (
                <div key={item.label} className="peerlink-notification-row">
                  <span className="peerlink-notification-dot" aria-hidden="true" />
                  <div className="peerlink-notification-copy">
                    <p>{item.label}</p>
                    <small>{item.meta}</small>
                  </div>
                </div>
              ))}
            </div>

            <div className="peerlink-upload-box">
              <div className="peerlink-upload-icon">
                <UserIcon name="upload" />
              </div>
              <p>Drag &amp; drop your video here</p>
              <button type="button">Choose Video</button>
            </div>
          </aside>

          <section className="peerlink-panel profile-panel">
            <div className="peerlink-profile-header">
              <div className="peerlink-profile-avatar">
                <UserIcon name="profile" />
              </div>
              <div className="peerlink-profile-copy">
                <h2>Khan Heorat</h2>
                <p>user@mya.com</p>
              </div>
            </div>

            <div className="peerlink-stat-grid">
              <div>
                <strong>109</strong>
                <span>Stats</span>
              </div>
              <div>
                <strong>55</strong>
                <span>Followers</span>
              </div>
              <div>
                <strong>0</strong>
                <span>Course</span>
              </div>
            </div>
          </section>

          <section className="peerlink-panel course-panel">
            <h2>Enrolled Courses</h2>
            <div className="peerlink-course-grid">
              {courseCards.map((course, index) => (
                <div className="peerlink-course-item" key={`${course.title}-${index}`}>
                  <div className="peerlink-course-title">{course.title}</div>
                  <div className="peerlink-progress-label">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="peerlink-progress-track">
                    <span style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="peerlink-panel notes-panel">
            <h2>Uploaded Notes</h2>
            <div className="peerlink-notes-list">
              {notesList.map((note, index) => (
                <div className="peerlink-note-row" key={`${note}-${index}`}>
                  <div className="peerlink-note-file">
                    <span className="peerlink-doc-icon">
                      <UserIcon name="notes" />
                    </span>
                    <span>{note}</span>
                  </div>
                  <button type="button" className="peerlink-download-btn" aria-label={`Download ${note}`}>
                    <UserIcon name="download" />
                  </button>
                </div>
              ))}
            </div>
          </section>

          <section className="peerlink-panel payment-panel">
            <h2>Payments Section</h2>
            <div className="peerlink-table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Instructor</th>
                    <th>Category</th>
                    <th>Enrolled</th>
                    <th>Income</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentRows.map((row, index) => (
                    <tr key={`${row.date}-${index}`}>
                      <td>{row.date}</td>
                      <td>{row.instructor}</td>
                      <td>{row.category}</td>
                      <td>{row.quantity}</td>
                      <td>{row.income}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </div>
      </main>
    </div>
  )
}

export default User