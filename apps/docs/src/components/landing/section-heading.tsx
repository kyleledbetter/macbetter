function SectionHeading({
  id,
  title,
  muted,
  children,
  actions,
  align = "start",
}: {
  id: string
  title: string
  muted?: string
  children?: React.ReactNode
  actions?: React.ReactNode
  align?: "start" | "center"
}) {
  return (
    <header className="lp-heading lp-reveal" data-align={align}>
      <h2 id={id} className="lp-h2">
        {title}
        {muted ? <> <span className="lp-muted">{muted}</span></> : null}
      </h2>
      {children ? <p className="lp-lead">{children}</p> : null}
      {actions ? (
        <div className="lp-heading-actions" data-platform="macos">
          {actions}
        </div>
      ) : null}
    </header>
  )
}

export { SectionHeading }
