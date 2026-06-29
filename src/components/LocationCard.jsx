import { useI18n } from '../lib/i18n'
import { categoryColor, timeAgo } from '../lib/labels'
import { CategoryBadge, VerificationBadge } from './Badges'
import Icon from './Icons'

export default function LocationCard({ location, onOpen, matched }) {
  const { t, lang } = useI18n()
  const needs = Array.isArray(location.needs) ? location.needs : []
  const resources = Array.isArray(location.resources) ? location.resources : []
  const ago = timeAgo(location.updated_at, lang)

  return (
    <button className="loc-card" onClick={() => onOpen(location)}>
      <span className="loc-card__accent" style={{ background: categoryColor(location.category) }} />
      <span className="loc-card__body">
        <span className="loc-card__top">
          <span className="loc-card__title">{location.name}</span>
          <VerificationBadge verification={location.verification} withText={false} />
        </span>
        <span className="loc-card__meta">
          <CategoryBadge category={location.category} />
          {location.state && (
            <span className="loc-card__where">
              <Icon name="pin" />
              {location.municipio ? `${location.municipio}, ${location.state}` : location.state}
            </span>
          )}
        </span>

        {location.summary ? <span className="loc-card__summary">{location.summary}</span> : null}

        {matched && matched.length > 0 && (
          <span className="loc-card__tags">
            {matched.map((m) => (
              <span key={m} className="tag tag--need">{m}</span>
            ))}
          </span>
        )}

        {!matched && needs.length > 0 && (
          <span className="loc-card__tags">
            {needs.slice(0, 3).map((n) => (
              <span key={n} className="tag tag--need">{n}</span>
            ))}
            {needs.length > 3 && <span className="tag">+{needs.length - 3}</span>}
          </span>
        )}

        {!matched && needs.length === 0 && resources.length > 0 && (
          <span className="loc-card__tags">
            {resources.slice(0, 3).map((r) => (
              <span key={r} className="tag tag--resource">{r}</span>
            ))}
            {resources.length > 3 && <span className="tag">+{resources.length - 3}</span>}
          </span>
        )}

        <span className="loc-card__foot">
          <span className="loc-card__time">{ago ? `${t('common.updated')} ${ago}` : t('common.never')}</span>
          <span className="loc-card__where" style={{ color: 'var(--primary-700)', fontWeight: 600 }}>
            {t('common.viewProfile')}
            <Icon name="chevronRight" />
          </span>
        </span>
      </span>
    </button>
  )
}
