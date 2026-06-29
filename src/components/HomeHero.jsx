import { useMemo, useState } from 'react'
import Icon from './Icons'
import { useI18n } from '../lib/i18n'

const WEEK = 7 * 24 * 60 * 60 * 1000

function computeStats(locations) {
  const now = Date.now()
  let registered = locations.length
  let verified = 0
  let recent = 0
  let active = 0
  for (const l of locations) {
    if (l.verification === 'verificado') verified += 1
    if (l.updated_at && now - new Date(l.updated_at).getTime() <= WEEK) recent += 1
    if (l.status_level && l.status_level !== 'sin_datos') active += 1
  }
  return { registered, verified, recent, active }
}

export default function HomeHero({ locations = [], onExplore, onReport }) {
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useI18n()
  const stats = useMemo(() => computeStats(locations), [locations])

  const CARDS = [
    { key: 'registered', label: t('hero.stat.points'), value: stats.registered, icon: 'pin' },
    { key: 'verified', label: t('hero.stat.verified'), value: stats.verified, icon: 'check' },
    { key: 'recent', label: t('hero.stat.recent'), value: stats.recent, icon: 'clock' },
    { key: 'active', label: t('hero.stat.active'), value: stats.active, icon: 'heart' },
  ]

  return (
    <section className={'hero' + (collapsed ? ' hero--collapsed' : '')}>
      <div className="hero__main">
        <div className="hero__text">
          <span className="hero__flag" aria-hidden><span /><span /><span /></span>
          <h1 className="hero__title">{t('hero.title')}</h1>
          {!collapsed && (
            <p className="hero__subtitle">{t('hero.subtitle')}</p>
          )}
          {!collapsed && (
            <div className="hero__actions">
              <button className="hero__btn hero__btn--primary" onClick={onExplore}>
                <Icon name="map" size={17} /> {t('hero.explore')}
              </button>
              <button className="hero__btn" onClick={onReport}>
                <Icon name="plus" size={17} /> {t('hero.report')}
              </button>
            </div>
          )}
        </div>
        <button
          className="hero__toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? t('common.back') : t('common.close')}
        >
          {collapsed ? '+' : '–'}
        </button>
      </div>

      <div className="hero__stats">
        {CARDS.map((c) => (
          <div key={c.key} className="stat">
            <span className="stat__icon"><Icon name={c.icon} size={18} /></span>
            <div className="stat__body">
              <span className="stat__value">{c.value}</span>
              <span className="stat__label">{c.label}</span>
            </div>
          </div>
        ))}
      </div>

      <p className="hero__note">
        <Icon name="info" size={15} />
        <span>{t('hero.note')}</span>
      </p>
    </section>
  )
}
