/**
 * A desktop wallpaper drawn from the theme: aurora light behind three silk
 * ribbons, with a little grain. It follows the accent colors, so it re-skins
 * with the theme. Decorative.
 */
function Wallpaper({ id = "hero", className }: { id?: string; className?: string }) {
  const g = (name: string) => `lp-${id}-${name}`
  return (
    <div aria-hidden="true" className={`lp-wallpaper ${className ?? ""}`}>
      <div className="lp-aurora" data-glow="a" />
      <div className="lp-aurora" data-glow="b" />
      <div className="lp-aurora" data-glow="c" />
      <svg className="lp-ribbons" viewBox="0 0 1440 900" preserveAspectRatio="none" focusable="false">
        <defs>
          <linearGradient id={g("r1")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--lp-ribbon-1)", stopOpacity: 0.9 }} />
            <stop offset="0.6" style={{ stopColor: "var(--lp-ribbon-1)", stopOpacity: 0.12 }} />
          </linearGradient>
          <linearGradient id={g("r2")} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" style={{ stopColor: "var(--lp-ribbon-2)", stopOpacity: 0.95 }} />
            <stop offset="0.7" style={{ stopColor: "var(--lp-ribbon-2b)", stopOpacity: 0.3 }} />
          </linearGradient>
          <linearGradient id={g("r3")} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" style={{ stopColor: "var(--lp-ribbon-3)", stopOpacity: 1 }} />
            <stop offset="1" style={{ stopColor: "var(--lp-wall-base)", stopOpacity: 1 }} />
          </linearGradient>
          <linearGradient id={g("edge")} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" style={{ stopColor: "var(--lp-edge)", stopOpacity: 0 }} />
            <stop offset="0.5" style={{ stopColor: "var(--lp-edge)", stopOpacity: 0.7 }} />
            <stop offset="1" style={{ stopColor: "var(--lp-edge)", stopOpacity: 0.1 }} />
          </linearGradient>
        </defs>
        <path
          d="M0 560C260 470 520 640 860 520S1290 300 1440 340V900H0Z"
          fill={`url(#${g("r1")})`}
        />
        <path d="M0 560C260 470 520 640 860 520S1290 300 1440 340" fill="none" stroke={`url(#${g("edge")})`} strokeWidth="1.2" />
        <path
          d="M0 690C300 600 600 790 960 650S1330 500 1440 540V900H0Z"
          fill={`url(#${g("r2")})`}
        />
        <path d="M0 690C300 600 600 790 960 650S1330 500 1440 540" fill="none" stroke={`url(#${g("edge")})`} strokeWidth="1" />
        <path
          d="M0 810C360 740 720 880 1080 790S1380 720 1440 740V900H0Z"
          fill={`url(#${g("r3")})`}
        />
      </svg>
      <div className="lp-grain" />
    </div>
  )
}

export { Wallpaper }
