import React, { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { gsap } from 'gsap'

const GRID_SIZE = 64
const GRID_HEIGHT = 560

const BackgroundLayer: React.FC = () => {
    const [width, setWidth] = useState<number>(typeof window !== 'undefined' ? window.innerWidth : 1920)
    const [height, setHeight] = useState<number>(GRID_HEIGHT)
    const verticalRefs = useRef<SVGLineElement[]>([])
    const horizontalRefs = useRef<SVGLineElement[]>([])
    const backgroundRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const onResize = () => {
            setWidth(window.innerWidth)
            setHeight(Math.max(GRID_HEIGHT, Math.floor(window.innerHeight * 0.62)))
        }

        onResize()
        window.addEventListener('resize', onResize)
        return () => window.removeEventListener('resize', onResize)
    }, [])

    const verticalLines = useMemo(
        () => Array.from({ length: Math.ceil(width / GRID_SIZE) + 2 }, (_, i) => i * GRID_SIZE),
        [width],
    )
    const horizontalLines = useMemo(
        () => Array.from({ length: Math.ceil(height / GRID_SIZE) + 2 }, (_, i) => i * GRID_SIZE),
        [height],
    )

    useLayoutEffect(() => {
        const ctx = gsap.context(() => {
            gsap.set(verticalRefs.current, { scaleY: 0, opacity: 0.25, transformOrigin: 'center top' })
            gsap.set(horizontalRefs.current, { scaleX: 0, opacity: 0.2, transformOrigin: 'left center' })

            const drawTl = gsap.timeline({ defaults: { ease: 'power2.out' } })
            drawTl
                .to(verticalRefs.current, { scaleY: 1, opacity: 0.55, stagger: 0.04, duration: 0.55 })
                .to(horizontalRefs.current, { scaleX: 1, opacity: 0.45, stagger: 0.03, duration: 0.45 }, 0.18)

            if (backgroundRef.current) {
                gsap.to(backgroundRef.current, {
                    backgroundPosition: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    duration: 22,
                    ease: 'none',
                    repeat: -1,
                })
            }
        })

        return () => ctx.revert()
    }, [horizontalLines.length, verticalLines.length])

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div
                className="absolute inset-0"
                style={{
                    height: '340px',
                    background: '#eef2f7',
                    WebkitMaskImage: 'radial-gradient(circle at top center, black 58%, transparent 130%)',
                    maskImage: 'radial-gradient(circle at top center, black 58%, transparent 100%)',
                }}
            />

            <div
                ref={backgroundRef}
                className="absolute inset-x-0 top-0 opacity-70"
                style={{
                    height: `${height}px`,
                    backgroundImage:
                        'linear-gradient(rgba(128, 140, 180, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(128, 140, 180, 0.08) 1px, transparent 1px)',
                    backgroundSize: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    maskImage: 'radial-gradient(ellipse at top, black 34%, transparent 72%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at top, black 34%, transparent 72%)',
                }}
            />

            <svg
                className="absolute inset-x-0 top-0"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                style={{
                    maskImage: 'radial-gradient(ellipse at top, black 40%, transparent 76%)',
                    WebkitMaskImage: 'radial-gradient(ellipse at top, black 40%, transparent 76%)',
                }}
            >
                {verticalLines.map((x, idx) => (
                    <line
                        key={`v-${x}-${idx}`}
                        ref={(el) => {
                            if (el) verticalRefs.current[idx] = el
                        }}
                        x1={x}
                        y1={0}
                        x2={x}
                        y2={height}
                        stroke="rgba(102, 126, 177, 0.45)"
                        strokeWidth="1"
                    />
                ))}
                {horizontalLines.map((y, idx) => (
                    <line
                        key={`h-${y}-${idx}`}
                        ref={(el) => {
                            if (el) horizontalRefs.current[idx] = el
                        }}
                        x1={0}
                        y1={y}
                        x2={width}
                        y2={y}
                        stroke="rgba(102, 126, 177, 0.35)"
                        strokeWidth="1"
                    />
                ))}
            </svg>
        </div>
    )
}

export default BackgroundLayer
