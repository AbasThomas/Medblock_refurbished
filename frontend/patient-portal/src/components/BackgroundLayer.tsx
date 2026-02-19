"use client"

import { useEffect, useRef } from 'react'

const COLS = 20
const ROWS = 13
const LINE_COLOR = 'rgba(148, 163, 184, 0.35)'
const BLUE_CELLS = generateBlueCells()

function generateBlueCells() {
  const cells: { col: number; row: number; opacity: number }[] = []
  const seed = [
    [2, 1],
    [5, 3],
    [9, 2],
    [15, 5],
    [3, 8],
    [12, 7],
    [18, 3],
    [6, 1],
    [1, 4],
    [16, 9],
    [7, 5],
    [14, 11],
    [4, 2],
    [0, 10],
    [11, 0],
    [19, 6],
    [8, 12],
    [17, 1],
    [10, 9],
    [3, 6],
  ]

  for (const [col, row] of seed) {
    cells.push({ col, row, opacity: 0.04 + Math.random() * 0.08 })
  }

  return cells
}

export default function BackgroundLayer() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let dpr = window.devicePixelRatio || 1
    let width = window.innerWidth
    let height = window.innerHeight

    function resize() {
      dpr = window.devicePixelRatio || 1
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    resize()
    window.addEventListener('resize', resize)

    const startTime = performance.now()
    const totalVerticalDuration = 1800
    const totalHorizontalDuration = 1400
    const verticalDelay = 100
    const horizontalDelay = 200

    function draw(now: number) {
      const elapsed = now - startTime

      ctx.clearRect(0, 0, width, height)

      const cellW = width / COLS
      const cellH = height / ROWS

      for (const cell of BLUE_CELLS) {
        const x = cell.col * cellW
        const y = cell.row * cellH
        ctx.fillStyle = `rgba(59, 130, 246, ${cell.opacity})`
        ctx.fillRect(x, y, cellW, cellH)
      }

      for (let i = 0; i <= COLS; i++) {
        const lineDelay = verticalDelay + (i / COLS) * totalVerticalDuration
        const lineElapsed = elapsed - lineDelay
        if (lineElapsed <= 0) continue

        const progress = Math.min(lineElapsed / (totalVerticalDuration * 0.6), 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        const x = i * cellW
        const lineHeight = height * eased

        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, lineHeight)
        ctx.strokeStyle = LINE_COLOR
        ctx.lineWidth = 1
        ctx.stroke()
      }

      for (let j = 0; j <= ROWS; j++) {
        const lineDelay = horizontalDelay + (j / ROWS) * totalHorizontalDuration
        const lineElapsed = elapsed - lineDelay
        if (lineElapsed <= 0) continue

        const progress = Math.min(lineElapsed / (totalHorizontalDuration * 0.6), 1)
        const eased = 1 - Math.pow(1 - progress, 3)

        const y = j * cellH
        const lineWidth = width * eased

        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(lineWidth, y)
        ctx.strokeStyle = LINE_COLOR
        ctx.lineWidth = 1
        ctx.stroke()
      }

      const maxTime =
        horizontalDelay + totalHorizontalDuration + totalHorizontalDuration * 0.6

      if (elapsed < maxTime + 200) {
        animRef.current = requestAnimationFrame(draw)
      }
    }

    animRef.current = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      if (animRef.current) {
        cancelAnimationFrame(animRef.current)
      }
    }
  }, [])

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1]">
      <canvas ref={canvasRef} className="block w-full h-full" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          maskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, black 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 70% at 50% 50%, transparent 55%, black 100%)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 left-0 right-0 h-28"
        style={{
          background:
            'linear-gradient(180deg, rgba(255,255,255,0.9), rgba(255,255,255,0))',
          filter: 'blur(24px)',
        }}
      />
      <div
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-28"
        style={{
          background:
            'linear-gradient(0deg, rgba(255,255,255,0.9), rgba(255,255,255,0))',
          filter: 'blur(24px)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 left-0 w-28"
        style={{
          background:
            'linear-gradient(90deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
          filter: 'blur(24px)',
        }}
      />
      <div
        className="pointer-events-none absolute top-0 bottom-0 right-0 w-28"
        style={{
          background:
            'linear-gradient(270deg, rgba(255,255,255,0.8), rgba(255,255,255,0))',
          filter: 'blur(24px)',
        }}
      />
    </div>
  )
}
