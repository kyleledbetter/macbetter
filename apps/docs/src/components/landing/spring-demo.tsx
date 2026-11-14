"use client"

import { Glass } from "macbetter/glass"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { useEffect, useRef, useState } from "react"

type Spring = "snappy" | "smooth" | "bouncy"

const springs: Record<Spring, string> = {
  snappy: "For controls: switches, segments, toggles.",
  smooth: "For larger moves: sidebars, panels, page changes.",
  bouncy: "Only after a gesture that carried momentum.",
}

/** Reads a spring's linear() stops from its token and draws them as a curve. */
function useCurve(spring: Spring, host: React.RefObject<HTMLElement | null>) {
  const [points, setPoints] = useState<number[]>([])
  useEffect(() => {
    if (!host.current) return
    const value = getComputedStyle(host.current).getPropertyValue(`--mb-spring-${spring}`)
    const stops = value
      .replace(/^\s*linear\(|\)\s*$/g, "")
      .split(",")
      .map((stop) => Number.parseFloat(stop))
      .filter((stop) => Number.isFinite(stop))
    setPoints(stops)
  }, [spring, host])
  return points
}

function SpringDemo() {
  const [spring, setSpring] = useState<Spring>("bouncy")
  const [end, setEnd] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const points = useCurve(spring, ref)

  const width = 240
  const height = 96
  const path = points
    .map((y, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width
      return `${index ? "L" : "M"}${x.toFixed(1)} ${(height - y * (height - 16) - 4).toFixed(1)}`
    })
    .join(" ")

  return (
    <div ref={ref} className="lp-spring" data-spring={spring}>
      <SegmentedControl
        aria-label="Spring"
        value={spring}
        onValueChange={(value) => {
          if (!value) return
          setSpring(value as Spring)
          setEnd((current) => !current)
        }}
      >
        <SegmentedControlItem value="snappy">Snappy</SegmentedControlItem>
        <SegmentedControlItem value="smooth">Smooth</SegmentedControlItem>
        <SegmentedControlItem value="bouncy">Bouncy</SegmentedControlItem>
      </SegmentedControl>

      <button
        type="button"
        className="lp-spring-track"
        aria-label={`Move the puck with the ${spring} spring`}
        onClick={() => setEnd((current) => !current)}
      >
        <Glass shape="capsule" variant="tinted" className="lp-spring-puck" data-end={end ? "" : undefined} />
      </button>

      <div className="lp-spring-meta">
        <svg viewBox={`0 0 ${width} ${height}`} className="lp-spring-curve" aria-hidden="true">
          <line x1="0" x2={width} y1={height - (height - 16) - 4} y2={height - (height - 16) - 4} />
          {path ? <path d={path} /> : null}
        </svg>
        <p>
          <code>--mb-spring-{spring}</code>
          <span>{springs[spring]}</span>
        </p>
      </div>
    </div>
  )
}

export { SpringDemo }
