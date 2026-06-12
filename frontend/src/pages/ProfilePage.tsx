import { useEffect, useState, type FormEvent } from 'react'
import { CameraIcon, EyeIcon, FileUpIcon, InfoIcon } from '../components/icons'
import { getProfile, updateProfile, uploadFile, type Profile } from '../services/api'
import { useAuth } from '../auth/AuthContext'

const COMPLETENESS_KEYS: (keyof Profile)[] = [
  'firstName', 'lastName', 'userName', 'phone', 'email', 'address',
  'country', 'state', 'city', 'aboutMe', 'experience', 'education',
  'skills', 'languages', 'awardsAndRecognition', 'url', 'resume',
]

function completeness(p: Profile): number {
  const filled = COMPLETENESS_KEYS.filter((k) => {
    const v = p[k]
    return v !== undefined && v !== null && String(v).trim() !== ''
  }).length
  return Math.round((filled / COMPLETENESS_KEYS.length) * 100)
}

function ProgressRing({ value }: { value: number }) {
  const r = 24
  const c = 2 * Math.PI * r
  return (
    <span className="progress-ring">
      <svg width="58" height="58" viewBox="0 0 58 58">
        <circle cx="29" cy="29" r={r} fill="none" stroke="#e6eaf4" strokeWidth="5" />
        <circle
          cx="29"
          cy="29"
          r={r}
          fill="none"
          stroke="#4f6fd8"
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * c} ${c}`}
        />
      </svg>
      <span>{value}%</span>
    </span>
  )
}

function SectionHead({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="psection__head">
      <img src={icon} alt="" />
      <h2>{title}</h2>
    </div>
  )
}

const aboutSections: { icon: string; title: string; key: keyof Profile }[] = [
  { icon: '/assets/figma/icon-aboutme.png', title: 'About Me', key: 'aboutMe' },
  { icon: '/assets/figma/icon-experience.png', title: 'Experience', key: 'experience' },
  { icon: '/assets/figma/icon-education.png', title: 'Education', key: 'education' },
  { icon: '/assets/figma/icon-skills.png', title: 'Skills', key: 'skills' },
  { icon: '/assets/figma/icon-languages.png', title: 'Languages', key: 'languages' },
  { icon: '/assets/figma/icon-awards.png', title: 'Awards and Recognitions', key: 'awardsAndRecognition' },
]

const countryOptions = ['India', 'UAE', 'Canada', 'Singapore']
const stateOptions = ['Maharashtra', 'Tamil Nadu', 'Karnataka', 'Delhi', 'Gujarat']
const cityOptions = ['Mumbai', 'Chennai', 'Bengaluru', 'New Delhi', 'Ahmedabad']

export default function ProfilePage() {
  const { logout } = useAuth()
  const [profile, setProfile] = useState<Profile>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [password, setPassword] = useState('')
  const [password2, setPassword2] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [resumeName, setResumeName] = useState('')

  useEffect(() => {
    getProfile()
      .then((r) => setProfile(r.data ?? {}))
      .catch((err) => {
        if (err?.status === 401 || err?.status === 403) logout()
        else setError('Could not load your profile. Please refresh.')
      })
      .finally(() => setLoading(false))
  }, [logout])

  const set = (key: keyof Profile) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSaved(false)
    setProfile((p) => ({ ...p, [key]: e.target.value }))
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>, kind: 'photo' | 'resume') {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const url = await uploadFile(file)
      setSaved(false)
      if (kind === 'photo') setProfile((p) => ({ ...p, url }))
      else {
        setProfile((p) => ({ ...p, resume: url }))
        setResumeName(file.name)
      }
    } catch {
      setError('File upload failed. Please try again.')
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault()
    setError('')
    if (password || password2) {
      if (password !== password2) {
        setError('Passwords do not match.')
        return
      }
    }
    setSaving(true)
    try {
      const body: Profile = { ...profile }
      if (password) body.password = password
      await updateProfile(body)
      setSaved(true)
      setPassword('')
      setPassword2('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not save changes.')
    } finally {
      setSaving(false)
    }
  }

  const fullName = [profile.firstName, profile.lastName].filter(Boolean).join(' ') || 'Your Profile'

  const withValue = (options: string[], value?: string) =>
    value && !options.includes(value) ? [value, ...options] : options

  const field = (
    id: string,
    label: string,
    key: keyof Profile,
    opts: { type?: string; select?: boolean; options?: string[]; placeholder?: string } = {},
  ) => (
    <div className="afield">
      <label htmlFor={id}>{label}</label>
      <div className="ainput">
        {opts.select ? (
          <select id={id} value={String(profile[key] ?? '')} onChange={set(key)}>
            <option value="">Select</option>
            {withValue(opts.options ?? [], String(profile[key] ?? '') || undefined).map((o) => (
              <option key={o} value={o}>{o}</option>
            ))}
          </select>
        ) : (
          <input
            id={id}
            type={opts.type ?? 'text'}
            value={String(profile[key] ?? '')}
            placeholder={opts.placeholder}
            onChange={set(key)}
          />
        )}
      </div>
    </div>
  )

  if (loading) {
    return (
      <main className="profile-page">
        <div className="page-wrap" style={{ padding: '80px 0', textAlign: 'center' }}>
          <p>Loading your profile…</p>
        </div>
      </main>
    )
  }

  return (
    <main className="profile-page">
      <div className="page-wrap profile-layout">
        <aside className="profile-card">
          <img src={profile.url || '/assets/figma/frank-avatar.png'} alt={fullName} />
          <h3>{fullName}</h3>
          <p style={{ textTransform: 'capitalize' }}>{profile.userType ?? ''}</p>
        </aside>

        <form className="profile-main" onSubmit={save}>
          <div className="profile-top">
            <h1>Edit Profile</h1>
            <span className="profile-completeness">
              Profile Completeness <InfoIcon /> <ProgressRing value={completeness(profile)} />
            </span>
            <div className="profile-actions">
              <button type="button" className="btn btn--cream" onClick={() => window.location.reload()}>
                Cancel
              </button>
              <button type="submit" className="btn btn--navy" disabled={saving}>
                {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
              </button>
            </div>
          </div>

          {error && (
            <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 16px' }}>{error}</p>
          )}

          <section className="psection">
            <SectionHead icon="/assets/figma/icon-general.png" title="General" />
            <div className="auth-row auth-row--triple">
              {field('p-first', 'First Name', 'firstName')}
              {field('p-last', 'Last Name', 'lastName')}
              {field('p-username', 'Username/Email', 'userName')}
            </div>
            <div className="auth-row auth-row--triple">
              <div className="afield">
                <label htmlFor="p-mobile">Mobile Number</label>
                <div className="ainput ainput--phone">
                  <span className="ainput__cc">🇮🇳 +91</span>
                  <input
                    id="p-mobile"
                    type="tel"
                    value={String(profile.phone ?? '')}
                    onChange={set('phone')}
                  />
                </div>
              </div>
              {field('p-whatsapp', 'WhatsApp Number', 'whatsapp', { type: 'tel' })}
              {field('p-email', 'Email', 'email', { type: 'email' })}
            </div>
            <p className="pnote">*WhatsApp will be sent to this number</p>
            <div className="auth-row auth-row--triple">
              {field('p-country', 'Country', 'country', { select: true, options: countryOptions })}
              {field('p-state', 'State', 'state', { select: true, options: stateOptions })}
              {field('p-city', 'City', 'city', { select: true, options: cityOptions })}
            </div>
            <div className="auth-row">
              <div className="afield">
                <label htmlFor="p-pass">New Password</label>
                <div className="ainput">
                  <input
                    id="p-pass"
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    placeholder="Leave blank to keep current"
                    autoComplete="new-password"
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="ainput__eye"
                    onClick={() => setShowPass((v) => !v)}
                    aria-label={showPass ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon off={showPass} />
                  </button>
                </div>
              </div>
              <div className="afield">
                <label htmlFor="p-pass2">Re-type Password</label>
                <div className="ainput">
                  <input
                    id="p-pass2"
                    type={showPass ? 'text' : 'password'}
                    value={password2}
                    placeholder="Repeat new password"
                    autoComplete="new-password"
                    onChange={(e) => setPassword2(e.target.value)}
                  />
                </div>
              </div>
            </div>
            <div className="upload-row">
              <div className="afield">
                <label htmlFor="p-photo">Profile Photo</label>
                <label className="upload-tile" htmlFor="p-photo">
                  <CameraIcon />
                  <strong>{profile.url ? 'Replace photo' : 'Upload photo'}</strong>
                  JPG, PNG (Max. 2MB)
                  <input
                    id="p-photo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    onChange={(e) => handleUpload(e, 'photo')}
                  />
                </label>
              </div>
              <div className="afield">
                <label htmlFor="p-resume">Upload Resume</label>
                <label className="upload-tile" htmlFor="p-resume">
                  <FileUpIcon />
                  <strong>{resumeName || (profile.resume ? 'Replace resume' : 'Drag & drop your resume')}</strong>
                  or <a>Browse file</a>
                  <br />
                  PDF, DOC, DOCX (Max. 5MB)
                  <input
                    id="p-resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={(e) => handleUpload(e, 'resume')}
                  />
                </label>
              </div>
            </div>
          </section>

          <section className="psection">
            <SectionHead icon="/assets/figma/icon-contact.png" title="Contact" />
            <div className="auth-row auth-row--triple">
              {field('pc-phone', 'Phone Number', 'phone', { type: 'tel' })}
              {field('pc-whatsapp', 'WhatsApp', 'whatsapp', { type: 'tel' })}
              {field('pc-email', 'Email', 'email', { type: 'email' })}
            </div>
            {field('pc-address', 'Address', 'address')}
          </section>

          {aboutSections.map((s) => (
            <section key={s.key as string} className="psection">
              <SectionHead icon={s.icon} title={s.title} />
              {field(`p-${s.key as string}`, 'Tell About You', s.key)}
            </section>
          ))}

          <div className="profile-foot">
            <button type="button" className="btn btn--cream" onClick={() => window.location.reload()}>
              Cancel
            </button>
            <button type="submit" className="btn btn--navy" disabled={saving}>
              {saving ? 'Saving…' : saved ? 'Saved ✓' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </main>
  )
}
