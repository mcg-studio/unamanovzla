import { useMemo, useState } from 'react'
import Icon from './Icons'
import { useI18n } from '../lib/i18n'

function computeStats(locations) {
  let registered = locations.length
  let verified = 0
  let active = 0
  let critical = 0
  for (const l of locations) {
    if (l.verification === 'verificado' || l.updated_at) verified += 1
    if (l.status_level && l.status_level !== 'sin_datos') active += 1
    if (l.status_level === 'critico') critical += 1
  }
  return { registered, verified, active, critical }
}

export default function HomeHero({ locations = [], onExplore, onReport }) {
  const [collapsed, setCollapsed] = useState(false)
  const { t } = useI18n()
  const stats = useMemo(() => computeStats(locations), [locations])

  const CARDS = [
    { key: 'registered', label: t('hero.stat.points'), value: stats.registered, icon: 'pin' },
    { key: 'verified', label: t('hero.stat.verified'), value: stats.verified, icon: 'check' },
    { key: 'recent', label: t('hero.stat.help'), value: stats.active, icon: 'heart' },
    { key: 'active', label: t('hero.stat.critical'), value: stats.critical, icon: 'clock' },
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
    </section>
  )
}
