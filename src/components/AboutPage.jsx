import { useI18n } from '../lib/i18n'
import { CATEGORY_ICON, categoryColor } from '../lib/labels'
import Icon from './Icons'
import WhatsAppCta from './WhatsAppCta'

const TYPE_KEYS = ['hospital', 'centro_acopio', 'refugio', 'organizacion', 'rescate', 'punto_medico', 'otro']

export default function AboutPage({ onNavigate, onReport }) {
  const { t } = useI18n()
  const steps = ['about.how1', 'about.how2', 'about.how3', 'about.how4', 'about.how5']

  return (
    <div className="page page--narrow">
      <div className="about-hero">
        <span className="about-hero__flag" aria-hidden="true">
          <span style={{ background: '#fcd116' }} />
          <span style={{ background: '#0a3d91' }} />
          <span style={{ background: '#cf142b' }} />
        </span>
        <h1>{t('about.title')}</h1>
        <p className="about-hero__sub">{t('about.subtitle')}</p>
      </div>

      <div className="stack" style={{ marginTop: 28 }}>
        <p>{t('about.body1')}</p>
        <p>{t('about.body2')}</p>
        <p>{t('about.body3')}</p>
      </div>

      <hr className="divider" />

      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 18 }}>{t('about.how')}</h2>
      <ol className="how-list">
        {steps.map((s, i) => (
          <li key={s}>
            <span className="how-list__num">{i + 1}</span>
            <span>{t(s)}</span>
          </li>
        ))}
      </ol>

      <hr className="divider" />

      <h2 style={{ fontSize: '1.3rem', fontWeight: 800, marginBottom: 18 }}>{t('about.types')}</h2>
      <div className="types-grid">
        {TYPE_KEYS.map((key) => (
          <div className="type-item" key={key}>
            <span className="type-item__icon" style={{ background: categoryColor(key) }}>
              <Icon name={CATEGORY_ICON[key] || 'pin'} />
            </span>
            <span>{t('category.' + key)}</span>
          </div>
        ))}
      </div>

      <hr className="divider" />

      <WhatsAppCta />

      <div className="row row--wrap" style={{ marginTop: 22, justifyContent: 'center' }}>
        <button className="btn btn--primary btn--lg" onClick={() => onNavigate('map')}>
          <Icon name="map" />
          {t('home.explore')}
        </button>
        <button className="btn btn--ghost btn--lg" onClick={onReport}>
          <Icon name="plus" />
          {t('nav.report')}
        </button>
      </div>
    </div>
  )
}
