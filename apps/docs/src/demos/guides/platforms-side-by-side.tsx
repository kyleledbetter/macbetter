import Settings from "./settings"

const platforms = [
  { id: "macos", label: "macOS" },
  { id: "ipados", label: "iPadOS" },
  { id: "ios", label: "iOS" },
] as const

export default function Example() {
  return (
    <div className="grid w-full gap-8 [grid-template-columns:repeat(auto-fit,minmax(min(100%,300px),1fr))]">
      {platforms.map((platform) => (
        <section key={platform.id} aria-label={platform.label} className="flex min-w-0 flex-col gap-3">
          <p className="text-[12px] font-semibold tracking-wide text-label-tertiary uppercase" style={{ margin: 0 }}>
            {platform.label}
          </p>
          <div data-platform={platform.id} className="flex min-w-0 justify-center">
            <Settings />
          </div>
        </section>
      ))}
    </div>
  )
}
