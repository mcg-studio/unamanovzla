import { useMemo, useState } from 'react'
import { useI18n } from '../lib/i18n'
import { repo } from '../lib/repository'
import { STATUS_ORDER, VERIFICATION_KEYS } from '../data/constants'
import { UPDATE_ICON, categoryColor, timeAgo, statusColor } from '../lib/labels'
import { CategoryBadge, VerificationBadge, StatusBadge } from './Badges'
import Icon from './Icons'

function ContactRow({ icon, label, href, value }) {
  if (!value) return null
  return (
    <a className="btn btn--ghost btn--block" href={href} target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'flex-start' }}>
      <Icon name={icon} />
      <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{label}</span>
    </a>
  )
}

export default function LocationProfile({ location, updates, isAdmin, onClose, onReportUpdate, onUpdated }) {
  const { t, lang } = useI18n()
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState(location)
  const [saving, setSaving] = useState(false)

  const locUpdates = useMemo(
    () => (updates || []).filter((u) => u.location_id === location.id),
    [updates, location.id],
  )

  const needs = Array.isArray(location.needs) ? location.needs : []
  const resources = Array.isArray(location.resources) ? location.resources : []
  const mapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${location.lat},${location.lng}`

  function set(k, v) { setForm((f) => ({ ...f, [k]: v })) }

  async function save() {
    setSaving(true)
    const patch = {
      status_level: form.status_level,
      verification: form.verification,
      summary: form.summary,
      description: form.description,
      address: form.address,
      contact_phone: form.contact_phone,
      contact_whatsapp: form.contact_whatsapp,
      contact_email: form.contact_email,
      website: form.website,
      donation_instructions: form.donation_instructions,
      needs: typeof form.needs === 'string' ? form.needs.split(',').map((s) => s.trim()).filter(Boolean) : form.needs,
      resources: typeof form.resources === 'string' ? form.resources.split(',').map((s) => s.trim()).filter(Boolean) : form.resources,
      blood_needed: !!form.blood_needed,
      blood_types: form.blood_types,
    }
    try {
      await repo.updateLocationStatus(location.id, patch)
      onUpdated?.(location.id, patch)
      setEditing(false)
    } catch (e) {
      console.log('[v0] update error', e?.message)
    }
    setSaving(false)
  }

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()}>
        <div className="panel-head">
          <div className="profile-hero">
            <div className="profile-hero__badges">
              <CategoryBadge category={location.category} />
              <VerificationBadge verification={location.verification} />
              <StatusBadge level={location.status_level} />
            </div>
            <h1>{location.name}</h1>
            {location.state && (
              <span className="profile-hero__where">
                <Icon name="pin" />
                {location.municipio ? `${location.municipio}, ${location.state}` : location.state}
              </span>
            )}
          </div>
          <button className="icon-btn" onClick={onClose} aria-label={t('common.close')}><Icon name="close" /></button>
        </div>

        <div className="panel-body">
          {location.summary && <p style={{ fontWeight: 600, marginBottom: 14 }}>{location.summary}</p>}
          {location.description && <p className="muted" style={{ marginBottom: 18 }}>{location.description}</p>}

          {needs.length > 0 && (
            <div className="profile-block">
              <h3>{t('profile.needs')}</h3>
              <div className="need-list">{needs.map((n) => <span key={n} className="tag tag--need">{n}</span>)}</div>
            </div>
          )}

          {resources.length > 0 && (
            <div className="profile-block">
              <h3>{t('profile.resources')}</h3>
              <div className="resource-list">{resources.map((r) => <span key={r} className="tag tag--resource">{r}</span>)}</div>
            </div>
          )}

          {location.blood_needed && (
            <div className="alert alert--error" style={{ marginBottom: 18 }}>
              <Icon name="droplet" />
              <span>{t('donate.bloodTitle')}{location.blood_types ? `: ${location.blood_types}` : ''}</span>
            </div>
          )}

          {location.donation_instructions && (
            <div className="profile-block">
              <h3>{t('profile.donations')}</h3>
              <p className="muted">{location.donation_instructions}</p>
            </div>
          )}

          <div className="profile-block">
            <h3>{t('profile.contact')}</h3>
            <div className="contact-actions">
              <ContactRow icon="phone" label={`${t('profile.call')}: ${location.contact_phone}`} href={`tel:${location.contact_phone}`} value={location.contact_phone} />
              <ContactRow icon="whatsapp" label="WhatsApp" href={`https://wa.me/${(location.contact_whatsapp || '').replace(/[^0-9]/g, '')}`} value={location.contact_whatsapp} />
              <ContactRow icon="mail" label={location.contact_email} href={`mailto:${location.contact_email}`} value={location.contact_email} />
              <ContactRow icon="globe" label={t('profile.website')} href={location.website} value={location.website} />
              {Number.isFinite(location.lat) && Number.isFinite(location.lng) && (
                <a className="btn btn--ghost btn--block" href={mapsUrl} target="_blank" rel="noopener noreferrer" style={{ justifyContent: 'flex-start' }}>
                  <Icon name="pin" /> {t('profile.directions')}
                </a>
              )}
            </div>
          </div>

          <div className="profile-block">
            <h3>{t('profile.timeline')}</h3>
            {locUpdates.length === 0 ? (
              <p className="muted">{t('profile.noUpdates')}</p>
            ) : (
              <div className="timeline">
                {locUpdates.map((u) => (
                  <div className="tl-item" key={u.id}>
                    <span className="tl-dot" style={{ background: statusColor(location.status_level) }}>
                      <Icon name={UPDATE_ICON[u.kind] || 'info'} />
                    </span>
                    <div className="tl-body">
                      <div className="tl-head">
                        <span className="tl-type">{t('update.' + (u.kind || 'estado'))}</span>
                        <span className="tl-time">· {timeAgo(u.created_at, lang)}</span>
                      </div>
                      {u.body && <p className="tl-text">{u.body}</p>}
                      {u.photo_url && <img className="tl-photo" src={u.photo_url} alt="" loading="lazy" />}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {isAdmin && editing && (
            <div className="profile-block card card--pad">
              <h3>{t('admin.points')}</h3>
              <div className="field">
                <label>{t('status.label')}</label>
                <select className="select" value={form.status_level} onChange={(e) => set('status_level', e.target.value)}>
                  {STATUS_ORDER.map((s) => <option key={s} value={s}>{t('status.' + s)}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('verification.verificado')}</label>
                <select className="select" value={form.verification} onChange={(e) => set('verification', e.target.value)}>
                  {VERIFICATION_KEYS.map((v) => <option key={v} value={v}>{t('verification.' + v)}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('directory.needs')}</label>
                <input className="input" value={Array.isArray(form.needs) ? form.needs.join(', ') : form.needs || ''} onChange={(e) => set('needs', e.target.value)} />
              </div>
              <div className="field">
                <label>{t('directory.offers')}</label>
                <input className="input" value={Array.isArray(form.resources) ? form.resources.join(', ') : form.resources || ''} onChange={(e) => set('resources', e.target.value)} />
              </div>
              <div className="field">
                <label>{t('profile.about')}</label>
                <textarea className="textarea" value={form.summary || ''} onChange={(e) => set('summary', e.target.value)} />
              </div>
            </div>
          )}
        </div>

        <div className="panel-foot">
          {isAdmin && (
            editing ? (
              <>
                <button className="btn btn--subtle" onClick={() => { setEditing(false); setForm(location) }}>{t('common.cancel')}</button>
                <button className="btn btn--success" onClick={save} disabled={saving}>
                  {saving ? <span className="spinner" /> : <Icon name="check" />} {t('common.save')}
                </button>
              </>
            ) : (
              <button className="btn btn--ghost" onClick={() => { setForm(location); setEditing(true) }}>
                <Icon name="edit" /> {t('admin.points')}
              </button>
            )
          )}
          <button className="btn btn--primary" onClick={() => onReportUpdate(location)}>
            <Icon name="send" /> {t('profile.reportUpdate')}
          </button>
        </div>
      </aside>
    </div>
  )
}
