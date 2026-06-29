import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { COMMON_NEEDS } from '../data/constants'
import { matchDonations, parseDonationItems } from '../lib/search'
import LocationCard from './LocationCard'
import Icon from './Icons'

export default function DonatePage({ locations, onOpen }) {
  const { t } = useI18n()
  const [text, setText] = useState('')
  const [submitted, setSubmitted] = useState('')

  const items = useMemo(() => parseDonationItems(submitted), [submitted])
  const matches = useMemo(() => (items.length ? matchDonations(locations, items) : []), [locations, items])

  const bloodCenters = useMemo(() => locations.filter((l) => l.blood_needed), [locations])

  function run(e) {
    e?.preventDefault()
    setSubmitted(text)
  }

  function quick(term) {
    const next = text ? `${text}, ${term}` : term
    setText(next)
    setSubmitted(next)
  }

  return (
    <div className="page page--wide">
      <div className="page-head">
        <h1>{t('donate.title')}</h1>
        <p>{t('donate.subtitle')}</p>
      </div>

      <form className="card card--pad" onSubmit={run}>
        <div className="field" style={{ marginBottom: 12 }}>
          <label htmlFor="donate-input">{t('donate.title')}</label>
          <textarea
            id="donate-input"
            className="textarea"
            value={text}
            placeholder={t('donate.placeholder')}
            onChange={(e) => setText(e.target.value)}
          />
        </div>
        <div className="chip-row" style={{ marginBottom: 16 }}>
          {COMMON_NEEDS.slice(0, 8).map((n) => (
            <button type="button" key={n} className="chip" onClick={() => quick(n)}>{n}</button>
          ))}
        </div>
        <button className="btn btn--primary" type="submit">
          <Icon name="search" />
          {t('donate.match')}
        </button>
      </form>

      {submitted && (
        <div style={{ marginTop: 28 }}>
          <h2 className="section-title">{t('donate.matches')}</h2>
          {matches.length === 0 ? (
            <div className="empty-state">
              <Icon name="box" />
              <p>{t('donate.noMatches')}</p>
            </div>
          ) : (
            <div className="grid">
              {matches.map(({ location, matched }) => (
                <LocationCard key={location.id} location={location} onOpen={onOpen} matched={matched} />
              ))}
            </div>
          )}
        </div>
      )}

      {bloodCenters.length > 0 && (
        <div style={{ marginTop: 32 }}>
          <h2 className="section-title" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Icon name="droplet" /> {t('donate.bloodTitle')}
          </h2>
          <p className="muted" style={{ marginBottom: 12, fontSize: '0.9rem' }}>{t('donate.bloodSubtitle')}</p>
          <div className="grid">
            {bloodCenters.map((l) => (
              <LocationCard key={l.id} location={l} onOpen={onOpen} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
