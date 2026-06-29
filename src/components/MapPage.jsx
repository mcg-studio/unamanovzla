import { useMemo, useRef } from 'react'
import { useI18n } from '../lib/i18n'
import { CATEGORIES } from '../data/constants'
import { categoryColor } from '../lib/labels'
import MapView from './MapView'
import SearchBox from './SearchBox'
import WhatsAppCta from './WhatsAppCta'
import Icon from './Icons'

const AID_CATEGORIES = ['hospital', 'punto_medico', 'centro_acopio', 'refugio', 'organizacion', 'rescate']

export default function MapPage({
  locations,
  allLocations,
  version,
  focus,
  placing,
  placedPoint,
  onMapClick,
  onSelect,
  query,
  onQuery,
  categoryFilter,
  onCategoryFilter,
  onReport,
}) {
  const { t } = useI18n()
  const mapRef = useRef(null)

  const stats = useMemo(() => {
    const now = Date.now()
    const weekMs = 7 * 24 * 60 * 60 * 1000
    return {
      points: allLocations.length,
      verified: allLocations.filter((l) => l.verification === 'verificado').length,
      updates: allLocations.filter((l) => l.updated_at && now - new Date(l.updated_at).getTime() < weekMs).length,
      active: allLocations.filter((l) => AID_CATEGORIES.includes(l.category)).length,
    }
  }, [allLocations])

  // Solo mostramos chips de categorías que existen en los datos.
  const presentCategories = useMemo(() => {
    const set = new Set(allLocations.map((l) => l.category))
    return CATEGORIES.filter((c) => set.has(c.key))
  }, [allLocations])

  function scrollToMap() {
    mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div className="home">
      <section className="home-hero">
        <span className="home-hero__flag" aria-hidden="true">
          <span style={{ background: '#fcd116' }} />
          <span style={{ background: '#0a3d91' }} />
          <span style={{ background: '#cf142b' }} />
        </span>
        <h1>{t('home.tagline')}</h1>
        <p>{t('home.subtitle')}</p>

        <div className="stat-row">
          <div className="stat"><div className="stat__num">{stats.points}</div><div className="stat__label">{t('home.stat.points')}</div></div>
          <div className="stat"><div className="stat__num" style={{ color: 'var(--success)' }}>{stats.verified}</div><div className="stat__label">{t('home.stat.verified')}</div></div>
          <div className="stat"><div className="stat__num" style={{ color: 'var(--primary-600)' }}>{stats.updates}</div><div className="stat__label">{t('home.stat.updates')}</div></div>
          <div className="stat"><div className="stat__num" style={{ color: 'var(--accent)' }}>{stats.active}</div><div className="stat__label">{t('home.stat.active')}</div></div>
        </div>

        <div className="row row--wrap" style={{ marginTop: 18 }}>
          <button className="btn btn--primary btn--lg" onClick={scrollToMap}>
            <Icon name="map" />
            {t('home.explore')}
          </button>
          <WhatsAppCta compact />
        </div>
      </section>

      <div className="map-shell map-shell--home" ref={mapRef}>
        <MapView
          locations={locations}
          version={version}
          focus={focus}
          placing={placing}
          placedPoint={placedPoint}
          onMapClick={onMapClick}
          onSelect={onSelect}
        />

        <div className="map-overlay-top">
          <div className="map-search">
            <SearchBox
              value={query}
              onChange={onQuery}
              locations={allLocations}
              onPick={onSelect}
              placeholder={t('directory.searchPlaceholder')}
            />
          </div>
          <div className="map-filters">
            <button
              className={'chip' + (categoryFilter === 'all' ? ' chip--active' : '')}
              onClick={() => onCategoryFilter('all')}
            >
              {t('common.allCategories')}
            </button>
            {presentCategories.map((c) => (
              <button
                key={c.key}
                className={'chip' + (categoryFilter === c.key ? ' chip--active' : '')}
                onClick={() => onCategoryFilter(c.key)}
              >
                <span className="chip__dot" style={{ background: categoryColor(c.key) }} />
                {t('category.' + c.key)}
              </button>
            ))}
          </div>
        </div>

        <div className="legend-card">
          <h4>{t('map.categories')}</h4>
          {presentCategories.slice(0, 6).map((c) => (
            <div className="legend-row" key={c.key}>
              <span className="legend-dot" style={{ background: categoryColor(c.key) }} />
              {t('category.' + c.key)}
            </div>
          ))}
        </div>

        {placing && (
          <div className="locating-banner">
            <Icon name="pin" />
            {t('map.locating')}
          </div>
        )}

        <button className="btn btn--primary btn--lg map-fab" onClick={onReport}>
          <Icon name="plus" />
          {t('nav.report')}
        </button>
      </div>
    </div>
  )
}
