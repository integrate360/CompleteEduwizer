import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'

const INFRA_LINKS = [
  { to: '/infrastructure-search/financialLoanServices', label: 'Financial Loan Services' },
  { to: '/infrastructure-search/smartTechnology', label: 'Smart Technology' },
  { to: '/infrastructure-search/integratedCurriculum', label: 'Integrated Curriculum' },
  { to: '/infrastructure-search/teacherTraining', label: 'Teacher Training' },
  {
    to: '/infrastructure-search/academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions',
    label: 'Academic Audit for Schools, Colleges, Universities, Private Institutions',
  },
  { to: '/infrastructure-search/websiteDevelopment', label: 'Website Development' },
  { to: '/infrastructure-search/artificialIntelligence', label: 'Artificial Intelligence' },
]

const COUNSELLOR_LINKS = [
  { to: '/career-counselling/career', label: 'Career' },
  { to: '/career-counselling/psychologist', label: 'Psychologist' },
  { to: '/career-counselling/schoolOrCollegeCounsellors', label: 'School/College Counsellors' },
]

const SIGNUP_LINKS = [
  { to: '/register/candidate', label: 'Candidate' },
  { to: '/register/counseller', label: 'Counseller' },
  { to: '/register/vendor', label: 'Vendor' },
  { to: '/register/institute', label: 'Recruiter' },
]

function Dropdown({
  label,
  items,
  className,
  align = 'left',
}: {
  label: string
  items: { to: string; label: string }[]
  className?: string
  align?: 'left' | 'right'
}) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [])

  return (
    <div className={`hdd${open ? ' is-open' : ''}`} ref={ref}>
      <button
        type="button"
        className={className ?? 'topnav__link hdd__toggle'}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
      >
        {label} <span className="hdd__caret" aria-hidden />
      </button>
      {open && (
        <div className={`hdd__menu hdd__menu--${align}`}>
          {items.map((item) => (
            <Link key={item.to} to={item.to} className="hdd__item" onClick={() => setOpen(false)}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

const navItems = [
  { label: 'Home', to: '/home' },
  { label: 'Events & Blogs', to: '/events-blogs' },
  { label: 'Contact Us', to: '/contact-us' },
  { label: 'About Us', to: '/about-us' },
]

export default function SiteHeader() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <header className="topbar">
      <div className="page-wrap topbar__inner">
        <Link to="/home" className="brand" aria-label="NG Eduwizer home">
          <img src="/assets/logo-full.png" alt="NG Eduwizer — India, Dubai, Canada, Singapore, Europe" />
        </Link>
        <nav className="topnav" aria-label="Primary">
          <NavLink
            to="/home"
            className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}
          >
            Home
          </NavLink>
          <Dropdown label="Infrastructure" items={INFRA_LINKS} />
          <Dropdown label="Counsellors" items={COUNSELLOR_LINKS} />
          {navItems.slice(1).map((item) => (
            <NavLink
              key={item.label}
              to={item.to}
              className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}
            >
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="topbar__actions">
          <a
            href="https://ngeduwizer.com"
            target="_blank"
            rel="noreferrer"
            className="btn topbar__setup"
          >
            Setup Of School
          </a>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn topbar__signup">My Profile</Link>
              <button
                type="button"
                className="btn topbar__login"
                onClick={() => {
                  logout()
                  navigate('/home')
                }}
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Dropdown label="Sign Up" items={SIGNUP_LINKS} className="btn topbar__signup hdd__toggle" align="right" />
              <Link to="/login" className="btn topbar__login">Login</Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
