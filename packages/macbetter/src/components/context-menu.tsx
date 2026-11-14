import {
  Menu,
  MenuContent as MenuContentPrimitive,
  MenuContextTrigger as MenuContextTriggerPrimitive,
} from "@ui-sdk/react/menu"
import type { MenuProps } from "@ui-sdk/react/menu"
import type * as React from "react"
import { cx } from "../lib/cx"

/** A menu opened from an area by right-click, long press, Shift+F10 or the context-menu key. */
function ContextMenu(props: MenuProps) {
  return <Menu {...props} />
}

/** The area that opens the menu. Give it `tabIndex={0}` so the keyboard can open it too. */
function ContextMenuTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuContextTriggerPrimitive>) {
  return (
    <MenuContextTriggerPrimitive
      className={cx("mb-menu-context-trigger mb-context-menu-trigger", className)}
      {...props}
    />
  )
}

function ContextMenuContent<Payload = unknown>({
  className,
  ...props
}: React.ComponentProps<typeof MenuContentPrimitive<Payload>>) {
  return (
    <MenuContentPrimitive<Payload>
      className={cx("mb-menu-content mb-context-menu-content", className)}
      {...props}
    />
  )
}

export { ContextMenu, ContextMenuContent, ContextMenuTrigger }
