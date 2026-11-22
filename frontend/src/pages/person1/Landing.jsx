
import { useState } from 'react'
import logo from '../../assets/skillsphere-logo.png'
import { useTheme } from '../../context/ThemeContext'
import './Landing.css'

function Landing() {
  const { theme, toggleTheme } = useTheme()

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('skillsphere-user'))
    } catch {
      return null
    }
  })

  const skills = [
    'Programming & Software',
    'AI & Data Science',
    'Cybersecurity',
    'Database & Cloud',
    'UI/UX & Graphic Design',
    'Digital Marketing',
    'Business & Entrepreneurship',
    'Communication Skills'
  ]

  const handleLogout = () => {
    localStorage.removeItem('skillsphere-user')
    setUser(null)
    window.location.href = '/'
  }

  return (
    <div className="landing-page">
      <nav className="navbar">
        <img src={logo} alt="SkillSphere Logo" className="brand-logo" />

        <div className="nav-links">
          <a href="#home">Home</a>
          <a href="#skills">Explore Skills</a>
          <a href="/courses">Explore Courses</a>
          <a href="#about">About</a>
          {user && <a href="/dashboard">Dashboard</a>}
        </div>

        <div className="nav-buttons">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>

          {user ? (
            <div className="user-nav">
              <a href="/profile" className="user-profile-link">
                <span className="user-avatar">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </span>
              </a>

              <button className="logout-btn" onClick={handleLogout}>
                Sign Out
              </button>
            </div>
          ) : (
            <>
              <a href="/login">Login</a>
              <a href="/signup" className="signup-btn">Sign Up</a>
            </>
          )}
        </div>
      </nav>

      <section className="hero-section" id="home">
        <div className="hero-content">
          <span className="tagline">LEARN • ASSESS • GROW</span>

          <h1>
            {user ? (
              <>Welcome back, {user.name?.split(' ')[0]}.</>
            ) : (
              <>Discover your skills.<br />Shape your future.</>
            )}
          </h1>

          <p>
            Explore your strengths, assess your abilities
            and build a learning journey that belongs to you.
          </p>

          <a href={user ? '/dashboard' : '/courses'} className="explore-btn">
            {user ? 'Go to Dashboard →' : 'Explore Courses →'}
          </a>
        </div>

        <div className="hero-visual">
          <div className="visual-card">
            <span>✦</span>
            <h2>Your potential,</h2>
            <h2>your journey.</h2>
            <p>Start discovering what you can achieve.</p>
          </div>
        </div>
      </section>

      <section className="skills-section" id="skills">
        <span className="tagline">FIND YOUR INTEREST</span>
        <h2>Explore what you can learn</h2>
        <p>Discover different fields and develop new skills.</p>

        <div className="skills-grid">
          {skills.map((skill) => (
            <a href="/courses" className="skill-card" key={skill}>
              <h3>{skill}</h3>
              <span>Explore →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="about-section" id="about">
        <h2>Your journey starts here.</h2>
        <p>
          Assess your skills, discover your strengths
          and follow a personalized learning roadmap.
        </p>
      </section>
    </div>
  )
}

export default Landing
