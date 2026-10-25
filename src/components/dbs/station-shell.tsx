import { useEffect, useState } from 'react'
import { ArrowLeft, ArrowRight, Map, RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { STATIONS, STATION_ORDER, type StationId } from '@/lib/content'
import { useProgress } from '@/lib/progress'
import { Character, Confetti, FunButton, useNav, useSfx } from './shared'

export const STATION_THEME: Record<
  StationId,
  { bg: string; ring: string; tone: 'joy' | 'sadness' | 'anger' | 'disgust'; decor: string[]; text: string }
> = {
  joy: {
    bg: 'bg-gradient-to-b from-[#fff8d1] via-[#ffeb8f] to-[#ffd84d]',
    ring: 'border-joy',
    tone: 'joy',
    decor: ['☀️', '⭐', '✨', '🌟'],
    text: 'text-[#7a5500]',
  },
  sadness: {
    bg: 'bg-gradient-to-b from-[#eef5ff] via-[#cfe3ff] to-[#a9cbff]',
    ring: 'border-sadness',
    tone: 'sadness',
    decor: ['💧', '☁️', '💙', '🌧️'],
    text: 'text-sadness-deep',
  },
  anger: {
    bg: 'bg-gradient-to-b from-[#fff0e6] via-[#ffc9a8] to-[#ff9a6b]',
    ring: 'border-anger',
    tone: 'anger',
    decor: ['🔥', '💥', '✨', '⚡'],
    text: 'text-anger-deep',
  },
  disgust: {
    bg: 'bg-gradient-to-b from-[#f0fde9] via-[#cff3bd] to-[#a4e38a]',
    ring: 'border-disgust',
    tone: 'disgust',
    decor: ['🌸', '🍃', '🌼', '🌿'],
    text: 'text-disgust-deep',
  },
}

export type GameProps = {
  onAnswer: (questionId: string, firstAttempt: boolean) => void
  onComplete: () => void
}

export function StationView({
  id,
  instruction,
  Game,
}: {
  id: StationId
  instruction: string
  Game: React.ComponentType<GameProps>
}) {
  const station = STATIONS[id]
  const theme = STATION_THEME[id]
  const { recordAnswer, completeStation, progress } = useProgress()
  const { go } = useNav()
  const sfx = useSfx()
  const [round, setRound] = useState(0)
  const [finished, setFinished] = useState(false)

  const nextId = STATION_ORDER[(STATION_ORDER.indexOf(id) + 1) % STATION_ORDER.length]
  const nextOpen = STATION_ORDER.find((s) => s !== id && !progress.completed[s])

  useEffect(() => {
    if (finished) sfx('badge')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finished])

  const restart = () => {
    setFinished(false)
    setRound((r) => r + 1)
  }

  return (
    <section className={cn('relative min-h-[calc(100vh-4rem)] overflow-hidden pb-16', theme.bg)}>
      <div aria-hidden className="pointer-events-none absolute inset-0">
        {theme.decor.concat(theme.decor).map((d, i) => (
          <span
            key={i}
            className="anim-float absolute text-3xl opacity-60 md:text-5xl"
            style={{ left: `${(i * 23 + 5) % 95}%`, top: `${(i * 31 + 8) % 85}%`, animationDelay: `${i * 0.4}s` }}
          >
            {d}
          </span>
        ))}
      </div>

      <div className="relative mx-auto max-w-5xl px-4 pt-6 md:pt-10">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <FunButton tone="white" size="sm" onClick={() => go('peta')}>
            <Map className="size-4" /> Kembali ke Peta Misi
          </FunButton>
          <span className={cn('rounded-full bg-white/80 px-4 py-2 font-display text-sm font-bold', theme.text)}>
            Stesen {station.number} daripada 4
          </span>
        </div>

        <header className="flex flex-col items-center gap-4 rounded-[2rem] bg-white/70 p-5 shadow-xl backdrop-blur md:flex-row md:p-6">
          <Character id={id} float className="h-32 w-auto shrink-0 md:h-40" />
          <div className="text-center md:text-left">
            <p className={cn('font-display text-sm font-bold tracking-widest', theme.text)}>
              {station.icon} {station.name}
            </p>
            <h1 className="font-display text-2xl font-bold md:text-4xl">{station.title}</h1>
            <div className="relative mt-3 rounded-2xl border-4 border-white bg-white p-3 text-base font-bold leading-relaxed shadow md:text-lg">
              {instruction}
            </div>
          </div>
        </header>

        <div className="mt-6">
          {finished ? (
            <BadgeEarned id={id} />
          ) : (
            <Game
              key={round}
              onAnswer={recordAnswer}
              onComplete={() => {
                completeStation(id)
                setFinished(true)
                window.scrollTo({ top: 0, behavior: 'smooth' })
              }}
            />
          )}
        </div>

        <nav aria-label="Navigasi stesen" className="mt-8 flex flex-wrap justify-center gap-3">
          <FunButton tone="white" onClick={() => go('peta')}>
            <ArrowLeft className="size-5" /> Kembali ke Peta Misi
          </FunButton>
          <FunButton tone="white" onClick={restart}>
            <RotateCcw className="size-5" /> Ulang Semula
          </FunButton>
          <FunButton tone={STATION_THEME[nextId].tone} onClick={() => go(nextId)}>
            Stesen Seterusnya <ArrowRight className="size-5" />
          </FunButton>
          {finished && !nextOpen && (
            <FunButton tone="rainbow" onClick={() => go('tahniah')}>
              🏆 Lihat Sijil
            </FunButton>
          )}
        </nav>
      </div>
      <Confetti show={finished} />
    </section>
  )
}

const BADGE_BG: Record<StationId, string> = {
  joy: 'bg-joy',
  sadness: 'bg-sadness',
  anger: 'bg-anger',
  disgust: 'bg-disgust',
}

export function BadgeIcon({
  id,
  earned = true,
  size = 'md',
}: {
  id: StationId
  earned?: boolean
  size?: 'sm' | 'md' | 'lg'
}) {
  const s = STATIONS[id]
  return (
    <div
      className={cn(
        'relative grid place-items-center rounded-full border-[6px] border-white shadow-xl',
        size === 'sm' && 'size-16 text-2xl',
        size === 'md' && 'size-24 text-4xl',
        size === 'lg' && 'size-36 text-6xl',
        earned ? BADGE_BG[id] : 'bg-muted grayscale',
      )}
    >
      <span className={cn(!earned && 'opacity-30')}>{earned ? s.badgeIcon : '🔒'}</span>
      {earned && (
        <span className="absolute -bottom-2 rounded-full bg-white px-2 text-[10px] font-black tracking-wider text-foreground shadow">
          LENCANA
        </span>
      )}
    </div>
  )
}

function BadgeEarned({ id }: { id: StationId }) {
  const s = STATIONS[id]
  const { go } = useNav()
  const { completedCount, allDone } = useProgress()
  return (
    <div className="anim-pop mx-auto max-w-xl rounded-[2rem] border-8 border-white bg-white/90 p-6 text-center shadow-2xl md:p-10">
      <p className="font-display text-xl font-bold text-muted-foreground">MISI SELESAI! 🎉</p>
      <div className="my-5 flex justify-center">
        <div className="anim-wiggle">
          <BadgeIcon id={id} size="lg" />
        </div>
      </div>
      <p className="text-sm font-black tracking-widest text-muted-foreground">KAMU MEMPEROLEH</p>
      <h2 className="mt-1 font-display text-2xl font-bold md:text-3xl">
        <span className="rainbow-text">{s.badge}</span>
      </h2>
      <p className="mt-3 text-lg font-bold">{completedCount} daripada 4 stesen selesai</p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        {allDone ? (
          <FunButton tone="rainbow" size="lg" onClick={() => go('tahniah')}>
            🏆 Tuntut Sijil
          </FunButton>
        ) : (
          <FunButton tone="primary" size="lg" onClick={() => go('peta')}>
            🗺️ Teruskan Misi
          </FunButton>
        )}
        <FunButton tone="white" onClick={() => go('pencapaian')}>
          Lihat Pencapaian
        </FunButton>
      </div>
    </div>
  )
}
