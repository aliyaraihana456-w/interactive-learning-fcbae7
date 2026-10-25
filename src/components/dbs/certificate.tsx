import { useEffect, useRef, useState } from 'react'
import { Download, Pencil, Printer } from 'lucide-react'

import { STATIONS, STATION_ORDER } from '@/lib/content'
import { formatDateMs, useProgress } from '@/lib/progress'
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
import { Input } from '@/components/ui/input'
import { Character, Confetti, FunButton, useNav } from './shared'

const W = 1754
const H = 1240 // A4 landscape ratio

const BADGE_COLORS = { joy: '#ffd23f', sadness: '#7fb2ff', anger: '#ff6a3d', disgust: '#6fcf5a' } as const

async function drawCertificate(canvas: HTMLCanvasElement, name: string, date: string) {
  await ensureFonts()
  const chars = await loadCharacters(['joy', 'sadness', 'anger', 'disgust', 'riley'])
  const ctx = canvas.getContext('2d')!
  canvas.width = W
  canvas.height = H
  ctx.clearRect(0, 0, W, H)

  drawRainbowBorder(ctx, W, H, 46, 60, '#fffdf6')

  // soft inner glow
  const glow = ctx.createRadialGradient(W / 2, H / 2, 100, W / 2, H / 2, W / 1.4)
  glow.addColorStop(0, 'rgba(255,255,255,0)')
  glow.addColorStop(1, 'rgba(180,108,255,0.12)')
  ctx.fillStyle = glow
  roundRect(ctx, 46, 46, W - 92, H - 92, 42)
  ctx.fill()

  // dashed inner line
  ctx.save()
  ctx.setLineDash([18, 14])
  ctx.lineWidth = 5
  ctx.strokeStyle = '#d9cdfb'
  roundRect(ctx, 80, 80, W - 160, H - 160, 34)
  ctx.stroke()
  ctx.restore()

  // memory orbs + stars
  const orbs: [number, number, number, string][] = [
    [150, 150, 34, '#ffd23f'], [W - 150, 150, 34, '#6fcf5a'], [150, H - 150, 34, '#7fb2ff'], [W - 150, H - 150, 34, '#ff6a3d'],
    [420, 120, 16, '#c86bfa'], [W - 420, 120, 16, '#4cc9f0'], [300, H - 110, 14, '#ff9f1c'], [W - 300, H - 110, 14, '#ff7eb6'],
  ]
  orbs.forEach(([x, y, r, c]) => drawOrb(ctx, x, y, r, c))
  ;[[560, 200], [W - 560, 200], [240, 520], [W - 240, 520], [W / 2 - 470, 1010], [W / 2 + 470, 1010]].forEach(([x, y], i) =>
    drawStar(ctx, x, y, 16 + (i % 3) * 6, ['#ffd23f', '#ff9f1c', '#c86bfa'][i % 3]),
  )

  // characters around the edge
  drawCharacter(ctx, chars.joy, 230, 330, 260, -0.12)
  drawCharacter(ctx, chars.disgust, W - 230, 330, 260, 0.12)
  drawCharacter(ctx, chars.sadness, 230, 830, 250, 0.08)
  drawCharacter(ctx, chars.anger, W - 230, 830, 250, -0.08)

  ctx.textAlign = 'center'
  ctx.textBaseline = 'alphabetic'

  ctx.fillStyle = '#7c4dff'
  ctx.font = '800 30px Nunito, sans-serif'
  ctx.fillText('DUNIA BANDINGAN SEMACAM: KEMBARA MISI EMOSI', W / 2, 180)

  ctx.font = '700 120px Fredoka, sans-serif'
  ctx.lineWidth = 14
  ctx.strokeStyle = '#ffffff'
  ctx.lineJoin = 'round'
  ctx.strokeText('SIJIL PENCAPAIAN', W / 2, 315)
  ctx.fillStyle = rainbowGradient(ctx, W / 2 - 520, 0, W / 2 + 520, 0)
  ctx.fillText('SIJIL PENCAPAIAN', W / 2, 315)

  ctx.fillStyle = '#6b6290'
  ctx.font = '800 36px Nunito, sans-serif'
  ctx.fillText('Dengan bangganya dianugerahkan kepada', W / 2, 400)

  // name
  const size = fitText(ctx, name, 1050, 104, (s) => `700 ${s}px Fredoka, sans-serif`)
  ctx.fillStyle = '#2b2350'
  ctx.fillText(name, W / 2, 400 + 30 + size)
  ctx.fillStyle = rainbowGradient(ctx, W / 2 - 480, 0, W / 2 + 480, 0)
  roundRect(ctx, W / 2 - 480, 400 + 60 + size, 960, 8, 4)
  ctx.fill()

  ctx.fillStyle = '#2b2350'
  ctx.font = '800 38px Nunito, sans-serif'
  ctx.fillText('Telah berjaya menyelesaikan empat misi pembelajaran', W / 2, 640)
  ctx.fillText('Bandingan Semacam', W / 2, 690)

  // badges
  const bx = [W / 2 - 390, W / 2 - 130, W / 2 + 130, W / 2 + 390]
  STATION_ORDER.forEach((id, i) => {
    const x = bx[i]
    const y = 820
    ctx.save()
    ctx.shadowColor = 'rgba(43,35,80,0.25)'
    ctx.shadowBlur = 16
    ctx.fillStyle = '#ffffff'
    ctx.beginPath()
    ctx.arc(x, y, 82, 0, Math.PI * 2)
    ctx.fill()
    ctx.restore()
    ctx.fillStyle = BADGE_COLORS[id]
    ctx.beginPath()
    ctx.arc(x, y, 70, 0, Math.PI * 2)
    ctx.fill()
    ctx.font = '72px "Apple Color Emoji","Segoe UI Emoji","Noto Color Emoji",sans-serif'
    ctx.textBaseline = 'middle'
    ctx.fillText(STATIONS[id].badgeIcon, x, y + 4)
    ctx.textBaseline = 'alphabetic'
    ctx.fillStyle = '#2b2350'
    ctx.font = '700 28px Fredoka, sans-serif'
    ctx.fillText(STATIONS[id].badgeTitle, x, y + 125)
  })

  ctx.fillStyle = '#6b6290'
  ctx.font = '800 32px Nunito, sans-serif'
  ctx.fillText(`Tarikh: ${date}`, W / 2, 1030)

  drawCharacter(ctx, chars.riley, W / 2, 1110, 130)
  ctx.font = '800 24px Nunito, sans-serif'
  ctx.fillStyle = '#7c4dff'
  ctx.fillText('Bahasa Melayu Tahun 3', W / 2 - 330, 1130)
  ctx.fillText('Wira Emosi 🌈', W / 2 + 330, 1130)
}

export function CertificateView() {
  const { go } = useNav()
  const { progress, setName, allDone, completedCount, ready } = useProgress()
  const [draft, setDraft] = useState(progress.name)
  const [editing, setEditing] = useState(!progress.name)
  const [error, setError] = useState('')
  const [dataUrl, setDataUrl] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!ready) return
    setDraft(progress.name)
    setEditing(!progress.name)
    // only when storage finishes loading
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready])

  const date = formatDateMs(progress.finishedAt)

  useEffect(() => {
    if (!allDone || !progress.name || editing || !canvasRef.current) return
    let cancelled = false
    void drawCertificate(canvasRef.current, progress.name, date).then(() => {
      if (!cancelled && canvasRef.current) setDataUrl(canvasRef.current.toDataURL('image/png'))
    })
    return () => {
      cancelled = true
    }
  }, [allDone, progress.name, editing, date])

  const submit = (e: React.FormEvent) => {
    e.preventDefault()
    const clean = draft.replace(/\s+/g, ' ').trim()
    if (clean.length < 2) return setError('Sila tulis nama kamu (sekurang-kurangnya 2 huruf).')
    if (clean.length > 40) return setError('Nama terlalu panjang. Gunakan maksimum 40 huruf.')
    setError('')
    setDataUrl(null)
    setName(clean)
    setEditing(false)
  }

  const downloadPdf = async () => {
    if (!dataUrl) return
    setBusy(true)
    try {
      const { jsPDF } = await import('jspdf')
      const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })
      pdf.addImage(dataUrl, 'PNG', 0, 0, 297, 210)
      pdf.save(`Sijil-Bandingan-Semacam-${progress.name.replace(/[^\p{L}\p{N}]+/gu, '-')}.pdf`)
    } finally {
      setBusy(false)
    }
  }

  if (!allDone) {
    return (
      <section className="dreamy-bg min-h-[calc(100vh-4rem)] px-4 py-14">
        <div className="mx-auto max-w-2xl rounded-[2rem] border-8 border-white bg-white/90 p-8 text-center shadow-2xl">
          <p className="text-6xl">🔒</p>
          <h1 className="mt-3 font-display text-3xl font-bold">Sijil masih berkunci</h1>
          <p className="mt-2 text-lg font-bold text-muted-foreground">
            Selesaikan keempat-empat stesen untuk membuka Sijil Pencapaian. Kamu telah menyelesaikan{' '}
            <strong className="text-foreground">{completedCount} daripada 4</strong> stesen.
          </p>
          <FunButton tone="rainbow" size="lg" className="mt-6" onClick={() => go('peta')}>
            🗺️ Ke Peta Misi
          </FunButton>
        </div>
      </section>
    )
  }

  return (
    <section className="dreamy-bg relative min-h-[calc(100vh-4rem)] overflow-hidden px-4 py-10">
      <Confetti show />
      <div className="mx-auto max-w-5xl text-center">
        <div className="flex justify-center gap-2">
          {(['joy', 'sadness', 'riley', 'anger', 'disgust'] as const).map((c, i) => (
            <Character key={c} id={c} float delay={i * 0.25} className="h-20 w-auto md:h-28" />
          ))}
        </div>
        <h1 className="title-outline mt-4 font-display text-4xl font-bold md:text-6xl">
          <span className="rainbow-text">TAHNIAH, WIRA EMOSI!</span>
        </h1>
        <p className="mt-3 text-xl font-bold md:text-2xl">
          Kamu telah berjaya menamatkan Kembara Misi Bandingan Semacam!
        </p>

        {editing ? (
          <form
            onSubmit={submit}
            className="anim-pop mx-auto mt-8 max-w-lg rounded-[2rem] border-8 border-white bg-white p-6 text-left shadow-2xl"
          >
            <label htmlFor="student-name" className="font-display text-xl font-bold">
              ✏️ Tulis nama penuh kamu untuk sijil:
            </label>
            <Input
              id="student-name"
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Contoh: tulis nama kamu di sini"
              maxLength={40}
              autoComplete="off"
              className="mt-3 h-14 rounded-2xl border-4 text-xl font-bold"
              aria-invalid={!!error}
            />
            {error && <p className="mt-2 font-bold text-destructive">{error}</p>}
            <FunButton type="submit" tone="rainbow" size="lg" className="mt-5 w-full">
              🎓 Jana Sijil Saya
            </FunButton>
          </form>
        ) : (
          <div className="mt-8">
            <div className="relative mx-auto overflow-hidden rounded-3xl bg-white shadow-2xl">
              <canvas ref={canvasRef} className="hidden" />
              {dataUrl ? (
                <img src={dataUrl} alt={`Sijil Pencapaian untuk ${progress.name}`} className="anim-pop w-full" />
              ) : (
                <div className="grid aspect-[1.414] w-full place-items-center font-display text-xl font-bold text-muted-foreground">
                  Sedang menyediakan sijil… ✨
                </div>
              )}
            </div>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <FunButton tone="rainbow" size="lg" onClick={downloadPdf} disabled={!dataUrl || busy}>
                <Download className="size-6" /> {busy ? 'Menyediakan…' : 'Muat Turun Sijil'}
              </FunButton>
              <FunButton tone="white" size="lg" onClick={() => window.print()} disabled={!dataUrl}>
                <Printer className="size-6" /> Cetak Sijil
              </FunButton>
              <FunButton tone="white" onClick={() => setEditing(true)}>
                <Pencil className="size-5" /> Tukar Nama
              </FunButton>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-3">
              <FunButton tone="joy" onClick={() => go('swafoto')}>
                📸 Jom Ambil Swafoto
              </FunButton>
              <FunButton tone="white" onClick={() => go('pencapaian')}>
                🏅 Lihat Pencapaian
              </FunButton>
              <FunButton tone="white" onClick={() => go('home')}>
                🏠 Halaman Utama
              </FunButton>
            </div>
            {dataUrl && (
              <div id="print-certificate" className="hidden">
                <img src={dataUrl} alt="" />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
