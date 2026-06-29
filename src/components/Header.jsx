import { useEffect, useState } from 'react'
import { IS_DEMO } from '../lib/repository'
import Icon from './Icons'

const NAV_ITEMS = [
  { key: 'map', label: 'Mapa', icon: 'map' },
  { key: 'directory', label: 'Puntos de ayuda', icon: 'list' },
  { key: 'donate', label: 'Donar', icon: 'heart' },
  { key: 'updates', label: 'Actualizaciones', icon: 'bell' },
  { key: 'report', label: 'Reportar', icon: 'plus' },
  { key: 'about', label: 'Acerca de', icon: 'info' },
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
        <button className="nav__brand" onClick={() => go('map')} aria-label="Inicio">
          <span className="nav__logo">
            <span className="nav__logo-bar nav__logo-bar--y" />
            <span className="nav__logo-bar nav__logo-bar--b" />
            <span className="nav__logo-bar nav__logo-bar--r" />
          </span>
          <span className="nav__brand-text">
            <span className="nav__title">Mapa de Ayuda</span>
            <span className="nav__subtitle">Coordinación humanitaria · Venezuela</span>
          </span>
        </button>

        <nav className="nav__links" aria-label="Navegación principal">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.key}
              className={'nav__link' + (view === item.key ? ' nav__link--active' : '')}
              onClick={() => go(item.key)}
              aria-current={view === item.key ? 'page' : undefined}
            >
              <Icon name={item.icon} size={17} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="nav__actions">
          {IS_DEMO && (
            <span className="badge-demo" title="Sin backend configurado: los datos viven en este navegador.">
              DEMO
            </span>
          )}
          {session?.isAdmin ? (
            <div className="nav__admin">
              <button className="nav__btn" onClick={onAdminClick}>
                <Icon name="check" size={15} /> Revisar
              </button>
              {session.isSuper && (
                <button className="nav__btn" onClick={onManageAdmins}>
                  <Icon name="users" size={15} /> Equipo
                </button>
              )}
              <button className="nav__btn nav__btn--ghost" onClick={onSignOut}>
                Salir
              </button>
            </div>
          ) : (
            <button className="nav__btn nav__btn--ghost nav__admin-link" onClick={onAdminClick}>
              <Icon name="shield" size={15} /> Admin
            </button>
          )}

          <button
            className="nav__hamburger"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={menuOpen}
          >
            <Icon name={menuOpen ? 'close' : 'menu'} size={22} />
          </button>
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
              <span>{item.label}</span>
            </button>
          ))}
          <div className="nav__drawer-divider" />
          {session?.isAdmin ? (
            <>
              <button className="nav__drawer-link" onClick={() => { onAdminClick(); setMenuOpen(false) }}>
                <Icon name="check" size={18} /> <span>Revisar reportes</span>
              </button>
              {session.isSuper && (
                <button className="nav__drawer-link" onClick={() => { onManageAdmins(); setMenuOpen(false) }}>
                  <Icon name="users" size={18} /> <span>Administradores</span>
                </button>
              )}
              <button className="nav__drawer-link" onClick={() => { onSignOut(); setMenuOpen(false) }}>
                <span>Salir</span>
              </button>
            </>
          ) : (
            <button className="nav__drawer-link" onClick={() => { onAdminClick(); setMenuOpen(false) }}>
              <Icon name="shield" size={18} /> <span>Admin</span>
            </button>
          )}
        </div>
      )}
    </header>
  )
}
