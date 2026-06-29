import { useState } from 'react'
import { useI18n } from '../lib/i18n'
import Icon from './Icons'

const NAV_ITEMS = [
  { key: 'map', icon: 'map', label: 'nav.map' },
  { key: 'directory', icon: 'list', label: 'nav.directory' },
  { key: 'donate', icon: 'heart', label: 'nav.donate' },
  { key: 'updates', icon: 'bell', label: 'nav.updates' },
]

export default function Navbar({ route, onNavigate, onReport, onAdmin, adminPending }) {
  const { t, toggle, lang } = useI18n()
  const [open, setOpen] = useState(false)

  function go(key) {
    onNavigate(key)
    setOpen(false)
  }

  const current = route?.name

  return (
    <nav className="nav">
      <div className="nav__inner">
        <button className="brand" onClick={() => go('map')} aria-label={t('app.title')}>
          <span className="brand__mark">
            <Icon name="lifebuoy" />
          </span>
          <span className="brand__text">
            <span className="brand__title">{t('app.title')}</span>
            <span className="brand__sub">{t('app.region')}</span>
          </span>
        </button>

        <div className="nav__links">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={'nav__link' + (current === item.key ? ' nav__link--active' : '')}
              onClick={() => go(item.key)}
            >
              <Icon name={item.icon} />
              {t(item.label)}
            </button>
          ))}
        </div>

        <span className="nav__spacer" />

        <div className="nav__actions">
          <button className="btn btn--primary btn--sm" onClick={onReport}>
            <Icon name="plus" />
            {t('nav.report')}
          </button>
          <button className="lang-toggle" onClick={toggle} aria-label={t('lang.toggle')}>
            <Icon name="language" />
            <span className="lang-toggle__full">{lang === 'es' ? 'EN' : 'ES'}</span>
          </button>
          <button
            className="icon-btn"
            onClick={onAdmin}
            aria-label={t('nav.admin')}
            title={t('nav.admin')}
            style={adminPending ? { borderColor: 'var(--warning)' } : undefined}
          >
            <Icon name="shield" />
          </button>
          <button className="nav__burger" onClick={() => setOpen((o) => !o)} aria-label={t('nav.menu')} aria-expanded={open}>
            <Icon name={open ? 'close' : 'menu'} />
          </button>
        </div>
      </div>

      <div className={'nav__mobile' + (open ? ' open' : '')}>
        {NAV_ITEMS.map((item) => (
          <button
            key={item.key}
            className={'nav__link' + (current === item.key ? ' nav__link--active' : '')}
            onClick={() => go(item.key)}
          >
            <Icon name={item.icon} />
            {t(item.label)}
          </button>
        ))}
        <button className="nav__link" onClick={() => { onReport(); setOpen(false) }}>
          <Icon name="plus" />
          {t('nav.report')}
        </button>
      </div>
    </nav>
  )
}
