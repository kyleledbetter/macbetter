import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import type * as React from "react"
import { join } from "../lib/cx"

/** A section of the Home tab: Favorites, Scenes, Cameras, or a room. */
function HomeSection({ className, ...props }: React.ComponentProps<"section">) {
  return <section className={join("mb-home-section", className)} {...props} />
}

function HomeSectionHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("mb-home-section-header", className)} {...props} />
}

type HomeSectionTitleProps = Omit<React.ComponentProps<"h2">, "onClick"> & {
  level?: 2 | 3
  /** Makes the title a link to the room or category, with a chevron, like "Kitchen ›". */
  href?: string
  /** Makes the title a button, for an app that shows the room in place. */
  onClick?: React.MouseEventHandler<HTMLElement>
  /** A router's link element, in place of `href`. */
  render?: React.ComponentProps<typeof ButtonPrimitive>["render"]
}

const chevron = (
  <svg className="mb-home-section-chevron" viewBox="0 0 8 14" aria-hidden="true">
    <path d="M1.5 1.5 6.5 7l-5 5.5" />
  </svg>
)

function HomeSectionTitle({ level = 2, href, onClick, render, className, children, ...props }: HomeSectionTitleProps) {
  const Heading = level === 3 ? "h3" : "h2"
  const interactive = href !== undefined || onClick !== undefined || render !== undefined
  return (
    <Heading className={join("mb-home-section-title", className)} {...props}>
      {interactive ? (
        <ButtonPrimitive
          render={render ?? (href !== undefined ? <a href={href} /> : undefined)}
          onClick={onClick}
          className="mb-home-section-link"
        >
          {children}
          {chevron}
        </ButtonPrimitive>
      ) : (
        children
      )}
    </Heading>
  )
}

/** A room's conditions in a line: "72° · 2 lights on · Humidity 41%". */
function HomeSectionSummary({ className, ...props }: React.ComponentProps<"p">) {
  return <p className={join("mb-home-section-summary", className)} {...props} />
}

export { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle }
export type { HomeSectionTitleProps }
