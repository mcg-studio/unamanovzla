// Utilidades de busqueda: normaliza texto (sin acentos), busca en nombres y
// campos de contenido, y empareja donaciones con necesidades.

export function normalize(s) {
  return (s || '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
}

const SEARCH_TEXT_FIELDS = [
  'name', 'state', 'municipio', 'summary', 'description', 'address',
  'supplies_needed', 'rescue_teams', 'buildings_searched', 'people_aided',
  'blood_types', 'donation_poc', 'donation_instructions',
]
const SEARCH_ARRAY_FIELDS = ['needs', 'resources']

export function locationText(loc) {
  const parts = []
  for (const f of SEARCH_TEXT_FIELDS) if (loc[f]) parts.push(loc[f])
  for (const f of SEARCH_ARRAY_FIELDS) if (Array.isArray(loc[f])) parts.push(loc[f].join(' '))
  return normalize(parts.join(' '))
}

export function matchLocation(loc, nq) {
  if (!nq) return true
  return locationText(loc).includes(nq)
}

export function parseDonationItems(text) {
  return [...new Set(
    (text || '').split(/[\n,;]+/).map((s) => s.trim()).filter(Boolean),
  )]
}

// Dado lo que la persona puede donar, sugiere lugares que lo necesitan.
export function matchDonations(locations, items) {
  const normItems = items.map((it) => ({ raw: it, n: normalize(it) })).filter((x) => x.n.length >= 2)
  if (!normItems.length) return []

  const order = { critico: 0, alto: 1, medio: 2, estable: 3, sin_datos: 4 }
  const results = []
  for (const l of locations) {
    const bloodText = l.blood_needed ? 'sangre donacion de sangre ' + (l.blood_types || '') : ''
    const needsArr = Array.isArray(l.needs) ? l.needs.join(' ') : ''
    const needText = normalize([needsArr, l.supplies_needed, bloodText].filter(Boolean).join(' '))
    if (!needText.trim()) continue
    const matched = []
    for (const it of normItems) {
      const words = it.n.split(/[^a-z0-9+áéíóúñ]+/i).filter((w) => w.length >= 3)
      if (needText.includes(it.n) || words.some((w) => needText.includes(w))) matched.push(it.raw)
    }
    if (matched.length) results.push({ location: l, matched })
  }
  results.sort(
    (a, b) =>
      b.matched.length - a.matched.length ||
      (order[a.location.status_level] ?? 9) - (order[b.location.status_level] ?? 9),
  )
  return results
}
