import Icon from './Icons'
import WhatsAppCta from './WhatsAppCta'

const HOW_STEPS = [
  'Organizaciones y ciudadanos reportan información.',
  'Los administradores verifican los datos.',
  'Los puntos aprobados aparecen en el mapa.',
  'Los centros de ayuda pueden actualizar sus necesidades y recursos disponibles.',
  'Donantes y voluntarios pueden identificar dónde apoyar.',
]

const POINT_TYPES = [
  { icon: 'hospital', label: 'Hospitales' },
  { icon: 'box', label: 'Centros de acopio' },
  { icon: 'home', label: 'Refugios' },
  { icon: 'users', label: 'Organizaciones comunitarias' },
  { icon: 'shield', label: 'Equipos de rescate' },
  { icon: 'plus', label: 'Centros médicos' },
  { icon: 'pin', label: 'Otros puntos de apoyo' },
]

export default function AboutPage({ onReport }) {
  return (
    <div className="page page--about">
      <div className="about">
        <header className="about__hero">
          <span className="about__flag" aria-hidden>
            <span /><span /><span />
          </span>
          <h1 className="about__title">¿Qué es Mapa de Ayuda?</h1>
          <p className="about__subtitle">
            Una plataforma colaborativa para coordinar ayuda durante emergencias en Venezuela.
          </p>
        </header>

        <section className="about__body">
          <p>
            Mapa de Ayuda conecta comunidades, hospitales, centros de acopio, refugios, voluntarios y
            organizaciones para facilitar la coordinación de recursos durante situaciones de emergencia.
          </p>
          <p>
            La plataforma permite visualizar necesidades en tiempo real, registrar puntos de ayuda,
            compartir actualizaciones y conectar donaciones con los lugares donde más se necesitan.
          </p>
          <p>
            La información es colaborativa y es revisada por administradores antes de ser publicada.
            Nuestro objetivo es ayudar a que recursos, información y apoyo lleguen más rápido a las
            personas y comunidades afectadas.
          </p>
        </section>

        <section className="about__section">
          <h2 className="about__h2">¿Cómo funciona?</h2>
          <ol className="about__steps">
            {HOW_STEPS.map((step, i) => (
              <li key={i} className="about__step">
                <span className="about__step-num">{i + 1}</span>
                <span>{step}</span>
              </li>
            ))}
          </ol>
        </section>

        <section className="about__section">
          <h2 className="about__h2">Tipos de puntos</h2>
          <div className="about__types">
            {POINT_TYPES.map((t) => (
              <div key={t.label} className="about__type">
                <span className="about__type-icon"><Icon name={t.icon} size={20} /></span>
                <span>{t.label}</span>
              </div>
            ))}
          </div>
        </section>

        <WhatsAppCta onReport={onReport} />
      </div>
    </div>
  )
}
