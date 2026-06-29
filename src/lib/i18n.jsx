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
    'nav.subtitle': 'Coordinando la ayuda en Venezuela',
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

    'hero.title': 'Conectando a Venezuela cuando más lo necesita',
    'hero.subtitle': 'Conectando necesidades, recursos y apoyo con la información más actualizada posible.',
    'hero.explore': 'Explorar el mapa',
    'hero.report': 'Reportar un punto',
    'hero.note': 'El mapa se actualiza con la información que reporta y verifica la comunidad. Ayúdanos a mantenerlo al día.',
    'hero.stat.points': 'Puntos registrados',
    'hero.stat.verified': 'Puntos verificados',
    'hero.stat.recent': 'Actualizaciones recientes',
    'hero.stat.active': 'Centros activos',

    'dir.title': 'Puntos de ayuda',
    'dir.lead': 'Directorio de hospitales, refugios y centros de acopio registrados en el mapa.',
    'dir.search': 'Buscar por nombre, estado o municipio…',
    'dir.allKinds': 'Todos los tipos',
    'dir.allStates': 'Todos los estados',
    'dir.count': 'puntos',
    'dir.empty': 'No se encontraron puntos con esos filtros.',

    'about.title': '¿Qué es Una Mano?',
    'about.subtitle': 'Una plataforma colaborativa para coordinar ayuda durante emergencias en Venezuela.',
    'about.p1': 'Una Mano conecta a personas, organizaciones y comunidades durante situaciones de emergencia en Venezuela.',
    'about.p2': 'Aquí puedes encontrar hospitales, centros de acopio, refugios y otros puntos de apoyo que necesitan recursos o están brindando ayuda.',
    'about.p3': 'Nuestro objetivo es que la información llegue más rápido, que las donaciones lleguen al lugar correcto y que las comunidades puedan coordinarse de forma más efectiva cuando más lo necesitan.',
    'about.p4': 'La información publicada es revisada por administradores y actualizada por la comunidad para mantener el mapa lo más útil y confiable posible.',
    'about.how': '¿Cómo funciona?',
    'about.how1': 'Organizaciones y ciudadanos reportan información.',
    'about.how2': 'Los administradores verifican los datos.',
    'about.how3': 'Los puntos aprobados aparecen en el mapa.',
    'about.how4': 'Los centros de ayuda pueden actualizar sus necesidades y recursos disponibles.',
    'about.how5': 'Donantes y voluntarios pueden identificar dónde apoyar.',
    'about.types': 'Tipos de puntos',
    'about.help': '¿Quieres ayudar?',
    'about.help1': 'Reporta información',
    'about.help2': 'Actualiza un punto existente',
    'about.help3': 'Dona recursos',
    'about.help4': 'Comparte el mapa',
    'about.help5': 'Únete como voluntario',
    'about.reportCta': 'Reportar un punto',

    'wa.title': 'Reporta por WhatsApp',
    'wa.desc': 'Pronto podrás enviar reportes y actualizaciones directamente por WhatsApp. Por ahora, usa el botón Reportar del mapa.',
    'wa.button': 'Escribir por WhatsApp',
    'wa.alt': 'Prefiero usar el formulario',
    'wa.soon': 'Integración de WhatsApp próximamente',

    'legend.title': 'Nivel de gravedad',

    'disclaimer.text': 'Información colaborativa, aportada por la comunidad y revisada por administradores. Puede no estar verificada en tiempo real: confirma con el contacto del lugar antes de movilizar recursos o donaciones.',
    'disclaimer.close': 'Cerrar aviso',

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
    'profile.noDonationPoc': 'Aún no se ha registrado un punto de entrega para esta ubicación.',
    'profile.situation': 'Situación',
    'profile.supplies': 'Suministros necesarios',
    'profile.sendUpdate': 'Enviar una actualización',
    'profile.adminEdit': 'Editar y publicar (admin)',
    'profile.adminNotice': 'Edición directa de administrador. Los cambios se publican de inmediato.',
    'profile.postUpdate': 'Publicar actualización',
    'profile.updateBody': 'Escribe la actualización…',
    'profile.publish': 'Publicar',
    'profile.publishChanges': 'Publicar cambios',
    'profile.delete': 'Eliminar',
    'profile.cancel': 'Cancelar',
    'profile.updatedAt': 'Actualizado',
    'profile.noInfo': 'Sin información aún',
    'profile.severity': 'Nivel de gravedad',
    'profile.verification': 'Estado de verificación',
    'profile.rescue': 'Equipos de rescate / quién ayuda',
    'profile.buildings': 'Edificaciones en búsqueda de personas',
    'profile.peopleAided': 'Personas atendidas por el desastre',
    'profile.bloodNeeded': 'Se necesitan donaciones de sangre',
    'profile.bloodTypes': 'Tipos de sangre necesarios',
    'profile.donationPoc': 'Punto de entrega de donaciones',
  },
  en: {
    'nav.map': 'Map',
    'nav.directory': 'Help points',
    'nav.donate': 'Donate',
    'nav.updates': 'Updates',
    'nav.report': 'Report',
    'nav.about': 'About',
    'nav.subtitle': 'Coordinating aid in Venezuela',
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

    'hero.title': 'Connecting Venezuela when it matters most',
    'hero.subtitle': 'Connecting needs, resources and support with the most up-to-date information possible.',
    'hero.explore': 'Explore the map',
    'hero.report': 'Report a point',
    'hero.note': 'The map is updated with information reported and verified by the community. Help us keep it current.',
    'hero.stat.points': 'Registered points',
    'hero.stat.verified': 'Verified points',
    'hero.stat.recent': 'Recent updates',
    'hero.stat.active': 'Active centers',

    'dir.title': 'Help points',
    'dir.lead': 'Directory of hospitals, shelters and collection centers registered on the map.',
    'dir.search': 'Search by name, state or municipality…',
    'dir.allKinds': 'All types',
    'dir.allStates': 'All states',
    'dir.count': 'points',
    'dir.empty': 'No points found with those filters.',

    'about.title': 'What is Una Mano?',
    'about.subtitle': 'A collaborative platform to coordinate aid during emergencies in Venezuela.',
    'about.p1': 'Una Mano connects people, organizations and communities during emergencies in Venezuela.',
    'about.p2': 'Here you can find hospitals, collection centers, shelters and other support points that need resources or are providing aid.',
    'about.p3': 'Our goal is for information to arrive faster, for donations to reach the right place, and for communities to coordinate more effectively when they need it most.',
    'about.p4': 'Published information is reviewed by administrators and updated by the community to keep the map as useful and reliable as possible.',
    'about.how': 'How does it work?',
    'about.how1': 'Organizations and citizens report information.',
    'about.how2': 'Administrators verify the data.',
    'about.how3': 'Approved points appear on the map.',
    'about.how4': 'Help centers can update their needs and available resources.',
    'about.how5': 'Donors and volunteers can identify where to help.',
    'about.types': 'Point types',
    'about.help': 'Want to help?',
    'about.help1': 'Report information',
    'about.help2': 'Update an existing point',
    'about.help3': 'Donate resources',
    'about.help4': 'Share the map',
    'about.help5': 'Join as a volunteer',
    'about.reportCta': 'Report a point',

    'wa.title': 'Report via WhatsApp',
    'wa.desc': 'Soon you will be able to send reports and updates directly via WhatsApp. For now, use the Report button on the map.',
    'wa.button': 'Message on WhatsApp',
    'wa.alt': 'I prefer to use the form',
    'wa.soon': 'WhatsApp integration coming soon',

    'legend.title': 'Severity level',

    'disclaimer.text': 'Collaborative information, contributed by the community and reviewed by administrators. It may not be verified in real time: confirm with the location contact before mobilizing resources or donations.',
    'disclaimer.close': 'Dismiss notice',

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
    'profile.noDonationPoc': 'No drop-off point has been registered for this location yet.',
    'profile.situation': 'Situation',
    'profile.supplies': 'Supplies needed',
    'profile.sendUpdate': 'Send an update',
    'profile.adminEdit': 'Edit and publish (admin)',
    'profile.adminNotice': 'Direct admin editing. Changes are published immediately.',
    'profile.postUpdate': 'Post update',
    'profile.updateBody': 'Write the update…',
    'profile.publish': 'Publish',
    'profile.publishChanges': 'Publish changes',
    'profile.delete': 'Delete',
    'profile.cancel': 'Cancel',
    'profile.updatedAt': 'Updated',
    'profile.noInfo': 'No information yet',
    'profile.severity': 'Severity level',
    'profile.verification': 'Verification status',
    'profile.rescue': 'Rescue teams / who is helping',
    'profile.buildings': 'Buildings being searched',
    'profile.peopleAided': 'People being treated',
    'profile.bloodNeeded': 'Blood donations needed',
    'profile.bloodTypes': 'Blood types needed',
    'profile.donationPoc': 'Donation drop-off point',
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
