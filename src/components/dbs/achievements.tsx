import { useState } from 'react'
import { toast } from 'sonner'
import { RotateCcw } from 'lucide-react'

import { cn } from '@/lib/utils'
import { STATIONS, STATION_ORDER, TOTAL_QUESTIONS } from '@/lib/content'
import { formatDateMs, useProgress } from '@/lib/progress'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Character, FunButton, SectionTitle, useNav } from './shared'
import { BadgeIcon, STATION_THEME } from './station-shell'

export function AchievementsView() {
  const { go } = useNav()
  const { progress, completedCount, allDone, reset } = useProgress()
  const [confirmOpen, setConfirmOpen] = useState(false)

  const solved = progress.solved.length
  const overall = Math.round(((completedCount / 4) * 0.5 + (solved / TOTAL_QUESTIONS) * 0.5) * 100)

  const stats = [
    { label: 'Stesen selesai', value: `${completedCount} / 4`, icon: '🗺️', color: '#7fb2ff' },
    { label: 'Jawapan betul', value: `${solved} / ${TOTAL_QUESTIONS}`, icon: '✅', color: '#6fcf5a' },
    { label: 'Betul pada cubaan pertama', value: `${progress.firstTry.length}`, icon: '⭐', color: '#ffd23f' },
    { label: 'Lencana dikumpul', value: `${completedCount}`, icon: '🏅', color: '#ff6a3d' },
  ]

  return (
    <section className="dreamy-bg min-h-[calc(100vh-4rem)] px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <SectionTitle sub={progress.name ? `Pencapaian ${progress.name}` : 'Lencana dan sijil yang telah kamu kumpulkan.'}>
          PENCAPAIAN SAYA
        </SectionTitle>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border-4 bg-white p-5 text-center shadow-lg" style={{ borderColor: s.color }}>
              <p className="text-3xl">{s.icon}</p>
              <p className="mt-1 font-display text-4xl font-bold">{s.value}</p>
              <p className="text-sm font-black text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="mt-6 rounded-3xl border-4 border-white bg-white p-5 shadow-lg">
          <div className="flex items-center justify-between font-display text-lg font-bold">
            <span>Kemajuan keseluruhan</span>
            <span>{overall}%</span>
          </div>
          <div className="mt-2 h-6 overflow-hidden rounded-full bg-muted">
            <div className="rainbow-bg h-full rounded-full transition-[width] duration-700" style={{ width: `${overall}%` }} />
          </div>
        </div>

        <h2 className="mt-10 text-center font-display text-3xl font-bold">🏅 Koleksi Lencana</h2>
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STATION_ORDER.map((id) => {
            const s = STATIONS[id]
            const earned = !!progress.completed[id]
            return (
              <div
                key={id}
                className={cn(
                  'flex flex-col items-center rounded-[2rem] border-[6px] bg-white p-6 text-center shadow-xl',
                  earned ? STATION_THEME[id].ring : 'border-dashed border-border',
                )}
              >
                <div className={cn(earned && 'anim-float')}>
                  <BadgeIcon id={id} earned={earned} />
                </div>
                <p className="mt-4 text-xs font-black tracking-widest text-muted-foreground">{s.name}</p>
                <p className="font-display text-xl font-bold">{s.badgeTitle}</p>
                {earned ? (
                  <p className="mt-1 text-sm font-bold text-disgust-deep">Diperoleh {formatDateMs(progress.completed[id]!)}</p>
                ) : (
                  <FunButton tone={STATION_THEME[id].tone} size="sm" className="mt-3" onClick={() => go(id)}>
                    Mula Misi
                  </FunButton>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-10 grid gap-5 md:grid-cols-2">
          <div className="flex items-center gap-4 rounded-[2rem] border-4 border-white bg-white p-6 shadow-xl">
            <Character id="riley" className="h-28 w-auto shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-bold">🎓 Sijil Pencapaian</h3>
              <p className="mt-1 font-bold text-muted-foreground">
                {allDone
                  ? progress.name
                    ? `Sijil untuk ${progress.name} sedia untuk dimuat turun.`
                    : 'Semua misi selesai! Tulis nama kamu untuk menjana sijil.'
                  : `Kumpul ${4 - completedCount} lagi lencana untuk membuka sijil.`}
              </p>
              <FunButton tone={allDone ? 'rainbow' : 'white'} className="mt-3" onClick={() => go(allDone ? 'tahniah' : 'peta')}>
                {allDone ? 'Lihat Sijil' : 'Teruskan Misi'}
              </FunButton>
            </div>
          </div>
          <div className="flex items-center gap-4 rounded-[2rem] border-4 border-white bg-white p-6 shadow-xl">
            <Character id="joy" className="h-28 w-auto shrink-0" />
            <div>
              <h3 className="font-display text-2xl font-bold">📸 Swafoto Wira Emosi</h3>
              <p className="mt-1 font-bold text-muted-foreground">Ambil gambar kenangan bersama watak emosi.</p>
              <FunButton tone="joy" className="mt-3" onClick={() => go('swafoto')}>
                Ambil Swafoto
              </FunButton>
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-3">
          <FunButton tone="white" onClick={() => go('peta')}>
            🗺️ Kembali ke Peta Misi
          </FunButton>
          <FunButton tone="white" onClick={() => go('home')}>
            🏠 Halaman Utama
          </FunButton>
          <FunButton tone="white" className="text-destructive" onClick={() => setConfirmOpen(true)}>
            <RotateCcw className="size-5" /> Set Semula Kemajuan
          </FunButton>
        </div>
      </div>

      <Dialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <DialogContent className="rounded-[2rem] border-4 border-anger">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Set semula kemajuan? 😮</DialogTitle>
            <DialogDescription className="text-base font-bold">
              Semua lencana, jawapan betul dan nama pada sijil akan dipadam daripada peranti ini. Tindakan ini tidak
              boleh dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-3">
            <FunButton tone="white" onClick={() => setConfirmOpen(false)}>
              Tidak, Batal
            </FunButton>
            <FunButton
              tone="anger"
              onClick={() => {
                reset()
                setConfirmOpen(false)
                toast.success('Kemajuan telah diset semula. Jom mulakan pengembaraan baharu!')
              }}
            >
              Ya, Set Semula
            </FunButton>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  )
}
