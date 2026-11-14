import { Glass } from "macbetter/glass"
import { PauseIcon, SkipBackIcon, SkipForwardIcon } from "lucide-react"

export default function Example() {
  return (
    <div
      style={{
        display: "grid",
        placeItems: "center",
        gap: 16,
        width: "100%",
        padding: "40px 20px",
        borderRadius: 18,
        backgroundImage: "url(/demos/wallpaper-valley.svg)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Glass style={{ display: "grid", gap: 2, padding: "14px 18px", width: 280 }}>
        <span style={{ fontWeight: 600 }}>Yosemite Valley</span>
        <span style={{ color: "var(--mb-label-secondary)" }}>Sunrise 6:48 AM · 54°</span>
      </Glass>
      <Glass shape="capsule" style={{ display: "flex", alignItems: "center", gap: 14, padding: "10px 20px" }}>
        <SkipBackIcon aria-hidden="true" size={20} />
        <PauseIcon aria-hidden="true" size={24} />
        <SkipForwardIcon aria-hidden="true" size={20} />
        <span style={{ fontWeight: 600 }}>Now Playing</span>
      </Glass>
      <div style={{ display: "flex", gap: 12 }}>
        <Glass variant="clear" shape="capsule" style={{ padding: "8px 16px", fontWeight: 600 }}>
          Clear
        </Glass>
        <Glass variant="tinted" shape="capsule" style={{ padding: "8px 16px", fontWeight: 600 }}>
          Tinted
        </Glass>
      </div>
    </div>
  )
}
