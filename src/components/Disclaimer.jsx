import { useState } from 'react'
import Icon from './Icons'
import { useI18n } from '../lib/i18n'

const KEY = 'mapa_ayuda_disclaimer_dismissed_v1'

export default function Disclaimer() {
  const { t } = useI18n()
  const [hidden, setHidden] = useState(() => {
    try { return localStorage.getItem(KEY) === '1' } catch { return false }
  })
  if (hidden) return null
  function dismiss() {
    try { localStorage.setItem(KEY, '1') } catch {}
    setHidden(true)
  }
  return (
    <div className="disclaimer" role="note">
      <span className="disclaimer__icon" aria-hidden><Icon name="alert" size={16} /></span>
      <span className="disclaimer__text">{t('disclaimer.text')}</span>
      <button className="disclaimer__close" onClick={dismiss} aria-label={t('disclaimer.close')}>×</button>
    </div>
  )
}
