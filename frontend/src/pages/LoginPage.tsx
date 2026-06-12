import { useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { ArrowRightIcon, EyeIcon, LockIcon, MailIcon } from '../components/icons'
import AuthDecor from '../components/AuthDecor'
import { login } from '../services/api'
import { useAuth } from '../auth/AuthContext'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const location = useLocation()
  const auth = useAuth()

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return
    const fd = new FormData(form)
    setBusy(true)
    setError('')
    try {
      const resp = await login(String(fd.get('email') ?? ''), String(fd.get('password') ?? ''))
      if (resp.success && resp.session && resp.data?._id) {
        auth.login(resp.session, resp.data._id)
        const from = (location.state as { from?: string } | null)?.from
        navigate(from ?? '/dashboard')
      } else {
        setError(resp.message ?? 'Incorrect credentials')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="auth-stage">
      <AuthDecor />
      <img className="auth-stage__plane" src="/assets/figma/contact-plane.png" alt="" />
      <div className="page-wrap">
        <section className="auth-card">
          <img className="auth-card__lock" src="/assets/figma/login-lock.png" alt="" />
          <h1>Welcome Back!</h1>
          <p className="auth-card__sub">Login to your account and continue your journey with us</p>
          <form className="auth-form" onSubmit={submit}>
            <div className="afield">
              <label htmlFor="login-email">Email Address</label>
              <div className="ainput">
                <MailIcon />
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  required
                  placeholder="Enter your email address"
                  autoComplete="email"
                />
              </div>
            </div>
            <div className="afield">
              <label htmlFor="login-password">Password</label>
              <div className="ainput">
                <LockIcon />
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter your password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="ainput__eye"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon off={showPassword} />
                </button>
              </div>
            </div>
            <div className="auth-meta">
              <label className="auth-check">
                <input type="checkbox" name="remember" defaultChecked /> Remember me
              </label>
              <Link to="/forgot-password" className="auth-link">Forgot Password?</Link>
            </div>
            {error && (
              <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
            )}
            <button type="submit" className="btn btn--navy btn--block" disabled={busy}>
              {busy ? 'Logging in…' : 'Login'} <ArrowRightIcon />
            </button>
          </form>
          <p className="auth-card__foot">
            Don&apos;t have an account?{' '}
            <Link to="/register/candidate" className="auth-link auth-link--underline">
              Create Account
            </Link>
          </p>
        </section>
      </div>
      <img
        className="auth-visual auth-visual--login"
        src="/assets/legacy/png/hey.png"
        alt="Student waving from a school chair"
      />
    </main>
  )
}
