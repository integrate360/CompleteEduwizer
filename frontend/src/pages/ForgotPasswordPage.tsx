import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowRightIcon, EyeIcon, LockIcon, MailIcon } from '../components/icons'
import AuthDecor from '../components/AuthDecor'
import { forgotPassword, setNewPassword } from '../services/api'

/** Step 1 — request a reset link by email. */
export function ForgotPasswordPage() {
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return
    const email = String(new FormData(form).get('email') ?? '')
    setBusy(true)
    setError('')
    try {
      await forgotPassword(email)
      setSent(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send the reset link.')
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
          <h1>Forgot Password?</h1>
          <p className="auth-card__sub">
            Enter your registered email and we&apos;ll send you a link to reset your password.
          </p>
          {sent ? (
            <p style={{ textAlign: 'center', fontWeight: 600, color: '#1c7c44' }}>
              ✓ Reset link sent — please check your email.
            </p>
          ) : (
            <form className="auth-form" onSubmit={submit}>
              <div className="afield">
                <label htmlFor="fp-email">Email Address</label>
                <div className="ainput">
                  <MailIcon />
                  <input
                    id="fp-email"
                    name="email"
                    type="email"
                    required
                    placeholder="Enter your email address"
                    autoComplete="email"
                  />
                </div>
              </div>
              {error && (
                <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
              )}
              <button type="submit" className="btn btn--navy btn--block" disabled={busy}>
                {busy ? 'Sending…' : 'Send Reset Link'} <ArrowRightIcon />
              </button>
            </form>
          )}
          <p className="auth-card__foot">
            Remembered it?{' '}
            <Link to="/login" className="auth-link auth-link--underline">Back to Login</Link>
          </p>
        </section>
      </div>
    </main>
  )
}

/** Step 2 — set a new password from the emailed token link. */
export function SetNewPasswordPage() {
  const { token } = useParams()
  const navigate = useNavigate()
  const [show, setShow] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity() || !token) return
    const fd = new FormData(form)
    const newPassword = String(fd.get('password') ?? '')
    if (newPassword !== String(fd.get('password2') ?? '')) {
      setError('Passwords do not match.')
      return
    }
    setBusy(true)
    setError('')
    try {
      await setNewPassword(token, newPassword)
      navigate('/login')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to set a new password.')
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
          <h1>Set New Password</h1>
          <p className="auth-card__sub">Choose a new password for your account.</p>
          <form className="auth-form" onSubmit={submit}>
            <div className="afield">
              <label htmlFor="np-pass">New Password</label>
              <div className="ainput">
                <LockIcon />
                <input
                  id="np-pass"
                  name="password"
                  type={show ? 'text' : 'password'}
                  required
                  minLength={8}
                  maxLength={25}
                  placeholder="Enter your new password"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="ainput__eye"
                  onClick={() => setShow((v) => !v)}
                  aria-label={show ? 'Hide password' : 'Show password'}
                >
                  <EyeIcon off={show} />
                </button>
              </div>
            </div>
            <div className="afield">
              <label htmlFor="np-pass2">Confirm Password</label>
              <div className="ainput">
                <LockIcon />
                <input
                  id="np-pass2"
                  name="password2"
                  type={show ? 'text' : 'password'}
                  required
                  placeholder="Repeat your new password"
                  autoComplete="new-password"
                />
              </div>
            </div>
            {error && (
              <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
            )}
            <button type="submit" className="btn btn--navy btn--block" disabled={busy}>
              {busy ? 'Saving…' : 'Reset Password'} <ArrowRightIcon />
            </button>
          </form>
        </section>
      </div>
    </main>
  )
}
