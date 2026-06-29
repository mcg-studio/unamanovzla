import { useEffect, useState } from 'react'
import { repo } from '../lib/repository'
import { STATES, SUPPLY_CHIPS } from '../data/constants'
import Icon from './Icons'

const STEPS = ['Ubicación', 'Tipo', 'Necesidades', 'Detalles']

// Tarjetas de tipo de punto. Cada una se asigna a un "kind" del modelo de datos
// (hospital u otro), conservando la estructura existente.
const TYPE_CARDS = [
  { id: 'hospital', label: 'Hospital', kind: 'hospital', icon: 'hospital' },
  { id: 'acopio', label: 'Centro de acopio', kind: 'otro', icon: 'box' },
  { id: 'refugio', label: 'Refugio', kind: 'otro', icon: 'home' },
  { id: 'organizacion', label: 'Organización comunitaria', kind: 'otro', icon: 'users' },
  { id: 'rescate', label: 'Equipo de rescate', kind: 'otro', icon: 'shield' },
  { id: 'medico', label: 'Centro médico', kind: 'hospital', icon: 'plus' },
  { id: 'otro', label: 'Otro', kind: 'otro', icon: 'pin' },
]

const PEOPLE_RANGES = ['1-10', '10-50', '50-100', '100+']

// Geocodificacion inversa best-effort con Nominatim para sugerir estado y
// municipio a partir del pin. Nunca bloquea el flujo si falla.
async function reverseGeocode(lat, lng) {
  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}&zoom=12&addressdetails=1`
    const res = await fetch(url, { headers: { Accept: 'application/json' } })
    if (!res.ok) return null
    const data = await res.json()
    const a = data.address || {}
    const rawState = a.state || a.region || ''
    let state = ''
    for (const s of STATES) {
      if (rawState.toLowerCase().includes(s.toLowerCase())) state = s
    }
    if (!state && /vargas/i.test(rawState)) state = 'La Guaira'
    const municipio = a.city || a.town || a.municipality || a.county || a.city_district || a.suburb || ''
    return { state, municipio }
  } catch {
    return null
  }
}

export default function NewLocationForm({ placedPoint, onRemark, onClose, onSent, onSetPoint }) {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({
    typeId: 'hospital',
    helpMode: 'needs', // 'needs' | 'offers'
    name: '',
    state: STATES[0],
    municipio: '',
    summary: '',
    supplies: [],
    suppliesOther: '',
    peopleRange: '',
    peopleExact: '',
    blood_needed: false,
    blood_types: '',
    donation_poc: '',
    submitter_name: '',
    submitter_contact: '',
  })
  const [stateConfirmed, setStateConfirmed] = useState(false)
  const [locating, setLocating] = useState(false)
  const [geoMsg, setGeoMsg] = useState('')
  const [showMore, setShowMore] = useState(false)
  const [stepError, setStepError] = useState('')
  const [status, setStatus] = useState({ sending: false, ok: false, error: '' })
  const [hp, setHp] = useState('') // honeypot anti-spam

  // Foto (captura local con vista previa).
  const [photo, setPhoto] = useState(null) // { url, name }

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))
  const selectedCard = TYPE_CARDS.find((c) => c.id === form.typeId) || TYPE_CARDS[0]
  const isHospital = selectedCard.kind === 'hospital'

  // Cuando llega un punto nuevo (GPS o toque en el mapa), intenta derivar
  // estado/municipio automaticamente.
  useEffect(() => {
    if (!placedPoint) return
    let alive = true
    setGeoMsg('Detectando estado y municipio…')
    reverseGeocode(placedPoint.lat, placedPoint.lng).then((r) => {
      if (!alive) return
      if (r) {
        setForm((f) => ({
          ...f,
          state: r.state || f.state,
          municipio: r.municipio || f.municipio,
        }))
        setStateConfirmed(false)
        setGeoMsg(r.state ? '' : 'No pudimos detectar el estado. Confírmalo abajo.')
      } else {
        setGeoMsg('')
      }
    })
    return () => { alive = false }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [placedPoint?.lat, placedPoint?.lng])

  function useMyLocation() {
    if (!('geolocation' in navigator)) {
      setStepError('Tu dispositivo no permite ubicación automática. Toca el mapa para marcar el lugar.')
      return
    }
    setLocating(true)
    setStepError('')
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocating(false)
        const pt = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        onSetPoint && onSetPoint(pt)
      },
      () => {
        setLocating(false)
        setStepError('No pudimos obtener tu ubicación. Toca el mapa para marcar el lugar.')
      },
      { enableHighAccuracy: true, timeout: 10000 },
    )
  }

  function toggleSupply(chip) {
    setForm((f) => ({
      ...f,
      supplies: f.supplies.includes(chip) ? f.supplies.filter((s) => s !== chip) : [...f.supplies, chip],
    }))
  }

  function onPhoto(e) {
    const file = e.target.files?.[0]
    if (file) setPhoto({ url: URL.createObjectURL(file), name: file.name })
  }

  function next() {
    setStepError('')
    if (step === 1 && !placedPoint) {
      setStepError('Marca la ubicación: usa tu ubicación o toca el mapa.')
      return
    }
    if (step === 3 && !form.name.trim()) {
      setStepError('Indica el nombre del lugar.')
      return
    }
    setStep((s) => Math.min(4, s + 1))
  }
  function back() {
    setStepError('')
    setStep((s) => Math.max(1, s - 1))
  }

  async function submit(e) {
    e.preventDefault()
    if (hp.trim()) { setStatus({ sending: false, ok: true, error: '' }); return }
    if (!form.name.trim()) { setStep(3); return setStepError('Indica el nombre del lugar.') }
    if (!placedPoint) { setStep(1); return setStepError('Marca la ubicación en el mapa.') }
    setStatus({ sending: true, ok: false, error: '' })

    const supplies = [...form.supplies.filter((s) => s !== 'Otro')]
    if (form.supplies.includes('Otro') && form.suppliesOther.trim()) supplies.push(form.suppliesOther.trim())
    const suppliesText = supplies.join(', ')
    const peopleText = form.peopleExact.trim() || form.peopleRange

    const proposed = {
      name: form.name.trim(),
      kind: selectedCard.kind,
      state: form.state,
      municipio: form.municipio.trim() || null,
      lat: placedPoint.lat,
      lng: placedPoint.lng,
    }
    if (form.summary.trim()) proposed.summary = form.summary.trim()
    if (suppliesText) proposed.supplies_needed = suppliesText
    if (form.donation_poc.trim()) proposed.donation_poc = form.donation_poc.trim()
    if (isHospital) {
      if (peopleText) proposed.people_aided = peopleText
      if (form.blood_needed) proposed.blood_needed = true
      if (form.blood_types.trim()) proposed.blood_types = form.blood_types.trim()
    }
    // Conserva el subtipo y el modo (necesita/ofrece) en la descripcion.
    const modeLabel = form.helpMode === 'offers' ? 'Ofrece ayuda' : 'Necesita ayuda'
    proposed.description = `${selectedCard.label} · ${modeLabel}`

    const mediaNote = photo ? ' (incluye foto)' : ''
    const message =
      `[${selectedCard.label} · ${modeLabel}] ` +
      (form.summary.trim() || `Propuesta de nuevo punto: ${form.name.trim()}`) +
      (suppliesText ? ` — Necesita: ${suppliesText}` : '') +
      mediaNote

    try {
      await repo.createSubmission({
        location_id: null,
        location_name: form.name.trim(),
        kind: selectedCard.kind,
        new_location: true,
        update_type: 'nuevo_punto',
        message,
        submitter_name: form.submitter_name.trim() || null,
        submitter_contact: form.submitter_contact.trim() || null,
        proposed,
      })
      setStatus({ sending: false, ok: true, error: '' })
      onSent && onSent()
    } catch {
      setStatus({ sending: false, ok: false, error: 'No se pudo enviar. Intenta de nuevo.' })
    }
  }

  if (status.ok) {
    return (
      <aside className="panel">
        <div className="panel__head">
          <button className="panel__close" onClick={onClose} aria-label="Cerrar">×</button>
          <h2 className="panel__title">Nuevo punto</h2>
        </div>
        <div className="panel__body">
          <div className="notice notice--ok">
            ¡Gracias! Tu nuevo punto fue enviado y un administrador lo revisará antes de publicarlo en el mapa.
          </div>
          <button className="btn btn--ghost btn--block" onClick={onClose}>Cerrar</button>
        </div>
      </aside>
    )
  }

  return (
    <aside className="panel">
      <div className="panel__head">
        <button className="panel__close" onClick={onClose} aria-label="Cerrar">×</button>
        <h2 className="panel__title">Reportar nuevo punto</h2>
        <div className="panel__sub">Será revisado por un administrador antes de publicarse.</div>

        <div className="wizard__progress" role="list" aria-label="Progreso del formulario">
          {STEPS.map((label, i) => {
            const n = i + 1
            const state = n < step ? 'done' : n === step ? 'current' : 'todo'
            return (
              <div key={label} className={'wizard__step wizard__step--' + state} role="listitem">
                <span className="wizard__dot">{n < step ? <Icon name="check" size={13} /> : n}</span>
                <span className="wizard__label">{label}</span>
              </div>
            )
          })}
        </div>
      </div>

      <div className="panel__body wizard__body">
        {/* Honeypot anti-spam: invisible para humanos. */}
        <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', width: 1, height: 1, overflow: 'hidden' }}>
          <label>No llenar este campo</label>
          <input type="text" tabIndex={-1} autoComplete="off" value={hp} onChange={(e) => setHp(e.target.value)} />
        </div>

        {/* ----- Paso 1: Ubicacion ----- */}
        {step === 1 && (
          <div className="wizard__pane">
            <button type="button" className="btn btn--primary btn--block btn--lg" onClick={useMyLocation} disabled={locating}>
              <Icon name="navigation" size={18} /> {locating ? 'Obteniendo ubicación…' : 'Usar mi ubicación'}
            </button>
            <p className="wizard__or">o</p>
            <div className={'locbox' + (placedPoint ? ' locbox--ok' : '')}>
              <Icon name="pin" size={18} />
              {placedPoint ? (
                <span>
                  Ubicación marcada: {placedPoint.lat.toFixed(4)}, {placedPoint.lng.toFixed(4)}.{' '}
                  <button type="button" className="linkbtn" onClick={onRemark}>Volver a marcar</button>
                </span>
              ) : (
                <span>Toca el mapa para marcar el lugar.</span>
              )}
            </div>

            {geoMsg && <p className="wizard__hint">{geoMsg}</p>}

            <label className="wizard__flabel">Estado</label>
            <select value={form.state} onChange={(e) => { set('state', e.target.value); setStateConfirmed(true) }}>
              {STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>

            <label className="wizard__flabel">Municipio (puedes confirmarlo)</label>
            <input value={form.municipio} onChange={(e) => set('municipio', e.target.value)} placeholder="Ej: Libertador, Chacao…" />
          </div>
        )}

        {/* ----- Paso 2: Tipo de punto ----- */}
        {step === 2 && (
          <div className="wizard__pane">
            <div className="seg-toggle" role="group" aria-label="Modo de ayuda">
              <button
                type="button"
                className={'seg-toggle__btn' + (form.helpMode === 'needs' ? ' seg-toggle__btn--active' : '')}
                onClick={() => set('helpMode', 'needs')}
              >
                Necesita ayuda
              </button>
              <button
                type="button"
                className={'seg-toggle__btn' + (form.helpMode === 'offers' ? ' seg-toggle__btn--active' : '')}
                onClick={() => set('helpMode', 'offers')}
              >
                Ofrece ayuda
              </button>
            </div>

            <label className="wizard__flabel">Tipo de punto</label>
            <div className="type-grid">
              {TYPE_CARDS.map((c) => (
                <button
                  type="button"
                  key={c.id}
                  className={'type-card' + (form.typeId === c.id ? ' type-card--active' : '')}
                  onClick={() => set('typeId', c.id)}
                  aria-pressed={form.typeId === c.id}
                >
                  <Icon name={c.icon} size={22} />
                  <span>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ----- Paso 3: Nombre y necesidades ----- */}
        {step === 3 && (
          <div className="wizard__pane">
            <label className="wizard__flabel">Nombre del lugar *</label>
            <input
              value={form.name}
              onChange={(e) => set('name', e.target.value)}
              placeholder="Ej: Hospital de Los Teques, Refugio Escuela Bolívar…"
            />

            <label className="wizard__flabel">{form.helpMode === 'offers' ? 'Recursos disponibles' : 'Suministros necesarios'}</label>
            <div className="chip-grid">
              {SUPPLY_CHIPS.map((chip) => (
                <button
                  type="button"
                  key={chip}
                  className={'chip-select' + (form.supplies.includes(chip) ? ' chip-select--active' : '')}
                  onClick={() => toggleSupply(chip)}
                  aria-pressed={form.supplies.includes(chip)}
                >
                  {chip}
                </button>
              ))}
            </div>
            {form.supplies.includes('Otro') && (
              <input
                style={{ marginTop: 8 }}
                value={form.suppliesOther}
                onChange={(e) => set('suppliesOther', e.target.value)}
                placeholder="Especifica otro suministro…"
              />
            )}

            {isHospital && (
              <>
                <label className="wizard__flabel">Personas siendo atendidas</label>
                <div className="range-row">
                  {PEOPLE_RANGES.map((r) => (
                    <button
                      type="button"
                      key={r}
                      className={'range-btn' + (form.peopleRange === r && !form.peopleExact ? ' range-btn--active' : '')}
                      onClick={() => { set('peopleRange', r); set('peopleExact', '') }}
                      aria-pressed={form.peopleRange === r && !form.peopleExact}
                    >
                      {r}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  inputMode="numeric"
                  min="0"
                  style={{ marginTop: 8 }}
                  value={form.peopleExact}
                  onChange={(e) => { set('peopleExact', e.target.value); set('peopleRange', '') }}
                  placeholder="O ingresa un número exacto"
                />

                <label className="wizard__check">
                  <input type="checkbox" checked={form.blood_needed} onChange={(e) => set('blood_needed', e.target.checked)} />
                  <span>Se necesitan donaciones de sangre</span>
                </label>
                {form.blood_needed && (
                  <input value={form.blood_types} onChange={(e) => set('blood_types', e.target.value)} placeholder="Tipos de sangre (ej: O-, A+)" />
                )}
              </>
            )}
          </div>
        )}

        {/* ----- Paso 4: Detalles ----- */}
        {step === 4 && (
          <div className="wizard__pane">
            <div className="media-actions">
              <label className="media-btn">
                <Icon name="camera" size={18} /> {photo ? 'Cambiar foto' : 'Agregar foto'}
                <input type="file" accept="image/*" capture="environment" onChange={onPhoto} hidden />
              </label>
              {photo && (
                <div className="media-preview">
                  <img src={photo.url || "/placeholder.svg"} alt="Vista previa" className="photo-thumb" />
                  <button type="button" className="iconbtn" onClick={() => setPhoto(null)} aria-label="Eliminar foto">
                    <Icon name="trash" size={16} />
                  </button>
                </div>
              )}
            </div>

            <label className="wizard__flabel">Resumen de la situación (opcional)</label>
            <textarea value={form.summary} onChange={(e) => set('summary', e.target.value)} placeholder="Describe qué está pasando en este punto…" />

            <button type="button" className="more-toggle" onClick={() => setShowMore((v) => !v)} aria-expanded={showMore}>
              <Icon name="chevron" size={16} className={showMore ? 'more-toggle__chev more-toggle__chev--open' : 'more-toggle__chev'} />
              Agregar más detalles (opcional)
            </button>
            {showMore && (
              <div className="more-section">
                <label className="wizard__flabel">Municipio / parroquia</label>
                <input value={form.municipio} onChange={(e) => set('municipio', e.target.value)} />
                <label className="wizard__flabel">Punto de entrega de donaciones</label>
                <input value={form.donation_poc} onChange={(e) => set('donation_poc', e.target.value)} placeholder="Nombre, teléfono o dirección de quien recibe" />
                <label className="wizard__flabel">Tu nombre</label>
                <input value={form.submitter_name} onChange={(e) => set('submitter_name', e.target.value)} />
                <label className="wizard__flabel">Tu contacto</label>
                <input value={form.submitter_contact} onChange={(e) => set('submitter_contact', e.target.value)} placeholder="Teléfono o correo" />
              </div>
            )}

            <p className="wizard__disclaimer">
              <Icon name="info" size={14} /> Será revisado por un administrador antes de publicarse.
            </p>
          </div>
        )}

        {stepError && <div className="notice notice--err">{stepError}</div>}
        {status.error && <div className="notice notice--err">{status.error}</div>}
      </div>

      <div className="wizard__footer">
        {step > 1 ? (
          <button type="button" className="btn btn--ghost" onClick={back}>
            <Icon name="arrowLeft" size={16} /> Atrás
          </button>
        ) : (
          <button type="button" className="btn btn--ghost" onClick={onClose}>Cancelar</button>
        )}
        {step < 4 ? (
          <button type="button" className="btn btn--primary wizard__next" onClick={next}>
            Siguiente <Icon name="arrowRight" size={16} />
          </button>
        ) : (
          <button type="button" className="btn btn--primary wizard__next" onClick={submit} disabled={status.sending}>
            {status.sending ? 'Enviando…' : 'Enviar punto'}
          </button>
        )}
      </div>
    </aside>
  )
}
