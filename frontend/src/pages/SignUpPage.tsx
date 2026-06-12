import { useRef, useState, type FormEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRightIcon,
  BriefcaseIcon,
  CalendarIcon,
  CameraIcon,
  EyeIcon,
  FileUpIcon,
  LockIcon,
  MailIcon,
  StarIcon,
  UserIcon,
} from '../components/icons'
import AuthDecor from '../components/AuthDecor'
import { sendOtp, signup, uploadFile, verifyOtp } from '../services/api'

/* Backend expects numbers for age/experience — labels stay as designed. */
const ageOptions = [
  { label: '18 – 24', value: 21 },
  { label: '25 – 34', value: 30 },
  { label: '35 – 44', value: 40 },
  { label: '45 – 54', value: 50 },
  { label: '55+', value: 58 },
]
const experienceOptions = [
  { label: 'Fresher', value: 0 },
  { label: '1 – 3 years', value: 2 },
  { label: '3 – 5 years', value: 4 },
  { label: '5 – 10 years', value: 7 },
  { label: '10+ years', value: 12 },
]
const countryOptions = ['India', 'UAE', 'Canada', 'Singapore', 'United Kingdom']
const stateOptions = ['Maharashtra', 'Tamil Nadu', 'Karnataka', 'Delhi', 'Gujarat']
const cityOptions = ['Mumbai', 'Chennai', 'Bengaluru', 'New Delhi', 'Ahmedabad']

/* Backend Joi enum for board */
const boardOptions = [
  { label: 'ICSE', value: 'icse' },
  { label: 'CBSE', value: 'cbse' },
  { label: 'IGSE', value: 'igse' },
  { label: 'State Board', value: 'state board' },
  { label: 'IB', value: 'ib' },
]

/* Preference options per user type — mirrors the live site */
const PREFERENCES: Record<string, { label: string; options: { label: string; value: string }[] }> = {
  default: {
    label: 'Preferred Category',
    options: [
      { label: 'School', value: 'school' },
      { label: 'College', value: 'college' },
      { label: 'University', value: 'university' },
      { label: 'Private Institutions', value: 'privateInstitutions' },
    ],
  },
  vendor: {
    label: 'Sector/Industry',
    options: [
      { label: 'Financial loan services', value: 'financialLoanServices' },
      { label: 'Smart Technology', value: 'smartTechnology' },
      { label: 'Integrated Curriculum', value: 'integratedCurriculum' },
      { label: 'Teacher Training', value: 'teacherTraining' },
      { label: 'Academic Audit for Schools, Colleges, Universities, Private Institutions', value: 'academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions' },
      { label: 'Website Development', value: 'websiteDevelopment' },
      { label: 'Artificial Intelligence', value: 'artificialIntelligence' },
    ],
  },
  counseller: {
    label: 'Counseller Type',
    options: [
      { label: 'Career', value: 'career' },
      { label: 'Psychologist', value: 'psychologist' },
      { label: 'School/College Counsellors', value: 'schoolOrCollegeCounsellors' },
    ],
  },
}

/** Route param → backend userType (recruiter is stored as institute). */
const USER_TYPES: Record<string, string> = {
  candidate: 'candidate',
  recruiter: 'institute',
  institute: 'institute',
  counseller: 'counseller',
  vendor: 'vendor',
  student: 'student',
  school: 'institute',
}

/* Which optional fields each user type gets — mirrors the live site */
const TYPE_FIELDS: Record<string, { age: boolean; experience: boolean; board: boolean }> = {
  candidate: { age: true, experience: true, board: true },
  counseller: { age: true, experience: true, board: true },
  student: { age: true, experience: false, board: false },
  vendor: { age: false, experience: false, board: true },
  institute: { age: false, experience: false, board: true },
}

const TYPE_LABELS: Record<string, string> = {
  candidate: 'Candidate',
  counseller: 'Counseller',
  vendor: 'Vendor',
  institute: 'Recruiter',
  student: 'Student',
}

function SelectField({
  id, label, icon, placeholder, options,
}: {
  id: string
  label: string
  icon: React.ReactNode
  placeholder: string
  options: { label: string; value: string | number }[]
}) {
  return (
    <div className="afield">
      <label htmlFor={id}>{label} <em>*</em></label>
      <div className="ainput">
        {icon}
        <select id={id} name={id} required defaultValue="">
          <option value="" disabled>{placeholder}</option>
          {options.map((o) => (
            <option key={o.label} value={o.value}>{o.label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState<{ url: string; name: string; fileType: string } | null>(null)
  const [resume, setResume] = useState<{ url: string; name: string; fileType: string } | null>(null)
  const [otpUserId, setOtpUserId] = useState<string | null>(null)
  const [otp, setOtp] = useState('')
  const [otpDone, setOtpDone] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)
  const navigate = useNavigate()
  const { type } = useParams()
  const userType = USER_TYPES[type ?? 'candidate'] ?? 'candidate'
  const fields = TYPE_FIELDS[userType] ?? TYPE_FIELDS.candidate
  const preference = PREFERENCES[userType] ?? PREFERENCES.default

  async function handleUpload(
    e: React.ChangeEvent<HTMLInputElement>,
    kind: 'photo' | 'resume',
  ) {
    const file = e.target.files?.[0]
    if (!file) return
    const maxBytes = kind === 'photo' ? 2 * 1024 * 1024 : 3 * 1024 * 1024
    if (file.size > maxBytes) {
      setError(`${kind === 'photo' ? 'Photo' : 'Resume'} exceeds the size limit.`)
      return
    }
    setError('')
    try {
      const url = await uploadFile(file)
      const meta = { url, name: file.name, fileType: file.type }
      if (kind === 'photo') setPhoto(meta)
      else setResume(meta)
    } catch {
      setError('File upload failed. Please try again.')
    }
  }

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) return
    if (!photo || !resume) {
      setError('Please upload both a profile photo and your resume.')
      return
    }
    const fd = new FormData(form)
    const email = String(fd.get('email') ?? '')
    setBusy(true)
    setError('')
    try {
      const body: Parameters<typeof signup>[0] = {
        firstName: String(fd.get('firstName') ?? ''),
        lastName: String(fd.get('lastName') ?? ''),
        userName: email.split('@')[0].replace(/[^a-zA-Z0-9_]/g, '').slice(0, 25),
        password: String(fd.get('password') ?? ''),
        email,
        phone: Number(String(fd.get('phone') ?? '').replace(/\D/g, '')),
        country: String(fd.get('su-country') ?? ''),
        state: String(fd.get('su-state') ?? ''),
        city: String(fd.get('su-city') ?? ''),
        preference: String(fd.get('su-category') ?? ''),
        url: photo.url,
        resume: resume.url,
        fileType: resume.fileType,
        userType,
      }
      if (fields.age) body.age = Number(fd.get('su-age'))
      if (fields.experience) body.experience = Number(fd.get('su-experience'))
      if (fields.board) body.board = String(fd.get('su-board') ?? '')
      const resp = await signup(body)
      const userId = resp.data?._id
      if (!userId) {
        setError(resp.message ?? 'Error while signing up')
        return
      }
      await sendOtp(userId)
      setOtpUserId(userId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  async function submitOtp(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!otpUserId || !otp) return
    setBusy(true)
    setError('')
    try {
      await verifyOtp(otpUserId, otp.trim())
      setOtpDone(true)
      setTimeout(() => navigate('/login'), 1600)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'OTP verification failed.')
    } finally {
      setBusy(false)
    }
  }

  /* ---------- OTP step ---------- */
  if (otpUserId) {
    return (
      <main className="auth-stage">
        <AuthDecor />
      <img className="auth-stage__plane" src="/assets/figma/contact-plane.png" alt="" />
        <div className="page-wrap">
          <section className="auth-card">
            <img className="auth-card__lock" src="/assets/figma/login-lock.png" alt="" />
            <h1>Verify Your Email</h1>
            <p className="auth-card__sub">
              We sent a one-time password to your email. Enter it below to activate your account.
            </p>
            {otpDone ? (
              <p style={{ textAlign: 'center', fontWeight: 600, color: '#1c7c44' }}>
                ✓ Verified! Redirecting you to login…
              </p>
            ) : (
              <form className="auth-form" onSubmit={submitOtp}>
                <div className="afield">
                  <label htmlFor="su-otp">One-Time Password</label>
                  <div className="ainput">
                    <LockIcon />
                    <input
                      id="su-otp"
                      name="otp"
                      type="text"
                      inputMode="numeric"
                      required
                      placeholder="Enter the OTP from your email"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                    />
                  </div>
                </div>
                {error && (
                  <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
                )}
                <button type="submit" className="btn btn--navy btn--block" disabled={busy}>
                  {busy ? 'Verifying…' : 'Verify OTP'} <ArrowRightIcon />
                </button>
                <p className="auth-card__foot">
                  Didn&apos;t get it?{' '}
                  <button
                    type="button"
                    className="auth-link auth-link--underline"
                    style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                    onClick={() => sendOtp(otpUserId).catch(() => {})}
                  >
                    Resend OTP
                  </button>
                </p>
              </form>
            )}
          </section>
        </div>
      </main>
    )
  }

  /* ---------- sign-up form ---------- */
  return (
    <main className="auth-stage">
      <AuthDecor />
      <img className="auth-stage__plane" src="/assets/figma/contact-plane.png" alt="" />
      <div className="page-wrap">
        <section className="auth-card auth-card--wide">
          <h1>Create Your Account</h1>
          <p className="auth-card__sub">
            Fill in your details to get started — signing up as{' '}
            <b>{TYPE_LABELS[userType] ?? 'Candidate'}</b>
          </p>
          <form className="auth-form" onSubmit={submit} ref={formRef}>
            <div className="auth-row">
              <div className="afield">
                <label htmlFor="su-first">First Name <em>*</em></label>
                <div className="ainput">
                  <UserIcon />
                  <input id="su-first" name="firstName" type="text" required placeholder="Enter first name" />
                </div>
              </div>
              <div className="afield">
                <label htmlFor="su-last">Last Name <em>*</em></label>
                <div className="ainput">
                  <UserIcon />
                  <input id="su-last" name="lastName" type="text" required placeholder="Enter last name" />
                </div>
              </div>
            </div>
            <div className="auth-row">
              <div className="afield">
                <label htmlFor="su-email">Email Address <em>*</em></label>
                <div className="ainput">
                  <MailIcon />
                  <input id="su-email" name="email" type="email" required placeholder="Enter email address" autoComplete="email" />
                </div>
              </div>
              <div className="afield">
                <label htmlFor="su-password">Password <em>*</em></label>
                <div className="ainput">
                  <LockIcon />
                  <input
                    id="su-password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    minLength={8}
                    maxLength={25}
                    placeholder="Create a strong password"
                    autoComplete="new-password"
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
            </div>
            <div className="auth-row">
              <div className="afield">
                <label htmlFor="su-phone">Phone Number <em>*</em></label>
                <div className="ainput ainput--phone">
                  <span className="ainput__cc">🇮🇳 +91</span>
                  <input
                    id="su-phone"
                    name="phone"
                    type="tel"
                    required
                    pattern="[0-9 ]{10,12}"
                    placeholder="Enter your number"
                    autoComplete="tel-national"
                  />
                </div>
              </div>
              {fields.age ? (
                <SelectField
                  id="su-age"
                  label="Age"
                  icon={<CalendarIcon />}
                  placeholder="Select your age"
                  options={ageOptions}
                />
              ) : (
                <SelectField
                  id="su-board"
                  label="Board"
                  icon={<StarIcon />}
                  placeholder="Select board"
                  options={boardOptions}
                />
              )}
            </div>
            <div className={fields.experience && fields.board ? 'auth-row auth-row--triple' : 'auth-row'}>
              {fields.experience && (
                <SelectField
                  id="su-experience"
                  label="Experience"
                  icon={<BriefcaseIcon />}
                  placeholder="Select experience"
                  options={experienceOptions}
                />
              )}
              <SelectField
                id="su-category"
                label={preference.label}
                icon={<StarIcon />}
                placeholder="Select your preference"
                options={preference.options}
              />
              {fields.board && fields.age && (
                <SelectField
                  id="su-board"
                  label="Board"
                  icon={<StarIcon />}
                  placeholder="Select board"
                  options={boardOptions}
                />
              )}
            </div>
            <div className="auth-row auth-row--triple">
              <SelectField
                id="su-country"
                label="Country"
                icon={<UserIcon />}
                placeholder="Select country"
                options={countryOptions.map((o) => ({ label: o, value: o }))}
              />
              <SelectField
                id="su-state"
                label="State"
                icon={<UserIcon />}
                placeholder="Select state"
                options={stateOptions.map((o) => ({ label: o, value: o }))}
              />
              <SelectField
                id="su-city"
                label="City"
                icon={<UserIcon />}
                placeholder="Select city"
                options={cityOptions.map((o) => ({ label: o, value: o }))}
              />
            </div>
            <div className="upload-row">
              <div className="afield">
                <label htmlFor="su-photo">Profile Photo <em>*</em></label>
                <label className="upload-tile" htmlFor="su-photo">
                  <CameraIcon />
                  <strong>{photo ? photo.name : 'Upload photo'}</strong>
                  JPG, PNG (Max. 2MB)
                  <input
                    id="su-photo"
                    name="photo"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    hidden
                    onChange={(e) => handleUpload(e, 'photo')}
                  />
                </label>
              </div>
              <div className="afield">
                <label htmlFor="su-resume">Upload Resume <em>*</em></label>
                <label className="upload-tile" htmlFor="su-resume">
                  <FileUpIcon />
                  <strong>{resume ? resume.name : 'Drag & drop your resume'}</strong>
                  or <a>Browse file</a>
                  <br />
                  PDF, DOC, DOCX (Max. 3MB)
                  <input
                    id="su-resume"
                    name="resume"
                    type="file"
                    accept=".pdf,.doc,.docx"
                    hidden
                    onChange={(e) => handleUpload(e, 'resume')}
                  />
                </label>
              </div>
            </div>
            <label className="auth-check" style={{ marginBottom: 26 }}>
              <input type="checkbox" name="terms" required /> I agree to the{' '}
              <Link to="/terms-conditions" className="auth-link">Terms &amp; Conditions</Link> and{' '}
              <Link to="/terms-conditions" className="auth-link">Privacy Policy</Link>
            </label>
            {error && (
              <p style={{ color: '#e0492c', fontSize: 14, margin: '0 0 14px' }}>{error}</p>
            )}
            <button type="submit" className="btn btn--navy btn--block" disabled={busy}>
              {busy ? 'Creating account…' : 'Create My Account'} <ArrowRightIcon />
            </button>
          </form>
          <p className="auth-card__foot">
            Already have an account?{' '}
            <Link to="/login" className="auth-link auth-link--underline">Login</Link>
          </p>
        </section>
      </div>
      <img
        className="auth-visual"
        src="/assets/figma/signup-rocket-boy.png"
        alt="Student flying on a pencil rocket"
      />
    </main>
  )
}
