import { useState } from 'react'
import { ArrowRight, Check, Search } from 'lucide-react'

import { cn } from '@/lib/utils'
import { DISGUST_QUESTIONS, shuffle } from '@/lib/content'
import { FeedbackBox, FunButton, ProgressDots, useSfx, type Feedback } from './shared'
import type { GameProps } from './station-shell'

function Highlight({ text, word, solved }: { text: string; word: string; solved: boolean }) {
  if (!solved) return <>{text}</>
  const i = text.indexOf(word)
  return (
    <>
      {text.slice(0, i)}
      <mark className="rounded-lg bg-anger/25 px-1 text-anger-deep line-through decoration-4">{word}</mark>
      {text.slice(i + word.length)}
    </>
  )
}

export function DisgustGame({ onAnswer, onComplete }: GameProps) {
  const sfx = useSfx()
  const [index, setIndex] = useState(0)
  const [order] = useState(() => DISGUST_QUESTIONS.map((q) => shuffle(q.options)))
  const [phase, setPhase] = useState<'decide' | 'pick' | 'solved'>('decide')
  const [misses, setMisses] = useState(0)
  const [wrongPicks, setWrongPicks] = useState<string[]>([])
  const [shake, setShake] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<Feedback>(null)

  const q = DISGUST_QUESTIONS[index]
  const last = index === DISGUST_QUESTIONS.length - 1
  const solved = phase === 'solved'

  const keep = () => {
    sfx('wrong')
    setMisses((m) => m + 1)
    setShake('keep')
    setTimeout(() => setShake(null), 500)
    setFeedback({
      kind: 'wrong',
      title: 'Eww, tunggu dulu! Ayat ini ada kesalahan. 🤢',
      body: 'Baca semula ayat itu. Adakah perbandingannya sesuai dengan sifat yang diterangkan? Cuba pilih kad pembetulan.',
    })
  }

  const openCards = () => {
    sfx('flip')
    setPhase('pick')
    setFeedback(null)
  }

  const pick = (option: string) => {
    if (solved || wrongPicks.includes(option)) return
    if (option === q.answer) {
      sfx('correct')
      setPhase('solved')
      onAnswer(q.id, misses === 0)
      setFeedback({ kind: 'correct', title: `Jawapan betul: “${q.answer}”`, body: q.explanation })
    } else {
      sfx('wrong')
      setMisses((m) => m + 1)
      setWrongPicks((w) => [...w, option])
      setShake(option)
      setTimeout(() => setShake(null), 500)
      setFeedback({
        kind: 'wrong',
        title: 'Belum tepat! Cuba lagi.',
        body: 'Kad ini masih tidak sesuai. Fikirkan sifat sebenar benda yang dibandingkan.',
      })
    }
  }

  const next = () => {
    if (last) return onComplete()
    setIndex((i) => i + 1)
    setPhase('decide')
    setMisses(0)
    setWrongPicks([])
    setFeedback(null)
  }

  return (
    <div className="rounded-[2rem] bg-white/85 p-5 shadow-xl md:p-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="font-display text-lg font-bold text-disgust-deep">Soalan {index + 1}</p>
        <ProgressDots total={DISGUST_QUESTIONS.length} done={index + (solved ? 1 : 0)} current={index} />
      </div>

      <div className="mx-auto mt-5 max-w-2xl rounded-3xl border-4 border-dashed border-anger bg-[#fff6f2] p-5 text-center">
        <p className="text-sm font-black tracking-widest text-anger-deep">🔍 AYAT YANG MENCURIGAKAN</p>
        <p className="mt-2 font-display text-2xl font-bold leading-snug md:text-3xl">
          “<Highlight text={q.wrong} word={q.wrongWord} solved={solved} />”
        </p>
      </div>

      {phase === 'decide' && (
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <FunButton tone="white" size="lg" onClick={keep} className={cn(shake === 'keep' && 'anim-shake')}>
            <Check className="size-6" /> Kekalkan Ayat
          </FunButton>
          <FunButton tone="disgust" size="lg" onClick={openCards}>
            <Search className="size-6" /> Pilih Kad Pembetulan
          </FunButton>
        </div>
      )}

      {phase !== 'decide' && (
        <div className="mt-6">
          <p className="mb-3 text-center font-display text-xl font-bold text-disgust-deep">
            Pilih kad pembetulan yang betul:
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {order[index].map((option, i) => {
              const isRight = solved && option === q.answer
              const isWrong = wrongPicks.includes(option)
              return (
                <button
                  key={option}
                  type="button"
                  onClick={() => pick(option)}
                  disabled={solved || isWrong}
                  className={cn(
                    'anim-pop rounded-3xl border-[6px] p-5 text-left font-display text-xl font-bold leading-snug shadow-lg transition-transform focus-visible:outline-4 focus-visible:outline-primary md:text-2xl',
                    isRight
                      ? 'border-disgust bg-[#eaffe4] ring-8 ring-disgust/30'
                      : isWrong
                        ? 'border-anger bg-[#fff0ea] opacity-60'
                        : 'border-white bg-[#f2fdec] hover:-translate-y-1 hover:border-disgust',
                    shake === option && 'anim-shake',
                    solved && !isRight && 'opacity-40',
                  )}
                  style={{ animationDelay: `${i * 0.1}s` }}
                >
                  <span className="mb-2 block text-sm font-black tracking-widest text-disgust-deep">
                    🌿 KAD PEMBETULAN {String.fromCharCode(65 + i)} {isRight && '✅'} {isWrong && '❌'}
                  </span>
                  “{option}”
                </button>
              )
            })}
          </div>
        </div>
      )}

      <div className="mt-6 space-y-4">
        <FeedbackBox feedback={feedback} />
        {solved && (
          <div className="flex justify-center">
            <FunButton tone={last ? 'rainbow' : 'disgust'} size="lg" onClick={next}>
              {last ? '🏅 Terima Lencana' : 'Soalan Seterusnya'} <ArrowRight className="size-6" />
            </FunButton>
          </div>
        )}
      </div>
    </div>
  )
}
