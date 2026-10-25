import { useState } from 'react'
import { ArrowRight, Check, Eraser } from 'lucide-react'

import { cn } from '@/lib/utils'
import { ANGER_QUESTIONS } from '@/lib/content'
import { FeedbackBox, FunButton, ProgressDots, useSfx, type Feedback } from './shared'
import type { GameProps } from './station-shell'

const capitalise = (w: string) => w.charAt(0).toUpperCase() + w.slice(1)

export function AngerGame({ onAnswer, onComplete }: GameProps) {
  const sfx = useSfx()
  const [index, setIndex] = useState(0)
  const [placed, setPlaced] = useState<number[]>([]) // indexes into q.scrambled
  const [misses, setMisses] = useState(0)
  const [solved, setSolved] = useState(false)
  const [shake, setShake] = useState(false)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [dragFrom, setDragFrom] = useState<{ zone: 'pool' | 'row'; tile: number } | null>(null)

  const q = ANGER_QUESTIONS[index]
  const last = index === ANGER_QUESTIONS.length - 1
  const pool = q.scrambled.map((_, i) => i).filter((i) => !placed.includes(i))
  const sentence = placed.map((i, n) => (n === 0 ? capitalise(q.scrambled[i]) : q.scrambled[i].toLowerCase()))

  const add = (tile: number, at?: number) => {
    if (solved) return
    sfx('click')
    setFeedback(null)
    setPlaced((p) => {
      const rest = p.filter((t) => t !== tile)
      const pos = at === undefined ? rest.length : Math.min(at, rest.length)
      return [...rest.slice(0, pos), tile, ...rest.slice(pos)]
    })
  }
  const remove = (tile: number) => {
    if (solved) return
    sfx('click')
    setFeedback(null)
    setPlaced((p) => p.filter((t) => t !== tile))
  }

  const check = () => {
    const ok =
      placed.length === q.answer.length &&
      placed.every((t, n) => q.scrambled[t].toLowerCase() === q.answer[n].toLowerCase())
    if (ok) {
      sfx('correct')
      setSolved(true)
      onAnswer(q.id, misses === 0)
      setFeedback({
        kind: 'correct',
        title: 'BOOM! MISI SELESAI! 💥 Kamu berjaya menyusun ayat dengan tepat!',
        body: q.explanation,
      })
    } else {
      sfx('wrong')
      setMisses((m) => m + 1)
      setShake(true)
      setTimeout(() => setShake(false), 500)
      setFeedback({ kind: 'wrong', title: 'Hampir berjaya! Cuba susun semula. 🔥', body: `Petunjuk: ${q.hint}` })
    }
  }

  const next = () => {
    if (last) return onComplete()
    setIndex((i) => i + 1)
    setPlaced([])
    setMisses(0)
    setSolved(false)
    setFeedback(null)
  }

  const tileClass =
    'rounded-2xl border-b-[6px] px-4 py-3 font-display text-xl font-bold shadow-md transition-transform hover:-translate-y-1 active:translate-y-0.5 md:text-2xl cursor-grab focus-visible:outline-4 focus-visible:outline-primary'

  return (
    <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-anger-deep">Soalan {index + 1}</p>
        <ProgressDots total={ANGER_QUESTIONS.length} done={index + (solved ? 1 : 0)} current={index} />
      </div>

      <p className="mt-4 text-center text-base font-bold text-muted-foreground">
        Perkataan bercampur: <span className="text-foreground">{q.scrambled.join(' / ')}</span>
      </p>

      {/* Answer row */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (dragFrom) add(dragFrom.tile)
          setDragFrom(null)
        }}
        aria-label="Ruang ayat"
        className={cn(
          'mt-4 flex min-h-24 flex-wrap items-center justify-center gap-3 rounded-3xl border-4 border-dashed p-4',
          solved ? 'border-solid border-disgust bg-[#eaffe4]' : 'border-anger bg-[#fff4ee]',
          shake && 'anim-shake',
        )}
      >
        {placed.length === 0 && (
          <span className="font-bold text-muted-foreground">Tekan atau seret perkataan ke sini 👇</span>
        )}
        {placed.map((tile, n) => (
          <button
            key={tile}
            type="button"
            draggable={!solved}
            onDragStart={() => setDragFrom({ zone: 'row', tile })}
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault()
              e.stopPropagation()
              if (dragFrom && dragFrom.tile !== tile) add(dragFrom.tile, placed.filter((t) => t !== dragFrom.tile).indexOf(tile))
              setDragFrom(null)
            }}
            onClick={() => remove(tile)}
            title="Tekan untuk keluarkan"
            className={cn(tileClass, solved ? 'border-disgust-deep bg-disgust text-white' : 'border-anger-deep bg-anger text-white')}
          >
            {sentence[n]}
          </button>
        ))}
        {placed.length > 0 && <span className="font-display text-3xl font-bold">.</span>}
      </div>

      {/* Word pool */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault()
          if (dragFrom?.zone === 'row') remove(dragFrom.tile)
          setDragFrom(null)
        }}
        className="mt-5 flex min-h-20 flex-wrap justify-center gap-3 rounded-3xl bg-[#ffe9dc] p-4"
      >
        {pool.length === 0 && !solved && (
          <span className="self-center font-bold text-muted-foreground">Semua perkataan sudah digunakan. Tekan SEMAK!</span>
        )}
        {solved && <span className="self-center font-bold text-disgust-deep">✅ {sentence.join(' ')}.</span>}
        {!solved &&
          pool.map((tile) => (
            <button
              key={tile}
              type="button"
              draggable
              onDragStart={() => setDragFrom({ zone: 'pool', tile })}
              onClick={() => add(tile)}
              className={cn(tileClass, 'border-[#e0a100] bg-joy text-[#4a3500]')}
            >
              {q.scrambled[tile]}
            </button>
          ))}
      </div>

      {!solved && (
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <FunButton tone="white" onClick={() => setPlaced([])} disabled={placed.length === 0}>
            <Eraser className="size-5" /> Kosongkan
          </FunButton>
          <FunButton tone="anger" onClick={check} disabled={placed.length !== q.scrambled.length}>
            <Check className="size-5" /> Semak Ayat
          </FunButton>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <FeedbackBox feedback={feedback} />
        {solved && (
          <div className="flex justify-center">
            <FunButton tone={last ? 'rainbow' : 'anger'} size="lg" onClick={next}>
              {last ? '🏅 Terima Lencana' : 'Soalan Seterusnya'} <ArrowRight className="size-6" />
            </FunButton>
          </div>
        )}
      </div>
    </div>
  )
}
