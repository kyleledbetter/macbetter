/**
 * apple.com's headline stack: a topic eyebrow (the real heading), a large
 * hand-broken headline, an intro paragraph in two tones, then text links.
 */
function SectionHeading({
  id,
  eyebrow,
  headline,
  children,
  links,
  align = "center",
  size = "elevated",
}: {
  id: string
  eyebrow: string
  headline: React.ReactNode
  children?: React.ReactNode
  links?: React.ReactNode
  align?: "start" | "center"
  size?: "super" | "elevated" | "headline"
}) {
  return (
    <header className="lp-heading stack lp-reveal" data-align={align}>
      <h2 id={id} className="stack-eyebrow type-eyebrow-reduced">
        {eyebrow}
      </h2>
      <p className={`stack-headline lp-headline ${size === "headline" ? "type-headline" : `type-headline-${size}`}`}>
        {headline}
      </p>
      {children ? <p className="stack-copy type-intro type-two-tone">{children}</p> : null}
      {links ? <div className="stack-links type-body">{links}</div> : null}
    </header>
  )
}

export { SectionHeading }
