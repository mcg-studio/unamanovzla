import { useState } from 'react'
import Icon from './Icons'

// Punto de entrada para la futura integración con WhatsApp.
// Por ahora muestra una sección placeholder; cuando exista el número/bot real,
// basta con reemplazar WHATSAPP_LINK por el enlace wa.me correspondiente.
const WHATSAPP_LINK = null

export default function WhatsAppCta({ onReport, compact = false }) {
  const [showInfo, setShowInfo] = useState(false)

  function handleClick() {
    if (WHATSAPP_LINK) {
      window.open(WHATSAPP_LINK, '_blank', 'noopener')
    } else {
      setShowInfo((v) => !v)
    }
  }

  return (
    <section className={'whatsapp' + (compact ? ' whatsapp--compact' : '')}>
      <div className="whatsapp__icon" aria-hidden>
        <Icon name="whatsapp" size={compact ? 22 : 28} />
      </div>
      <div className="whatsapp__content">
        <h3 className="whatsapp__title">Reportar por WhatsApp</h3>
        <p className="whatsapp__desc">
          ¿Tienes información sobre una necesidad, hospital, refugio o centro de acopio? Envíanos un
          mensaje por WhatsApp para que nuestro equipo pueda revisarlo y agregarlo al mapa.
        </p>
        <div className="whatsapp__actions">
          <button className="whatsapp__btn" onClick={handleClick}>
            <Icon name="whatsapp" size={18} /> Reportar por WhatsApp
          </button>
          {onReport && (
            <button className="whatsapp__alt" onClick={onReport}>
              o reporta desde la app
            </button>
          )}
        </div>
        {showInfo && (
          <p className="whatsapp__note">
            <Icon name="clock" size={14} /> Integración con WhatsApp disponible próximamente.
            Mientras tanto, puedes reportar directamente desde la aplicación.
          </p>
        )}
      </div>
    </section>
  )
}
