import { Slider } from "macbetter/slider"
import { Volume1Icon, Volume2Icon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, width: "100%", maxWidth: 360 }}>
      <Volume1Icon aria-hidden="true" size={16} style={{ color: "var(--mb-label-secondary)", flex: "none" }} />
      <Slider defaultValue={60} thumbLabel="Volume" />
      <Volume2Icon aria-hidden="true" size={16} style={{ color: "var(--mb-label-secondary)", flex: "none" }} />
    </div>
  )
}
