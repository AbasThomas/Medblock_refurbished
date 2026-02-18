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
            gsap.set(verticalRefs.current, { scaleY: 0, opacity: 0.22, transformOrigin: 'center top' })
            gsap.set(horizontalRefs.current, { scaleX: 0, opacity: 0.18, transformOrigin: 'left center' })

            gsap.timeline({ defaults: { ease: 'power2.out' } })
                .to(verticalRefs.current, { scaleY: 1, opacity: 0.48, stagger: 0.05, duration: 0.65 })
                .to(horizontalRefs.current, { scaleX: 1, opacity: 0.38, stagger: 0.04, duration: 0.5 }, 0.22)

            if (backgroundRef.current) {
                gsap.to(backgroundRef.current, {
                    backgroundPosition: `${GRID_SIZE}px ${GRID_SIZE}px`,
                    duration: 24,
                    ease: 'none',
                    repeat: -1,
                })
            }
        })

        return () => ctx.revert()
    }, [horizontalLines.length, verticalLines.length])

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden print:hidden">
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
                        'linear-gradient(rgba(114, 129, 167, 0.08) 1px, transparent 1px), linear-gradient(to right, rgba(114, 129, 167, 0.08) 1px, transparent 1px)',
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
                        stroke="rgba(97, 118, 176, 0.44)"
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
                        stroke="rgba(97, 118, 176, 0.34)"
                        strokeWidth="1"
                    />
                ))}
            </svg>
        </div>
    )
}

export default BackgroundLayer
