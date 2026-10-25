// Canvas drawing helpers for the certificate and the selfie frame.
// Everything runs in the browser; nothing is uploaded anywhere.

import { charImg, type CharacterId } from './content'

export const RAINBOW = ['#ff5a5f', '#ff9f1c', '#ffd23f', '#6fcf5a', '#4cc9f0', '#7c4dff', '#c86bfa']

export function loadImage(src: string) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const im = new Image()
    im.onload = () => resolve(im)
    im.onerror = reject
    im.src = src
  })
}

export async function loadCharacters(ids: CharacterId[]) {
  const imgs = await Promise.all(ids.map((id) => loadImage(charImg(id))))
  return Object.fromEntries(ids.map((id, i) => [id, imgs[i]])) as Record<CharacterId, HTMLImageElement>
}

export async function ensureFonts() {
  if (typeof document === 'undefined' || !document.fonts) return
  try {
    await Promise.all([
      document.fonts.load('700 64px Fredoka'),
      document.fonts.load('800 32px Nunito'),
    ])
  } catch {
    // Fall back to system fonts.
  }
}

export function rainbowGradient(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number) {
  const g = ctx.createLinearGradient(x0, y0, x1, y1)
  RAINBOW.forEach((c, i) => g.addColorStop(i / (RAINBOW.length - 1), c))
  return g
}

export function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.arcTo(x + w, y, x + w, y + h, r)
  ctx.arcTo(x + w, y + h, x, y + h, r)
  ctx.arcTo(x, y + h, x, y, r)
  ctx.arcTo(x, y, x + w, y, r)
  ctx.closePath()
}

export function drawOrb(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save()
  ctx.shadowColor = color
  ctx.shadowBlur = r * 1.2
  const g = ctx.createRadialGradient(x - r * 0.35, y - r * 0.35, r * 0.1, x, y, r)
  g.addColorStop(0, '#ffffff')
  g.addColorStop(0.35, color)
  g.addColorStop(1, shade(color))
  ctx.fillStyle = g
  ctx.beginPath()
  ctx.arc(x, y, r, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function shade(hex: string) {
  const n = parseInt(hex.slice(1), 16)
  const f = (v: number) => Math.max(0, Math.round(v * 0.65))
  return `rgb(${f(n >> 16)}, ${f((n >> 8) & 255)}, ${f(n & 255)})`
}

export function drawStar(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string) {
  ctx.save()
  ctx.fillStyle = color
  ctx.beginPath()
  for (let i = 0; i < 10; i++) {
    const rad = i % 2 === 0 ? r : r * 0.45
    const a = (Math.PI / 5) * i - Math.PI / 2
    ctx.lineTo(x + Math.cos(a) * rad, y + Math.sin(a) * rad)
  }
  ctx.closePath()
  ctx.fill()
  ctx.restore()
}

export function drawRainbowBorder(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  thickness: number,
  radius: number,
  inner = '#ffffff',
) {
  ctx.save()
  ctx.fillStyle = rainbowGradient(ctx, 0, 0, w, h)
  roundRect(ctx, 0, 0, w, h, radius)
  ctx.fill()
  ctx.fillStyle = inner
  roundRect(ctx, thickness, thickness, w - thickness * 2, h - thickness * 2, radius * 0.7)
  ctx.fill()
  ctx.restore()
}

export function drawCharacter(
  ctx: CanvasRenderingContext2D,
  im: HTMLImageElement,
  x: number,
  y: number,
  height: number,
  rotate = 0,
) {
  const width = height * (200 / 260)
  ctx.save()
  ctx.translate(x, y)
  ctx.rotate(rotate)
  ctx.shadowColor = 'rgba(43,35,80,0.25)'
  ctx.shadowBlur = 12
  ctx.shadowOffsetY = 6
  ctx.drawImage(im, -width / 2, -height / 2, width, height)
  ctx.restore()
}

export function fitText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number, startSize: number, font: (s: number) => string) {
  let size = startSize
  ctx.font = font(size)
  while (ctx.measureText(text).width > maxWidth && size > 18) {
    size -= 2
    ctx.font = font(size)
  }
  return size
}
