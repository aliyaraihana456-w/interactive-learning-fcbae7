import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { SADNESS_PAIRS, shuffle } from '@/lib/content'
import { FeedbackBox, FunButton, ProgressDots, useSfx, type Feedback } from './shared'
import type { GameProps } from './station-shell'

export function SadnessGame({ onAnswer, onComplete }: GameProps) {
  const sfx = useSfx()
  const [meanings] = useState(() => shuffle(SADNESS_PAIRS))
  const [opened, setOpened] = useState<string | null>(null)
  const [matched, setMatched] = useState<string[]>([])
  const [misses, setMisses] = useState<Record<string, number>>({})
  const [shakeId, setShakeId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const allDone = matched.length === SADNESS_PAIRS.length

  const openCard = (id: string) => {
    if (matched.includes(id)) return
    sfx('flip')
    setOpened(id)
    setFeedback(null)
  }

  const pickMeaning = (id: string) => {
    if (matched.includes(id)) return
    if (!opened) {
      sfx('wrong')
      setFeedback({ kind: 'wrong', title: 'Buka kad ayat dahulu! 💧', body: 'Tekan salah satu Kad A untuk membukanya.' })
      return
    }
    const pair = SADNESS_PAIRS.find((p) => p.id === opened)!
    if (id === opened) {
      sfx('correct')
      onAnswer(pair.id, !misses[pair.id])
      setMatched((m) => [...m, pair.id])
      setOpened(null)
      setFeedback({ kind: 'correct', title: `“${pair.phrase}” — padanan tepat! ⭐`, body: pair.explanation })
    } else {
      sfx('wrong')
      setMisses((m) => ({ ...m, [pair.id]: (m[pair.id] ?? 0) + 1 }))
      setShakeId(id)
      setTimeout(() => setShakeId(null), 500)
      setFeedback({
        kind: 'wrong',
        title: 'Alamak, belum tepat! Cuba lagi.',
        body: `Fikirkan sifat benda dalam ungkapan “${pair.phrase}”. Apakah yang ingin digambarkan?`,
      })
    }
  }

  return (
    <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-sadness-deep">
          {matched.length} daripada {SADNESS_PAIRS.length} pasangan dipadankan
        </p>
        <ProgressDots total={SADNESS_PAIRS.length} done={matched.length} current={matched.length} />
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div>
          <h3 className="mb-3 font-display text-xl font-bold text-sadness-deep">
            Kad A: Bandingan Semacam
          </h3>
          <div className="grid gap-4">
            {SADNESS_PAIRS.map((p, i) => {
              const isMatched = matched.includes(p.id)
              const isOpen = opened === p.id || isMatched
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => openCard(p.id)}
                  aria-pressed={opened === p.id}
                  aria-label={isOpen ? p.phrase : `Kad ayat ${i + 1} (tertutup)`}
                  className="flip-scene h-28 w-full text-left focus-visible:outline-4 focus-visible:outline-primary"
                >
                  <div className={cn('flip-card relative size-full', isOpen && 'is-flipped')}>
                    <div className="flip-face absolute inset-0 flex items-center justify-center gap-3 rounded-3xl border-4 border-white bg-gradient-to-br from-sadness to-sadness-deep text-white shadow-lg">
                      <span className="text-4xl">💧</span>
                      <span className="font-display text-xl font-bold">Kad Ayat {i + 1}</span>
                      <span className="text-sm font-bold opacity-80">Tekan untuk buka</span>
                    </div>
                    <div
                      className={cn(
                        'flip-face flip-back absolute inset-0 flex items-center justify-center rounded-3xl border-4 p-4 text-center shadow-lg',
                        isMatched
                          ? 'border-disgust bg-[#eaffe4]'
                          : 'border-sadness-deep bg-white ring-8 ring-sadness/40',
                      )}
                    >
                      <span className="font-display text-2xl font-bold">
                        “{p.phrase}” {isMatched && '✅'}
                      </span>
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-3 font-display text-xl font-bold text-sadness-deep">
            Kad B: Maksud
          </h3>
          <div className="grid gap-4">
            {meanings.map((m) => {
              const isMatched = matched.includes(m.id)
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => pickMeaning(m.id)}
                  disabled={isMatched}
                  className={cn(
                    'min-h-28 rounded-3xl border-4 p-4 text-left text-lg font-bold leading-snug shadow-lg transition-transform focus-visible:outline-4 focus-visible:outline-primary',
                    isMatched
                      ? 'border-disgust bg-[#eaffe4]'
                      : 'border-white bg-[#f3f8ff] hover:-translate-y-1 hover:border-sadness',
                    opened && !isMatched && 'border-sadness/60',
                    shakeId === m.id && 'anim-shake border-anger',
                  )}
                >
                  {isMatched && <span className="mb-1 block text-sm font-black text-disgust-deep">✅ {m.phrase}</span>}
                  {m.meaning}
                </button>
              )
            })}
          </div>
        </div>
      </div>

      <p className="mt-4 text-center text-sm font-bold text-muted-foreground">
        {opened
          ? 'Bagus! Sekarang pilih Kad B yang menerangkan maksud ayat tersebut.'
          : 'Langkah 1: Tekan Kad A untuk membukanya. Langkah 2: Pilih Kad B yang betul.'}
      </p>

      <div className="mt-6 space-y-4">
        <FeedbackBox feedback={feedback} />
        {allDone && (
          <div className="flex justify-center">
            <FunButton tone="rainbow" size="lg" onClick={onComplete}>
              🏅 Terima Lencana <ArrowRight className="size-6" />
            </FunButton>
          </div>
        )}
      </div>
    </div>
  )
}
