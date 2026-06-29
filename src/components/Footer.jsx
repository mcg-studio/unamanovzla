import { useI18n } from '../lib/i18n'

export default function Footer({ onNavigate, onReport }) {
  const { t } = useI18n()
  return (
    <footer className="footer">
      <div className="footer__inner">
        <div className="footer__brand">
          <span className="footer__flag" aria-hidden="true">
            <span style={{ background: '#fcd116' }} />
            <span style={{ background: '#0a3d91' }} />
            <span style={{ background: '#cf142b' }} />
          </span>
          <strong>{t('app.title')}</strong>
        </div>
        <p className="footer__tagline">{t('footer.tagline')}</p>
        <nav className="footer__links">
          <button onClick={() => onNavigate('about')}>{t('footer.about')}</button>
          <button onClick={() => onNavigate('donate')}>{t('footer.donate')}</button>
          <button onClick={onReport}>{t('footer.report')}</button>
        </nav>
      </div>
    </footer>
  )
}
