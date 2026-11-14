import {
  createListboxController,
  Listbox as ListboxPrimitive,
  ListboxGroup as ListboxGroupPrimitive,
  ListboxGroupLabel as ListboxGroupLabelPrimitive,
  ListboxItem as ListboxItemPrimitive,
  ListboxItemIcon as ListboxItemIconPrimitive,
  ListboxItemIndicator as ListboxItemIndicatorPrimitive,
  ListboxItems,
  ListboxSeparator as ListboxSeparatorPrimitive,
} from "@ui-sdk/react/listbox"
import type { ListboxProps } from "@ui-sdk/react/listbox"
import type * as React from "react"
import { cx } from "../lib/cx"
import { CheckGlyph } from "../lib/menu-glyphs"

/** An always-visible list you select from, like a Mac table or an iOS choice list. */
function Listbox<T = string, Multiple extends boolean | undefined = false>(props: ListboxProps<T, Multiple>) {
  return <ListboxPrimitive<T, Multiple> {...props} className={cx("sd-listbox", props.className)} />
}

/** A row. Selection is a solid fill on the Mac and a trailing checkmark on iOS, which it renders. */
function ListboxItem<T = string>({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ListboxItemPrimitive<T>>, "children"> & { children?: React.ReactNode }) {
  return (
    <ListboxItemPrimitive<T> className={cx("sd-listbox-item", className)} {...props}>
      {children}
      <ListboxItemIndicator />
    </ListboxItemPrimitive>
  )
}

function ListboxItemIndicator({
  keepMounted = true,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ListboxItemIndicatorPrimitive>) {
  return (
    <ListboxItemIndicatorPrimitive
      keepMounted={keepMounted}
      className={cx("sd-listbox-item-indicator", className)}
      {...props}
    >
      {children ?? <CheckGlyph />}
    </ListboxItemIndicatorPrimitive>
  )
}

function ListboxItemIcon({ className, ...props }: React.ComponentProps<typeof ListboxItemIconPrimitive>) {
  return <ListboxItemIconPrimitive className={cx("sd-listbox-item-icon", className)} {...props} />
}

function ListboxGroup({ className, ...props }: React.ComponentProps<typeof ListboxGroupPrimitive>) {
  return <ListboxGroupPrimitive className={cx("sd-listbox-group", className)} {...props} />
}

function ListboxGroupLabel({ className, ...props }: React.ComponentProps<typeof ListboxGroupLabelPrimitive>) {
  return <ListboxGroupLabelPrimitive className={cx("sd-listbox-group-label", className)} {...props} />
}

function ListboxSeparator({ className, ...props }: React.ComponentProps<typeof ListboxSeparatorPrimitive>) {
  return <ListboxSeparatorPrimitive className={cx("sd-listbox-separator", className)} {...props} />
}

export {
  createListboxController,
  Listbox,
  ListboxGroup,
  ListboxGroupLabel,
  ListboxItem,
  ListboxItemIcon,
  ListboxItemIndicator,
  ListboxItems,
  ListboxSeparator,
}
export type { ListboxProps }
