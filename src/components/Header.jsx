import { useEffect, useState } from 'react'
import { IS_DEMO } from '../lib/repository'
import { useI18n } from '../lib/i18n'
import Icon from './Icons'

const NAV_ITEMS = [
  { key: 'map', tkey: 'nav.map', icon: 'map' },
  { key: 'directory', tkey: 'nav.directory', icon: 'list' },
  { key: 'donate', tkey: 'nav.donate', icon: 'heart' },
  { key: 'updates', tkey: 'nav.updates', icon: 'bell' },
  { key: 'report', tkey: 'nav.report', icon: 'plus' },
  { key: 'about', tkey: 'nav.about', icon: 'info' },
]

export default function Header({
  view,
  onNavigate,
  session,
  onAdminClick,
  onSignOut,
  onManageAdmins,
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const { t, lang, toggle } = useI18n()

  // Cierra el menu movil al cambiar de vista.
  useEffect(() => {
    setMenuOpen(false)
  }, [view])

  function go(key) {
    onNavigate(key)
    setMenuOpen(false)
  }

  return (
    <header className="nav">
      <div className="nav__inner">
        <button
          className="nav__hamburger"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label={menuOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          aria-expanded={menuOpen}
        >
          <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
        </button>

        <button className="nav__brand" onClick={() => go('map')} aria-label={t('nav.home')}>
          <span className="nav__logo">
            <span className="nav__logo-bar nav__logo-bar--y" />
            <span className="nav__logo-bar nav__logo-bar--b" />
            <span className="nav__logo-bar nav__logo-bar--r" />
          </span>
          <span className="nav__brand-text">
            <span className="nav__title">Una Mano</span>
            <span className="nav__subtitle">{t('nav.subtitle')}</span>
          </span>
        </button>

        <nav className="nav__links" aria-label={t('nav.mainNav')}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={'nav__link' + (view === item.key ? ' nav__link--active' : '')}
              onClick={() => go(item.key)}
              aria-current={view === item.key ? 'page' : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span>{t(item.tkey)}</span>
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          {IS_DEMO && (
            <span className="badge-demo" title="Sin backend configurado: los datos viven en este navegador.">
              DEMO
            </span>
          )}
          <button
            className="nav__lang"
            onClick={toggle}
            aria-label={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
            title={lang === 'es' ? 'Switch to English' : 'Cambiar a Español'}
          >
            <Icon name="globe" size={15} />
            <span>{lang === 'es' ? 'EN' : 'ES'}</span>
          </button>
          {session?.isAdmin ? (
            <div className="nav__admin">
              <button className="nav__btn" onClick={onAdminClick}>
                <Icon name="check" size={15} /> {t('nav.review')}
              </button>
              {session.isSuper && (
                <button className="nav__btn" onClick={onManageAdmins}>
                  <Icon name="users" size={15} /> {t('nav.team')}
                </button>
              )}
              <button className="nav__btn nav__btn--ghost" onClick={onSignOut}>
                {t('nav.signout')}
              </button>
            </div>
          ) : (
            <button className="nav__btn nav__btn--ghost nav__admin-link" onClick={onAdminClick}>
              <Icon name="shield" size={15} /> {t('nav.admin')}
            </button>
          )}
        </div>
      </div>

      {menuOpen && (
        <div className="nav__drawer">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={'nav__drawer-link' + (view === item.key ? ' nav__drawer-link--active' : '')}
              onClick={() => go(item.key)}
            >
              <Icon name={item.icon} size={18} />
              <span>{t(item.tkey)}</span>
            </button>
          ))}
          <div className="nav__drawer-divider" />
          {session?.isAdmin ? (
            <>
              <button className="nav__drawer-link" onClick={() => { onAdminClick(); setMenuOpen(false) }}>
                <Icon name="check" size={18} /> <span>{t('nav.reviewReports')}</span>
              </button>
              {session.isSuper && (
                <button className="nav__drawer-link" onClick={() => { onManageAdmins(); setMenuOpen(false) }}>
                  <Icon name="users" size={18} /> <span>{t('nav.admins')}</span>
                </button>
              )}
              <button className="nav__drawer-link" onClick={() => { onSignOut(); setMenuOpen(false) }}>
                <span>{t('nav.signout')}</span>
              </button>
            </>
          ) : (
            <button className="nav__drawer-link" onClick={() => { onAdminClick(); setMenuOpen(false) }}>
              <Icon name="shield" size={18} /> <span>{t('nav.admin')}</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
