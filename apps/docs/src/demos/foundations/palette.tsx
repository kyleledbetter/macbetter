import { contrastRatio } from "macbetter/theme"

const palette = [
  { name: "Trinidad", hex: "#EE5700", role: "Accent and orange, light" },
  { name: "Gold Drop", hex: "#F67F01", role: "Accent and orange, dark" },
  { name: "Neon Carrot", hex: "#F9943C", role: "Accent text, dark" },
  { name: "Rajah", hex: "#F8B16D", role: "Brand art, not a token" },
  { name: "Racing Green", hex: "#0A1C13", role: "Ink, on-accent, dark background" },
  { name: "Stromboli", hex: "#25604E", role: "Brand art, not a token" },
  { name: "Observatory", hex: "#028F71", role: "Secondary accent and green, light" },
  { name: "Emerald", hex: "#44BD8B", role: "Green, dark" },
  { name: "Puerto Rico", hex: "#52C6A0", role: "Secondary accent and mint, dark" },
]

const ink = "#0A1C13"
const paper = "#FFFFFF"

export default function Palette() {
  return (
    <div className="grid w-full grid-cols-2 gap-3 sm:grid-cols-3">
      {palette.map((color) => {
        const onInk = contrastRatio(color.hex, ink)
        const onPaper = contrastRatio(color.hex, paper)
        const text = onInk >= onPaper ? ink : paper
        return (
          <figure key={color.hex} className="m-0 flex min-w-0 flex-col overflow-hidden rounded-[14px] border border-separator bg-bg-elevated">
            <div className="flex h-24 items-end p-3" style={{ background: color.hex, color: text }}>
              <span className="text-[12px] font-semibold tabular-nums">
                {Math.max(onInk, onPaper).toFixed(1)}:1
              </span>
            </div>
            <figcaption className="flex flex-col gap-0.5 px-3 py-2.5">
              <span className="text-[13px] font-semibold text-label">{color.name}</span>
              <span className="font-mono text-[12px] text-label-secondary">{color.hex}</span>
              <span className="text-[12px] text-label-tertiary">{color.role}</span>
            </figcaption>
          </figure>
        )
      })}
    </div>
  )
}
