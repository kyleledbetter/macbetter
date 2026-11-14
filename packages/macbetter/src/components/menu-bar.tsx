import { MenuContent as MenuContentPrimitive, MenuTrigger as MenuTriggerPrimitive } from "@ui-sdk/react/menu"
import { Menubar } from "@ui-sdk/react/menubar"
import type * as React from "react"
import { cx } from "../lib/cx"

/** The Mac's menu bar: one tab stop, arrow keys between menus. Put a `Menu` per title inside. */
function MenuBar({ className, ...props }: React.ComponentProps<typeof Menubar>) {
  return <Menubar className={cx("mb-menu-bar", className)} {...props} />
}

type MenuBarTriggerProps = React.ComponentProps<typeof MenuTriggerPrimitive> & {
  /** The application menu's title, set in bold. */
  app?: boolean
}

function MenuBarTrigger({ app, className, ...props }: MenuBarTriggerProps) {
  return (
    <MenuTriggerPrimitive
      data-app={app ? "" : undefined}
      className={cx("mb-menu-bar-trigger", className)}
      {...props}
    />
  )
}

/** A menu bar's menu: it hangs from the bar and doesn't scale in. */
function MenuBarContent<Payload = unknown>({
  sideOffset = 3,
  className,
  ...props
}: React.ComponentProps<typeof MenuContentPrimitive<Payload>>) {
  return (
    <MenuContentPrimitive<Payload>
      sideOffset={sideOffset}
      className={cx("mb-menu-content mb-menu-bar-content", className)}
      {...props}
    />
  )
}

export { MenuBar, MenuBarContent, MenuBarTrigger }
export type { MenuBarTriggerProps }
