import { CATEGORY_COLOR, STATUS_LEVELS, VERIFICATION } from '../data/constants'

export function categoryColor(cat) {
  return CATEGORY_COLOR[cat] || CATEGORY_COLOR.otro
}

export function statusColor(level) {
  return (STATUS_LEVELS[level] || STATUS_LEVELS.sin_datos).color
}

export function verificationColor(v) {
  return (VERIFICATION[v] || VERIFICATION.sin_actualizar).color
}

// Mapea categoria -> icono del set de Icons.jsx.
export const CATEGORY_ICON = {
  hospital: 'cross',
  punto_medico: 'cross',
  centro_acopio: 'box',
  refugio: 'home',
  organizacion: 'users',
  rescate: 'lifebuoy',
  parroquia: 'pin',
  otro: 'pin',
}

export const UPDATE_ICON = {
  estado: 'info',
  necesidades: 'box',
  recursos: 'check',
  sangre: 'droplet',
  donacion: 'heart',
  otro: 'bell',
}

// Tiempo relativo legible ("hace 3 h", "3h ago").
export function timeAgo(iso, lang = 'es') {
  if (!iso) return null
  const then = new Date(iso).getTime()
  if (!Number.isFinite(then)) return null
  const sec = Math.round((Date.now() - then) / 1000)
  const ES = { now: 'ahora', m: 'min', h: 'h', d: 'd', sem: 'sem' }
  const EN = { now: 'now', m: 'm', h: 'h', d: 'd', sem: 'w' }
  const L = lang === 'en' ? EN : ES
  if (sec < 60) return L.now
  const min = Math.round(sec / 60)
  if (min < 60) return `${min} ${L.m}`
  const hr = Math.round(min / 60)
  if (hr < 24) return `${hr} ${L.h}`
  const day = Math.round(hr / 24)
  if (day < 7) return `${day} ${L.d}`
  const wk = Math.round(day / 7)
  return `${wk} ${L.sem}`
}

export function formatDate(iso, lang = 'es') {
  if (!iso) return ''
  try {
    return new Date(iso).toLocaleString(lang === 'en' ? 'en-US' : 'es-VE', {
      day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit',
    })
  } catch {
    return ''
  }
}
