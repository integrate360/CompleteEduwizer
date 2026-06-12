import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
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

/* ---------- desktop dropdown ---------- */
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

/* ---------- mobile collapsible group ---------- */
function MobileGroup({
  label,
  items,
  onNavigate,
}: {
  label: string
  items: { to: string; label: string }[]
  onNavigate: () => void
}) {
  const [open, setOpen] = useState(false)
  return (
    <div className="mnav__group">
      <button
        type="button"
        className="mnav__link mnav__group-toggle"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
      >
        {label} <span className={`hdd__caret${open ? ' open' : ''}`} aria-hidden />
      </button>
      {open && (
        <div className="mnav__sub">
          {items.map((item) => (
            <Link key={item.to} to={item.to} className="mnav__sublink" onClick={onNavigate}>
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export default function SiteHeader() {
  const { isLoggedIn, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [menuOpen, setMenuOpen] = useState(false)

  // Close the drawer on route change and lock body scroll while it's open.
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- close menu on navigation
    setMenuOpen(false)
  }, [location.pathname])
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  const close = () => setMenuOpen(false)

  return (
    <header className="topbar">
      <div className="page-wrap topbar__inner">
        <Link to="/home" className="brand" aria-label="NG Eduwizer home" onClick={close}>
          <img src="/assets/logo-full.png" alt="NG Eduwizer — India, Dubai, Canada, Singapore, Europe" />
        </Link>

        {/* ---- desktop nav ---- */}
        <nav className="topnav" aria-label="Primary">
          <NavLink to="/home" className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}>
            Home
          </NavLink>
          <Dropdown label="Infrastructure" items={INFRA_LINKS} />
          <Dropdown label="Counsellors" items={COUNSELLOR_LINKS} />
          <NavLink to="/events-blogs" className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}>
            Events &amp; Blogs
          </NavLink>
          <NavLink to="/contact-us" className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}>
            Contact Us
          </NavLink>
          <NavLink to="/about-us" className={({ isActive }) => `topnav__link${isActive ? ' is-active' : ''}`}>
            About Us
          </NavLink>
        </nav>

        {/* ---- desktop actions ---- */}
        <div className="topbar__actions">
          <a href="https://ngeduwizer.com" target="_blank" rel="noreferrer" className="btn topbar__setup">
            Setup Of School
          </a>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn topbar__signup">My Profile</Link>
              <button type="button" className="btn topbar__login" onClick={() => { logout(); navigate('/home') }}>
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

        {/* ---- hamburger (mobile/tablet) ---- */}
        <button
          type="button"
          className={`hamburger${menuOpen ? ' is-open' : ''}`}
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
        >
          <span /><span /><span />
        </button>
      </div>

      {/* ---- mobile drawer ---- */}
      {menuOpen && <div className="mnav__backdrop" onClick={close} />}
      <nav className={`mnav${menuOpen ? ' is-open' : ''}`} aria-label="Mobile">
        <NavLink to="/home" className="mnav__link" onClick={close}>Home</NavLink>
        <MobileGroup label="Infrastructure" items={INFRA_LINKS} onNavigate={close} />
        <MobileGroup label="Counsellors" items={COUNSELLOR_LINKS} onNavigate={close} />
        <NavLink to="/events-blogs" className="mnav__link" onClick={close}>Events &amp; Blogs</NavLink>
        <NavLink to="/contact-us" className="mnav__link" onClick={close}>Contact Us</NavLink>
        <NavLink to="/about-us" className="mnav__link" onClick={close}>About Us</NavLink>

        <div className="mnav__actions">
          <a href="https://ngeduwizer.com" target="_blank" rel="noreferrer" className="btn topbar__setup" onClick={close}>
            Setup Of School
          </a>
          {isLoggedIn ? (
            <>
              <Link to="/dashboard" className="btn topbar__signup" onClick={close}>My Profile</Link>
              <button type="button" className="btn topbar__login" onClick={() => { close(); logout(); navigate('/home') }}>
                Logout
              </button>
            </>
          ) : (
            <>
              <MobileGroup label="Sign Up" items={SIGNUP_LINKS} onNavigate={close} />
              <Link to="/login" className="btn topbar__login" onClick={close}>Login</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
