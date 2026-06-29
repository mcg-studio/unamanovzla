import { useMemo } from 'react'
import { useI18n } from '../lib/i18n'
import { UPDATE_ICON, categoryColor, timeAgo } from '../lib/labels'
import Icon from './Icons'

export default function UpdatesPage({ updates, locations, onOpen }) {
  const { t, lang } = useI18n()
  const byId = useMemo(() => Object.fromEntries(locations.map((l) => [l.id, l])), [locations])

  return (
    <div className="page page--narrow">
      <div className="page-head">
        <h1>{t('updates.title')}</h1>
        <p>{t('updates.subtitle')}</p>
      </div>

      {(!updates || updates.length === 0) ? (
        <div className="empty-state">
          <Icon name="bell" />
          <p>{t('updates.empty')}</p>
        </div>
      ) : (
        <div className="timeline">
          {updates.map((u) => {
            const loc = byId[u.location_id]
            const kind = u.kind || 'estado'
            return (
              <div className="tl-item" key={u.id}>
                <span className="tl-dot" style={{ background: categoryColor(loc?.category) }}>
                  <Icon name={UPDATE_ICON[kind] || 'info'} />
                </span>
                <div className="tl-body">
                  <div className="tl-head">
                    <span className="tl-type">{t('update.' + kind)}</span>
                    {loc && (
                      <button className="tl-time" style={{ border: 'none', background: 'none', cursor: 'pointer', color: 'var(--primary-700)', fontWeight: 600 }} onClick={() => onOpen(loc)}>
                        {t('updates.from')} {loc.name}
                      </button>
                    )}
                    <span className="tl-time">· {timeAgo(u.created_at, lang)}</span>
                  </div>
                  {u.body && <p className="tl-text">{u.body}</p>}
                  {u.photo_url && <img className="tl-photo" src={u.photo_url} alt="" loading="lazy" />}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
