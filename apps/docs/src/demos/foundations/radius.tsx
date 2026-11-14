const radii = [
  ["xs", 4],
  ["sm", 6],
  ["md", 8],
  ["lg", 12],
  ["xl", 16],
  ["2xl", 22],
  ["3xl", 30],
] as const

const scales = [
  { scale: 0.7, theme: "Graphite" },
  { scale: 1, theme: "Dreambase, System" },
  { scale: 1.15, theme: "Nebula" },
]

export default function Radius() {
  return (
    <div className="flex w-full flex-col gap-6">
      {scales.map(({ scale, theme }) => (
        <section key={scale} aria-label={`Radius scale ${scale}`} className="flex flex-col gap-2.5">
          <p className="text-[12px] text-label-secondary" style={{ margin: 0 }}>
            <code className="font-mono text-label">--sd-radius-scale: {scale}</code> · {theme}
          </p>
          <div className="flex flex-wrap gap-3">
            {radii.map(([name, base]) => (
              <figure key={name} className="m-0 flex flex-col items-center gap-1.5">
                <div
                  className="size-16 border border-separator-strong bg-fill-tertiary"
                  style={{ borderRadius: `${base * scale}px`, borderColor: "var(--sd-separator-strong)" }}
                />
                <figcaption className="font-mono text-[11px] text-label-tertiary">
                  {name} {Math.round(base * scale * 10) / 10}
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
