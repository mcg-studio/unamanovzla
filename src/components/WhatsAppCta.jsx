import { useI18n } from '../lib/i18n'
import Icon from './Icons'

// Punto de entrada para futura integración de WhatsApp. El número se puede
// configurar luego mediante VITE_WHATSAPP_NUMBER; por ahora es un placeholder.
const WHATSAPP_NUMBER = import.meta.env.VITE_WHATSAPP_NUMBER || ''

export default function WhatsAppCta({ compact = false }) {
  const { t } = useI18n()
  const enabled = Boolean(WHATSAPP_NUMBER)
  const href = enabled
    ? `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, '')}`
    : undefined

  if (compact) {
    return enabled ? (
      <a className="btn btn--success" href={href} target="_blank" rel="noopener noreferrer">
        <Icon name="whatsapp" />
        {t('whatsapp.cta')}
      </a>
    ) : (
      <button className="btn btn--success" type="button" title={t('whatsapp.soon')}>
        <Icon name="whatsapp" />
        {t('whatsapp.cta')}
      </button>
    )
  }

  return (
    <div className="card card--pad whatsapp-card">
      <div className="whatsapp-card__icon">
        <Icon name="whatsapp" />
      </div>
      <div className="whatsapp-card__text">
        <h3>{t('whatsapp.title')}</h3>
        <p>{t('whatsapp.desc')}</p>
        {enabled ? (
          <a className="btn btn--success" href={href} target="_blank" rel="noopener noreferrer">
            <Icon name="whatsapp" />
            {t('whatsapp.cta')}
          </a>
        ) : (
          <div className="row row--wrap" style={{ marginTop: 4 }}>
            <button className="btn btn--success" type="button">
              <Icon name="whatsapp" />
              {t('whatsapp.cta')}
            </button>
            <span className="badge badge--soft">{t('whatsapp.soon')}</span>
          </div>
        )}
      </div>
    </div>
  )
}
