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
            gsap.set(verticalRefs.current, { scaleY: 0, opacity: 0.18, transformOrigin: 'center top' })
            gsap.set(horizontalRefs.current, { scaleX: 0, opacity: 0.15, transformOrigin: 'left top' })

            const drawTl = gsap.timeline({ defaults: { ease: 'power2.out' } })
            drawTl
                .to(verticalRefs.current, {
                    scaleY: 1,
                    opacity: 0.5,
                    stagger: { each: 0.04, from: 'start' },
                    duration: 0.6,
                })
                .to(
                    horizontalRefs.current,
                    {
                        scaleX: 1,
                        opacity: 0.35,
                        stagger: { each: 0.025, from: 'start' },
                        duration: 0.45,
                    },
                    0.25,
                )
        })

        return () => ctx.revert()
    }, [horizontalLines.length, verticalLines.length])

    return (
        <div className="fixed inset-0 z-[-1] pointer-events-none overflow-hidden">
            <div
                ref={backgroundRef}
                className="absolute inset-x-0 top-0 opacity-70"
                style={{
                    height: `${height}px`,
                    backgroundColor: '#f8fafc',
                }}
            />

            <svg
                className="absolute inset-x-0 top-0"
                width={width}
                height={height}
                viewBox={`0 0 ${width} ${height}`}
                preserveAspectRatio="none"
                style={{
                    opacity: 0.6
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
