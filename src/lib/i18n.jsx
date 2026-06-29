import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const LS_LANG = 'mapa_ayuda_lang'

const DICT = {
  es: {
    'app.title': 'Mapa de ayuda',
    'app.subtitle': 'Coordinación de ayuda · Terremoto del 24 de junio',
    'app.region': 'Distrito Capital · Miranda · La Guaira',

    'nav.map': 'Mapa',
    'nav.directory': 'Puntos de ayuda',
    'nav.donate': 'Donar',
    'nav.updates': 'Actualizaciones',
    'nav.report': 'Reportar',
    'nav.admin': 'Administración',
    'nav.menu': 'Menú',

    'common.close': 'Cerrar',
    'common.cancel': 'Cancelar',
    'common.save': 'Guardar',
    'common.send': 'Enviar',
    'common.back': 'Volver',
    'common.next': 'Siguiente',
    'common.previous': 'Anterior',
    'common.search': 'Buscar',
    'common.loading': 'Cargando…',
    'common.all': 'Todos',
    'common.allStates': 'Todos los estados',
    'common.allCategories': 'Todas las categorías',
    'common.optional': 'opcional',
    'common.required': 'obligatorio',
    'common.viewProfile': 'Ver ficha',
    'common.viewOnMap': 'Ver en el mapa',
    'common.results': 'resultados',
    'common.noResults': 'No se encontraron resultados.',
    'common.updated': 'Actualizado',
    'common.never': 'Sin actualizaciones',
    'common.yes': 'Sí',
    'common.no': 'No',
    'common.continue': 'Continuar',
    'common.share': 'Compartir',
    'common.copied': 'Enlace copiado',

    'category.hospital': 'Hospital',
    'category.punto_medico': 'Punto médico',
    'category.centro_acopio': 'Centro de acopio',
    'category.refugio': 'Refugio',
    'category.organizacion': 'Organización comunitaria',
    'category.rescate': 'Equipo de rescate',
    'category.parroquia': 'Parroquia',
    'category.otro': 'Otro punto',

    'verification.verificado': 'Verificado',
    'verification.pendiente': 'Pendiente',
    'verification.sin_actualizar': 'Sin actualizar',
    'verification.verificado.help': 'Confirmado por el equipo de coordinación',
    'verification.pendiente.help': 'Reportado, en proceso de verificación',
    'verification.sin_actualizar.help': 'Aún no se ha confirmado información reciente',

    'status.critico': 'Crítico',
    'status.alto': 'Alto',
    'status.medio': 'Medio',
    'status.estable': 'Estable',
    'status.sin_datos': 'Sin datos',
    'status.label': 'Nivel de urgencia',

    'update.estado': 'Estado general',
    'update.necesidades': 'Necesidades',
    'update.recursos': 'Recursos disponibles',
    'update.sangre': 'Donación de sangre',
    'update.donacion': 'Punto de donación',
    'update.otro': 'Otro',

    'map.locating': 'Toca el mapa para ubicar el punto',
    'map.legend': 'Leyenda',
    'map.categories': 'Categorías',
    'map.urgency': 'Urgencia',
    'map.points': 'puntos',

    'disclaimer.text': 'Información colaborativa y de referencia. Verifica antes de actuar y prioriza fuentes oficiales en emergencias.',

    'directory.title': 'Puntos de ayuda',
    'directory.subtitle': 'Hospitales, centros de acopio, refugios y organizaciones que están coordinando la respuesta.',
    'directory.searchPlaceholder': 'Buscar por nombre, zona o necesidad…',
    'directory.needs': 'Necesita',
    'directory.offers': 'Ofrece',
    'directory.sortRecent': 'Más recientes',
    'directory.sortUrgency': 'Mayor urgencia',
    'directory.sortName': 'Nombre',

    'profile.about': 'Acerca de',
    'profile.needs': 'Necesidades actuales',
    'profile.resources': 'Recursos disponibles',
    'profile.contact': 'Contacto',
    'profile.donations': 'Cómo donar',
    'profile.timeline': 'Actualizaciones',
    'profile.noUpdates': 'Todavía no hay actualizaciones publicadas.',
    'profile.call': 'Llamar',
    'profile.whatsapp': 'WhatsApp',
    'profile.email': 'Correo',
    'profile.website': 'Sitio web',
    'profile.reportUpdate': 'Enviar actualización',
    'profile.directions': 'Cómo llegar',
    'profile.photos': 'Fotos',

    'donate.title': 'Quiero donar',
    'donate.subtitle': 'Dinos qué puedes aportar y te mostramos los puntos que lo necesitan ahora.',
    'donate.placeholder': 'Ej: agua, medicinas, pañales, ropa de niño…',
    'donate.match': 'Buscar coincidencias',
    'donate.matches': 'Puntos que coinciden',
    'donate.noMatches': 'No encontramos puntos que necesiten eso por ahora. Intenta con otros términos.',
    'donate.matched': 'Coincide con',
    'donate.bloodTitle': 'Donación de sangre',
    'donate.bloodSubtitle': 'Centros que necesitan donantes de sangre.',

    'updates.title': 'Actualizaciones',
    'updates.subtitle': 'Lo más reciente reportado por los puntos de ayuda.',
    'updates.empty': 'Aún no hay actualizaciones.',
    'updates.from': 'desde',

    'report.title': 'Reportar información',
    'report.subtitle': 'Ayuda a mantener el mapa actualizado. Tu reporte será revisado antes de publicarse.',
    'report.step': 'Paso',
    'report.of': 'de',
    'report.q.what': '¿Qué quieres reportar?',
    'report.opt.update': 'Actualizar un punto existente',
    'report.opt.updateDesc': 'Nuevas necesidades, recursos o estado de un lugar que ya está en el mapa.',
    'report.opt.new': 'Registrar un punto nuevo',
    'report.opt.newDesc': 'Un centro de acopio, refugio u organización que aún no aparece.',
    'report.q.which': '¿Qué punto?',
    'report.q.whichPlaceholder': 'Busca el punto por nombre…',
    'report.q.category': 'Categoría del punto',
    'report.q.name': 'Nombre del punto',
    'report.q.location': 'Ubicación',
    'report.q.locationHelp': 'Toca el mapa para marcar dónde está.',
    'report.q.details': 'Detalles',
    'report.q.updateType': 'Tipo de actualización',
    'report.q.message': 'Mensaje',
    'report.q.messagePlaceholder': 'Describe la situación, necesidades o recursos…',
    'report.q.needs': '¿Qué necesita?',
    'report.q.resources': '¿Qué ofrece / tiene disponible?',
    'report.q.photo': 'Foto',
    'report.q.photoHelp': 'Una imagen ayuda a verificar la información (opcional).',
    'report.q.contact': 'Tu contacto',
    'report.q.contactHelp': 'Para que el equipo pueda confirmar contigo (no se publica).',
    'report.q.review': 'Revisar y enviar',
    'report.submit': 'Enviar reporte',
    'report.success': 'Gracias. Tu reporte fue enviado y será revisado pronto.',
    'report.sending': 'Enviando…',
    'report.addAnother': 'Enviar otro reporte',

    'admin.title': 'Panel de administración',
    'admin.queue': 'Reportes pendientes',
    'admin.points': 'Gestionar puntos',
    'admin.admins': 'Administradores',
    'admin.empty': 'No hay reportes pendientes.',
    'admin.approve': 'Aprobar',
    'admin.reject': 'Rechazar',
    'admin.signOut': 'Cerrar sesión',
    'admin.pending': 'pendientes',

    'auth.title': 'Acceso de administración',
    'auth.email': 'Correo',
    'auth.password': 'Contraseña',
    'auth.signIn': 'Iniciar sesión',
    'auth.request': 'Solicitar acceso',
    'auth.forgot': '¿Olvidaste tu contraseña?',

    'lang.toggle': 'English',
  },
  en: {
    'app.title': 'Aid Map',
    'app.subtitle': 'Aid coordination · June 24 earthquake',
    'app.region': 'Distrito Capital · Miranda · La Guaira',

    'nav.map': 'Map',
    'nav.directory': 'Aid points',
    'nav.donate': 'Donate',
    'nav.updates': 'Updates',
    'nav.report': 'Report',
    'nav.admin': 'Admin',
    'nav.menu': 'Menu',

    'common.close': 'Close',
    'common.cancel': 'Cancel',
    'common.save': 'Save',
    'common.send': 'Send',
    'common.back': 'Back',
    'common.next': 'Next',
    'common.previous': 'Previous',
    'common.search': 'Search',
    'common.loading': 'Loading…',
    'common.all': 'All',
    'common.allStates': 'All states',
    'common.allCategories': 'All categories',
    'common.optional': 'optional',
    'common.required': 'required',
    'common.viewProfile': 'View details',
    'common.viewOnMap': 'View on map',
    'common.results': 'results',
    'common.noResults': 'No results found.',
    'common.updated': 'Updated',
    'common.never': 'No updates yet',
    'common.yes': 'Yes',
    'common.no': 'No',
    'common.continue': 'Continue',
    'common.share': 'Share',
    'common.copied': 'Link copied',

    'category.hospital': 'Hospital',
    'category.punto_medico': 'Medical point',
    'category.centro_acopio': 'Collection center',
    'category.refugio': 'Shelter',
    'category.organizacion': 'Community organization',
    'category.rescate': 'Rescue team',
    'category.parroquia': 'Parish',
    'category.otro': 'Other point',

    'verification.verificado': 'Verified',
    'verification.pendiente': 'Pending',
    'verification.sin_actualizar': 'Not updated',
    'verification.verificado.help': 'Confirmed by the coordination team',
    'verification.pendiente.help': 'Reported, being verified',
    'verification.sin_actualizar.help': 'No recent information confirmed yet',

    'status.critico': 'Critical',
    'status.alto': 'High',
    'status.medio': 'Medium',
    'status.estable': 'Stable',
    'status.sin_datos': 'No data',
    'status.label': 'Urgency level',

    'update.estado': 'General status',
    'update.necesidades': 'Needs',
    'update.recursos': 'Available resources',
    'update.sangre': 'Blood donation',
    'update.donacion': 'Donation point',
    'update.otro': 'Other',

    'map.locating': 'Tap the map to place the point',
    'map.legend': 'Legend',
    'map.categories': 'Categories',
    'map.urgency': 'Urgency',
    'map.points': 'points',

    'disclaimer.text': 'Collaborative reference information. Verify before acting and prioritize official sources during emergencies.',

    'directory.title': 'Aid points',
    'directory.subtitle': 'Hospitals, collection centers, shelters and organizations coordinating the response.',
    'directory.searchPlaceholder': 'Search by name, area or need…',
    'directory.needs': 'Needs',
    'directory.offers': 'Offers',
    'directory.sortRecent': 'Most recent',
    'directory.sortUrgency': 'Highest urgency',
    'directory.sortName': 'Name',

    'profile.about': 'About',
    'profile.needs': 'Current needs',
    'profile.resources': 'Available resources',
    'profile.contact': 'Contact',
    'profile.donations': 'How to donate',
    'profile.timeline': 'Updates',
    'profile.noUpdates': 'No updates published yet.',
    'profile.call': 'Call',
    'profile.whatsapp': 'WhatsApp',
    'profile.email': 'Email',
    'profile.website': 'Website',
    'profile.reportUpdate': 'Send update',
    'profile.directions': 'Directions',
    'profile.photos': 'Photos',

    'donate.title': 'I want to donate',
    'donate.subtitle': 'Tell us what you can contribute and we will show the points that need it now.',
    'donate.placeholder': 'E.g. water, medicine, diapers, kids clothing…',
    'donate.match': 'Find matches',
    'donate.matches': 'Matching points',
    'donate.noMatches': 'We could not find points needing that right now. Try other terms.',
    'donate.matched': 'Matches',
    'donate.bloodTitle': 'Blood donation',
    'donate.bloodSubtitle': 'Centers in need of blood donors.',

    'updates.title': 'Updates',
    'updates.subtitle': 'The latest reported by aid points.',
    'updates.empty': 'No updates yet.',
    'updates.from': 'from',

    'report.title': 'Report information',
    'report.subtitle': 'Help keep the map up to date. Your report will be reviewed before publishing.',
    'report.step': 'Step',
    'report.of': 'of',
    'report.q.what': 'What would you like to report?',
    'report.opt.update': 'Update an existing point',
    'report.opt.updateDesc': 'New needs, resources or status for a place already on the map.',
    'report.opt.new': 'Register a new point',
    'report.opt.newDesc': 'A collection center, shelter or organization not yet listed.',
    'report.q.which': 'Which point?',
    'report.q.whichPlaceholder': 'Search the point by name…',
    'report.q.category': 'Point category',
    'report.q.name': 'Point name',
    'report.q.location': 'Location',
    'report.q.locationHelp': 'Tap the map to mark where it is.',
    'report.q.details': 'Details',
    'report.q.updateType': 'Update type',
    'report.q.message': 'Message',
    'report.q.messagePlaceholder': 'Describe the situation, needs or resources…',
    'report.q.needs': 'What does it need?',
    'report.q.resources': 'What does it offer / have available?',
    'report.q.photo': 'Photo',
    'report.q.photoHelp': 'An image helps verify the information (optional).',
    'report.q.contact': 'Your contact',
    'report.q.contactHelp': 'So the team can confirm with you (not published).',
    'report.q.review': 'Review and send',
    'report.submit': 'Send report',
    'report.success': 'Thank you. Your report was sent and will be reviewed soon.',
    'report.sending': 'Sending…',
    'report.addAnother': 'Send another report',

    'admin.title': 'Admin panel',
    'admin.queue': 'Pending reports',
    'admin.points': 'Manage points',
    'admin.admins': 'Admins',
    'admin.empty': 'No pending reports.',
    'admin.approve': 'Approve',
    'admin.reject': 'Reject',
    'admin.signOut': 'Sign out',
    'admin.pending': 'pending',

    'auth.title': 'Admin access',
    'auth.email': 'Email',
    'auth.password': 'Password',
    'auth.signIn': 'Sign in',
    'auth.request': 'Request access',
    'auth.forgot': 'Forgot your password?',

    'lang.toggle': 'Español',
  },
}

const I18nContext = createContext(null)

export function I18nProvider({ children }) {
  const [lang, setLang] = useState(() => {
    if (typeof localStorage !== 'undefined') {
      const saved = localStorage.getItem(LS_LANG)
      if (saved === 'es' || saved === 'en') return saved
    }
    return 'es'
  })

  useEffect(() => {
    try {
      localStorage.setItem(LS_LANG, lang)
    } catch {}
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key, vars) => {
      let str = (DICT[lang] && DICT[lang][key]) || (DICT.es && DICT.es[key]) || key
      if (vars) for (const k of Object.keys(vars)) str = str.replace(`{${k}}`, vars[k])
      return str
    },
    [lang],
  )

  const toggle = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), [])

  const value = useMemo(() => ({ lang, setLang, toggle, t }), [lang, toggle, t])
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error('useI18n must be used within I18nProvider')
  return ctx
}
