import { useState } from 'react'
import './Admin.css'

const courses = [
  {
    title: 'Learn the Learning Course',
    instructor: 'Khan Hoorat',
    category: 'Category',
    enrolled: '3,500',
    views: '15.2M',
    income: '$1,250,400',
  },
  {
    title: 'Complete Web Development',
    instructor: 'Alex Morgan',
    category: 'Development',
    enrolled: '2,850',
    views: '9.8M',
    income: '$185,200',
  },
  {
    title: 'UI/UX Design Fundamentals',
    instructor: 'Sarah Lee',
    category: 'Design',
    enrolled: '2,300',
    views: '7.1M',
    income: '$142,800',
  },
]

const chartValues = {
  income: [10, 38, 20, 43, 74, 68, 101, 82, 132, 96, 134, 134],
  refunds: [9, 25, 7, 24, 31, 17, 47, 9, 9, 34, 29, 24],
}

function DashboardIcon({ name }) {
  const sharedProps = {
    width: 19,
    height: 19,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.7,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  }

  const paths = {
    dashboard: (
      <>
        <rect x="3" y="3" width="7" height="7" />
        <rect x="14" y="3" width="7" height="7" />
        <rect x="3" y="14" width="7" height="7" />
        <rect x="14" y="14" width="7" height="7" />
      </>
    ),
    courses: (
      <>
        <path d="M5 3h14v18H5z" />
        <path d="M8 7h8M8 11h8M8 15h5" />
      </>
    ),
    students: (
      <>
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20v-1.5A5.5 5.5 0 0 1 9 13h1a5.5 5.5 0 0 1 5.5 5.5V20z" />
        <path d="M16 5.5a3 3 0 0 1 0 5.8M18 14a4.5 4.5 0 0 1 2.5 4v2" />
      </>
    ),
    financials: (
      <>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="M3 10h18M7 15h3" />
      </>
    ),
    analytics: (
      <>
        <path d="M4 20V11M10 20V5M16 20v-8M22 20V3" />
      </>
    ),
    settings: (
      <>
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-1.8 1.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5v.2h-2.6v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.9.3l-.1.1-1.8-1.8.1-.1A1.7 1.7 0 0 0 8 15a1.7 1.7 0 0 0-1.5-1H6.3v-2.6h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1 1.8-1.8.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.5v-.2H15v.2a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1 1.8 1.8-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.5 1h.2V14h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
  }

  return <svg {...sharedProps}>{paths[name]}</svg>
}

function RevenueChart() {
  const plot = { left: 48, top: 17, width: 700, height: 157 }
  const max = 140
  const pointsFor = (values) =>
    values.map((value, index) => {
      const x = plot.left + (index / (values.length - 1)) * plot.width
      const y = plot.top + plot.height - (value / max) * plot.height
      return [x, y]
    })

  const toPath = (points) =>
    points.map(([x, y], index) => `${index === 0 ? 'M' : 'L'} ${x} ${y}`).join(' ')

  const incomePoints = pointsFor(chartValues.income)
  const refundsPoints = pointsFor(chartValues.refunds)
  const incomePath = toPath(incomePoints)
  const incomeArea = `${incomePath} L ${plot.left + plot.width} ${plot.top + plot.height} L ${plot.left} ${plot.top + plot.height} Z`

  return (
    <svg
      className="admin-chart"
      viewBox="0 0 780 206"
      role="img"
      aria-label="Monthly income versus refunds chart"
    >
      <defs>
        <linearGradient id="income-fill" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#4384e8" stopOpacity=".26" />
          <stop offset="100%" stopColor="#4384e8" stopOpacity=".015" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3, 4, 5, 6, 7].map((tick) => {
        const y = plot.top + plot.height - (tick / 7) * plot.height
        const label = tick === 0 ? '$0' : tick <= 4 ? `$${tick * 20}k` : `$${(tick - 4) * 20 + 80}k`
        return (
          <g key={tick}>
            <line
              x1={plot.left}
              x2={plot.left + plot.width}
              y1={y}
              y2={y}
              className="admin-chart-grid"
            />
            <text x="42" y={y + 3.5} textAnchor="end" className="admin-chart-label">
              {label}
            </text>
          </g>
        )
      })}
      <path d={incomeArea} fill="url(#income-fill)" />
      <path d={incomePath} className="admin-chart-income" />
      <path d={toPath(refundsPoints)} className="admin-chart-refunds" />
    </svg>
  )
}

function Admin() {
  const [activeSection, setActiveSection] = useState('Dashboard')

  const navigation = [
    { name: 'Dashboard', icon: 'dashboard' },
    { name: 'Courses', icon: 'courses' },
    { name: 'Students', icon: 'students' },
    { name: 'Financials', icon: 'financials', expandable: true },
    { name: 'Analytics', icon: 'analytics', expandable: true },
    { name: 'Settings', icon: 'settings' },
  ]

  const metrics = [
    { label: 'Total Revenue', value: '$1,250,400', symbol: '$', tone: 'blue' },
    { label: 'Active Students', value: '85,000', symbol: '♧', tone: 'green' },
    { label: 'Total Courses', value: '3,500', symbol: '▣', tone: 'orange' },
    { label: 'Total Views', value: '15.2M', symbol: '◉', tone: 'blue' },
  ]

  return (
    <main className="admin-page">
      <section className="admin-shell" aria-label="Admin dashboard">
        <header className="admin-topbar">
          <h1>Admin Dashboard</h1>
          <div className="admin-profile" aria-label="Administrator profile">
            <span className="admin-profile-avatar">A</span>
            <span>Admin</span>
          </div>
        </header>

        <div className="admin-layout">
          <aside className="admin-sidebar">
            <nav aria-label="Admin navigation">
              {navigation.map((item) => (
                <button
                  className={`admin-nav-item${activeSection === item.name ? ' is-active' : ''}`}
                  key={item.name}
                  onClick={() => setActiveSection(item.name)}
                  type="button"
                  aria-current={activeSection === item.name ? 'page' : undefined}
                >
                  <DashboardIcon name={item.icon} />
                  <span>{item.name}</span>
                  {item.expandable && <span className="admin-nav-chevron">⌄</span>}
                </button>
              ))}
            </nav>
          </aside>

          <div className="admin-content">
            <div className="admin-mobile-title">{activeSection}</div>

            <section className="admin-metrics" aria-label="Dashboard overview">
              {metrics.map((metric) => (
                <article className="admin-metric-card" key={metric.label}>
                  <div className="admin-metric-label">{metric.label}</div>
                  <div className="admin-metric-value">{metric.value}</div>
                  <span className={`admin-metric-icon ${metric.tone}`} aria-hidden="true">
                    {metric.symbol}
                  </span>
                </article>
              ))}
            </section>

            <section className="admin-panel admin-revenue-panel">
              <div className="admin-panel-heading">
                <h2>Monthly Income vs. Refunds</h2>
                <div className="admin-chart-legend">
                  <span><i className="income-dot" />Monthly</span>
                  <span><i className="refund-dot" />Refunds</span>
                </div>
              </div>
              <RevenueChart />
              <div className="admin-chart-months" aria-hidden="true">
                {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
                  <span key={month}>{month}</span>
                ))}
              </div>
            </section>

            <section className="admin-panel admin-courses-panel">
              <div className="admin-panel-heading">
                <h2>Top Performing Courses</h2>
                <button type="button" className="admin-view-all">View all</button>
              </div>
              <div className="admin-table-wrap">
                <table className="admin-course-table">
                  <thead>
                    <tr>
                      <th scope="col">Course Title</th>
                      <th scope="col">Instructor</th>
                      <th scope="col">Category</th>
                      <th scope="col">Enrolled</th>
                      <th scope="col">Views</th>
                      <th scope="col">Income</th>
                    </tr>
                  </thead>
                  <tbody>
                    {courses.map((course) => (
                      <tr key={course.title}>
                        <td>{course.title}</td>
                        <td>{course.instructor}</td>
                        <td>{course.category}</td>
                        <td>{course.enrolled}</td>
                        <td>{course.views}</td>
                        <td>{course.income}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
            <p className="admin-demo-note">Showing sample dashboard data</p>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Admin