import { Helmet } from 'react-helmet-async'
import { useSeoOverride } from '../seo/SeoContext'

const SITE_NAME = 'NG Eduwizer'
const SITE_URL = (import.meta.env.VITE_SITE_URL as string | undefined) ?? 'https://eduwizer.com'
const DEFAULT_IMAGE = `${SITE_URL}/assets/logo-full.png`

export interface SeoProps {
  title: string
  description: string
  /** Path part of the canonical URL, e.g. "/about-us". */
  path?: string
  image?: string
  /** "website" (default) or "article" for blogs/events. */
  type?: 'website' | 'article'
  /** Optional JSON-LD structured data object(s). */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[]
  /** Set true on auth/search pages we don't want indexed. */
  noIndex?: boolean
  /** Admin-override key ("home", "about-us", "blog:<id>", "event:<id>"). */
  pageKey?: string
}

/**
 * Per-page SEO: unique <title>, meta description, canonical URL, Open Graph +
 * Twitter cards, and optional JSON-LD. Drop one <Seo .../> at the top of a page.
 */
export default function Seo({
  title,
  description,
  path = '',
  image = DEFAULT_IMAGE,
  type = 'website',
  jsonLd,
  noIndex = false,
  pageKey,
}: SeoProps) {
  // Admin overrides (if set) win over the page's built-in defaults.
  const override = useSeoOverride(pageKey)
  const finalTitle = override?.title || title
  const finalDescription = override?.description || description
  const finalImage = override?.ogImage || image

  const fullTitle = `${finalTitle} | ${SITE_NAME}`
  const canonical = `${SITE_URL}${path}`
  const blocks = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : []

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={finalDescription} />
      <link rel="canonical" href={canonical} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:type" content={type} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={finalImage} />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={finalDescription} />
      <meta name="twitter:image" content={finalImage} />

      {blocks.map((block, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(block)}
        </script>
      ))}
    </Helmet>
  )
}

export { SITE_URL, SITE_NAME }
