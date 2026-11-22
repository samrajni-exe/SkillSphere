
import { useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Login.css'

function Login() {
  const { theme, toggleTheme } = useTheme()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('http://127.0.0.1:5055/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json()

      if (!response.ok) {
        setError(data.message || 'Invalid email or password.')
        return
      }

      localStorage.setItem('skillsphere-user', JSON.stringify(data.user))

      alert(`Welcome back, ${data.user.name}!`)
      window.location.href = '/'

    } catch (err) {
      setError('Cannot connect to the server. Please make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <nav className="auth-navbar">
        <a href="/" className="auth-brand">SkillSphere</a>
        <div className="auth-nav-right">
          <button className="theme-toggle" onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <a href="/">Home</a>
        </div>
      </nav>

      <div className="auth-container">
        <div className="auth-card">
          <span className="auth-tagline">WELCOME BACK</span>
          <h1>Log in to SkillSphere</h1>
          <p className="auth-description">
            Continue your learning journey and keep growing.
          </p>

          <button
            className="social-button"
            type="button"
            onClick={() => alert('Google authentication will be configured later.')}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <button
            className="email-button"
            type="button"
            onClick={() => document.getElementById('login-email')?.focus()}
          >
            <span>✉</span>
            Continue with Email
          </button>

          <div className="auth-divider">
            <span>OR LOG IN MANUALLY</span>
          </div>

          <form onSubmit={handleLogin}>
            <label htmlFor="login-email">Email Address</label>
            <input
              id="login-email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <div className="auth-options">
              <label className="remember-option">
                <input type="checkbox" />
                Remember me
              </label>
              <a href="#forgot">Forgot password?</a>
            </div>

            {error && <p className="login-error">{error}</p>}

            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? 'Logging In...' : 'Log In'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <a href="/signup">Sign Up</a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Login
