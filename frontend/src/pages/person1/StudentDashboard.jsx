
import { useEffect, useState } from 'react'

function StudentDashboard() {
  const user = JSON.parse(localStorage.getItem('skillsphere-user') || 'null')

  const [dashboard, setDashboard] = useState(null)
  const [enrolledCourses, setEnrolledCourses] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user?.id) {
      window.location.href = '/login'
      return
    }

    Promise.all([
      fetch(`http://127.0.0.1:5000/api/dashboard/${user.id}`).then(res => {
        if (!res.ok) throw new Error('Dashboard loading failed')
        return res.json()
      }),
      fetch(`http://127.0.0.1:5000/api/courses/student/${user.id}/enrolled`).then(res => {
        if (!res.ok) throw new Error('Courses loading failed')
        return res.json()
      })
    ])
      .then(([dashboardData, coursesData]) => {
        setDashboard(dashboardData)
        setEnrolledCourses(coursesData)
      })
      .catch(error => console.error(error))
      .finally(() => setLoading(false))
  }, [])

  const logout = () => {
    localStorage.removeItem('skillsphere-user')
    window.location.href = '/login'
  }

  const buttonStyle = {
    padding: '11px 18px',
    border: 'none',
    borderRadius: 9,
    cursor: 'pointer',
    background: '#473C33',
    color: 'white'
  }

  if (loading) return <h2 style={{ padding: 40 }}>Loading dashboard...</h2>

  if (!dashboard) return <h2 style={{ padding: 40 }}>Unable to load dashboard. Please refresh.</h2>

  return (
    <main style={{
      minHeight: '100vh',
      padding: '35px 7%',
      background: 'var(--bg, #FFFDF7)',
      color: 'var(--text, #473C33)'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 15
      }}>
        <h2>SkillSphere</h2>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button style={buttonStyle} onClick={() => window.location.href = '/'}>Home</button>
          <button style={buttonStyle} onClick={() => window.location.href = '/courses'}>Courses</button>
          <button style={buttonStyle} onClick={() => window.location.href = '/profile'}>Profile</button>
          <button style={buttonStyle} onClick={logout}>Sign Out</button>
        </div>
      </header>

      <section style={{ marginTop: 45 }}>
        <p>STUDENT DASHBOARD</p>
        <h1>Welcome, {dashboard.student.name}!</h1>
        <p>Keep learning. Keep growing. Build your future with SkillSphere.</p>
      </section>

      <section style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
        gap: 22,
        marginTop: 30
      }}>
        <div style={{ background: '#FEC868', padding: 25, borderRadius: 18 }}>
          <h3>Enrolled Courses</h3>
          <h1>{dashboard.enrolled_courses}</h1>
        </div>

        <div style={{ background: '#ABC270', padding: 25, borderRadius: 18 }}>
          <h3>Completed Lessons</h3>
          <h1>{dashboard.completed_lessons}</h1>
        </div>

        <div style={{ background: '#FDA769', padding: 25, borderRadius: 18 }}>
          <h3>Student Account</h3>
          <h2>{dashboard.student.name}</h2>
          <p>{dashboard.student.email}</p>
        </div>
      </section>

      <section style={{ marginTop: 45 }}>
        <h2>My Enrolled Courses</h2>
        <p>Pick up where you left off.</p>

        {enrolledCourses.length === 0 ? (
          <div style={{ background: 'white', padding: 25, borderRadius: 15 }}>
            <p>You haven't enrolled in any courses yet.</p>
            <button style={buttonStyle} onClick={() => window.location.href = '/courses'}>
              Explore Courses
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
            gap: 20,
            marginTop: 20
          }}>
            {enrolledCourses.map(course => (
              <article key={course.id} style={{
                background: 'var(--card, white)',
                padding: 24,
                borderRadius: 18,
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)'
              }}>
                <p>{course.category}</p>
                <h3>{course.title}</h3>
                <p>{course.level} • {course.duration}</p>
                <p>{course.description}</p>
                <button
                  style={buttonStyle}
                  onClick={() => window.location.href = `/course/${course.id}`}
                >
                  Continue Learning →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section style={{
        marginTop: 45,
        padding: 30,
        borderRadius: 18,
        background: 'var(--card, white)'
      }}>
        <h2>Discover More Skills</h2>
        <p>Explore more courses and expand your knowledge.</p>
        <button style={buttonStyle} onClick={() => window.location.href = '/courses'}>
          Explore All Courses →
        </button>
      </section>
    </main>
  )
}

export default StudentDashboard
