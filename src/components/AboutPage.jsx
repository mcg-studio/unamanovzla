import Icon from './Icons'
import WhatsAppCta from './WhatsAppCta'
import { useI18n } from '../lib/i18n'

const POINT_TYPES = [
  { icon: 'hospital', es: 'Hospitales', en: 'Hospitals' },
  { icon: 'box', es: 'Centros de acopio', en: 'Collection centers' },
  { icon: 'home', es: 'Refugios', en: 'Shelters' },
  { icon: 'users', es: 'Organizaciones comunitarias', en: 'Community organizations' },
  { icon: 'shield', es: 'Equipos de rescate', en: 'Rescue teams' },
  { icon: 'plus', es: 'Centros médicos', en: 'Medical centers' },
  { icon: 'pin', es: 'Otros puntos de apoyo', en: 'Other support points' },
]

export default function AboutPage({ onReport }) {
  const { t, lang } = useI18n()
  const steps = [t('about.how1'), t('about.how2'), t('about.how3'), t('about.how4')]

  return (
    <div className="page page--about">
      <div className="about">
        <header className="about__hero">
          <span className="about__flag" aria-hidden>
            <span /><span /><span />
          </span>
          <h1 className="about__title">{t('about.title')}</h1>
          <p className="about__subtitle">{t('about.subtitle')}</p>
        </header>

        <section className="about__body">
          <p>{t('about.p1')}</p>
          <p>{t('about.p2')}</p>
        </section>

        <section className="about__section">
          <h2 className="about__h2">{t('about.how')}</h2>
          <ol className="about__steps">
            {steps.map((step, i) => (
              <li key={i} className="about__step">
                <span className="about__step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__h2">{t('about.types')}</h2>
          <div className="about__types">
            {POINT_TYPES.map((pt) => (
              <div key={pt.icon} className="about__type">
                <span className="about__type-icon"><Icon name={pt.icon} size={20} /></span>
                <span>{lang === 'en' ? pt.en : pt.es}</span>
              </div>
            ))}
          </div>
        </section>

        <WhatsAppCta onReport={onReport} />
      </div>
    </div>
  )
}
