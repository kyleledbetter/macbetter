type Swatch = { token: string; note: string }

const groups: Array<{ title: string; kind: "text" | "fill" | "line"; swatches: Swatch[] }> = [
  {
    title: "Labels",
    kind: "text",
    swatches: [
      { token: "--mb-label", note: "Primary text" },
      { token: "--mb-label-secondary", note: "Subtitles, values" },
      { token: "--mb-label-tertiary", note: "Placeholders, hints" },
      { token: "--mb-label-quaternary", note: "Disabled text" },
      { token: "--mb-accent-text", note: "Links, tinted text" },
      { token: "--mb-destructive-text", note: "Destructive text" },
    ],
  },
  {
    title: "Backgrounds",
    kind: "fill",
    swatches: [
      { token: "--mb-bg", note: "Window and page" },
      { token: "--mb-bg-secondary", note: "Grouped page" },
      { token: "--mb-bg-tertiary", note: "Inset groups" },
      { token: "--mb-bg-elevated", note: "Popovers, sheets" },
      { token: "--mb-bg-sidebar", note: "Sidebars" },
      { token: "--mb-bg-control", note: "Bezeled controls" },
      { token: "--mb-bg-field", note: "Text fields" },
    ],
  },
  {
    title: "Fills",
    kind: "fill",
    swatches: [
      { token: "--mb-fill", note: "Switch track, touch press" },
      { token: "--mb-fill-secondary", note: "Touch bezeled buttons" },
      { token: "--mb-fill-tertiary", note: "Hover, segmented track" },
      { token: "--mb-fill-quaternary", note: "Quiet hover, large areas" },
    ],
  },
  {
    title: "Separators",
    kind: "line",
    swatches: [
      { token: "--mb-separator", note: "Between rows" },
      { token: "--mb-separator-strong", note: "Section edges" },
      { token: "--mb-separator-opaque", note: "Opaque hairlines" },
      { token: "--mb-control-border", note: "Control edges, 3:1" },
    ],
  },
  {
    title: "Accent",
    kind: "fill",
    swatches: [
      { token: "--mb-accent", note: "Filled controls" },
      { token: "--mb-accent-hover", note: "Pointer hover" },
      { token: "--mb-accent-pressed", note: "Press" },
      { token: "--mb-accent-soft", note: "Tinted fills" },
      { token: "--mb-on-accent", note: "Text on accent" },
      { token: "--mb-accent-secondary", note: "Second brand color" },
      { token: "--mb-focus-ring", note: "Focus halo" },
      { token: "--mb-selection", note: "Text selection" },
    ],
  },
  {
    title: "System palette",
    kind: "fill",
    swatches: ["red", "orange", "yellow", "green", "mint", "teal", "cyan", "blue", "indigo", "purple", "pink", "brown"].map(
      (name) => ({ token: `--mb-${name}`, note: name[0]!.toUpperCase() + name.slice(1) })
    ),
  },
]

function Sample({ kind, token }: { kind: "text" | "fill" | "line"; token: string }) {
  if (kind === "text") {
    return (
      <div className="flex h-14 items-center px-3 text-[22px] font-semibold tracking-[-0.02em]" style={{ color: `var(${token})` }}>
        Aa
      </div>
    )
  }
  if (kind === "line") {
    return (
      <div className="flex h-14 items-center px-3">
        <div className="h-[2px] w-full rounded-full" style={{ background: `var(${token})` }} />
      </div>
    )
  }
  return <div className="h-14" style={{ background: `var(${token})` }} />
}

export default function SemanticColors() {
  return (
    <div className="flex w-full flex-col gap-6">
      {groups.map((group) => (
        <section key={group.title} aria-label={group.title} className="flex flex-col gap-2.5">
          <div className="text-[13px] font-semibold text-label">{group.title}</div>
          <div className="grid gap-2.5 [grid-template-columns:repeat(auto-fill,minmax(150px,1fr))]">
            {group.swatches.map((swatch) => (
              <figure
                key={swatch.token}
                className="m-0 min-w-0 overflow-hidden rounded-[12px] border border-separator"
                style={{ background: "var(--mb-bg)" }}
              >
                <Sample kind={group.kind} token={swatch.token} />
                <figcaption className="flex flex-col gap-0.5 border-t border-separator px-3 py-2">
                  <code className="!bg-transparent !p-0 font-mono text-[11px] break-all text-label">{swatch.token}</code>
                  <span className="text-[12px] text-label-tertiary">{swatch.note}</span>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
