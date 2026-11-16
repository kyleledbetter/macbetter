import { MoreLink } from "@/components/more-link"

/** A bento tile: a working component on a stage, and a link to its docs page under it. */
function Tile({
  area,
  name,
  href,
  children,
  className,
  background,
}: {
  area: string
  name: string
  href: string
  children: React.ReactNode
  className?: string
  /** Painted behind the stage, like a wallpaper. */
  background?: React.ReactNode
}) {
  return (
    <div className={`lp-tile ${className ?? ""}`} style={{ gridArea: area }}>
      {background}
      <div className="lp-tile-stage">{children}</div>
      <MoreLink href={href} className="lp-tile-name" aria-label={`${name}, learn more`}>
        {name}
      </MoreLink>
    </div>
  )
}

export { Tile }
