function Nested({ outer, padding, inner, label }: { outer: number; padding: number; inner: number; label: string }) {
  return (
    <figure className="m-0 flex flex-col items-center gap-2">
      <div
        className="flex h-36 w-52 bg-fill-secondary"
        style={{ borderRadius: outer, padding, boxShadow: "inset 0 0 0 1px var(--mb-separator-strong)" }}
      >
        <div className="flex-1 bg-accent" style={{ borderRadius: inner }} />
      </div>
      <figcaption className="text-center text-[12px] text-label-secondary">
        {label}
        <br />
        <span className="font-mono text-[11px] text-label-tertiary">
          outer {outer} · padding {padding} · inner {inner}
        </span>
      </figcaption>
    </figure>
  )
}

export default function Concentric() {
  return (
    <div className="flex flex-wrap justify-center gap-8">
      <Nested outer={22} padding={8} inner={14} label="Concentric: inner = outer − padding" />
      <Nested outer={22} padding={8} inner={22} label="Same radius: the inner corners bulge" />
    </div>
  )
}
