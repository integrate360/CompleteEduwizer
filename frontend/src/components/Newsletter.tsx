import { useState, type FormEvent } from 'react'
import { subscribe } from '../services/api'

function useSubscribe() {
  const [email, setEmail] = useState('')
  const [done, setDone] = useState(false)

  function submit(e: FormEvent) {
    e.preventDefault()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return
    // optimistic UI — the legacy app did not surface subscribe failures either
    subscribe(email).catch(() => {})
    setDone(true)
    setEmail('')
  }
  return { email, setEmail, done, submit }
}

/** Dark gradient newsletter card — home / events / about. */
export function NewsletterDark() {
  const { email, setEmail, done, submit } = useSubscribe()
  return (
    <section className="newsletter-dark">
      <div className="page-wrap">
        <div className="newsletter-dark__card">
          <div>
            <h2 className="newsletter-dark__title">Subscribe To Our Newsletter</h2>
            <p className="newsletter-dark__sub">
              If you want to receive new offers and notifications from us
            </p>
          </div>
          <form className="newsletter-form" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder={done ? 'Subscribed — thank you!' : 'Enter your email address'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn--gold btn--pill">Subscribe Now</button>
          </form>
        </div>
      </div>
    </section>
  )
}

/** Light pastel newsletter band — contact / profile. */
export function NewsletterLight() {
  const { email, setEmail, done, submit } = useSubscribe()
  return (
    <section className="newsletter-light">
      <div className="page-wrap">
        <div className="newsletter-light__card">
          <img src="/assets/figma/newsletter-envelope.png" alt="" />
          <div>
            <h2 className="newsletter-light__title">Subscribe To Our Newsletter</h2>
            <p className="newsletter-light__sub">
              If you want to receive new offers and notifications from us.
            </p>
          </div>
          <form className="newsletter-form newsletter-form--light" onSubmit={submit}>
            <input
              type="email"
              required
              placeholder={done ? 'Subscribed — thank you!' : 'Enter your email address'}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              aria-label="Email address"
            />
            <button type="submit" className="btn btn--gold btn--pill">Subscribe Now</button>
          </form>
        </div>
      </div>
    </section>
  )
}
