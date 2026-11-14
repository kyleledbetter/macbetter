type Swatch = { token: string; note: string }

const groups: Array<{ title: string; kind: "text" | "fill" | "line"; swatches: Swatch[] }> = [
  {
    title: "Labels",
    kind: "text",
    swatches: [
      { token: "--sd-label", note: "Primary text" },
      { token: "--sd-label-secondary", note: "Subtitles, values" },
      { token: "--sd-label-tertiary", note: "Placeholders, hints" },
      { token: "--sd-label-quaternary", note: "Disabled text" },
      { token: "--sd-accent-text", note: "Links, tinted text" },
      { token: "--sd-destructive-text", note: "Destructive text" },
    ],
  },
  {
    title: "Backgrounds",
    kind: "fill",
    swatches: [
      { token: "--sd-bg", note: "Window and page" },
      { token: "--sd-bg-secondary", note: "Grouped page" },
      { token: "--sd-bg-tertiary", note: "Inset groups" },
      { token: "--sd-bg-elevated", note: "Popovers, sheets" },
      { token: "--sd-bg-sidebar", note: "Sidebars" },
      { token: "--sd-bg-control", note: "Bezeled controls" },
      { token: "--sd-bg-field", note: "Text fields" },
    ],
  },
  {
    title: "Fills",
    kind: "fill",
    swatches: [
      { token: "--sd-fill", note: "Switch track, touch press" },
      { token: "--sd-fill-secondary", note: "Touch bezeled buttons" },
      { token: "--sd-fill-tertiary", note: "Hover, segmented track" },
      { token: "--sd-fill-quaternary", note: "Quiet hover, large areas" },
    ],
  },
  {
    title: "Separators",
    kind: "line",
    swatches: [
      { token: "--sd-separator", note: "Between rows" },
      { token: "--sd-separator-strong", note: "Section edges" },
      { token: "--sd-separator-opaque", note: "Opaque hairlines" },
      { token: "--sd-control-border", note: "Control edges, 3:1" },
    ],
  },
  {
    title: "Accent",
    kind: "fill",
    swatches: [
      { token: "--sd-accent", note: "Filled controls" },
      { token: "--sd-accent-hover", note: "Pointer hover" },
      { token: "--sd-accent-pressed", note: "Press" },
      { token: "--sd-accent-soft", note: "Tinted fills" },
      { token: "--sd-on-accent", note: "Text on accent" },
      { token: "--sd-accent-secondary", note: "Second brand color" },
      { token: "--sd-focus-ring", note: "Focus halo" },
      { token: "--sd-selection", note: "Text selection" },
    ],
  },
  {
    title: "System palette",
    kind: "fill",
    swatches: ["red", "orange", "yellow", "green", "mint", "teal", "cyan", "blue", "indigo", "purple", "pink", "brown"].map(
      (name) => ({ token: `--sd-${name}`, note: name[0]!.toUpperCase() + name.slice(1) })
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
                style={{ background: "var(--sd-bg)" }}
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
