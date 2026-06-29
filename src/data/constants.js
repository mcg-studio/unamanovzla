// Niveles de gravedad usados para colorear el mapa y las fichas.
export const STATUS_LEVELS = {
  critico: { color: '#dc2626' },
  alto: { color: '#ea580c' },
  medio: { color: '#d97706' },
  estable: { color: '#16a34a' },
  sin_datos: { color: '#94a3b8' },
}

export const STATUS_ORDER = ['critico', 'alto', 'medio', 'estable', 'sin_datos']

// ---------------------------------------------------------------------------
// Categorias de puntos de ayuda. Las etiquetas se traducen via i18n usando la
// clave `category.<key>`. El color se usa para los marcadores del mapa y los
// distintivos (badges).
// ---------------------------------------------------------------------------
export const CATEGORIES = [
  { key: 'hospital', color: '#dc2626' },
  { key: 'punto_medico', color: '#db2777' },
  { key: 'centro_acopio', color: '#2563eb' },
  { key: 'refugio', color: '#0d9488' },
  { key: 'organizacion', color: '#0891b2' },
  { key: 'rescate', color: '#ea580c' },
  { key: 'parroquia', color: '#64748b' },
  { key: 'otro', color: '#475569' },
]

export const CATEGORY_KEYS = CATEGORIES.map((c) => c.key)
export const CATEGORY_COLOR = Object.fromEntries(CATEGORIES.map((c) => [c.key, c.color]))

// Categorias que el publico puede elegir al proponer / reportar un punto nuevo.
export const REPORTABLE_CATEGORIES = [
  'centro_acopio',
  'refugio',
  'punto_medico',
  'hospital',
  'organizacion',
  'rescate',
  'otro',
]

// ---------------------------------------------------------------------------
// Estado de verificacion de cada punto.
// ---------------------------------------------------------------------------
export const VERIFICATION = {
  verificado: { color: '#16a34a' },
  pendiente: { color: '#d97706' },
  sin_actualizar: { color: '#94a3b8' },
}
export const VERIFICATION_KEYS = ['verificado', 'pendiente', 'sin_actualizar']

// Tipos de actualizacion (timeline + reportes).
export const UPDATE_TYPES = ['estado', 'necesidades', 'recursos', 'sangre', 'donacion', 'otro']

export const STATES = ['Distrito Capital', 'Miranda', 'La Guaira']

// Sugerencias comunes de necesidades / recursos (chips en formularios).
export const COMMON_NEEDS = [
  'Agua potable',
  'Alimentos no perecederos',
  'Medicinas',
  'Insumos medicos',
  'Ropa',
  'Cobijas / colchones',
  'Pañales',
  'Productos de higiene',
  'Voluntarios',
  'Transporte',
  'Combustible',
  'Donacion de sangre',
]

export const COMMON_RESOURCES = [
  'Albergue / refugio',
  'Comida caliente',
  'Atencion medica',
  'Agua',
  'Punto de carga / electricidad',
  'Internet / comunicaciones',
  'Transporte',
  'Almacenamiento',
  'Voluntarios disponibles',
]

// Estado inicial (vacio) de una ubicacion antes de cualquier actualizacion.
export function emptyStatus() {
  return {
    category: 'otro',
    verification: 'sin_actualizar',
    status_level: 'sin_datos',
    summary: '',
    description: '',
    address: '',
    contact_phone: '',
    contact_whatsapp: '',
    contact_email: '',
    website: '',
    needs: [],
    resources: [],
    donation_instructions: '',
    photos: [],
    supplies_needed: '',
    donation_poc: '',
    rescue_teams: '',
    buildings_searched: '',
    people_aided: '',
    blood_needed: false,
    blood_types: '',
    updated_at: null,
    updated_by: '',
  }
}
