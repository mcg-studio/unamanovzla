import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { matchLocation, normalize } from '../lib/search'
import { categoryColor } from '../lib/labels'
import Icon from './Icons'

export default function SearchBox({ value, onChange, locations, onPick, placeholder }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)

  const results = useMemo(() => {
    const nq = normalize(value)
    if (!nq || nq.length < 2) return []
    return locations.filter((l) => matchLocation(l, nq)).slice(0, 8)
  }, [value, locations])

  return (
    <div className="search-box">
      <div className="search-input-wrap">
        <Icon name="search" className="search-icon" />
        <input
          className="input input--icon"
          type="search"
          value={value}
          placeholder={placeholder || t('common.search')}
          onChange={(e) => { onChange(e.target.value); setOpen(true) }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
      </div>
      {open && results.length > 0 && (
        <div className="search-results">
          {results.map((l) => (
            <button
              key={l.id}
              className="search-item"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => { onPick(l); setOpen(false) }}
            >
              <span className="legend-dot" style={{ background: categoryColor(l.category) }} />
              <span>
                <span className="search-item__name">{l.name}</span>
                <span className="search-item__sub">{t('category.' + l.category)}{l.state ? ` · ${l.state}` : ''}</span>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
