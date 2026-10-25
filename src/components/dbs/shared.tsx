import { createContext, useContext, useMemo } from 'react'

import { cn } from '@/lib/utils'
import { charImg, type CharacterId } from '@/lib/content'
import { playSfx } from '@/lib/sound'
import { useProgress } from '@/lib/progress'

export type View =
  | 'home'
  | 'intro'
  | 'nota'
  | 'peta'
  | 'joy'
  | 'sadness'
  | 'anger'
  | 'disgust'
  | 'pencapaian'
  | 'tahniah'
  | 'swafoto'

export const VIEWS: View[] = [
  'home',
  'intro',
  'nota',
  'peta',
  'joy',
  'sadness',
  'anger',
  'disgust',
  'pencapaian',
  'tahniah',
  'swafoto',
]

export const NavContext = createContext<{ view: View; go: (v: View) => void }>({
  view: 'home',
  go: () => {},
})

export const useNav = () => useContext(NavContext)

export function useSfx() {
  const { progress } = useProgress()
  return (kind: Parameters<typeof playSfx>[0]) => playSfx(kind, progress.sound)
}

const tones = {
  joy: 'bg-joy text-[#4a3500]',
  sadness: 'bg-sadness text-white',
  anger: 'bg-anger text-white',
  disgust: 'bg-disgust text-[#123d12]',
  riley: 'bg-riley text-white',
  rainbow: 'rainbow-bg text-white',
  white: 'bg-white text-foreground border-2 border-border',
  primary: 'bg-primary text-primary-foreground',
} as const

export type Tone = keyof typeof tones

export function FunButton({
  tone = 'primary',
  className,
  size = 'md',
  onClick,
  children,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: Tone
  size?: 'sm' | 'md' | 'lg'
}) {
  const sfx = useSfx()
  return (
    <button
      type="button"
      {...props}
      onClick={(e) => {
        sfx('click')
        onClick?.(e)
      }}
      className={cn(
        'btn-pop inline-flex items-center justify-center gap-2 rounded-full font-display font-bold tracking-wide uppercase select-none disabled:opacity-50 disabled:pointer-events-none focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-primary',
        size === 'sm' && 'px-4 py-2 text-sm',
        size === 'md' && 'px-6 py-3 text-base md:text-lg',
        size === 'lg' && 'px-8 py-4 text-lg md:text-2xl',
        tones[tone],
        className,
      )}
    >
      {children}
    </button>
  )
}

export function Character({
  id,
  className,
  float = false,
  delay = 0,
}: {
  id: CharacterId
  className?: string
  float?: boolean
  delay?: number
}) {
  const names: Record<CharacterId, string> = {
    joy: 'Joy',
    sadness: 'Sadness',
    anger: 'Anger',
    disgust: 'Disgust',
    riley: 'Riley',
  }
  return (
    <img
      src={charImg(id)}
      alt={names[id]}
      width={200}
      height={260}
      draggable={false}
      className={cn('select-none drop-shadow-lg', float && 'anim-float', className)}
      style={delay ? { animationDelay: `${delay}s` } : undefined}
    />
  )
}

export function Orb({
  color,
  size = 24,
  className,
  style,
}: {
  color: string
  size?: number
  className?: string
  style?: React.CSSProperties
}) {
  return (
    <span
      aria-hidden
      className={cn('memory-orb anim-glow inline-block', className)}
      style={
        { width: size, height: size, '--orb': color, ...style } as React.CSSProperties
      }
    />
  )
}

export function Sparkles({ count = 14 }: { count?: number }) {
  const stars = useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        left: (i * 37) % 100,
        top: (i * 53) % 100,
        delay: (i % 7) * 0.3,
        size: 10 + ((i * 7) % 14),
      })),
    [count],
  )
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s, i) => (
        <span
          key={i}
          className="anim-twinkle absolute text-white"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            fontSize: s.size,
            animationDelay: `${s.delay}s`,
          }}
        >
          ✦
        </span>
      ))}
    </div>
  )
}

export function Confetti({ show }: { show: boolean }) {
  const pieces = useMemo(
    () =>
      Array.from({ length: 70 }, (_, i) => ({
        left: Math.random() * 100,
        delay: Math.random() * 0.8,
        dur: 2.2 + Math.random() * 1.8,
        color: ['#ffd23f', '#7fb2ff', '#ff6a3d', '#6fcf5a', '#b46cff', '#ff7eb6'][i % 6],
        w: 8 + Math.random() * 8,
        round: i % 3 === 0,
      })),
    // regenerate each time confetti is shown
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [show],
  )
  if (!show) return null
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
      {pieces.map((p, i) => (
        <span
          key={i}
          className="absolute top-0 block"
          style={{
            left: `${p.left}%`,
            width: p.w,
            height: p.round ? p.w : p.w * 1.6,
            background: p.color,
            borderRadius: p.round ? '9999px' : 3,
            animation: `confetti-fall ${p.dur}s ${p.delay}s ease-in forwards`,
          }}
        />
      ))}
    </div>
  )
}

export function SectionTitle({
  children,
  sub,
  className,
}: {
  children: React.ReactNode
  sub?: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('text-center', className)}>
      <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl md:text-5xl">
        <span className="rainbow-text">{children}</span>
      </h2>
      {sub && (
        <p className="mx-auto mt-3 max-w-2xl text-lg font-bold text-muted-foreground md:text-xl">
          {sub}
        </p>
      )}
    </div>
  )
}

export type Feedback = { kind: 'correct' | 'wrong'; title: string; body?: string } | null

export function FeedbackBox({ feedback }: { feedback: Feedback }) {
  if (!feedback) return null
  const good = feedback.kind === 'correct'
  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'anim-pop rounded-3xl border-4 p-4 md:p-5',
        good ? 'border-disgust bg-[#eaffe4]' : 'border-anger bg-[#fff0ea]',
      )}
    >
      <p className={cn('font-display text-xl font-bold md:text-2xl', good ? 'text-disgust-deep' : 'text-anger-deep')}>
        {feedback.title}
      </p>
      {feedback.body && (
        <p className="mt-1 text-base font-bold leading-relaxed md:text-lg">{feedback.body}</p>
      )}
    </div>
  )
}

export function ProgressDots({ total, done, current }: { total: number; done: number; current: number }) {
  return (
    <div className="flex items-center gap-2" aria-label={`Soalan ${Math.min(current + 1, total)} daripada ${total}`}>
      {Array.from({ length: total }, (_, i) => (
        <span
          key={i}
          className={cn(
            'grid size-9 place-items-center rounded-full border-4 border-white font-display text-sm font-bold shadow',
            i < done ? 'bg-disgust text-white' : i === current ? 'bg-white text-foreground' : 'bg-white/50 text-foreground/60',
          )}
        >
          {i < done ? '✓' : i + 1}
        </span>
      ))}
    </div>
  )
}
