import { useState } from 'react'
import { ArrowRight, BookOpen, Rocket, Trophy } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DEFINITION, img, NOTE_CARDS, STATIONS, STATION_ORDER, type CharacterId } from '@/lib/content'
import { useProgress } from '@/lib/progress'
import { Character, FunButton, Orb, SectionTitle, Sparkles, useNav, useSfx, type View } from './shared'
import { BadgeIcon, STATION_THEME } from './station-shell'

/* ───────────────────────── HOME ───────────────────────── */

export function HomeView() {
  const { go } = useNav()
  const { completedCount } = useProgress()
  return (
    <>
      <section className="relative overflow-hidden">
        <div className="relative min-h-[640px] w-full md:aspect-[16/9] md:min-h-0 lg:max-h-[calc(100vh-4rem)] lg:min-h-[620px]">
          <img
            src={img('hero-bg.png', 1600)}
            srcSet={`${img('hero-bg.png', 800)} 800w, ${img('hero-bg.png', 1600)} 1600w`}
            sizes="100vw"
            alt=""
            className="absolute inset-0 size-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/20 to-[#fdf8ff]" />
          <Sparkles count={18} />

          <Orb color="#ffd23f" size={34} className="absolute left-[8%] top-[14%]" />
          <Orb color="#7fb2ff" size={26} className="absolute right-[12%] top-[18%]" />
          <Orb color="#ff6a3d" size={22} className="absolute left-[30%] top-[8%]" />
          <Orb color="#6fcf5a" size={28} className="absolute right-[28%] top-[6%]" />

          <div className="relative z-10 mx-auto flex h-full max-w-6xl flex-col items-center justify-center px-4 py-10 text-center">
            <p className="anim-pop rounded-full bg-white/85 px-5 py-2 font-display text-sm font-bold tracking-widest text-primary shadow md:text-base">
              ✨ BAHASA MELAYU TAHUN 3 ✨
            </p>
            <h1 className="title-outline anim-pop mt-4 font-display text-5xl font-bold leading-[0.95] sm:text-6xl md:text-7xl lg:text-8xl">
              <span className="rainbow-text">DUNIA BANDINGAN SEMACAM</span>
            </h1>
            <p className="mt-3 rounded-2xl bg-white/80 px-4 py-1 font-display text-xl font-bold text-foreground shadow md:text-3xl">
              Kembara Misi Emosi 🌈
            </p>

            <div className="mt-5 flex items-end justify-center gap-1 sm:gap-3">
              {(['joy', 'sadness', 'riley', 'anger', 'disgust'] as CharacterId[]).map((c, i) => (
                <Character
                  key={c}
                  id={c}
                  float
                  delay={i * 0.35}
                  className={cn('h-24 w-auto sm:h-32 md:h-36', c === 'riley' && 'h-28 sm:h-40 md:h-44')}
                />
              ))}
            </div>

            <div className="mt-6 flex flex-col flex-wrap justify-center gap-3 sm:flex-row">
              <FunButton tone="rainbow" size="lg" onClick={() => go('intro')}>
                <Rocket className="size-6" /> Mula Pengembaraan
              </FunButton>
              <FunButton tone="joy" size="lg" onClick={() => go('nota')}>
                <BookOpen className="size-6" /> Jom Belajar
              </FunButton>
              <FunButton tone="white" size="lg" onClick={() => go('pencapaian')}>
                <Trophy className="size-6" /> Lihat Pencapaian
              </FunButton>
            </div>
            {completedCount > 0 && (
              <p className="mt-4 rounded-full bg-white/85 px-4 py-1 text-sm font-black shadow">
                🌟 {completedCount} daripada 4 stesen selesai — teruskan!
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-14">
        <SectionTitle sub="Ikuti laluan pengembaraan ini langkah demi langkah.">Laluan Wira Emosi</SectionTitle>
        <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { icon: '👩‍🏫', t: 'Pengenalan', d: 'Berkenalan dengan dua orang cikgu.', v: 'intro' as View, c: '#b46cff' },
            { icon: '📒', t: 'Nota', d: 'Kenali bandingan semacam.', v: 'nota' as View, c: '#ffd23f' },
            { icon: '🗺️', t: 'Peta Misi', d: 'Jelajah empat stesen emosi.', v: 'peta' as View, c: '#7fb2ff' },
            { icon: '🏅', t: 'Lencana & Sijil', d: 'Kumpul lencana, tuntut sijil.', v: 'pencapaian' as View, c: '#ff6a3d' },
            { icon: '📸', t: 'Swafoto', d: 'Abadikan kenangan wira.', v: 'swafoto' as View, c: '#6fcf5a' },
          ].map((s, i) => (
            <li key={s.t}>
              <button
                type="button"
                onClick={() => go(s.v)}
                className="group flex h-full w-full flex-col items-center gap-2 rounded-3xl border-4 bg-white p-5 text-center shadow-lg transition-transform hover:-translate-y-1"
                style={{ borderColor: s.c }}
              >
                <span className="grid size-16 place-items-center rounded-full text-3xl" style={{ background: `${s.c}33` }}>
                  {s.icon}
                </span>
                <span className="text-xs font-black tracking-widest text-muted-foreground">LANGKAH {i + 1}</span>
                <span className="font-display text-xl font-bold">{s.t}</span>
                <span className="text-sm font-bold text-muted-foreground">{s.d}</span>
              </button>
            </li>
          ))}
        </ol>
      </section>
    </>
  )
}

/* ───────────────────────── INTRO ───────────────────────── */

export function IntroView() {
  const { go } = useNav()
  return (
    <section className="dreamy-bg relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="mx-auto w-fit -rotate-1 rounded-[2rem] rainbow-bg p-1.5 shadow-xl">
          <h1 className="rounded-[1.7rem] bg-white px-6 py-3 text-center font-display text-2xl font-bold sm:text-3xl md:text-5xl">
            <span className="rainbow-text">SELAMAT DATANG KE DUNIA INSIDE OUT!</span>
          </h1>
        </div>

        <div className="relative mt-8 overflow-hidden rounded-[2rem] border-8 border-white shadow-2xl">
          <img
            src={img('teachers.png', 1400)}
            srcSet={`${img('teachers.png', 700)} 700w, ${img('teachers.png', 1400)} 1400w`}
            sizes="(min-width: 1152px) 1152px, 100vw"
            alt="Dua orang guru perempuan yang comel sedang tersenyum dan melambai"
            className="aspect-[16/9] w-full object-cover"
          />
          <div className="absolute inset-x-0 top-0 hidden justify-between gap-6 p-6 md:flex">
            <SpeechBubble side="left" who="Cikgu Aliya">
              Hai, murid-murid! Selamat datang ke dunia bandingan semacam!
            </SpeechBubble>
            <SpeechBubble side="right" who="Cikgu Iwana">
              Bersedia untuk meneroka dunia bahasa bersama-sama watak emosi? Jom kita mulakan misi!
            </SpeechBubble>
          </div>
        </div>

        <div className="mt-6 grid gap-4 md:hidden">
          <SpeechBubble side="left" who="Cikgu Aliya">
            Hai, murid-murid! Selamat datang ke dunia bandingan semacam!
          </SpeechBubble>
          <SpeechBubble side="right" who="Cikgu Iwana">
            Bersedia untuk meneroka dunia bahasa bersama-sama watak emosi? Jom kita mulakan misi!
          </SpeechBubble>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4">
          <div className="flex items-end gap-2">
            {(['joy', 'sadness', 'anger', 'disgust'] as CharacterId[]).map((c, i) => (
              <Character key={c} id={c} float delay={i * 0.3} className="h-20 w-auto md:h-24" />
            ))}
          </div>
          <FunButton tone="rainbow" size="lg" onClick={() => go('nota')}>
            Jom Mulakan <ArrowRight className="size-6" />
          </FunButton>
        </div>
      </div>
    </section>
  )
}

function SpeechBubble({ side, who, children }: { side: 'left' | 'right'; who: string; children: React.ReactNode }) {
  return (
    <div
      className={cn(
        'anim-pop relative max-w-sm rounded-[1.75rem] border-4 bg-white p-4 shadow-xl md:p-5',
        side === 'left' ? 'border-[#ff7eb6]' : 'border-riley md:ml-auto',
      )}
      style={{ animationDelay: side === 'left' ? '0.2s' : '0.8s' }}
    >
      <p className={cn('text-xs font-black tracking-widest', side === 'left' ? 'text-[#d6407f]' : 'text-[#7d3bd1]')}>
        {who.toUpperCase()}
      </p>
      <p className="mt-1 font-display text-lg font-bold leading-snug md:text-xl">“{children}”</p>
      <span
        aria-hidden
        className={cn(
          'absolute -bottom-4 size-7 rotate-45 border-b-4 border-r-4 bg-white',
          side === 'left' ? 'left-10 border-[#ff7eb6]' : 'right-10 border-riley',
        )}
      />
    </div>
  )
}

/* ───────────────────────── NOTA ───────────────────────── */

const NOTE_TONE = {
  joy: 'border-joy from-[#fff8d1] to-[#ffe27a]',
  anger: 'border-anger from-[#fff0e6] to-[#ffb48f]',
  disgust: 'border-disgust from-[#f0fde9] to-[#c4efae]',
  sadness: 'border-sadness from-[#eef5ff] to-[#b6d3ff]',
} as const

export function NotesView() {
  const { go } = useNav()
  const sfx = useSfx()
  const [flipped, setFlipped] = useState<number[]>([])
  const toggle = (i: number) => {
    sfx('flip')
    setFlipped((f) => (f.includes(i) ? f.filter((x) => x !== i) : [...f, i]))
  }
  return (
    <section className="dreamy-bg min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle>JOM KENALI BANDINGAN SEMACAM</SectionTitle>

        <div className="mx-auto mt-8 flex max-w-4xl flex-col items-center gap-4 rounded-[2rem] border-4 border-white bg-white/90 p-6 shadow-xl md:flex-row">
          <Character id="riley" float className="h-32 w-auto shrink-0" />
          <div>
            <p className="font-display text-sm font-bold tracking-widest text-primary">📖 DEFINISI</p>
            <p className="mt-1 text-xl font-bold leading-relaxed md:text-2xl">{DEFINITION}</p>
            <p className="mt-3 text-base font-bold text-muted-foreground">
              Cari kata perbandingan ini dalam ungkapan:{' '}
              {['seperti', 'bagai', 'umpama', 'bak', 'macam'].map((w) => (
                <span key={w} className="mx-0.5 inline-block rounded-full bg-secondary px-3 py-0.5 text-foreground">
                  {w}
                </span>
              ))}
            </p>
          </div>
        </div>

        <p className="mt-8 text-center font-display text-lg font-bold text-muted-foreground">
          👆 Tekan setiap kad untuk melihat maksudnya!
        </p>

        <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {NOTE_CARDS.map((c, i) => {
            const isFlipped = flipped.includes(i)
            return (
              <button
                key={c.phrase}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={isFlipped}
                aria-label={`Kad ${i + 1}: ${c.phrase}`}
                className="flip-scene h-[26rem] w-full text-left focus-visible:outline-4 focus-visible:outline-primary"
              >
                <div className={cn('flip-card relative size-full', isFlipped && 'is-flipped')}>
                  <div
                    className={cn(
                      'flip-face absolute inset-0 flex flex-col overflow-hidden rounded-[2rem] border-[6px] bg-gradient-to-b shadow-xl',
                      NOTE_TONE[c.color],
                    )}
                  >
                    <span className="absolute left-3 top-3 z-10 rounded-full bg-white px-3 py-1 font-display text-sm font-bold shadow">
                      KAD {i + 1}
                    </span>
                    <img src={img(c.image, 500)} alt={c.alt} loading="lazy" className="aspect-square w-full object-cover" />
                    <div className="flex flex-1 flex-col items-center justify-center p-3 text-center">
                      <p className="font-display text-2xl font-bold leading-tight">“{c.phrase}”</p>
                      <p className="mt-1 text-sm font-black text-muted-foreground">Tekan untuk lihat maksud ↻</p>
                    </div>
                  </div>
                  <div
                    className={cn(
                      'flip-face flip-back absolute inset-0 flex flex-col items-center justify-center gap-4 rounded-[2rem] border-[6px] bg-white p-6 text-center shadow-xl',
                      NOTE_TONE[c.color].split(' ')[0],
                    )}
                  >
                    <img src={img(c.image, 240)} alt="" className="size-28 rounded-full border-4 border-white object-cover shadow-lg" />
                    <p className="font-display text-2xl font-bold leading-tight">“{c.phrase}”</p>
                    <div className="rounded-2xl bg-muted p-4">
                      <p className="text-xs font-black tracking-widest text-primary">MAKSUD</p>
                      <p className="mt-1 text-lg font-bold leading-snug">{c.meaning}</p>
                    </div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-10 flex justify-center">
          <FunButton tone="rainbow" size="lg" onClick={() => go('peta')}>
            Seterusnya <ArrowRight className="size-6" />
          </FunButton>
        </div>
      </div>
    </section>
  )
}

/* ───────────────────────── PETA MISI ───────────────────────── */

// Positions (percent) of the four stations on the wide map.
const MAP_POINTS = [
  { x: 13, y: 70 },
  { x: 37, y: 30 },
  { x: 63, y: 68 },
  { x: 87, y: 30 },
]

export function MapView() {
  const { go } = useNav()
  const { progress, completedCount, allDone } = useProgress()
  const pct = (completedCount / 4) * 100

  return (
    <section className="dreamy-bg min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle sub="Tekan mana-mana stesen untuk memulakan misi.">KEMBARA MISI BANDINGAN SEMACAM</SectionTitle>

        <div className="mx-auto mt-6 max-w-xl rounded-full border-4 border-white bg-white p-2 shadow-lg">
          <div className="relative h-8 overflow-hidden rounded-full bg-muted">
            <div className="rainbow-bg h-full rounded-full transition-[width] duration-700" style={{ width: `${pct}%` }} />
            <span className="absolute inset-0 grid place-items-center font-display text-base font-bold">
              {completedCount} daripada 4 stesen selesai
            </span>
          </div>
        </div>

        {/* Wide map */}
        <div className="relative mt-8 hidden aspect-[16/8] overflow-hidden rounded-[2.5rem] border-8 border-white shadow-2xl md:block">
          <img src={img('hero-bg.png', 1400)} alt="" className="absolute inset-0 size-full object-cover opacity-80" />
          <div className="absolute inset-0 bg-white/30" />
          <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="absolute inset-0 size-full" aria-hidden>
            <defs>
              <linearGradient id="path-rainbow" x1="0" x2="1">
                <stop offset="0" stopColor="#ffd23f" />
                <stop offset="0.33" stopColor="#7fb2ff" />
                <stop offset="0.66" stopColor="#ff6a3d" />
                <stop offset="1" stopColor="#6fcf5a" />
              </linearGradient>
            </defs>
            <path
              d={`M ${MAP_POINTS[0].x} ${MAP_POINTS[0].y / 2} C 22 ${MAP_POINTS[0].y / 2}, 28 ${MAP_POINTS[1].y / 2}, ${MAP_POINTS[1].x} ${MAP_POINTS[1].y / 2} S 54 ${MAP_POINTS[2].y / 2}, ${MAP_POINTS[2].x} ${MAP_POINTS[2].y / 2} S 80 ${MAP_POINTS[3].y / 2}, ${MAP_POINTS[3].x} ${MAP_POINTS[3].y / 2}`}
              fill="none"
              stroke="white"
              strokeWidth="2.6"
              strokeLinecap="round"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 26 }}
            />
            <path
              d={`M ${MAP_POINTS[0].x} ${MAP_POINTS[0].y / 2} C 22 ${MAP_POINTS[0].y / 2}, 28 ${MAP_POINTS[1].y / 2}, ${MAP_POINTS[1].x} ${MAP_POINTS[1].y / 2} S 54 ${MAP_POINTS[2].y / 2}, ${MAP_POINTS[2].x} ${MAP_POINTS[2].y / 2} S 80 ${MAP_POINTS[3].y / 2}, ${MAP_POINTS[3].x} ${MAP_POINTS[3].y / 2}`}
              fill="none"
              stroke="url(#path-rainbow)"
              strokeLinecap="round"
              strokeDasharray="1 20"
              vectorEffect="non-scaling-stroke"
              style={{ strokeWidth: 12 }}
            />
          </svg>
          {STATION_ORDER.map((id, i) => (
            <div
              key={id}
              className="absolute -translate-x-1/2 -translate-y-1/2"
              style={{ left: `${MAP_POINTS[i].x}%`, top: `${MAP_POINTS[i].y}%` }}
            >
              <StationNode id={id} done={!!progress.completed[id]} onOpen={() => go(id)} />
            </div>
          ))}
          <div className="absolute bottom-3 right-4 flex items-center gap-2 rounded-full bg-white/90 px-4 py-2 font-display font-bold shadow">
            {allDone ? '🏆 Semua misi selesai!' : '🏁 Garisan penamat: Sijil Wira Emosi'}
          </div>
        </div>

        {/* Narrow map */}
        <ol className="relative mt-8 grid gap-8 md:hidden">
          <span aria-hidden className="absolute bottom-10 left-1/2 top-10 w-3 -translate-x-1/2 rounded-full rainbow-bg opacity-60" />
          {STATION_ORDER.map((id) => (
            <li key={id} className="relative flex justify-center">
              <StationNode id={id} done={!!progress.completed[id]} onOpen={() => go(id)} />
            </li>
          ))}
        </ol>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <FunButton tone="white" onClick={() => go('nota')}>
            📒 Ulang Kaji Nota
          </FunButton>
          <FunButton tone="white" onClick={() => go('pencapaian')}>
            🏅 Lihat Pencapaian
          </FunButton>
          {allDone && (
            <FunButton tone="rainbow" onClick={() => go('tahniah')}>
              🏆 Tuntut Sijil
            </FunButton>
          )}
        </div>
      </div>
    </section>
  )
}

function StationNode({ id, done, onOpen }: { id: (typeof STATION_ORDER)[number]; done: boolean; onOpen: () => void }) {
  const s = STATIONS[id]
  const theme = STATION_THEME[id]
  const sfx = useSfx()
  return (
    <button
      type="button"
      onClick={() => {
        sfx('click')
        onOpen()
      }}
      className={cn(
        'group relative flex w-60 flex-col items-center rounded-[2rem] border-[6px] bg-white/95 p-3 pt-2 text-center shadow-xl transition-transform hover:-translate-y-2 hover:rotate-1 focus-visible:outline-4 focus-visible:outline-primary lg:w-64',
        theme.ring,
      )}
    >
      <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-white px-3 py-1 font-display text-xs font-bold shadow">
        {s.icon} STESEN {s.number}
      </span>
      <Character id={id} className="mt-2 h-24 w-auto transition-transform group-hover:scale-110 lg:h-28" />
      <span className={cn('font-display text-xl font-bold', theme.text)}>{s.name}</span>
      <span className="text-sm font-bold text-muted-foreground">{s.task}</span>
      <span
        className={cn(
          'mt-2 rounded-full px-3 py-1 text-xs font-black',
          done ? 'bg-disgust text-white' : 'bg-muted text-muted-foreground',
        )}
      >
        {done ? `✅ SELESAI • ${s.badgeTitle}` : '▶ MULA MISI'}
      </span>
      {done && (
        <span className="absolute -right-4 -top-4">
          <BadgeIcon id={id} size="sm" />
        </span>
      )}
    </button>
  )
}
