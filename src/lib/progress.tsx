import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import { STATION_ORDER, type StationId } from './content'

const STORAGE_KEY = 'dbs-kembara-misi-emosi-v1'

export type Progress = {
  completed: Partial<Record<StationId, string>> // station → ISO date completed
  solved: string[] // question ids answered correctly
  firstTry: string[] // question ids answered correctly on the first attempt
  name: string
  finishedAt: string | null
  sound: boolean
}

const EMPTY: Progress = {
  completed: {},
  solved: [],
  firstTry: [],
  name: '',
  finishedAt: null,
  sound: true,
}

type ProgressApi = {
  progress: Progress
  ready: boolean
  recordAnswer: (questionId: string, firstAttempt: boolean) => void
  completeStation: (id: StationId) => void
  setName: (name: string) => void
  toggleSound: () => void
  reset: () => void
  completedCount: number
  allDone: boolean
}

const ProgressContext = createContext<ProgressApi | null>(null)

export function ProgressProvider({ children }: { children: React.ReactNode }) {
  const [progress, setProgress] = useState<Progress>(EMPTY)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setProgress({ ...EMPTY, ...JSON.parse(raw) })
    } catch {
      // Corrupt or unavailable storage: start fresh.
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
    } catch {
      // Storage full or blocked; progress still works for this visit.
    }
  }, [progress, ready])

  const recordAnswer = useCallback((id: string, firstAttempt: boolean) => {
    setProgress((p) => ({
      ...p,
      solved: p.solved.includes(id) ? p.solved : [...p.solved, id],
      firstTry:
        firstAttempt && !p.firstTry.includes(id)
          ? [...p.firstTry, id]
          : p.firstTry,
    }))
  }, [])

  const completeStation = useCallback((id: StationId) => {
    setProgress((p) => {
      if (p.completed[id]) return p
      const completed = { ...p.completed, [id]: new Date().toISOString() }
      const all = STATION_ORDER.every((s) => completed[s])
      return {
        ...p,
        completed,
        finishedAt: all ? (p.finishedAt ?? new Date().toISOString()) : null,
      }
    })
  }, [])

  const setName = useCallback(
    (name: string) => setProgress((p) => ({ ...p, name })),
    [],
  )
  const toggleSound = useCallback(
    () => setProgress((p) => ({ ...p, sound: !p.sound })),
    [],
  )
  const reset = useCallback(
    () => setProgress((p) => ({ ...EMPTY, sound: p.sound })),
    [],
  )

  const value = useMemo<ProgressApi>(() => {
    const completedCount = STATION_ORDER.filter(
      (s) => progress.completed[s],
    ).length
    return {
      progress,
      ready,
      recordAnswer,
      completeStation,
      setName,
      toggleSound,
      reset,
      completedCount,
      allDone: completedCount === STATION_ORDER.length,
    }
  }, [progress, ready, recordAnswer, completeStation, setName, toggleSound, reset])

  return (
    <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>
  )
}

export function useProgress() {
  const ctx = useContext(ProgressContext)
  if (!ctx) throw new Error('useProgress must be used inside ProgressProvider')
  return ctx
}

export function formatDateMs(iso: string | null) {
  const d = iso ? new Date(iso) : new Date()
  return d.toLocaleDateString('ms-MY', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })
}
