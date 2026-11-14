import { contrastRatio } from "macbetter/theme"

type Seeds = { accent: string; onAccent: string; accentText: string; bg: string; ink: string }

// The seed values from each built-in theme's stylesheet.
const themes: Array<{ name: string; light: Seeds; dark: Seeds }> = [
  {
    name: "Ember",
    light: { accent: "#ee5700", onAccent: "#0a1c13", accentText: "#b84300", bg: "#ffffff", ink: "#0a1c13" },
    dark: { accent: "#f67f01", onAccent: "#0a1c13", accentText: "#f9943c", bg: "#0a1c13", ink: "#f1f7f3" },
  },
  {
    name: "System",
    light: { accent: "#007aff", onAccent: "#ffffff", accentText: "#0064d6", bg: "#ffffff", ink: "#000000" },
    dark: { accent: "#0a84ff", onAccent: "#ffffff", accentText: "#409cff", bg: "#1c1c1e", ink: "#ffffff" },
  },
  {
    name: "Nebula",
    light: { accent: "#6d3df5", onAccent: "#ffffff", accentText: "#5a2be0", bg: "#ffffff", ink: "#14102b" },
    dark: { accent: "#9b7bff", onAccent: "#120a2e", accentText: "#b29bff", bg: "#100c24", ink: "#f3f1ff" },
  },
  {
    name: "Graphite",
    light: { accent: "#1f1f23", onAccent: "#ffffff", accentText: "#1f1f23", bg: "#ffffff", ink: "#111114" },
    dark: { accent: "#f2f2f4", onAccent: "#121214", accentText: "#f2f2f4", bg: "#18181b", ink: "#f5f5f7" },
  },
]

const pairs: Array<{ label: string; target: number; ratio: (s: Seeds) => number }> = [
  { label: "Ink on background", target: 4.5, ratio: (s) => contrastRatio(s.ink, s.bg) },
  { label: "Accent text on background", target: 4.5, ratio: (s) => contrastRatio(s.accentText, s.bg) },
  { label: "On-accent on accent", target: 4.5, ratio: (s) => contrastRatio(s.onAccent, s.accent) },
  { label: "Accent on background", target: 3, ratio: (s) => contrastRatio(s.accent, s.bg) },
]

function Cell({ value, target }: { value: number; target: number }) {
  const pass = value >= target
  return (
    <td className="px-3 py-2 text-end font-mono text-[12px] whitespace-nowrap tabular-nums">
      <span className={pass ? "text-label" : "font-semibold text-(--mb-destructive-text)"}>
        {value.toFixed(2)}
        {pass ? "" : " ✕"}
      </span>
    </td>
  )
}

export default function Contrast() {
  return (
    <div className="docs-table-wrap !my-0 w-full">
      <table className="w-full text-[13px]">
        <thead>
          <tr>
            <th className="px-3 py-2 text-start font-semibold text-label">Pair</th>
            <th className="px-3 py-2 text-end font-semibold text-label">Target</th>
            {themes.map((theme) => (
              <th key={theme.name} colSpan={2} className="px-3 py-2 text-end font-semibold text-label">
                {theme.name}
                <span className="block text-[11px] font-normal text-label-tertiary">light · dark</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {pairs.map((pair) => (
            <tr key={pair.label} className="border-t border-separator">
              <td className="px-3 py-2 text-label-secondary">{pair.label}</td>
              <td className="px-3 py-2 text-end font-mono text-[12px] text-label-tertiary">{pair.target}:1</td>
              {themes.flatMap((theme) => [
                <Cell key={`${theme.name}-light`} value={pair.ratio(theme.light)} target={pair.target} />,
                <Cell key={`${theme.name}-dark`} value={pair.ratio(theme.dark)} target={pair.target} />,
              ])}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
