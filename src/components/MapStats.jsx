import { useMemo, useState } from 'react'
import Icon from './Icons'
import { useI18n } from '../lib/i18n'
import { computeStats } from '../lib/stats'

// Tira compacta de estadisticas superpuesta al mapa, con un icono de informacion
// que despliega el aviso de datos comunitarios (colapsado por defecto).
export default function MapStats({ locations = [] }) {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const s = useMemo(() => computeStats(locations), [locations])

  const pills = [
    { value: s.registered, label: t('mstat.points') },
    { value: s.verified, label: t('mstat.verified') },
    { value: s.recent, label: t('mstat.updates') },
    { value: s.active, label: t('mstat.active') },
  ]

  return (
    <div className="mapstats">
      <div className="mapstats__strip" role="list">
        {pills.map((p, i) => (
          <span className="mapstats__pill" role="listitem" key={i}>
            <strong>{p.value}</strong> {p.label}
          </span>
        ))}
        <button
          className={'mapstats__info' + (open ? ' mapstats__info--on' : '')}
          onClick={() => setOpen((v) => !v)}
          aria-label={t('map.info')}
          aria-expanded={open}
        >
          <Icon name="info" size={16} />
        </button>
      </div>
      {open && (
        <p className="mapstats__note">{t('disclaimer.text')}</p>
      )}
    </div>
  )
}
