import { useCallback, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { ArrowRightIcon, PinIcon, StarIcon } from '../components/icons'
import { searchProfiles, type Profile } from '../services/api'

const TITLES: Record<string, string> = {
  vendor: 'Infrastructure & Services',
  counseller: 'Counsellors',
  candidate: 'Candidates',
  institute: 'Recruiters & Institutes',
}

const PREF_LABELS: Record<string, string> = {
  financialLoanServices: 'Financial Loan Services',
  smartTechnology: 'Smart Technology',
  integratedCurriculum: 'Integrated Curriculum',
  teacherTraining: 'Teacher Training',
  academicAuditForSchoolsCollegesUniversitiesPrivateInstitutions: 'Academic Audit',
  websiteDevelopment: 'Website Development',
  artificialIntelligence: 'Artificial Intelligence',
  career: 'Career',
  psychologist: 'Psychologist',
  schoolOrCollegeCounsellors: 'School/College Counsellors',
}

/**
 * Generic profile search page — covers the live site's
 * /infrastructure-search/:preference (vendors),
 * /career-counselling/:preference (counsellors) and /candidate pages.
 */
export default function SearchPage({ userType }: { userType: string }) {
  const { preference } = useParams()
  const [results, setResults] = useState<Profile[]>([])
  const [city, setCity] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const runSearch = useCallback(async () => {
    setLoading(true)
    setError('')
    try {
      const body: Record<string, unknown> = { userType }
      if (preference) body.preference = preference
      const resp = await searchProfiles(body)
      setResults(resp.data ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Search failed.')
    } finally {
      setLoading(false)
    }
  }, [userType, preference])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag for async fetch
    runSearch()
  }, [runSearch])

  const visible = city
    ? results.filter((r) => String(r.city ?? '').toLowerCase().includes(city.toLowerCase()))
    : results

  const title = TITLES[userType] ?? 'Search'
  const prefLabel = preference ? PREF_LABELS[preference] ?? preference : null

  return (
    <main className="search-page">
      <section className="search-hero">
        <div className="page-wrap">
          <h1 className="section-heading section-heading--left">
            {title}
            {prefLabel && <span className="search-hero__pref"> — {prefLabel}</span>}
          </h1>
          <div className="search-filter">
            <div className="ainput search-filter__input">
              <PinIcon size={17} />
              <input
                type="text"
                placeholder="Filter by city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                aria-label="Filter by city"
              />
            </div>
            {city && (
              <button type="button" className="btn btn--cream" onClick={() => setCity('')}>
                Clear filter
              </button>
            )}
          </div>
        </div>
      </section>

      <section className="page-wrap search-results">
        {loading ? (
          <p className="search-empty">Searching…</p>
        ) : error ? (
          <p className="search-empty">{error}</p>
        ) : visible.length === 0 ? (
          <div className="search-empty">
            <h3>For enquiries / services connect with us</h3>
            <Link to="/contact-us" className="btn btn--gold" style={{ marginTop: 18 }}>
              Get In Touch <ArrowRightIcon />
            </Link>
          </div>
        ) : (
          <div className="result-list">
            {visible.map((r, i) => (
              <article key={String(r._id ?? i)} className="result-card">
                <img
                  className="result-card__photo"
                  src={r.url || '/assets/onlyImageLogo.png'}
                  alt={`${r.firstName ?? ''} ${r.lastName ?? ''}`}
                />
                <div className="result-card__body">
                  <div className="result-card__head">
                    <h3>{[r.firstName, r.lastName].filter(Boolean).join(' ') || 'Eduwizer Member'}</h3>
                    {Boolean(r.sponsored) && <span className="result-card__tag"><StarIcon /> Sponsored</span>}
                  </div>
                  {typeof r.aboutMe === 'string' && r.aboutMe && (
                    <p className="result-card__desc">{r.aboutMe}</p>
                  )}
                  <div className="result-card__meta">
                    {r.city ? <span><PinIcon size={15} /> {String(r.city)}</span> : null}
                    {r.preference ? <span>Preference: {PREF_LABELS[String(r.preference)] ?? String(r.preference)}</span> : null}
                  </div>
                  <div className="result-card__actions">
                    <Link to="/contact-us" className="btn btn--gold">Contact Now</Link>
                    <a className="btn btn--cream" href="mailto:support@eduwizer.com?subject=Enquiry via Eduwizer">
                      Email Us
                    </a>
                    <a className="btn btn--cream" href="tel:+919167780061">Call Us</a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
