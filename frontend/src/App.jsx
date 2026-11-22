import Landing from './pages/person1/Landing'
import Login from './pages/person1/Login'
import Signup from './pages/person1/Signup'
import Profile from './pages/person1/Profile'
import Courses from './pages/person1/Courses'
import CourseDetails from './pages/person1/CourseDetails'
import StudentDashboard from './pages/person1/StudentDashboard'

import SkillAssessment from './pages/person2/SkillAssessment'
import AssessmentResults from './pages/person2/AssessmentResults'
import LearningRoadmap from './pages/person2/LearningRoadmap'
import PracticeZone from './pages/person2/PracticeZone'
import ProjectSubmission from './pages/person2/ProjectSubmission'
import Achievements from './pages/person2/Achievements'
import AdminDashboard from './pages/person2/AdminDashboard'

function Person2Layout({ children }) {
  const links = [
    ['Assessment', '/assessment'],
    ['Results', '/assessment-results'],
    ['Roadmap', '/roadmap'],
    ['Practice', '/practice'],
    ['Projects', '/projects'],
    ['Achievements', '/achievements'],
    ['Admin', '/admin']
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FFFDF7' }}>
      <nav style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', padding: '16px', background: '#473C33' }}>
        <a href="/dashboard" style={{ color: '#FEC868' }}>SkillSphere</a>
        {links.map(([label, path]) => (
          <a key={path} href={path} style={{ color: '#FFFDF7', textDecoration: 'none' }}>
            {label}
          </a>
        ))}
      </nav>
      {children}
    </div>
  )
}

function App() {
  const path = window.location.pathname

  let user = null
  try {
    user = JSON.parse(localStorage.getItem('skillsphere-user') || 'null')
  } catch {
    user = null
  }

  const userId = user?.id

  if (path === '/login') return <Login />
  if (path === '/signup') return <Signup />
  if (path === '/profile') return <Profile />
  if (path === '/courses') return <Courses />
  if (path === '/dashboard') return <StudentDashboard />
  if (path.startsWith('/course/')) return <CourseDetails />

  if (path === '/assessment') return <Person2Layout><SkillAssessment userId={userId} /></Person2Layout>
  if (path === '/assessment-results') return <Person2Layout><AssessmentResults userId={userId} /></Person2Layout>
  if (path === '/roadmap') return <Person2Layout><LearningRoadmap userId={userId} /></Person2Layout>
  if (path === '/practice') return <Person2Layout><PracticeZone userId={userId} /></Person2Layout>
  if (path === '/projects') return <Person2Layout><ProjectSubmission userId={userId} /></Person2Layout>
  if (path === '/achievements') return <Person2Layout><Achievements userId={userId} /></Person2Layout>
  if (path === '/admin') return <Person2Layout><AdminDashboard /></Person2Layout>

  return <Landing />
}

export default App
