import { useI18n } from '../lib/i18n'
import { categoryColor, statusColor } from '../lib/labels'
import Icon from './Icons'

export function CategoryBadge({ category }) {
  const { t } = useI18n()
  return (
    <span className="badge badge--cat" style={{ background: categoryColor(category) }}>
      {t('category.' + category)}
    </span>
  )
}

export function VerificationBadge({ verification, withText = true }) {
  const { t } = useI18n()
  const v = verification || 'sin_actualizar'
  const icon = v === 'verificado' ? 'checkCircle' : v === 'pendiente' ? 'clock' : 'info'
  return (
    <span className={'verif verif--' + v} title={t('verification.' + v + '.help')}>
      <Icon name={icon} />
      {withText && t('verification.' + v)}
    </span>
  )
}

export function StatusBadge({ level }) {
  const { t } = useI18n()
  const l = level || 'sin_datos'
  return (
    <span className="badge badge--soft">
      <span className="badge__dot" style={{ background: statusColor(l) }} />
      {t('status.' + l)}
    </span>
  )
}
