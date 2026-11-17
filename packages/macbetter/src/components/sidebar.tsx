import { Button as ButtonPrimitive } from "@ui-sdk/react/button"
import { Collapsible, CollapsiblePanel, CollapsibleTrigger } from "@ui-sdk/react/collapsible"
import type * as React from "react"
import { join } from "../lib/cx"

type SidebarProps = React.ComponentProps<"nav"> & {
  /** `accent` fills the selected row with the accent color, as macOS does in the key window; `gray` uses a neutral fill. */
  selection?: "accent" | "gray"
}

function Sidebar({ selection = "accent", className, ...props }: SidebarProps) {
  return <nav data-selection={selection} className={join("mb-sidebar", className)} {...props} />
}

type SidebarSectionProps = Omit<React.ComponentProps<"div">, "title"> & {
  /** The section header. Also names the list for assistive technology. */
  title?: React.ReactNode
  /** Lets people hide the section with a disclosure chevron in its header. */
  collapsible?: boolean
  defaultOpen?: boolean
  open?: boolean
  onOpenChange?: React.ComponentProps<typeof Collapsible>["onOpenChange"]
}

function SidebarSection({
  title,
  collapsible,
  defaultOpen = true,
  open,
  onOpenChange,
  className,
  children,
  ...props
}: SidebarSectionProps) {
  const label = typeof title === "string" ? title : undefined
  const list = (
    <ul aria-label={label} className="mb-sidebar-list">
      {children}
    </ul>
  )

  if (!collapsible) {
    return (
      <div className={join("mb-sidebar-section", className)} {...props}>
        {title ? (
          <div aria-hidden={label ? true : undefined} className="mb-sidebar-section-header">
            {title}
          </div>
        ) : null}
        {list}
      </div>
    )
  }

  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
      className={join("mb-sidebar-section", className)}
      {...props}
    >
      <CollapsibleTrigger className="mb-sidebar-section-header">
        <span className="mb-sidebar-section-title">{title}</span>
        <svg viewBox="0 0 16 16" aria-hidden="true" className="mb-sidebar-section-chevron">
          <path d="M6 3.5 10.5 8 6 12.5" />
        </svg>
      </CollapsibleTrigger>
      <CollapsiblePanel className="mb-sidebar-section-panel">{list}</CollapsiblePanel>
    </Collapsible>
  )
}

type SidebarItemProps = Omit<React.ComponentProps<"a">, "ref" | "onClick"> & {
  onClick?: React.MouseEventHandler<HTMLElement>
  icon?: React.ReactNode
  /** A trailing count or status, like unread messages. */
  badge?: React.ReactNode
  /** Marks the row as the place on screen now. Sets `aria-current="page"`. */
  current?: boolean
  /** Tints this row's icon, like a colored tag or a folder. */
  tint?: string
  /** Renders the row as your router's link: `render={<Link to="/inbox" />}`. Create the element in a client component. */
  render?: React.ComponentProps<typeof ButtonPrimitive>["render"]
}

function SidebarItem({
  icon,
  badge,
  current,
  tint,
  href,
  render,
  onClick,
  className,
  children,
  style,
  ...props
}: SidebarItemProps) {
  const content = (
    <>
      {icon ? (
        <span aria-hidden="true" className="mb-sidebar-item-icon">
          {icon}
        </span>
      ) : null}
      <span className="mb-sidebar-item-label">{children}</span>
      {badge != null ? <span className="mb-sidebar-item-badge">{badge}</span> : null}
    </>
  )
  const shared = {
    "aria-current": current ? ("page" as const) : undefined,
    "data-current": current ? "" : undefined,
    className: join("mb-sidebar-item", className),
    style: tint ? ({ "--mb-sidebar-icon-color": tint, ...style } as React.CSSProperties) : style,
  }

  return (
    <li className="mb-sidebar-list-item">
      {render ? (
        <ButtonPrimitive {...(props as React.HTMLAttributes<HTMLElement>)} {...shared} render={render} onClick={onClick}>
          {content}
        </ButtonPrimitive>
      ) : href ? (
        <a href={href} onClick={onClick} {...shared} {...props}>
          {content}
        </a>
      ) : (
        <ButtonPrimitive {...(props as React.HTMLAttributes<HTMLElement>)} {...shared} onClick={onClick}>
          {content}
        </ButtonPrimitive>
      )}
    </li>
  )
}

export { Sidebar, SidebarItem, SidebarSection }
export type { SidebarItemProps, SidebarProps, SidebarSectionProps }
