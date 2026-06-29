import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { CATEGORIES } from '../data/constants'
import { categoryColor } from '../lib/labels'
import { matchLocation, normalize } from '../lib/search'
import LocationCard from './LocationCard'
import Icon from './Icons'

const STATUS_RANK = { critico: 0, alto: 1, medio: 2, estable: 3, sin_datos: 4 }

export default function DirectoryPage({ locations, onOpen }) {
  const { t, lang } = useI18n()
  const [query, setQuery] = useState('')
  const [cat, setCat] = useState('all')
  const [sort, setSort] = useState('recent')

  const presentCategories = useMemo(() => {
    const set = new Set(locations.map((l) => l.category))
    return CATEGORIES.filter((c) => set.has(c.key))
  }, [locations])

  const filtered = useMemo(() => {
    const nq = normalize(query)
    let rows = locations.filter((l) => (cat === 'all' || l.category === cat) && matchLocation(l, nq))
    rows = [...rows]
    if (sort === 'recent') rows.sort((a, b) => new Date(b.updated_at || 0) - new Date(a.updated_at || 0))
    else if (sort === 'urgency') rows.sort((a, b) => (STATUS_RANK[a.status_level] ?? 9) - (STATUS_RANK[b.status_level] ?? 9))
    else rows.sort((a, b) => a.name.localeCompare(b.name, lang === 'en' ? 'en' : 'es'))
    return rows
  }, [locations, query, cat, sort, lang])

  return (
    <div className="page page--wide">
      <div className="page-head">
        <h1>{t('directory.title')}</h1>
        <p>{t('directory.subtitle')}</p>
      </div>

      <div className="stack" style={{ marginBottom: 22 }}>
        <div className="search-box" style={{ maxWidth: 460 }}>
          <div className="search-input-wrap">
            <Icon name="search" className="search-icon" />
            <input
              className="input input--icon"
              type="search"
              value={query}
              placeholder={t('directory.searchPlaceholder')}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="spread row--wrap">
          <div className="chip-row">
            <button className={'chip' + (cat === 'all' ? ' chip--active' : '')} onClick={() => setCat('all')}>
              {t('common.allCategories')}
            </button>
            {presentCategories.map((c) => (
              <button key={c.key} className={'chip' + (cat === c.key ? ' chip--active' : '')} onClick={() => setCat(c.key)}>
                <span className="chip__dot" style={{ background: categoryColor(c.key) }} />
                {t('category.' + c.key)}
              </button>
            ))}
          </div>
          <select className="select" style={{ width: 'auto' }} value={sort} onChange={(e) => setSort(e.target.value)}>
            <option value="recent">{t('directory.sortRecent')}</option>
            <option value="urgency">{t('directory.sortUrgency')}</option>
            <option value="name">{t('directory.sortName')}</option>
          </select>
        </div>
      </div>

      <div className="muted" style={{ marginBottom: 12, fontSize: '0.85rem' }}>
        {filtered.length} {t('common.results')}
      </div>

      {filtered.length === 0 ? (
        <div className="empty-state">
          <Icon name="search" />
          <p>{t('common.noResults')}</p>
        </div>
      ) : (
        <div className="grid">
          {filtered.map((l) => (
            <LocationCard key={l.id} location={l} onOpen={onOpen} />
          ))}
        </div>
      )}
    </div>
  )
}
