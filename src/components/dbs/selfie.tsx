import { useEffect, useRef, useState } from 'react'
import { Camera, Download, RefreshCcw, Video } from 'lucide-react'

import { cn } from '@/lib/utils'
import {
  drawCharacter,
  drawOrb,
  drawRainbowBorder,
  drawStar,
  ensureFonts,
  fitText,
  loadCharacters,
  rainbowGradient,
  roundRect,
} from '@/lib/canvas-art'
import { Character, FunButton, SectionTitle, useNav, useSfx } from './shared'

const W = 1080
const H = 1350
const PAD = 60
const CAPTION_H = 190
const PHOTO = { x: PAD, y: PAD, w: W - PAD * 2, h: H - PAD * 2 - CAPTION_H }
const CAPTION = 'SAYA WIRA BANDINGAN SEMACAM!'

type Status = 'idle' | 'requesting' | 'live' | 'photo' | 'error'

function cameraErrorMessage(err: unknown) {
  const name = err instanceof DOMException ? err.name : ''
  if (name === 'NotAllowedError' || name === 'SecurityError')
    return 'Alamak! Kebenaran kamera ditolak. Tekan ikon kamera atau mangga 🔒 di bar alamat pelayar, benarkan kamera, kemudian tekan CUBA LAGI.'
  if (name === 'NotFoundError' || name === 'OverconstrainedError')
    return 'Hmm, kami tidak menjumpai kamera pada peranti ini. Cuba gunakan peranti yang mempunyai kamera, kemudian tekan CUBA LAGI.'
  if (name === 'NotReadableError' || name === 'AbortError')
    return 'Kamera sedang digunakan oleh aplikasi lain. Tutup aplikasi tersebut, kemudian tekan CUBA LAGI.'
  return 'Maaf, kamera tidak dapat dibuka buat masa ini. Tekan CUBA LAGI.'
}

async function composePhoto(video: HTMLVideoElement, canvas: HTMLCanvasElement) {
  await ensureFonts()
  const chars = await loadCharacters(['joy', 'sadness', 'anger', 'disgust'])
  const ctx = canvas.getContext('2d')!
  canvas.width = W
  canvas.height = H

  drawRainbowBorder(ctx, W, H, 34, 70, '#fff8e8')

  // Photo, mirrored like the live preview and cropped to cover the frame window.
  const vw = video.videoWidth
  const vh = video.videoHeight
  const scale = Math.max(PHOTO.w / vw, PHOTO.h / vh)
  const sw = PHOTO.w / scale
  const sh = PHOTO.h / scale
  ctx.save()
  roundRect(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, 46)
  ctx.clip()
  ctx.translate(PHOTO.x + PHOTO.w, PHOTO.y)
  ctx.scale(-1, 1)
  ctx.drawImage(video, (vw - sw) / 2, (vh - sh) / 2, sw, sh, 0, 0, PHOTO.w, PHOTO.h)
  ctx.restore()

  ctx.save()
  ctx.lineWidth = 10
  ctx.strokeStyle = '#ffffff'
  roundRect(ctx, PHOTO.x, PHOTO.y, PHOTO.w, PHOTO.h, 46)
  ctx.stroke()
  ctx.restore()

  // Decorations
  ;[
    [120, 380, 22, '#ffd23f'],
    [W - 110, 420, 18, '#7fb2ff'],
    [W / 2 - 200, 90, 14, '#ff6a3d'],
    [W / 2 + 220, 100, 16, '#6fcf5a'],
  ].forEach(([x, y, r, c]) => drawOrb(ctx, x as number, y as number, r as number, c as string))
  ;[
    [W / 2, 96, 26],
    [W / 2 - 110, 120, 16],
    [W / 2 + 110, 124, 16],
    [90, 640, 18],
    [W - 90, 700, 20],
  ].forEach(([x, y, r], i) => drawStar(ctx, x, y, r, ['#ffd23f', '#ffffff', '#ffffff', '#ffd23f', '#ff9f1c'][i]))

  drawCharacter(ctx, chars.joy, 150, 170, 230, -0.15)
  drawCharacter(ctx, chars.disgust, W - 150, 170, 230, 0.15)
  drawCharacter(ctx, chars.sadness, 140, PHOTO.y + PHOTO.h - 110, 220, 0.1)
  drawCharacter(ctx, chars.anger, W - 140, PHOTO.y + PHOTO.h - 110, 220, -0.1)

  // Caption
  const cy = PHOTO.y + PHOTO.h + 24
  ctx.save()
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(43,35,80,0.2)'
  ctx.shadowBlur = 14
  roundRect(ctx, PAD, cy, W - PAD * 2, CAPTION_H - 34, 40)
  ctx.fill()
  ctx.restore()
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const size = fitText(ctx, CAPTION, W - PAD * 2 - 60, 74, (s) => `700 ${s}px Fredoka, sans-serif`)
  ctx.fillStyle = rainbowGradient(ctx, PAD + 30, 0, W - PAD - 30, 0)
  ctx.fillText(CAPTION, W / 2, cy + (CAPTION_H - 34) / 2 - (size > 50 ? 8 : 0))
  ctx.font = '800 26px Nunito, sans-serif'
  ctx.fillStyle = '#7c4dff'
  ctx.fillText('Dunia Bandingan Semacam • Kembara Misi Emosi', W / 2, cy + CAPTION_H - 62)

  return canvas.toDataURL('image/png')
}

export function SelfieView() {
  const { go } = useNav()
  const sfx = useSfx()
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const [status, setStatus] = useState<Status>('idle')
  const [error, setError] = useState('')
  const [photo, setPhoto] = useState<string | null>(null)
  const [count, setCount] = useState<number | null>(null)
  const [flash, setFlash] = useState(false)

  const stopStream = () => {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
  }

  useEffect(() => stopStream, [])

  const openCamera = async () => {
    setError('')
    if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
      setStatus('error')
      setError(
        'Pelayar ini tidak membenarkan kamera. Pastikan laman dibuka melalui pautan https:// dan gunakan pelayar terkini seperti Chrome, Safari atau Edge.',
      )
      return
    }
    setStatus('requesting')
    try {
      stopStream()
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 1600 } },
        audio: false,
      })
      streamRef.current = stream
      const v = videoRef.current!
      v.srcObject = stream
      await v.play()
      setStatus('live')
    } catch (err) {
      stopStream()
      setStatus('error')
      setError(cameraErrorMessage(err))
    }
  }

  const takePhoto = () => {
    if (status !== 'live' || count !== null) return
    let n = 3
    setCount(n)
    sfx('click')
    const tick = setInterval(async () => {
      n -= 1
      if (n > 0) {
        setCount(n)
        sfx('click')
        return
      }
      clearInterval(tick)
      setCount(null)
      const v = videoRef.current
      if (!v || !v.videoWidth || !canvasRef.current) return
      sfx('shutter')
      setFlash(true)
      setTimeout(() => setFlash(false), 300)
      const url = await composePhoto(v, canvasRef.current)
      setPhoto(url)
      setStatus('photo')
    }, 800)
  }

  const retake = () => {
    setPhoto(null)
    if (streamRef.current?.active) {
      setStatus('live')
      void videoRef.current?.play()
    }
    else void openCamera()
  }

  const download = () => {
    if (!photo) return
    const a = document.createElement('a')
    a.href = photo
    a.download = `swafoto-wira-emosi-${new Date().toISOString().slice(0, 10)}.png`
    document.body.appendChild(a)
    a.click()
    a.remove()
  }

  const live = status === 'live'

  return (
    <section className="dreamy-bg min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <SectionTitle sub="Gambar hanya diproses dalam peranti kamu dan tidak dimuat naik ke mana-mana.">
          JOM AMBIL SWAFOTO BERSAMA WATAK EMOSI!
        </SectionTitle>

        <div className="mt-8 grid items-start gap-8 md:grid-cols-[1fr_auto]">
          {/* Stage */}
          <div className="relative mx-auto w-full max-w-md">
            <div
              className={cn(
                'rainbow-bg relative aspect-[4/5] w-full overflow-hidden rounded-[2.5rem] p-[3.2%] shadow-2xl',
                photo && 'hidden',
              )}
            >
              <div className="relative size-full overflow-hidden rounded-[2rem] bg-[#fff8e8]">
                <div className="absolute inset-x-[2.5%] top-[2.5%] bottom-[16%] overflow-hidden rounded-[1.6rem] border-4 border-white bg-gradient-to-br from-[#e9e2ff] to-[#d6ecff]">
                  <video
                    ref={videoRef}
                    muted
                    playsInline
                    className={cn('size-full -scale-x-100 object-cover', !live && 'invisible')}
                  />
                  {!live && (
                    <div className="absolute inset-0 grid place-items-center p-6 text-center">
                      {status === 'requesting' ? (
                        <p className="font-display text-xl font-bold">
                          📷 Sila tekan <strong>“Benarkan / Allow”</strong> pada mesej pelayar…
                        </p>
                      ) : status === 'error' ? (
                        <div>
                          <p className="text-5xl">🙈</p>
                          <p className="mt-2 font-display text-lg font-bold leading-snug">Kamera belum dapat dibuka</p>
                        </div>
                      ) : (
                        <div>
                          <p className="text-6xl">📸</p>
                          <p className="mt-2 font-display text-xl font-bold">Tekan BUKA KAMERA untuk bermula</p>
                        </div>
                      )}
                    </div>
                  )}
                  {count !== null && (
                    <span
                      key={count}
                      className="anim-pop absolute inset-0 grid place-items-center font-display text-[9rem] font-bold text-white drop-shadow-[0_6px_0_rgba(43,35,80,0.4)]"
                    >
                      {count}
                    </span>
                  )}
                  {flash && <span className="absolute inset-0 bg-white" />}
                </div>
                <Character id="joy" className="absolute left-[2%] top-[1%] h-[19%] w-auto -rotate-12" />
                <Character id="disgust" className="absolute right-[2%] top-[1%] h-[19%] w-auto rotate-12" />
                <Character id="sadness" className="absolute bottom-[16%] left-[1%] h-[18%] w-auto rotate-6" />
                <Character id="anger" className="absolute bottom-[16%] right-[1%] h-[18%] w-auto -rotate-6" />
                <span className="anim-twinkle absolute left-1/2 top-[3%] -translate-x-1/2 text-3xl">⭐</span>
                <div className="absolute inset-x-[2.5%] bottom-[2.5%] grid h-[12%] place-items-center rounded-[1.4rem] bg-white shadow">
                  <span className="rainbow-text px-2 text-center font-display text-lg font-bold leading-tight sm:text-2xl">
                    {CAPTION}
                  </span>
                </div>
              </div>
            </div>

            {photo && (
              <img
                src={photo}
                alt="Swafoto kamu dalam bingkai Wira Bandingan Semacam"
                className="anim-pop w-full rounded-[2.5rem] shadow-2xl"
              />
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Controls */}
          <div className="flex flex-col gap-3 md:w-72">
            <FunButton
              tone="joy"
              size="lg"
              onClick={openCamera}
              disabled={status === 'requesting' || live || status === 'photo'}
            >
              <Video className="size-6" /> {status === 'error' ? 'Cuba Lagi' : 'Buka Kamera'}
            </FunButton>
            <FunButton tone="rainbow" size="lg" onClick={takePhoto} disabled={!live || count !== null}>
              <Camera className="size-6" /> Ambil Gambar
            </FunButton>
            <FunButton tone="white" size="lg" onClick={retake} disabled={status !== 'photo'}>
              <RefreshCcw className="size-6" /> Ambil Semula
            </FunButton>
            <FunButton tone="disgust" size="lg" onClick={download} disabled={!photo}>
              <Download className="size-6" /> Muat Turun Gambar
            </FunButton>

            {status === 'error' && (
              <div role="alert" className="anim-pop rounded-3xl border-4 border-sadness bg-[#eef5ff] p-4 font-bold leading-relaxed">
                💙 {error}
              </div>
            )}

            <div className="rounded-3xl bg-white/80 p-4 text-sm font-bold leading-relaxed text-muted-foreground shadow">
              🔒 Foto kamu selamat! Gambar hanya disimpan dalam pelayar dan hanya dimuat turun apabila kamu menekan
              butang <strong>MUAT TURUN GAMBAR</strong>.
            </div>

            <FunButton tone="white" onClick={() => go('pencapaian')}>
              🏅 Lihat Pencapaian
            </FunButton>
          </div>
        </div>
      </div>
    </section>
  )
}
