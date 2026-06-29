import { createContext, useCallback, useContext, useEffect, useState } from 'react'

const LS_LANG = 'mapa_ayuda_lang'

// Diccionario de traducciones para las superficies publicas de la app.
// Las claves faltantes en un idioma caen al texto en espanol.
const DICT = {
  es: {
    'nav.map': 'Mapa',
    'nav.directory': 'Puntos de ayuda',
    'nav.donate': 'Donar',
    'nav.updates': 'Actualizaciones',
    'nav.report': 'Reportar',
    'nav.about': 'Acerca de',
    'nav.subtitle': 'Coordinación humanitaria · Venezuela',
    'nav.review': 'Revisar',
    'nav.team': 'Equipo',
    'nav.signout': 'Salir',
    'nav.admin': 'Admin',
    'nav.reviewReports': 'Revisar reportes',
    'nav.admins': 'Administradores',
    'nav.home': 'Inicio',
    'nav.openMenu': 'Abrir menú',
    'nav.closeMenu': 'Cerrar menú',
    'nav.mainNav': 'Navegación principal',

    'hero.title': 'Mapa de ayuda humanitaria en Venezuela',
    'hero.subtitle': 'Coordinamos necesidades, recursos y puntos de ayuda en tiempo real. Encuentra hospitales, refugios y centros de acopio cerca de ti.',
    'hero.explore': 'Explorar el mapa',
    'hero.report': 'Reportar un punto',
    'hero.stat.points': 'Puntos registrados',
    'hero.stat.verified': 'Verificados',
    'hero.stat.help': 'Centros de ayuda',
    'hero.stat.critical': 'En estado crítico',

    'dir.title': 'Puntos de ayuda',
    'dir.lead': 'Directorio de hospitales, refugios y centros de acopio registrados en el mapa.',
    'dir.search': 'Buscar por nombre, estado o municipio…',
    'dir.allKinds': 'Todos los tipos',
    'dir.allStates': 'Todos los estados',
    'dir.count': 'puntos',
    'dir.empty': 'No se encontraron puntos con esos filtros.',

    'about.title': '¿Qué es Mapa de Ayuda?',
    'about.subtitle': 'Una plataforma colaborativa para coordinar ayuda humanitaria durante emergencias en Venezuela.',
    'about.p1': 'Mapa de Ayuda conecta a quienes necesitan ayuda con quienes pueden ofrecerla. Reúne en un solo mapa hospitales, refugios, centros de acopio y otros puntos clave, con información verificada por la comunidad.',
    'about.p2': 'Cualquier persona puede reportar un punto o enviar una actualización. Un equipo de administradores revisa la información antes de publicarla para mantener el mapa confiable.',
    'about.how': '¿Cómo funciona?',
    'about.how1': 'Explora el mapa para encontrar puntos de ayuda cerca de ti.',
    'about.how2': 'Reporta un nuevo punto o envía una actualización sobre uno existente.',
    'about.how3': 'Los administradores verifican la información antes de publicarla.',
    'about.how4': 'Coordina donaciones y recursos con los puntos que más lo necesitan.',
    'about.types': 'Tipos de puntos',
    'about.reportCta': 'Reportar un punto',

    'wa.title': 'Reporta por WhatsApp',
    'wa.desc': 'Pronto podrás enviar reportes y actualizaciones directamente por WhatsApp. Por ahora, usa el botón Reportar del mapa.',
    'wa.button': 'Escribir por WhatsApp',
    'wa.alt': 'Prefiero usar el formulario',
    'wa.soon': 'Integración de WhatsApp próximamente',

    'legend.title': 'Nivel de gravedad',

    'common.close': 'Cerrar',
    'common.back': 'Volver',
    'common.loading': 'Cargando…',

    'verif.verificado': 'Verificado',
    'verif.pendiente': 'Pendiente de verificar',
    'verif.sin_actualizar': 'Sin actualizar',

    'profile.timeline': 'Bitácora de actualizaciones',
    'profile.noUpdates': 'Aún no hay actualizaciones publicadas para este punto.',
    'profile.contact': 'Contacto',
    'profile.phone': 'Teléfono',
    'profile.whatsapp': 'WhatsApp',
    'profile.email': 'Correo',
    'profile.website': 'Sitio web',
    'profile.address': 'Dirección',
    'profile.needs': 'Necesidades',
    'profile.resources': 'Recursos disponibles',
    'profile.donations': '¿Dónde enviar donaciones?',
    'profile.situation': 'Situación',
    'profile.supplies': 'Suministros necesarios',
    'profile.sendUpdate': 'Enviar una actualización',
    'profile.adminEdit': 'Editar y publicar (admin)',
    'profile.postUpdate': 'Publicar actualización',
    'profile.updateBody': 'Escribe la actualización…',
    'profile.publish': 'Publicar',
    'profile.delete': 'Eliminar',
    'profile.updatedAt': 'Actualizado',
  },
  en: {
    'nav.map': 'Map',
    'nav.directory': 'Help points',
    'nav.donate': 'Donate',
    'nav.updates': 'Updates',
    'nav.report': 'Report',
    'nav.about': 'About',
    'nav.subtitle': 'Humanitarian coordination · Venezuela',
    'nav.review': 'Review',
    'nav.team': 'Team',
    'nav.signout': 'Sign out',
    'nav.admin': 'Admin',
    'nav.reviewReports': 'Review reports',
    'nav.admins': 'Administrators',
    'nav.home': 'Home',
    'nav.openMenu': 'Open menu',
    'nav.closeMenu': 'Close menu',
    'nav.mainNav': 'Main navigation',

    'hero.title': 'Humanitarian aid map for Venezuela',
    'hero.subtitle': 'We coordinate needs, resources and help points in real time. Find hospitals, shelters and collection centers near you.',
    'hero.explore': 'Explore the map',
    'hero.report': 'Report a point',
    'hero.stat.points': 'Registered points',
    'hero.stat.verified': 'Verified',
    'hero.stat.help': 'Help centers',
    'hero.stat.critical': 'In critical state',

    'dir.title': 'Help points',
    'dir.lead': 'Directory of hospitals, shelters and collection centers registered on the map.',
    'dir.search': 'Search by name, state or municipality…',
    'dir.allKinds': 'All types',
    'dir.allStates': 'All states',
    'dir.count': 'points',
    'dir.empty': 'No points found with those filters.',

    'about.title': 'What is Mapa de Ayuda?',
    'about.subtitle': 'A collaborative platform to coordinate humanitarian aid during emergencies in Venezuela.',
    'about.p1': 'Mapa de Ayuda connects those who need help with those who can offer it. It brings hospitals, shelters, collection centers and other key points together on a single map, with community-verified information.',
    'about.p2': 'Anyone can report a point or submit an update. A team of administrators reviews the information before publishing it to keep the map trustworthy.',
    'about.how': 'How does it work?',
    'about.how1': 'Explore the map to find help points near you.',
    'about.how2': 'Report a new point or submit an update about an existing one.',
    'about.how3': 'Administrators verify the information before publishing it.',
    'about.how4': 'Coordinate donations and resources with the points that need them most.',
    'about.types': 'Point types',
    'about.reportCta': 'Report a point',

    'wa.title': 'Report via WhatsApp',
    'wa.desc': 'Soon you will be able to send reports and updates directly via WhatsApp. For now, use the Report button on the map.',
    'wa.button': 'Message on WhatsApp',
    'wa.alt': 'I prefer to use the form',
    'wa.soon': 'WhatsApp integration coming soon',

    'legend.title': 'Severity level',

    'common.close': 'Close',
    'common.back': 'Back',
    'common.loading': 'Loading…',

    'verif.verificado': 'Verified',
    'verif.pendiente': 'Pending verification',
    'verif.sin_actualizar': 'Not updated',

    'profile.timeline': 'Updates timeline',
    'profile.noUpdates': 'No updates have been published for this point yet.',
    'profile.contact': 'Contact',
    'profile.phone': 'Phone',
    'profile.whatsapp': 'WhatsApp',
    'profile.email': 'Email',
    'profile.website': 'Website',
    'profile.address': 'Address',
    'profile.needs': 'Needs',
    'profile.resources': 'Available resources',
    'profile.donations': 'Where to send donations?',
    'profile.situation': 'Situation',
    'profile.supplies': 'Supplies needed',
    'profile.sendUpdate': 'Send an update',
    'profile.adminEdit': 'Edit and publish (admin)',
    'profile.postUpdate': 'Post update',
    'profile.updateBody': 'Write the update…',
    'profile.publish': 'Publish',
    'profile.delete': 'Delete',
    'profile.updatedAt': 'Updated',
  },
}

const I18nContext = createContext({ lang: 'es', t: (k) => k, toggle: () => {}, setLang: () => {} })

export function I18nProvider({ children }) {
  const [lang, setLang] = useState('es')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(LS_LANG)
      if (saved === 'es' || saved === 'en') setLang(saved)
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem(LS_LANG, lang)
    } catch {}
    if (typeof document !== 'undefined') document.documentElement.lang = lang
  }, [lang])

  const t = useCallback(
    (key) => (DICT[lang] && DICT[lang][key]) ?? DICT.es[key] ?? key,
    [lang],
  )
  const toggle = useCallback(() => setLang((l) => (l === 'es' ? 'en' : 'es')), [])

  return (
    <I18nContext.Provider value={{ lang, t, toggle, setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
