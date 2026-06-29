import { useEffect, useMemo, useState } from 'react'
import Header from './components/Header'
import MapView from './components/MapView'
import Legend from './components/Legend'
import LocationPanel from './components/LocationPanel'
import AdminLogin from './components/AdminLogin'
import AdminQueue from './components/AdminQueue'
import AdminManager from './components/AdminManager'
import SearchBox from './components/SearchBox'
import NewLocationForm from './components/NewLocationForm'
import DonateMatcher from './components/DonateMatcher'
import UpdatesFeed from './components/UpdatesFeed'
import Disclaimer from './components/Disclaimer'
import ResetPassword from './components/ResetPassword'
import HomeHero from './components/HomeHero'
import DirectoryPage from './components/DirectoryPage'
import AboutPage from './components/AboutPage'
import { repo } from './lib/repository'
import { STATES } from './data/constants'
import { matchLocation, normalize } from './lib/search'

export default function App() {
  const [locations, setLocations] = useState([])
  const [version, setVersion] = useState(0)
  const [loading, setLoading] = useState(true)
  const [selectedId, setSelectedId] = useState(null)
  const [session, setSession] = useState({ isAdmin: false })
  const [showLogin, setShowLogin] = useState(false)
  const [showQueue, setShowQueue] = useState(false)
  const [showAdmins, setShowAdmins] = useState(false)
  const [filterState, setFilterState] = useState('all')
  const [filterKind, setFilterKind] = useState('all')
  const [query, setQuery] = useState('')
  const [focus, setFocus] = useState(null)
  const [placedPoint, setPlacedPoint] = useState(null)
  const [showReset, setShowReset] = useState(false)

  // Vista activa: map | directory | donate | updates | report | about
  const [view, setView] = useState('map')

  const placing = view === 'report' && !placedPoint
  const showNewForm = view === 'report'
  // El mapa permanece montado (conserva el estado de Leaflet) salvo en las
  // vistas de pagina completa, que se renderizan en su lugar.
  const showMap = view !== 'directory' && view !== 'about'

  async function loadLocations() {
    const data = await repo.getLocations()
    setLocations(data)
    setVersion((v) => v + 1)
    setLoading(false)
  }

  useEffect(() => {
    loadLocations()
    repo.getSession().then(setSession).catch(() => {})
    const unsub = repo.onAuthEvent((event) => {
      if (event === 'PASSWORD_RECOVERY') setShowReset(true)
    })
    return unsub
  }, [])

  const filtered = useMemo(() => {
    const nq = normalize(query)
    return locations.filter(
      (l) =>
        (filterState === 'all' || l.state === filterState) &&
        (filterKind === 'all' || l.kind === filterKind) &&
        matchLocation(l, nq),
    )
  }, [locations, filterState, filterKind, query])

  function handlePickLocation(l) {
    setSelectedId(l.id)
    if (Number.isFinite(l.lat) && Number.isFinite(l.lng)) {
      setFocus({ lat: l.lat, lng: l.lng, ts: Date.now() })
    }
  }

  function navigate(next) {
    if (next === 'report') {
      setSelectedId(null)
      setPlacedPoint(null)
    }
    setView(next)
  }

  function pickFromDirectory(l) {
    setView('map')
    handlePickLocation(l)
  }

  function closeReport() {
    setPlacedPoint(null)
    setView('map')
  }
  function handleMapClick(pt) {
    if (view !== 'report') return
    setPlacedPoint(pt)
  }

  const selected = useMemo(
    () => locations.find((l) => l.id === selectedId) || null,
    [locations, selectedId],
  )

  function applyPatch(id, patch) {
    setLocations((ls) => ls.map((l) => (l.id === id ? { ...l, ...patch } : l)))
    setVersion((v) => v + 1)
  }

  async function handleAdminClick() {
    if (session.isAdmin) setShowQueue(true)
    else setShowLogin(true)
  }

  async function handleSignOut() {
    await repo.signOut()
    setSession({ isAdmin: false })
  }

  return (
    <div className="app">
      <Header
        view={view}
        onNavigate={navigate}
        session={session}
        onAdminClick={handleAdminClick}
        onSignOut={handleSignOut}
        onManageAdmins={() => setShowAdmins(true)}
      />

      <Disclaimer />

      <div className="main">
        {view === 'map' && (
          <HomeHero
            locations={locations}
            onExplore={() => {
              const el = document.querySelector('.map-wrap')
              if (el) el.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
            }}
            onReport={() => navigate('report')}
          />
        )}

        <div className="map-wrap" style={{ display: showMap ? 'block' : 'none' }}>
          <MapView
            locations={filtered}
            version={version}
            focus={focus}
            placing={placing}
            placedPoint={placedPoint}
            onMapClick={handleMapClick}
            onSelect={(l) => setSelectedId(l.id)}
          />

          <div className="toolbar">
            <SearchBox value={query} onChange={setQuery} locations={locations} onPickLocation={handlePickLocation} />
            <div className="filters">
              <button className={'chip' + (filterState === 'all' ? ' chip--active' : '')} onClick={() => setFilterState('all')}>
                Todos los estados
              </button>
              {STATES.map((s) => (
                <button key={s} className={'chip' + (filterState === s ? ' chip--active' : '')} onClick={() => setFilterState(s)}>
                  {s}
                </button>
              ))}
              <span style={{ width: 8 }} />
              <button className={'chip' + (filterKind === 'all' ? ' chip--active' : '')} onClick={() => setFilterKind('all')}>
                Todo
              </button>
              <button className={'chip' + (filterKind === 'parroquia' ? ' chip--active' : '')} onClick={() => setFilterKind('parroquia')}>
                Parroquias
              </button>
              <button className={'chip' + (filterKind === 'hospital' ? ' chip--active' : '')} onClick={() => setFilterKind('hospital')}>
                Hospitales
              </button>
              <button className={'chip' + (filterKind === 'otro' ? ' chip--active' : '')} onClick={() => setFilterKind('otro')}>
                Otros puntos
              </button>
            </div>
          </div>

          <Legend />

          {loading && (
            <div className="legend" style={{ bottom: 'auto', top: 70, left: '50%', transform: 'translateX(-50%)' }}>
              Cargando ubicaciones…
            </div>
          )}

          {selected && !showNewForm && (
            <LocationPanel
              location={selected}
              isAdmin={session.isAdmin}
              onClose={() => setSelectedId(null)}
              onUpdated={applyPatch}
            />
          )}

          {showNewForm && (
            <NewLocationForm
              placedPoint={placedPoint}
              onRemark={() => setPlacedPoint(null)}
              onClose={closeReport}
              onSent={() => { setPlacedPoint(null); loadLocations() }}
            />
          )}
        </div>

        {view === 'directory' && (
          <DirectoryPage locations={locations} onPick={pickFromDirectory} />
        )}

        {view === 'about' && (
          <AboutPage onReport={() => navigate('report')} />
        )}
      </div>

      {view === 'donate' && (
        <DonateMatcher
          locations={locations}
          onClose={() => setView('map')}
          onPickLocation={(l) => { setView('map'); handlePickLocation(l) }}
        />
      )}

      {view === 'updates' && (
        <UpdatesFeed
          locations={locations}
          onClose={() => setView('map')}
          onPickLocation={(l) => { setView('map'); handlePickLocation(l) }}
        />
      )}

      {showLogin && (
        <AdminLogin
          onClose={() => setShowLogin(false)}
          onLoggedIn={() => {
            setShowLogin(false)
            repo.getSession().then(setSession)
            setShowQueue(true)
          }}
        />
      )}

      {showQueue && session.isAdmin && (
        <AdminQueue locations={locations} onClose={() => setShowQueue(false)} onApplied={loadLocations} />
      )}

      {showAdmins && session.isSuper && (
        <AdminManager locations={locations} onClose={() => setShowAdmins(false)} />
      )}

      {showReset && (
        <ResetPassword
          onClose={() => {
            setShowReset(false)
            if (typeof window !== 'undefined' && window.history?.replaceState) {
              window.history.replaceState(null, '', window.location.pathname + window.location.search)
            }
          }}
          onDone={() => repo.getSession().then(setSession).catch(() => {})}
        />
      )}
    </div>
  )
}
