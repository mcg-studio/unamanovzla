import { useMemo, useState } from 'react'
import { KIND_META, STATUS_LEVELS, STATES } from '../data/constants'
import { normalize, matchLocation } from '../lib/search'
import Icon from './Icons'

const KIND_ICON = { hospital: 'hospital', parroquia: 'pin', otro: 'box' }

export default function DirectoryPage({ locations = [], onPick }) {
  const [query, setQuery] = useState('')
  const [filterState, setFilterState] = useState('all')
  const [filterKind, setFilterKind] = useState('all')

  const filtered = useMemo(() => {
    const nq = normalize(query)
    return locations
      .filter(
        (l) =>
          (filterState === 'all' || l.state === filterState) &&
          (filterKind === 'all' || l.kind === filterKind) &&
          matchLocation(l, nq),
      )
      .sort((a, b) => {
        // Primero los que tienen información publicada.
        const au = a.updated_at ? 1 : 0
        const bu = b.updated_at ? 1 : 0
        if (au !== bu) return bu - au
        return (a.name || '').localeCompare(b.name || '')
      })
  }, [locations, query, filterState, filterKind])

  return (
    <div className="page page--directory">
      <div className="directory">
        <header className="directory__head">
          <h1 className="page__title">Puntos de ayuda</h1>
          <p className="page__lead">
            Hospitales, refugios, centros de acopio y otros puntos registrados en la zona afectada.
          </p>
        </header>

        <div className="directory__controls">
          <div className="directory__search">
            <Icon name="search" size={16} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar por nombre, zona o necesidad…"
              aria-label="Buscar puntos de ayuda"
            />
          </div>
          <div className="directory__filters">
            <select value={filterState} onChange={(e) => setFilterState(e.target.value)} aria-label="Filtrar por estado">
              <option value="all">Todos los estados</option>
              {STATES.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
            <select value={filterKind} onChange={(e) => setFilterKind(e.target.value)} aria-label="Filtrar por tipo">
              <option value="all">Todos los tipos</option>
              <option value="hospital">Hospitales</option>
              <option value="parroquia">Parroquias</option>
              <option value="otro">Otros puntos</option>
            </select>
          </div>
        </div>

        <p className="directory__count">{filtered.length} puntos</p>

        <ul className="directory__list">
          {filtered.map((l) => {
            const meta = KIND_META[l.kind] || KIND_META.otro
            const status = STATUS_LEVELS[l.status_level] || STATUS_LEVELS.sin_datos
            return (
              <li key={l.id}>
                <button className="dir-card" onClick={() => onPick(l)}>
                  <span className="dir-card__icon" style={{ background: meta.color }}>
                    <Icon name={KIND_ICON[l.kind] || 'box'} size={18} />
                  </span>
                  <span className="dir-card__body">
                    <span className="dir-card__name">{l.name}</span>
                    <span className="dir-card__meta">
                      {meta.label}
                      {l.municipio ? ` · ${l.municipio}` : ''}
                      {l.state ? ` · ${l.state}` : ''}
                    </span>
                    {l.summary && <span className="dir-card__summary">{l.summary}</span>}
                  </span>
                  <span className="dir-card__status">
                    <span className="status-dot" style={{ background: status.color }} />
                    {status.label}
                  </span>
                </button>
              </li>
            )
          })}
          {filtered.length === 0 && (
            <li className="directory__empty">No se encontraron puntos con esos filtros.</li>
          )}
        </ul>
      </div>
    </div>
  )
}
