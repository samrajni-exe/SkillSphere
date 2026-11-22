
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Signup.css'

function Signup() {
  const { theme, toggleTheme } = useTheme()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (password.length < 8) {
      setError('Password must contain at least 8 characters.')
      return
    }

    if (password !== confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Signup failed. Please try again.')
        return
      }

      alert('Account created successfully! Please log in.')
      window.location.href = '/login'

    } catch (err) {
      setError('Cannot connect to the server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="signup-page">
      <nav className="signup-navbar">
        <a href="/" className="signup-brand">SkillSphere<span>.</span></a>

        <div className="signup-nav-right">
          <button className="signup-theme-btn" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <a href="/">Home</a>
        </div>
      </nav>

      <main className="signup-container">
        <section className="signup-welcome">
          <span className="signup-tag">START SOMETHING NEW</span>
          <h1>Your next chapter starts here.</h1>
          <p>
            Discover your abilities, explore new interests and
            build skills that shape your future.
          </p>

          <div className="signup-decoration">
            <div className="signup-decoration-circle">✦</div>
            <h2>Explore your potential.</h2>
            <p>Every new skill opens a new possibility.</p>
          </div>
        </section>

        <section className="signup-form-card">
          <span className="signup-tag">JOIN SKILLSPHERE</span>
          <h2>Create an account</h2>
          <p className="signup-subtitle">
            Choose how you'd like to get started.
          </p>

          <button
            type="button"
            className="google-signup-btn"
            onClick={() => alert('Google authentication will be configured later.')}
          >
            <svg viewBox="0 0 48 48" aria-hidden="true">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5Z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.76 7.18l7.73 6C44.42 37.99 46.98 31.9 46.98 24.55Z"/>
              <path fill="#FBBC05" d="M10.53 28.59a14.4 14.4 0 0 1 0-9.18l-7.98-6.19a23.96 23.96 0 0 0 0 21.56l7.98-6.19Z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.91-5.8l-7.73-6c-2.14 1.44-4.88 2.3-8.18 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48Z"/>
            </svg>
            Continue with Google
          </button>

          <button
            type="button"
            className="email-signup-btn"
            onClick={() => document.getElementById('signup-email')?.focus()}
          >
            <span>✉</span>
            Continue with Email
          </button>

          <div className="signup-divider">
            <span></span>
            <p>OR SIGN UP MANUALLY</p>
            <span></span>
          </div>

          <form onSubmit={handleSignup}>
            <label htmlFor="signup-name">Full Name</label>
            <input
              id="signup-name"
              type="text"
              placeholder="Enter your full name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />

            <label htmlFor="signup-email">Email Address</label>
            <input
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="signup-password">Password</label>
            <input
              id="signup-password"
              type="password"
              placeholder="At least 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={8}
              required
            />

            <label htmlFor="confirm-password">Confirm Password</label>
            <input
              id="confirm-password"
              type="password"
              placeholder="Re-enter your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            {error && <p className="signup-error">{error}</p>}

            <button type="submit" className="signup-submit" disabled={loading}>
              {loading ? 'Creating Account...' : 'Create Account →'}
            </button>
          </form>

          <p className="signup-login">
            Already have an account? <a href="/login">Sign In</a>
          </p>
        </section>
      </main>
    </div>
  )
}

export default Signup
