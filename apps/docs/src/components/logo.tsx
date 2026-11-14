import { useId } from "react"
import { dragonPaths, ember, markViewBox } from "@/components/brand-art"

type MarkProps = {
  size?: number
  className?: string
  /** `ember` paints the dragon with the Ember orange gradient, for large brand moments. */
  tone?: "label" | "ember"
}

/** The Macbetter dragon. Inherits `currentColor`, so it follows the label color in every theme. */
function MacbetterMark({ size = 24, className, tone = "label" }: MarkProps) {
  const id = `mb-mark-${useId().replace(/[^A-Za-z0-9_-]/g, "")}`
  return (
    <svg
      width={size}
      height={size}
      viewBox={markViewBox}
      fill={tone === "ember" ? `url(#${id})` : "currentColor"}
      aria-hidden="true"
      className={className}
    >
      {tone === "ember" ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0.4" y2="1">
            <stop offset="0" stopColor={ember.light} />
            <stop offset="0.5" stopColor={ember.mid} />
            <stop offset="1" stopColor={ember.deep} />
          </linearGradient>
        </defs>
      ) : null}
      {dragonPaths.map((d) => (
        <path key={d.slice(0, 12)} d={d} />
      ))}
    </svg>
  )
}

function MacbetterLogo({ className }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-[6px] text-(--site-label) ${className ?? ""}`}>
      <MacbetterMark size={20} />
      <span className="text-[15px] leading-none font-semibold tracking-[-0.03em]">macbetter</span>
    </span>
  )
}

export { MacbetterLogo, MacbetterMark }
