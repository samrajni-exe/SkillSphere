
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
      fetch(`https://skillsphere-api-2026.onrender.com/api/dashboard/${user.id}`).then(res => {
        if (!res.ok) throw new Error('Dashboard loading failed')
        return res.json()
      }),
      fetch(`https://skillsphere-api-2026.onrender.com/api/courses/student/${user.id}/enrolled`).then(res => {
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

  const goTo = (path) => {
    window.location.href = path
  }

  const features = [
    {
      icon: '🎯',
      title: 'Skill Assessment',
      description: 'Test your skills and discover your strengths.',
      path: '/assessment',
      color: '#FFF0D6'
    },
    {
      icon: '📊',
      title: 'Assessment Results',
      description: 'Review your performance and identify areas to improve.',
      path: '/assessment-results',
      color: '#EAF1D9'
    },
    {
      icon: '🗺️',
      title: 'Learning Roadmap',
      description: 'Follow your personalized learning journey.',
      path: '/roadmap',
      color: '#FCE9DF'
    },
    {
      icon: '💡',
      title: 'Practice Zone',
      description: 'Strengthen your knowledge through practice.',
      path: '/practice',
      color: '#E9EDFA'
    },
    {
      icon: '🚀',
      title: 'Projects',
      description: 'Submit projects and track your progress.',
      path: '/projects',
      color: '#F5E9F5'
    },
    {
      icon: '🏆',
      title: 'Achievements',
      description: 'Explore your badges and achievements.',
      path: '/achievements',
      color: '#FFF1D9'
    },
    {
      icon: '⚙️',
      title: 'Admin Dashboard',
      description: 'Access platform administration.',
      path: '/admin',
      color: '#E8EEEE'
    }
  ]

  if (loading) {
    return (
      <div className="ss-message">
        <h2>Loading your dashboard...</h2>
      </div>
    )
  }

  if (!dashboard) {
    return (
      <div className="ss-message">
        <h2>Unable to load dashboard</h2>
        <p>Please refresh the page and try again.</p>
      </div>
    )
  }

  return (
    <main className="ss-dashboard">

      <style>{`
        .ss-dashboard {
          min-height: 100vh;
          padding: 28px 6%;
          background: #FFFDF7;
          color: #473C33;
          font-family: inherit;
          box-sizing: border-box;
        }

        .ss-dashboard * {
          box-sizing: border-box;
        }

        .ss-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
          margin-bottom: 55px;
        }

        .ss-logo {
          font-size: 27px;
          font-weight: 800;
          letter-spacing: -0.8px;
          margin: 0;
        }

        .ss-nav {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .ss-btn {
          background: #473C33;
          color: white;
          border: none;
          padding: 11px 19px;
          border-radius: 9px;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          transition: 0.2s ease;
        }

        .ss-btn:hover {
          background: #76604F;
          transform: translateY(-2px);
        }

        .ss-welcome {
          margin-bottom: 30px;
        }

        .ss-eyebrow {
          color: #A17A52;
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 2px;
          margin-bottom: 10px;
        }

        .ss-welcome h1 {
          font-size: clamp(27px, 3vw, 36px);
          margin: 0 0 10px;
          line-height: 1.2;
        }

        .ss-subtitle {
          color: #82766C;
          font-size: 15px;
          margin: 0;
        }

        .ss-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
          margin-bottom: 55px;
        }

        .ss-stat {
          padding: 25px;
          border-radius: 17px;
          min-height: 125px;
        }

        .ss-stat:nth-child(1) {
          background: #FEC868;
        }

        .ss-stat:nth-child(2) {
          background: #ABC270;
        }

        .ss-stat:nth-child(3) {
          background: #FDA769;
        }

        .ss-stat-label {
          font-size: 14px;
          font-weight: 700;
          margin: 0 0 12px;
        }

        .ss-stat h2 {
          font-size: 27px;
          margin: 0;
          overflow-wrap: anywhere;
        }

        .ss-stat p {
          font-size: 13px;
          margin: 7px 0 0;
          overflow-wrap: anywhere;
        }

        .ss-section {
          margin-bottom: 55px;
        }

        .ss-section-heading {
          margin-bottom: 22px;
        }

        .ss-section-heading h2 {
          font-size: 23px;
          margin: 0 0 7px;
        }

        .ss-section-heading p {
          color: #82766C;
          margin: 0;
          font-size: 14px;
        }

        .ss-course-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .ss-course {
          background: white;
          border: 1px solid #F0EBE2;
          padding: 23px;
          border-radius: 17px;
          box-shadow: 0 5px 18px rgba(71,60,51,0.055);
          display: flex;
          flex-direction: column;
          min-height: 245px;
          transition: 0.2s ease;
        }

        .ss-course:hover {
          transform: translateY(-4px);
          box-shadow: 0 9px 23px rgba(71,60,51,0.10);
        }

        .ss-category {
          color: #A17A52;
          font-size: 12px;
          font-weight: 700;
          margin: 0 0 9px;
        }

        .ss-course h3 {
          font-size: 17px;
          line-height: 1.4;
          margin: 0 0 9px;
        }

        .ss-course-meta {
          color: #958779;
          font-size: 12px;
          margin: 0 0 12px;
        }

        .ss-course-description {
          color: #766B62;
          font-size: 13px;
          line-height: 1.6;
          margin: 0 0 20px;
        }

        .ss-course .ss-btn {
          align-self: flex-start;
          margin-top: auto;
        }

        .ss-feature-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .ss-feature {
          display: flex;
          flex-direction: column;
          text-decoration: none;
          color: #473C33;
          background: white;
          border: 1px solid #F0EBE2;
          border-radius: 17px;
          padding: 23px;
          min-height: 185px;
          box-shadow: 0 5px 18px rgba(71,60,51,0.045);
          transition: 0.2s ease;
        }

        .ss-feature:hover {
          transform: translateY(-4px);
          border-color: #D7C6AD;
          box-shadow: 0 9px 23px rgba(71,60,51,0.09);
        }

        .ss-feature-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 43px;
          height: 43px;
          border-radius: 12px;
          font-size: 21px;
          margin-bottom: 16px;
        }

        .ss-feature h3 {
          font-size: 16px;
          margin: 0 0 9px;
        }

        .ss-feature p {
          color: #82766C;
          font-size: 13px;
          line-height: 1.6;
          margin: 0;
        }

        .ss-feature-link {
          color: #A17A52;
          font-size: 12px;
          font-weight: 800;
          margin-top: auto;
          padding-top: 16px;
        }

        .ss-discover {
          padding: 30px;
          background: #F5EBDD;
          border-radius: 18px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        .ss-discover h2 {
          margin: 0 0 8px;
          font-size: 21px;
        }

        .ss-discover p {
          color: #82766C;
          margin: 0;
          font-size: 14px;
        }

        .ss-empty {
          background: white;
          border: 1px solid #F0EBE2;
          padding: 28px;
          border-radius: 16px;
        }

        .ss-message {
          min-height: 100vh;
          display: grid;
          place-content: center;
          text-align: center;
          padding: 25px;
          color: #473C33;
          background: #FFFDF7;
        }

        @media (max-width: 900px) {
          .ss-course-grid,
          .ss-feature-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
          .ss-dashboard {
            padding: 22px 5%;
          }

          .ss-header {
            margin-bottom: 38px;
          }

          .ss-nav {
            width: 100%;
          }

          .ss-nav button {
            flex: 1;
          }

          .ss-stats {
            grid-template-columns: 1fr;
            gap: 13px;
            margin-bottom: 40px;
          }

          .ss-course-grid,
          .ss-feature-grid {
            grid-template-columns: 1fr;
          }

          .ss-course {
            min-height: 220px;
          }

          .ss-section {
            margin-bottom: 40px;
          }

          .ss-discover {
            padding: 24px;
          }
        }
      `}</style>

      <header className="ss-header">
        <h2 className="ss-logo">SkillSphere</h2>

        <nav className="ss-nav">
          <button className="ss-btn" onClick={() => goTo('/')}>Home</button>
          <button className="ss-btn" onClick={() => goTo('/courses')}>Courses</button>
          <button className="ss-btn" onClick={() => goTo('/profile')}>Profile</button>
          <button className="ss-btn" onClick={logout}>Sign Out</button>
        </nav>
      </header>

      <section className="ss-welcome">
        <p className="ss-eyebrow">STUDENT DASHBOARD</p>
        <h1>Welcome, {dashboard.student.name}!</h1>
        <p className="ss-subtitle">
          Keep learning. Keep growing. Build your future with SkillSphere.
        </p>
      </section>

      <section className="ss-stats">
        <div className="ss-stat">
          <p className="ss-stat-label">📚 Enrolled Courses</p>
          <h2>{dashboard.enrolled_courses}</h2>
        </div>

        <div className="ss-stat">
          <p className="ss-stat-label">✓ Completed Lessons</p>
          <h2>{dashboard.completed_lessons}</h2>
        </div>

        <div className="ss-stat">
          <p className="ss-stat-label">👤 Student Account</p>
          <h2>{dashboard.student.name}</h2>
          <p>{dashboard.student.email}</p>
        </div>
      </section>

      <section className="ss-section">
        <div className="ss-section-heading">
          <h2>My Enrolled Courses</h2>
          <p>Pick up where you left off.</p>
        </div>

        {enrolledCourses.length === 0 ? (
          <div className="ss-empty">
            <p>You haven't enrolled in any courses yet.</p>
            <button className="ss-btn" onClick={() => goTo('/courses')}>
              Explore Courses →
            </button>
          </div>
        ) : (
          <div className="ss-course-grid">
            {enrolledCourses.map(course => (
              <article className="ss-course" key={course.id}>
                <p className="ss-category">{course.category}</p>
                <h3>{course.title}</h3>
                <p className="ss-course-meta">
                  {course.level} • {course.duration}
                </p>
                <p className="ss-course-description">
                  {course.description}
                </p>
                <button
                  className="ss-btn"
                  onClick={() => goTo(`/course/${course.id}`)}
                >
                  Continue Learning →
                </button>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="ss-section">
        <div className="ss-section-heading">
          <h2>Skill Development Hub</h2>
          <p>Assess your abilities, practise new skills and track your growth.</p>
        </div>

        <div className="ss-feature-grid">
          {features.map(feature => (
            <a
              key={feature.path}
              href={feature.path}
              className="ss-feature"
            >
              <div
                className="ss-feature-icon"
                style={{ background: feature.color }}
              >
                {feature.icon}
              </div>

              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
              <span className="ss-feature-link">Explore →</span>
            </a>
          ))}
        </div>
      </section>

      <section className="ss-discover">
        <div>
          <h2>Ready to learn something new?</h2>
          <p>Explore more courses and expand your knowledge.</p>
        </div>

        <button className="ss-btn" onClick={() => goTo('/courses')}>
          Explore All Courses →
        </button>
      </section>

    </main>
  )
}

export default StudentDashboard
