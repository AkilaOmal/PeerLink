import { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../Components/Navbar'
import './Course.css'

function formatUploadDate(value) {
  const date = new Date(value)
  return Number.isNaN(date.getTime())
    ? 'Recently uploaded'
    : date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}

function Course() {
  const [videos, setVideos] = useState([])
  const [activeSubject, setActiveSubject] = useState('All subjects')
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')
  const [selectedVideo, setSelectedVideo] = useState(null)
  const location = useLocation()
  const navigate = useNavigate()
  const uploadNotice = location.state?.uploadComplete
    ? 'Your upload was added to the shared course catalog.'
    : ''

  useEffect(() => {
    let isCurrent = true

    async function loadVideos() {
      setIsLoading(true)
      setErrorMessage('')

      try {
        const response = await axios.get('http://localhost:8080/api/videos', {
          withCredentials: true,
        })
        if (isCurrent) {
          setVideos(response.data)
        }
      } catch (error) {
        if (isCurrent && error.response?.status === 401) {
          navigate('/login', { replace: true })
        } else if (isCurrent) {
          setErrorMessage('Could not load courses. Please try again.')
        }
      } finally {
        if (isCurrent) {
          setIsLoading(false)
        }
      }
    }

    loadVideos()
    return () => {
      isCurrent = false
    }
  }, [navigate])

  const subjects = ['All subjects', ...new Set(videos.map((video) => video.subject))]
  const filteredVideos = activeSubject === 'All subjects'
    ? videos
    : videos.filter((video) => video.subject === activeSubject)

  return (
    <div className="course-catalog-page">
      <Navbar />

      <main className="course-catalog-main">
        <header className="course-catalog-heading">
          <div>
            <p className="course-catalog-eyebrow">PEERLINK LIBRARY</p>
            <h1>Uploaded Courses</h1>
            <p>Explore videos shared by the PeerLink community.</p>
          </div>
          <Link className="course-upload-link" to="/user">
            Upload a video
          </Link>
        </header>

        {uploadNotice && (
          <p className="course-catalog-notice" role="status">
            {uploadNotice}
          </p>
        )}

        {!isLoading && videos.length > 0 && (
          <nav className="course-subject-filters" aria-label="Filter courses by subject">
            {subjects.map((subject) => (
              <button
                key={subject}
                type="button"
                className={activeSubject === subject ? 'active' : ''}
                aria-pressed={activeSubject === subject}
                onClick={() => setActiveSubject(subject)}
              >
                {subject}
              </button>
            ))}
          </nav>
        )}

        {isLoading && <p className="course-catalog-message">Loading courses...</p>}
        {errorMessage && (
          <p className="course-catalog-message error" role="alert">
            {errorMessage}
          </p>
        )}
        {!isLoading && !errorMessage && videos.length === 0 && (
          <div className="course-catalog-empty">
            <h2>No courses uploaded yet</h2>
            <p>Be the first to share a video with the PeerLink community.</p>
            <Link to="/user">Upload a video</Link>
          </div>
        )}
        {!isLoading && !errorMessage && filteredVideos.length === 0 && videos.length > 0 && (
          <p className="course-catalog-message">There are no courses in this subject yet.</p>
        )}

        <section className="course-card-grid" aria-label="Uploaded courses">
          {filteredVideos.map((video, index) => (
            <button
              className="course-catalog-card"
              key={video.id}
              type="button"
              onClick={() => setSelectedVideo(video)}
              aria-label={`View ${video.subject}: ${video.originalFileName || video.description}`}
            >
              <span className={`course-card-media tone-${index % 4}`} aria-hidden="true">
                <span className="course-play-icon">▶</span>
                <span>{video.source === 'file' ? 'Uploaded video' : 'Video link'}</span>
              </span>

              <span className="course-card-content">
                <span className="course-card-subject">{video.subject}</span>
                <span className="course-card-title">{video.originalFileName || video.subject}</span>
                <span className="course-card-description">{video.description}</span>
                <span className="course-card-meta">
                  <span>{video.source === 'file' ? 'Video' : 'External link'}</span>
                  <time dateTime={video.uploadedAt}>{formatUploadDate(video.uploadedAt)}</time>
                </span>
              </span>
            </button>
          ))}
        </section>
      </main>

      {selectedVideo && (
        <div className="course-detail-backdrop" onClick={() => setSelectedVideo(null)}>
          <section
            className="course-detail-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="course-detail-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header className="course-detail-header">
              <div>
                <span className="course-card-subject">{selectedVideo.subject}</span>
                <h2 id="course-detail-title">
                  {selectedVideo.originalFileName || selectedVideo.subject}
                </h2>
              </div>
              <button
                type="button"
                className="course-detail-close"
                aria-label="Close course details"
                onClick={() => setSelectedVideo(null)}
              >
                ×
              </button>
            </header>

            {selectedVideo.source === 'file' ? (
              <video
                className="course-detail-player"
                controls
                autoPlay
                preload="metadata"
                crossOrigin="use-credentials"
                src={`http://localhost:8080/api/videos/${selectedVideo.id}/file`}
                aria-label={`Play ${selectedVideo.subject} video`}
              />
            ) : (
              <div className="course-detail-link">
                <p>This course was submitted as an external video link.</p>
                <a href={selectedVideo.videoLink} target="_blank" rel="noreferrer">
                  Open video
                </a>
              </div>
            )}

            <div className="course-detail-information">
              <h3>About this video</h3>
              <p>{selectedVideo.description}</p>
              <div>
                <span>{selectedVideo.source === 'file' ? 'Uploaded video' : 'External video link'}</span>
                <time dateTime={selectedVideo.uploadedAt}>
                  Uploaded {formatUploadDate(selectedVideo.uploadedAt)}
                </time>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  )
}

export default Course