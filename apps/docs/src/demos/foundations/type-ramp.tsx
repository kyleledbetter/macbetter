"use client"

import { useEffect, useRef, useState } from "react"

const styles = [
  { name: "Large Title", className: "sd-text-large-title", sample: "Library" },
  { name: "Title 1", className: "sd-text-title-1", sample: "Recently Added" },
  { name: "Title 2", className: "sd-text-title-2", sample: "Shared with You" },
  { name: "Title 3", className: "sd-text-title-3", sample: "Albums" },
  { name: "Headline", className: "sd-text-headline", sample: "Morning Run" },
  { name: "Body", className: "sd-text-body", sample: "Your playlist syncs to every device." },
  { name: "Callout", className: "sd-text-callout", sample: "Downloads finish in the background." },
  { name: "Subheadline", className: "sd-text-subheadline", sample: "Updated 2 minutes ago" },
  { name: "Footnote", className: "sd-text-footnote", sample: "Requires macOS 15 or later." },
  { name: "Caption", className: "sd-text-caption", sample: "42 songs, 2 hr 18 min" },
]

type Metrics = { size: string; leading: string; weight: string; tracking: string }

function px(value: string) {
  return value.endsWith("px") ? `${Math.round(parseFloat(value) * 10) / 10}` : value
}

function Row({ name, className, sample }: (typeof styles)[number]) {
  const ref = useRef<HTMLParagraphElement>(null)
  const [metrics, setMetrics] = useState<Metrics>()

  useEffect(() => {
    const element = ref.current
    if (!element) return
    const read = () => {
      const style = getComputedStyle(element)
      const size = parseFloat(style.fontSize)
      const tracking = style.letterSpacing === "normal" ? 0 : parseFloat(style.letterSpacing) / size
      setMetrics({
        size: px(style.fontSize),
        leading: px(style.lineHeight),
        weight: style.fontWeight,
        tracking: `${tracking.toFixed(3)}em`,
      })
    }
    read()
    const observer = new ResizeObserver(read)
    observer.observe(element)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="grid items-baseline gap-x-6 gap-y-1 border-b border-separator py-3 last:border-b-0 sm:grid-cols-[200px_1fr]">
      <div className="flex flex-col">
        <span className="text-[12px] font-semibold text-label">{name}</span>
        <span className="font-mono text-[11px] text-label-tertiary tabular-nums">
          {metrics ? `${metrics.size}/${metrics.leading} · ${metrics.weight} · ${metrics.tracking}` : " "}
        </span>
      </div>
      <p ref={ref} className={`${className} min-w-0`} style={{ margin: 0 }}>
        {sample}
      </p>
    </div>
  )
}

export default function TypeRamp() {
  return (
    <div className="w-full">
      {styles.map((style) => (
        <Row key={style.className} {...style} />
      ))}
    </div>
  )
}
