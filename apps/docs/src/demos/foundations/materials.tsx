const materials = [
  { id: "ultrathin", name: "Ultrathin", note: "Over media you want to keep seeing" },
  { id: "thin", name: "Thin", note: "Small floating controls" },
  { id: "regular", name: "Regular", note: "Menus, popovers, the default" },
  { id: "thick", name: "Thick", note: "Busy content, long text" },
  { id: "chrome", name: "Chrome", note: "Toolbars and title bars" },
  { id: "sidebar", name: "Sidebar", note: "Source lists" },
] as const

const blobs = [
  { color: "var(--sd-red)", x: "4%", y: "8%", size: 120 },
  { color: "var(--sd-yellow)", x: "30%", y: "52%", size: 140 },
  { color: "var(--sd-blue)", x: "58%", y: "4%", size: 130 },
  { color: "var(--sd-green)", x: "80%", y: "50%", size: 120 },
  { color: "var(--sd-purple)", x: "44%", y: "18%", size: 90 },
]

export default function Materials() {
  return (
    <div className="relative w-full overflow-hidden rounded-[18px] p-5 sm:p-8">
      <div aria-hidden="true" className="absolute inset-0">
        {blobs.map((blob) => (
          <span
            key={blob.color}
            className="absolute rounded-full"
            style={{ left: blob.x, top: blob.y, width: blob.size, height: blob.size, background: blob.color }}
          />
        ))}
        <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 text-center text-[88px] leading-none font-bold tracking-[-0.04em] text-label opacity-80 select-none">
          Stardust
        </span>
      </div>
      <div className="relative grid gap-3 [grid-template-columns:repeat(auto-fill,minmax(min(100%,180px),1fr))]">
        {materials.map((material) => (
          <div
            key={material.id}
            className="sd-material flex min-h-[104px] flex-col justify-end gap-0.5 p-4"
            data-material={material.id}
            style={{ borderRadius: "var(--sd-radius-xl)" }}
          >
            <span className="sd-text-headline">{material.name}</span>
            <span className="sd-text-footnote sd-label-secondary">{material.note}</span>
          </div>
        ))}
      </div>
      <div className="relative mt-6 flex justify-center">
        <div className="sd-glass flex items-center gap-1 rounded-full p-1.5">
          {["Library", "For You", "Browse", "Search"].map((tab, index) => (
            <span
              key={tab}
              className="rounded-full px-4 py-1.5 text-[13px] font-medium"
              style={index === 0 ? { background: "var(--sd-fill-secondary)", color: "var(--sd-label)" } : { color: "var(--sd-label-secondary)" }}
            >
              {tab}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
