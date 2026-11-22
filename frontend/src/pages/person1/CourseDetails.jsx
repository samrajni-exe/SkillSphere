
import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './CourseDetails.css'

const API = 'http://127.0.0.1:5000/api'

function CourseDetails() {
  const { theme, toggleTheme } = useTheme()
  const courseId = window.location.pathname.split('/')[2]

  const [course, setCourse] = useState(null)
  const [lessons, setLessons] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEnrolled, setIsEnrolled] = useState(false)
  const [statusChecked, setStatusChecked] = useState(false)
  const [enrolling, setEnrolling] = useState(false)
  const [message, setMessage] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [learningMode, setLearningMode] = useState(false)

  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem('skillsphere-user'))
    } catch {
      return null
    }
  })()

  useEffect(() => {
    const loadCourse = async () => {
      try {
        const response = await fetch(`${API}/courses/${courseId}`)
        if (!response.ok) throw new Error()
        setCourse(await response.json())
      } catch {
        setMessage('Could not load this course. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    loadCourse()
  }, [courseId])

  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user?.id) {
        setStatusChecked(true)
        return
      }

      try {
        const response = await fetch(
          `${API}/courses/${courseId}/enrollment-status?user_id=${user.id}`
        )

        if (!response.ok) throw new Error()

        const data = await response.json()
        setIsEnrolled(data.enrolled)

        if (data.enrolled) {
          const lessonResponse = await fetch(
            `${API}/courses/${courseId}/lessons?user_id=${user.id}`
          )

          if (!lessonResponse.ok) throw new Error()

          setLessons(await lessonResponse.json())
        }
      } catch {
        setMessage('Unable to load your course access. Please try again.')
      } finally {
        setStatusChecked(true)
      }
    }

    checkEnrollment()
  }, [courseId])

  const handleEnroll = async () => {
    if (!user?.id) {
      window.location.href = '/login'
      return
    }

    setEnrolling(true)
    setMessage('')

    try {
      const response = await fetch(`${API}/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: user.id })
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || 'Enrolment failed.')

      setIsEnrolled(true)
      setMessage(data.message || 'Successfully enrolled!')

      const lessonResponse = await fetch(
        `${API}/courses/${courseId}/lessons?user_id=${user.id}`
      )

      if (!lessonResponse.ok) throw new Error('Could not load lessons.')

      setLessons(await lessonResponse.json())
    } catch (error) {
      setMessage(error.message || 'Something went wrong.')
    } finally {
      setEnrolling(false)
    }
  }

  const startLearning = () => {
    if (lessons.length === 0) {
      setMessage('Lessons for this course will be added soon.')
      return
    }

    setSelectedIndex(0)
    setLearningMode(true)
  }

  const currentLesson = lessons[selectedIndex]

  if (loading) return <p className="details-message">Loading course...</p>
  if (!course) return <p className="details-message">{message || 'Course not found.'}</p>

  return (
    <div className="details-page">
      <nav className="details-navbar">
        <a href="/" className="details-brand">SkillSphere</a>
        <div>
          <a href="/courses">Explore Courses</a>
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>

      <header className="details-hero">
        <span>{course.category}</span>
        <h1>{course.title}</h1>
        <p>{course.description}</p>

        <div className="details-meta">
          <span>📚 {course.level}</span>
          <span>◷ {course.duration}</span>
          <span>📖 {lessons.length} Lessons</span>
        </div>

        {!statusChecked ? (
          <button className="enroll-btn" disabled>Checking access...</button>
        ) : isEnrolled ? (
          <button className="enroll-btn enrolled" onClick={startLearning}>
            Start Learning →
          </button>
        ) : (
          <button
            className="enroll-btn"
            onClick={handleEnroll}
            disabled={enrolling}
          >
            {enrolling ? 'Enrolling...' : 'Enroll Now →'}
          </button>
        )}

        {message && <p className="enroll-message">{message}</p>}
      </header>

      <main className="details-content">
        <button
          className="back-courses"
          onClick={() => window.location.href = '/courses'}
        >
          ← Back to Courses
        </button>

        {!isEnrolled ? (
          <section className="learning-locked">
            <h2>Course Curriculum</h2>
            <p>Enrol in this course to unlock the lessons and start learning.</p>
          </section>
        ) : learningMode && currentLesson ? (
          <section className="learning-area">
            <button
              className="learning-back"
              onClick={() => setLearningMode(false)}
            >
              ← Back to curriculum
            </button>

            <p className="learning-label">
              LESSON {selectedIndex + 1} OF {lessons.length}
            </p>

            <h2>{currentLesson.title}</h2>

            <div className="learning-content">
              {currentLesson.content || 'Lesson content will be available soon.'}
            </div>

            <div className="learning-navigation">
              <button
                disabled={selectedIndex === 0}
                onClick={() => setSelectedIndex(index => index - 1)}
              >
                ← Previous
              </button>

              <span>{selectedIndex + 1} / {lessons.length}</span>

              <button
                disabled={selectedIndex === lessons.length - 1}
                onClick={() => setSelectedIndex(index => index + 1)}
              >
                Next →
              </button>
            </div>
          </section>
        ) : (
          <section className="learning-area">
            <h2>Course Curriculum</h2>
            <p className="curriculum-subtitle">
              Select a lesson to begin learning.
            </p>

            {lessons.length === 0 ? (
              <div className="empty-lessons">
                No lessons have been added to this course yet.
              </div>
            ) : (
              <div className="lesson-list">
                {lessons.map((lesson, index) => (
                  <button
                    className="learning-lesson"
                    key={lesson.id}
                    onClick={() => {
                      setSelectedIndex(index)
                      setLearningMode(true)
                    }}
                  >
                    <span>
                      <span className="lesson-number">{index + 1}</span>
                      {lesson.title}
                    </span>
                    <span>Open lesson →</span>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}
      </main>
    </div>
  )
}

export default CourseDetails
