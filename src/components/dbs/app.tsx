import { useCallback, useEffect, useState } from 'react'
import { BookOpen, Camera, Home, Map, Trophy, Volume2, VolumeX } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ProgressProvider, useProgress } from '@/lib/progress'
import { NavContext, Orb, VIEWS, type View } from './shared'
import { HomeView, IntroView, MapView, NotesView } from './views'
import { StationView } from './station-shell'
import { JoyGame } from './joy-station'
import { SadnessGame } from './sadness-station'
import { AngerGame } from './anger-station'
import { DisgustGame } from './disgust-station'
import { AchievementsView } from './achievements'
import { CertificateView } from './certificate'
import { SelfieView } from './selfie'

const viewFromHash = (): View => {
  const h = window.location.hash.replace('#', '') as View
  return VIEWS.includes(h) ? h : 'home'
}

export function App() {
  return (
    <ProgressProvider>
      <Shell />
    </ProgressProvider>
  )
}

function Shell() {
  const [view, setView] = useState<View>('home')

  useEffect(() => {
    setView(viewFromHash())
    const onHash = () => {
      setView(viewFromHash())
      window.scrollTo({ top: 0 })
    }
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = useCallback((v: View) => {
    if (v === viewFromHash()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }
    window.location.hash = v === 'home' ? '' : v
    if (v === 'home') history.replaceState(null, '', window.location.pathname)
    setView(v)
    window.scrollTo({ top: 0 })
  }, [])

  return (
    <NavContext.Provider value={{ view, go }}>
      <TopBar />
      <main key={view}>
        {view === 'home' && <HomeView />}
        {view === 'intro' && <IntroView />}
        {view === 'nota' && <NotesView />}
        {view === 'peta' && <MapView />}
        {view === 'joy' && (
          <StationView
            id="joy"
            instruction="Selamat datang ke Stesen Gembira! Padankan setiap bandingan semacam dengan gambar yang betul."
            Game={JoyGame}
          />
        )}
        {view === 'sadness' && (
          <StationView
            id="sadness"
            instruction="Di Stesen Sedih, bukalah kad ayat dan padankan ayat tersebut dengan maksud yang paling tepat."
            Game={SadnessGame}
          />
        )}
        {view === 'anger' && (
          <StationView
            id="anger"
            instruction="Alamak! Perkataan telah bercampur-aduk. Bantu Marah menyusun perkataan supaya menjadi ayat tunggal yang lengkap!"
            Game={AngerGame}
          />
        )}
        {view === 'disgust' && (
          <StationView
            id="disgust"
            instruction="Wah, ada ayat yang tidak sesuai! Bantu Loya mengenal pasti kesalahan dan pilih kad pembetulan yang betul."
            Game={DisgustGame}
          />
        )}
        {view === 'pencapaian' && <AchievementsView />}
        {view === 'tahniah' && <CertificateView />}
        {view === 'swafoto' && <SelfieView />}
      </main>
      <Footer />
    </NavContext.Provider>
  )
}

const NAV: { view: View; label: string; icon: typeof Home; match?: View[] }[] = [
  { view: 'home', label: 'Halaman Utama', icon: Home, match: ['intro'] },
  { view: 'nota', label: 'Nota', icon: BookOpen },
  { view: 'peta', label: 'Peta Misi', icon: Map, match: ['joy', 'sadness', 'anger', 'disgust'] },
  { view: 'pencapaian', label: 'Pencapaian', icon: Trophy, match: ['tahniah'] },
  { view: 'swafoto', label: 'Swafoto', icon: Camera },
]

function TopBar() {
  const { progress, toggleSound, completedCount } = useProgress()
  return (
    <NavContext.Consumer>
      {({ view, go }) => (
        <header className="sticky top-0 z-40 border-b-4 border-white bg-white/85 shadow-sm backdrop-blur print:hidden">
          <div className="rainbow-bg h-1.5" />
          <div className="mx-auto flex h-16 max-w-6xl items-center gap-2 px-3">
            <button type="button" onClick={() => go('home')} className="flex shrink-0 items-center gap-2" aria-label="Halaman Utama">
              <span className="flex -space-x-2">
                <Orb color="#ffd23f" size={22} />
                <Orb color="#7fb2ff" size={22} />
                <Orb color="#ff6a3d" size={22} />
                <Orb color="#6fcf5a" size={22} />
              </span>
              <span className="hidden font-display text-lg font-bold leading-none lg:block">
                Kembara <span className="rainbow-text">Misi Emosi</span>
              </span>
            </button>
            <nav aria-label="Navigasi utama" className="ml-auto flex items-center gap-1 overflow-x-auto">
              {NAV.map((n) => {
                const active = view === n.view || n.match?.includes(view)
                return (
                  <button
                    key={n.view}
                    type="button"
                    onClick={() => go(n.view)}
                    aria-current={active ? 'page' : undefined}
                    className={cn(
                      'flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 font-display text-sm font-bold transition-colors',
                      active ? 'bg-primary text-primary-foreground' : 'hover:bg-muted',
                    )}
                  >
                    <n.icon className="size-5" />
                    <span className="hidden sm:inline">{n.label}</span>
                    {n.view === 'pencapaian' && (
                      <span className="rounded-full bg-joy px-1.5 text-xs text-[#4a3500]">{completedCount}/4</span>
                    )}
                  </button>
                )
              })}
              <button
                type="button"
                onClick={toggleSound}
                aria-label={progress.sound ? 'Matikan kesan bunyi' : 'Hidupkan kesan bunyi'}
                aria-pressed={progress.sound}
                className="grid size-10 shrink-0 place-items-center rounded-full hover:bg-muted"
              >
                {progress.sound ? <Volume2 className="size-5" /> : <VolumeX className="size-5" />}
              </button>
            </nav>
          </div>
        </header>
      )}
    </NavContext.Consumer>
  )
}

function Footer() {
  return (
    <footer className="border-t-4 border-white bg-white/70 px-4 py-6 text-center text-sm font-bold text-muted-foreground print:hidden">
      <div className="rainbow-bg mx-auto mb-3 h-1.5 w-24 rounded-full" />
      Dunia Bandingan Semacam: Kembara Misi Emosi • Bahasa Melayu Tahun 3 🌈
    </footer>
  )
}
