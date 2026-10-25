// All lesson text and game data for Dunia Bandingan Semacam lives here.

export type StationId = 'joy' | 'sadness' | 'anger' | 'disgust'

export const img = (file: string, w = 480) =>
  `/.netlify/images?url=/img/${file}&w=${w}&fm=webp`

export const charImg = (id: CharacterId) => `/img/chars/${id}.svg`

export type CharacterId = 'joy' | 'sadness' | 'anger' | 'disgust' | 'riley'

export const DEFINITION =
  'Bandingan semacam ialah ungkapan yang membandingkan sesuatu dengan benda, haiwan atau keadaan lain untuk menerangkan sesuatu sifat.'

export const NOTE_CARDS = [
  {
    phrase: 'Manis umpama madu',
    meaning: 'Sesuatu yang mempunyai rasa manis seperti madu.',
    image: 'madu.png',
    alt: 'Balang madu berwarna keemasan',
    color: 'joy',
  },
  {
    phrase: 'Berani seperti singa',
    meaning: 'Seseorang yang mempunyai keberanian.',
    image: 'singa.png',
    alt: 'Seekor singa yang kelihatan berani',
    color: 'anger',
  },
  {
    phrase: 'Putih seperti kapas',
    meaning: 'Sesuatu yang berwarna putih seperti kapas.',
    image: 'kapas.png',
    alt: 'Gumpalan kapas putih',
    color: 'disgust',
  },
  {
    phrase: 'Luas bak lautan',
    meaning: 'Sesuatu yang sangat luas.',
    image: 'lautan.png',
    alt: 'Lautan biru yang terbentang luas',
    color: 'sadness',
  },
] as const

export const JOY_QUESTIONS = [
  {
    id: 'joy-1',
    phrase: 'Merah seperti cili',
    answer: 'C',
    options: [
      { key: 'A', label: 'Terung', image: 'terung.png' },
      { key: 'B', label: 'Sawi', image: 'sawi.png' },
      { key: 'C', label: 'Cili', image: 'cili.png' },
    ],
    explanation:
      'Bagus! Cili biasanya berwarna merah. Oleh itu, warna merah dibandingkan dengan cili.',
  },
  {
    id: 'joy-2',
    phrase: 'Pantas seperti kilat',
    answer: 'A',
    options: [
      { key: 'A', label: 'Kilat', image: 'kilat.png' },
      { key: 'B', label: 'Hujan', image: 'hujan.png' },
      { key: 'C', label: 'Musim bunga', image: 'musim-bunga.png' },
    ],
    explanation:
      'Betul! Kilat berlaku dengan sangat cepat. Oleh itu, sesuatu yang sangat pantas boleh dibandingkan dengan kilat.',
  },
  {
    id: 'joy-3',
    phrase: 'Tinggi bagai galah',
    answer: 'C',
    options: [
      { key: 'A', label: 'Cawan', image: 'cawan.png' },
      { key: 'B', label: 'Buku', image: 'buku.png' },
      { key: 'C', label: 'Galah', image: 'galah.png' },
    ],
    explanation:
      'Tahniah! Galah ialah objek yang panjang dan tinggi. Ungkapan ini menggambarkan sesuatu yang tinggi.',
  },
]

export const SADNESS_PAIRS = [
  {
    id: 'sadness-1',
    phrase: 'Gemuk seperti badak',
    meaning:
      'Menggambarkan seseorang atau haiwan yang berbadan besar atau gemuk.',
    explanation:
      'Bagus! Badak ialah haiwan yang mempunyai tubuh besar. Ungkapan ini digunakan untuk menggambarkan tubuh yang besar atau gemuk.',
  },
  {
    id: 'sadness-2',
    phrase: 'Berat macam batu',
    meaning: 'Menggambarkan sesuatu yang sangat berat.',
    explanation:
      'Tepat sekali! Batu biasanya mempunyai berat. Ungkapan ini menunjukkan sesuatu yang dirasakan sangat berat.',
  },
  {
    id: 'sadness-3',
    phrase: 'Manis bak gula',
    meaning: 'Menggambarkan sesuatu yang mempunyai rasa manis.',
    explanation:
      'Syabas! Gula mempunyai rasa manis. Oleh itu, gula digunakan sebagai perbandingan untuk menerangkan rasa manis.',
  },
]

export const ANGER_QUESTIONS = [
  {
    id: 'anger-1',
    scrambled: ['Adik', 'seperti', 'tidur', 'bayi'],
    answer: ['Adik', 'tidur', 'seperti', 'bayi'],
    hint: 'Mulakan ayat dengan perkataan berhuruf besar, “Adik”. Apakah yang adik lakukan?',
    explanation:
      'Bagus! Susunan ini membentuk ayat lengkap. Ungkapan ‘seperti bayi’ menerangkan keadaan tidur yang nyenyak.',
  },
  {
    id: 'anger-2',
    scrambled: ['bak', 'Rambutnya', 'arang', 'hitam'],
    answer: ['Rambutnya', 'hitam', 'bak', 'arang'],
    hint: 'Ayat bermula dengan “Rambutnya”. Sebutkan warnanya dahulu, kemudian bandingkan dengan “bak …”.',
    explanation:
      'Tepat! Ayat ini membandingkan warna rambut yang hitam dengan arang yang berwarna hitam.',
  },
  {
    id: 'anger-3',
    scrambled: ['bulan', 'Aida', 'berseri', 'wajah', 'umpama'],
    answer: ['Wajah', 'Aida', 'berseri', 'umpama', 'bulan'],
    hint: 'Ayat bermula dengan “Wajah”. Wajah siapa? Bagaimana keadaannya? Akhiri dengan “umpama …”.',
    explanation:
      'Syabas! Ayat ini menunjukkan wajah Aida kelihatan berseri dengan membandingkannya dengan bulan.',
  },
]

export const DISGUST_QUESTIONS = [
  {
    id: 'disgust-1',
    wrong: 'Air sungai itu jernih seperti arang.',
    wrongWord: 'arang',
    options: [
      'Air sungai itu jernih seperti kaca.',
      'Air sungai itu jernih seperti lumpur.',
    ],
    answer: 'Air sungai itu jernih seperti kaca.',
    explanation:
      'Betul! Kaca yang jernih boleh menggambarkan air yang bersih dan jelas. Arang pula berwarna hitam dan tidak sesuai untuk menggambarkan kejernihan air.',
  },
  {
    id: 'disgust-2',
    wrong: 'Kelas 5 Uranus senyap macam pasar.',
    wrongWord: 'senyap',
    options: [
      'Kelas 5 Uranus sunyi macam pasar.',
      'Kelas 5 Uranus bising macam pasar.',
    ],
    answer: 'Kelas 5 Uranus bising macam pasar.',
    explanation:
      'Tepat! Pasar biasanya mempunyai suasana yang riuh dan bising. Oleh itu, ungkapan ‘bising macam pasar’ lebih sesuai.',
  },
  {
    id: 'disgust-3',
    wrong: 'Kuih raya di dalam bekas tawar bak gula.',
    wrongWord: 'tawar',
    options: [
      'Kuih raya di dalam bekas manis bak gula.',
      'Kuih raya di dalam bekas masin bak gula.',
    ],
    answer: 'Kuih raya di dalam bekas manis bak gula.',
    explanation:
      'Syabas! Gula mempunyai rasa manis. Oleh itu, ungkapan ‘manis bak gula’ lebih sesuai untuk menggambarkan rasa kuih.',
  },
]

export const STATIONS: Record<
  StationId,
  {
    id: StationId
    number: number
    name: string
    title: string
    task: string
    badge: string
    badgeTitle: string
    badgeIcon: string
    icon: string
    total: number
  }
> = {
  joy: {
    id: 'joy',
    number: 1,
    name: 'STESEN JOY',
    title: 'Padankan Perkataan dengan Gambar',
    task: 'Padanan gambar',
    badge: 'LENCANA JOY — WIRA PADANAN',
    badgeTitle: 'Wira Padanan',
    badgeIcon: '⭐',
    icon: '☀️',
    total: JOY_QUESTIONS.length,
  },
  sadness: {
    id: 'sadness',
    number: 2,
    name: 'STESEN SADNESS',
    title: 'Padankan Ayat dengan Maksud',
    task: 'Padanan maksud',
    badge: 'LENCANA SADNESS — PAKAR MAKSUD',
    badgeTitle: 'Pakar Maksud',
    badgeIcon: '💧',
    icon: '☁️',
    total: SADNESS_PAIRS.length,
  },
  anger: {
    id: 'anger',
    number: 3,
    name: 'STESEN ANGER',
    title: 'Susun Perkataan Menjadi Ayat',
    task: 'Susun ayat',
    badge: 'LENCANA ANGER — JUARA SUSUNAN AYAT',
    badgeTitle: 'Juara Susunan Ayat',
    badgeIcon: '🔥',
    icon: '🌋',
    total: ANGER_QUESTIONS.length,
  },
  disgust: {
    id: 'disgust',
    number: 4,
    name: 'STESEN DISGUST',
    title: 'Kenal Pasti Bandingan Semacam yang Salah',
    task: 'Pembetulan ayat',
    badge: 'LENCANA DISGUST — DETEKTIF BAHASA',
    badgeTitle: 'Detektif Bahasa',
    badgeIcon: '🔍',
    icon: '🌿',
    total: DISGUST_QUESTIONS.length,
  },
}

export const STATION_ORDER: StationId[] = ['joy', 'sadness', 'anger', 'disgust']

export const TOTAL_QUESTIONS = STATION_ORDER.reduce(
  (n, id) => n + STATIONS[id].total,
  0,
)

export function shuffle<T>(items: readonly T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
