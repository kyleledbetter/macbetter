import { Squircle } from "macbetter/squircle"
import { CloudSunIcon } from "lucide-react"

export default function Example() {
  return (
    <Squircle
      radius={22}
      render={<article />}
      aria-label="Weather in Cupertino"
      style={{
        display: "grid",
        gap: 4,
        width: 170,
        padding: 16,
        background: "linear-gradient(180deg, var(--mb-blue), color-mix(in oklch, var(--mb-blue), black 35%))",
        color: "#fff",
      }}
    >
      <span className="mb-text-headline">Cupertino</span>
      <span style={{ font: "300 44px/1 var(--mb-font-display)" }}>21°</span>
      <CloudSunIcon aria-hidden="true" style={{ width: 20, height: 20, marginTop: 12 }} />
      <span className="mb-text-footnote">Partly cloudy</span>
      <span className="mb-text-footnote">H:24° L:13°</span>
    </Squircle>
  )
}
