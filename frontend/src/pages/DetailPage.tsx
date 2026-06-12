import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { ArrowRightIcon, ClockIcon } from '../components/icons'
import { getBlogById, getEventById, type BlogItem } from '../services/api'
import Seo, { SITE_NAME } from '../components/Seo'

/** Trim HTML/markup to a plain-text meta description (~160 chars). */
const toMetaDescription = (text = '', fallback = '') => {
  const clean = text.replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim()
  if (!clean) return fallback
  return clean.length > 160 ? `${clean.slice(0, 157)}…` : clean
}

const fmtDate = (ts?: string) =>
  ts
    ? new Date(ts).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    : ''

/** Shared detail page for /events-details/:id and /blogs-details/:id. */
export default function DetailPage({ kind }: { kind: 'event' | 'blog' }) {
  const { id } = useParams()
  const [item, setItem] = useState<BlogItem | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    const fetcher = kind === 'event' ? getEventById : getBlogById
    fetcher(id)
      .then((r) => setItem((r.data ?? [])[0] ?? null))
      .catch(() => setItem(null))
      .finally(() => setLoading(false))
  }, [id, kind])

  if (loading) {
    return (
      <main className="detail-page page-wrap">
        <p className="search-empty">Loading…</p>
      </main>
    )
  }

  if (!item) {
    return (
      <main className="detail-page page-wrap">
        <div className="search-empty">
          <h3>{kind === 'event' ? 'Event' : 'Blog'} not found.</h3>
          <Link to="/events-blogs" className="btn btn--gold" style={{ marginTop: 18 }}>
            Back to Events &amp; Blogs <ArrowRightIcon />
          </Link>
        </div>
      </main>
    )
  }

  const metaDescription = toMetaDescription(
    item.description || item.data,
    `${item.title} — ${kind === 'event' ? 'event' : 'article'} from ${SITE_NAME}.`,
  )
  const seoPath = `/${kind === 'event' ? 'events-details' : 'blogs-details'}/${id}`
  const jsonLd =
    kind === 'blog'
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          headline: item.title,
          description: metaDescription,
          image: item.image,
          author: item.author ? { '@type': 'Person', name: item.author } : undefined,
          datePublished: item.createdTimestamp,
          publisher: { '@type': 'Organization', name: SITE_NAME },
        }
      : {
          '@context': 'https://schema.org',
          '@type': 'Event',
          name: item.title,
          description: metaDescription,
          image: item.image,
          startDate: item.createdTimestamp,
          organizer: { '@type': 'Organization', name: SITE_NAME },
        }

  return (
    <main className="detail-page">
      <Seo
        title={item.title}
        description={metaDescription}
        path={seoPath}
        pageKey={`${kind}:${id}`}
        type="article"
        image={item.image || undefined}
        jsonLd={jsonLd}
      />
      <div className="page-wrap detail-article">
        <span className="eyebrow">{kind === 'event' ? 'Event' : 'Blog'}</span>
        <h1 className="detail-title">{item.title}</h1>
        <div className="detail-meta">
          {item.author && <strong>By {item.author}</strong>}
          {item.createdTimestamp && (
            <span><ClockIcon /> {fmtDate(item.createdTimestamp)}</span>
          )}
        </div>
        {item.image && <img className="detail-image" src={item.image} alt={item.title} />}
        {item.description && <p className="detail-lede">{item.description}</p>}
        {item.data && (
          /* `data` is rich-text HTML from the admin panel — sanitized to block stored XSS */
          <div
            className="detail-body"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(item.data) }}
          />
        )}
        <Link to="/events-blogs" className="btn btn--cream" style={{ marginTop: 34 }}>
          ← Back to Events &amp; Blogs
        </Link>
      </div>
    </main>
  )
}
