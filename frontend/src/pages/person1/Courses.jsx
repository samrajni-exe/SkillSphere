
import { useEffect, useMemo, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Courses.css'

const categories = [
  'All Categories',
  'Programming & Software',
  'AI & Data Science',
  'Cybersecurity',
  'Database & Cloud',
  'UI/UX & Graphic Design',
  'Digital Marketing',
  'Business & Entrepreneurship',
  'Communication Skills'
]

function Courses() {
  const { theme, toggleTheme } = useTheme()

  const [courses, setCourses] = useState([])
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All Categories')
  const [level, setLevel] = useState('All Levels')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/courses/')
      .then(response => {
        if (!response.ok) throw new Error('Could not load courses')
        return response.json()
      })
      .then(data => setCourses(data))
      .catch(() => setError('Unable to load courses. Please check your backend.'))
      .finally(() => setLoading(false))
  }, [])

  const filteredCourses = useMemo(() => {
    return courses.filter(course => {
      const matchesSearch =
        course.title.toLowerCase().includes(search.toLowerCase()) ||
        course.description?.toLowerCase().includes(search.toLowerCase())

      const matchesCategory =
        category === 'All Categories' || course.category === category

      const matchesLevel =
        level === 'All Levels' || course.level === level

      return matchesSearch && matchesCategory && matchesLevel
    })
  }, [courses, search, category, level])

  return (
    <div className="courses-page">
      <nav className="courses-navbar">
        <a href="/" className="courses-brand">SkillSphere</a>

        <div className="courses-nav-links">
          <a href="/">Home</a>
          <a href="/profile">My Profile</a>
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
        </div>
      </nav>

      <header className="courses-hero">
        <p className="courses-eyebrow">LEARN • EXPLORE • GROW</p>
        <h1>Explore Your Learning Journey</h1>
        <p>Discover skills, learn something new and build your future.</p>
      </header>

      <main className="courses-container">
        <div className="courses-heading">
          <div>
            <h2>Explore Courses</h2>
            <p>Find the right course for your interests.</p>
          </div>
          <span>{filteredCourses.length} Courses Found</span>
        </div>

        <div className="course-filters">
          <input
            type="text"
            placeholder="🔍 Search courses..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />

          <select value={category} onChange={e => setCategory(e.target.value)}>
            {categories.map(item => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select value={level} onChange={e => setLevel(e.target.value)}>
            <option>All Levels</option>
            <option>Beginner</option>
            <option>Intermediate</option>
            <option>Advanced</option>
          </select>
        </div>

        {loading && <p className="course-message">Loading courses...</p>}

        {error && <p className="course-message error">{error}</p>}

        {!loading && !error && filteredCourses.length === 0 && (
          <p className="course-message">No courses found. Try another search.</p>
        )}

        <div className="course-grid">
          {filteredCourses.map(course => (
            <article className="course-card" key={course.id}>
              <div className="course-card-top">
                <span className="course-category">{course.category}</span>
                <span className="course-level">{course.level}</span>
              </div>

              <div className="course-card-content">
                <h3>{course.title}</h3>
                <p>{course.description}</p>
              </div>

              <div className="course-card-bottom">
                <span>◷ {course.duration}</span>
                <button onClick={() => {
                  window.location.href = `/course/${course.id}`
                }}>
                  View Course →
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>
    </div>
  )
}

export default Courses
