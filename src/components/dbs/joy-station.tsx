import { useState } from 'react'
import { ArrowRight } from 'lucide-react'

import { cn } from '@/lib/utils'
import { img, JOY_QUESTIONS } from '@/lib/content'
import { FeedbackBox, FunButton, ProgressDots, useSfx, type Feedback } from './shared'
import type { GameProps } from './station-shell'

export function JoyGame({ onAnswer, onComplete }: GameProps) {
  const sfx = useSfx()
  const [index, setIndex] = useState(0)
  const [wrongKeys, setWrongKeys] = useState<string[]>([])
  const [solved, setSolved] = useState(false)
  const [shakeKey, setShakeKey] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)
  const [dragOver, setDragOver] = useState(false)

  const q = JOY_QUESTIONS[index]
  const last = index === JOY_QUESTIONS.length - 1

  const choose = (key: string) => {
    if (solved || wrongKeys.includes(key)) return
    if (key === q.answer) {
      sfx('correct')
      setSolved(true)
      onAnswer(q.id, wrongKeys.length === 0)
      setFeedback({ kind: 'correct', title: 'HEBAT! Jawapan kamu tepat! ⭐', body: q.explanation })
    } else {
      sfx('wrong')
      setWrongKeys((w) => [...w, key])
      setShakeKey(key)
      setTimeout(() => setShakeKey(null), 500)
      setFeedback({
        kind: 'wrong',
        title: 'Cuba lagi!',
        body: 'Perhatikan gambar dan fikirkan maksud bandingan semacam tersebut.',
      })
    }
  }

  const next = () => {
    if (last) return onComplete()
    setIndex((i) => i + 1)
    setWrongKeys([])
    setSolved(false)
    setFeedback(null)
  }

  const answer = q.options.find((o) => o.key === q.answer)!

  return (
    <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-[#7a5500]">Soalan {index + 1}</p>
        <ProgressDots total={JOY_QUESTIONS.length} done={index + (solved ? 1 : 0)} current={index} />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault()
          setDragOver(true)
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault()
          setDragOver(false)
          choose(e.dataTransfer.getData('text/plain'))
        }}
        className={cn(
          'mx-auto mt-5 flex max-w-xl flex-col items-center gap-3 rounded-3xl border-4 border-dashed p-5 text-center transition-colors sm:flex-row sm:justify-center',
          dragOver ? 'border-joy-deep bg-[#fff3b0]' : 'border-joy bg-[#fffbe6]',
          solved && 'border-solid border-disgust bg-[#eaffe4]',
        )}
      >
        <div className="grid size-24 shrink-0 place-items-center overflow-hidden rounded-2xl border-4 border-white bg-white shadow-inner">
          {solved ? (
            <img src={img(answer.image, 200)} alt={answer.label} className="anim-pop size-full object-cover" />
          ) : (
            <span className="text-4xl text-joy-deep">?</span>
          )}
        </div>
        <div>
          <p className="font-display text-3xl font-bold md:text-4xl">“{q.phrase}”</p>
          <p className="mt-1 text-sm font-bold text-muted-foreground">
            Tekan gambar yang betul, atau seret gambar ke sini.
          </p>
        </div>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {q.options.map((o) => {
          const isWrong = wrongKeys.includes(o.key)
          const isRight = solved && o.key === q.answer
          return (
            <button
              key={o.key}
              type="button"
              draggable={!solved && !isWrong}
              onDragStart={(e) => e.dataTransfer.setData('text/plain', o.key)}
              onClick={() => choose(o.key)}
              disabled={solved && !isRight}
              aria-label={`${o.key}. ${o.label}`}
              className={cn(
                'group relative overflow-hidden rounded-3xl border-[6px] bg-white text-left shadow-lg transition-transform hover:-translate-y-1 focus-visible:outline-4 focus-visible:outline-primary',
                isRight ? 'border-disgust ring-8 ring-disgust/30' : isWrong ? 'border-anger opacity-60' : 'border-white',
                shakeKey === o.key && 'anim-shake',
                solved && !isRight && 'opacity-40',
              )}
            >
              <img
                src={img(o.image, 400)}
                alt={o.label}
                loading="lazy"
                draggable={false}
                className="aspect-square w-full object-cover sm:aspect-[4/3]"
              />
              <div className="flex items-center gap-3 p-3">
                <span className="grid size-10 place-items-center rounded-full bg-joy font-display text-xl font-bold text-[#4a3500]">
                  {o.key}
                </span>
                <span className="font-display text-xl font-bold">{o.label}</span>
                {isRight && <span className="ml-auto text-2xl">✅</span>}
                {isWrong && <span className="ml-auto text-2xl">❌</span>}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6 space-y-4">
        <FeedbackBox feedback={feedback} />
        {solved && (
          <div className="flex justify-center">
            <FunButton tone={last ? 'rainbow' : 'joy'} size="lg" onClick={next}>
              {last ? '🏅 Terima Lencana' : 'Soalan Seterusnya'} <ArrowRight className="size-6" />
            </FunButton>
          </div>
        )}
      </div>
    </div>
  )
}
