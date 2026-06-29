import { useMemo, useState } from 'react'
import Icon from './Icons'

const DAY = 24 * 60 * 60 * 1000

function computeStats(locations) {
  const now = Date.now()
  let registered = locations.length
  let verified = 0
  let recent = 0
  let active = 0
  for (const l of locations) {
    const updated = l.updated_at ? new Date(l.updated_at).getTime() : 0
    if (updated) verified += 1
    if (updated && now - updated <= 7 * DAY) recent += 1
    if (l.status_level && l.status_level !== 'sin_datos') active += 1
  }
  return { registered, verified, recent, active }
}

export default function HomeHero({ locations = [], onExplore, onReport }) {
  const [collapsed, setCollapsed] = useState(false)
  const stats = useMemo(() => computeStats(locations), [locations])

  const CARDS = [
    { key: 'registered', label: 'Puntos registrados', value: stats.registered, icon: 'pin' },
    { key: 'verified', label: 'Puntos verificados', value: stats.verified, icon: 'check' },
    { key: 'recent', label: 'Actualizaciones recientes', value: stats.recent, icon: 'clock' },
    { key: 'active', label: 'Centros de ayuda activos', value: stats.active, icon: 'heart' },
  ]

  return (
    <section className={'hero' + (collapsed ? ' hero--collapsed' : '')}>
      <div className="hero__main">
        <div className="hero__text">
          <span className="hero__flag" aria-hidden><span /><span /><span /></span>
          <h1 className="hero__title">Conectando necesidades, recursos y ayuda en tiempo real.</h1>
          {!collapsed && (
            <p className="hero__subtitle">
              Mapa colaborativo de la respuesta al terremoto del 24 de junio en Distrito Capital,
              Miranda y La Guaira.
            </p>
          )}
          {!collapsed && (
            <div className="hero__actions">
              <button className="hero__btn hero__btn--primary" onClick={onExplore}>
                <Icon name="map" size={17} /> Explorar el mapa
              </button>
              <button className="hero__btn" onClick={onReport}>
                <Icon name="plus" size={17} /> Reportar un punto
              </button>
            </div>
          )}
        </div>
        <button
          className="hero__toggle"
          onClick={() => setCollapsed((v) => !v)}
          aria-label={collapsed ? 'Mostrar información' : 'Ocultar información'}
        >
          {collapsed ? 'Mostrar' : 'Ocultar'}
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
