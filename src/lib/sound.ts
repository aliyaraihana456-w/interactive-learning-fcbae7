// Small synthesized sound effects (no recorded voices). Generated with Web Audio.

type Sfx = 'click' | 'correct' | 'wrong' | 'badge' | 'flip' | 'shutter'

let ctx: AudioContext | null = null

function audio() {
  if (typeof window === 'undefined') return null
  if (!ctx) {
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext })
        .webkitAudioContext
    if (!AC) return null
    ctx = new AC()
  }
  if (ctx.state === 'suspended') void ctx.resume()
  return ctx
}

function tone(
  ac: AudioContext,
  freq: number,
  start: number,
  dur: number,
  type: OscillatorType = 'sine',
  vol = 0.15,
) {
  const osc = ac.createOscillator()
  const gain = ac.createGain()
  osc.type = type
  osc.frequency.value = freq
  gain.gain.setValueAtTime(0.0001, ac.currentTime + start)
  gain.gain.exponentialRampToValueAtTime(vol, ac.currentTime + start + 0.02)
  gain.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + start + dur)
  osc.connect(gain).connect(ac.destination)
  osc.start(ac.currentTime + start)
  osc.stop(ac.currentTime + start + dur + 0.05)
}

export function playSfx(kind: Sfx, enabled: boolean) {
  if (!enabled) return
  const ac = audio()
  if (!ac) return
  switch (kind) {
    case 'click':
      tone(ac, 660, 0, 0.08, 'triangle', 0.08)
      break
    case 'flip':
      tone(ac, 520, 0, 0.06, 'triangle', 0.08)
      tone(ac, 780, 0.05, 0.08, 'triangle', 0.08)
      break
    case 'correct':
      ;[523, 659, 784, 1047].forEach((f, i) => tone(ac, f, i * 0.08, 0.22))
      break
    case 'wrong':
      tone(ac, 220, 0, 0.18, 'square', 0.06)
      tone(ac, 180, 0.15, 0.25, 'square', 0.06)
      break
    case 'badge':
      ;[523, 659, 784, 659, 784, 1047, 1319].forEach((f, i) =>
        tone(ac, f, i * 0.1, 0.3, 'triangle', 0.12),
      )
      break
    case 'shutter':
      tone(ac, 1800, 0, 0.05, 'square', 0.05)
      tone(ac, 900, 0.05, 0.08, 'square', 0.05)
      break
  }
}
