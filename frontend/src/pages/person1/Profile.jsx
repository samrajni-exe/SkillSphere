
import { useEffect, useState } from 'react'
import { useTheme } from '../../context/ThemeContext'
import './Profile.css'

function Profile() {
  const { theme, toggleTheme } = useTheme()

  const user = JSON.parse(localStorage.getItem('skillsphere-user') || 'null')

  const [profile, setProfile] = useState({
    name: '',
    email: '',
    college: '',
    bio: '',
    phone: '',
    study_year: ''
  })

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (!user) {
      window.location.href = '/login'
      return
    }

    fetch(`http://127.0.0.1:5000/api/profile/${user.id}`)
      .then(response => {
        if (!response.ok) throw new Error('Could not load profile')
        return response.json()
      })
      .then(data => {
        setProfile({
          name: data.name || '',
          email: data.email || '',
          college: data.college || '',
          bio: data.bio || '',
          phone: data.phone || '',
          study_year: data.study_year || ''
        })
      })
      .catch(() => setError('Unable to load your profile.'))
      .finally(() => setLoading(false))
  }, [])

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value
    })
  }

  const handleSave = async (e) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setError('')

    try {
      const response = await fetch(
        `http://127.0.0.1:5000/api/profile/${user.id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            college: profile.college,
            bio: profile.bio,
            phone: profile.phone,
            study_year: profile.study_year
          })
        }
      )

      const data = await response.json()

      if (!response.ok) throw new Error(data.message)

      setMessage('Your profile has been updated successfully!')
    } catch (err) {
      setError(err.message || 'Unable to save your profile.')
    } finally {
      setSaving(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('skillsphere-user')
    window.location.href = '/'
  }

  if (!user) return null

  return (
    <div className="profile-page">
      <nav className="profile-navbar">
        <a href="/" className="profile-brand">SkillSphere.</a>

        <div className="profile-nav-actions">
          <button onClick={toggleTheme}>
            {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
          </button>
          <a href="/">Home</a>
          <button onClick={handleLogout}>Sign Out</button>
        </div>
      </nav>

      <main className="profile-container">
        <div className="profile-heading">
          <span className="profile-tag">YOUR PERSONAL SPACE</span>
          <h1>My Profile</h1>
          <p>Manage your information and learning identity.</p>
        </div>

        {loading ? (
          <p className="profile-status">Loading your profile...</p>
        ) : (
          <div className="profile-card">
            <div className="profile-user-heading">
              <div className="profile-avatar">
                {profile.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h2>{profile.name}</h2>
                <p>{profile.email}</p>
              </div>
            </div>

            <form onSubmit={handleSave}>
              <div className="profile-form-grid">
                <div className="profile-field">
                  <label>Full Name</label>
                  <input value={profile.name} disabled />
                </div>

                <div className="profile-field">
                  <label>Email Address</label>
                  <input value={profile.email} disabled />
                </div>

                <div className="profile-field">
                  <label>College / University</label>
                  <input
                    name="college"
                    value={profile.college}
                    onChange={handleChange}
                    placeholder="Enter your college"
                  />
                </div>

                <div className="profile-field">
                  <label>Phone Number</label>
                  <input
                    name="phone"
                    value={profile.phone}
                    onChange={handleChange}
                    placeholder="Enter your phone number"
                  />
                </div>

                <div className="profile-field">
                  <label>Current Study Year</label>
                  <select
                    name="study_year"
                    value={profile.study_year}
                    onChange={handleChange}
                  >
                    <option value="">Select study year</option>
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div className="profile-field full-width">
                  <label>About Me</label>
                  <textarea
                    name="bio"
                    value={profile.bio}
                    onChange={handleChange}
                    placeholder="Tell us a little about yourself..."
                    rows="4"
                  />
                </div>
              </div>

              {message && <p className="profile-success">{message}</p>}
              {error && <p className="profile-error">{error}</p>}

              <button
                type="submit"
                className="profile-save-btn"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </main>
    </div>
  )
}

export default Profile
