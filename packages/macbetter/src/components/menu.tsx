import {
  Menu,
  MenuCheckboxItem as MenuCheckboxItemPrimitive,
  MenuContent as MenuContentPrimitive,
  MenuContextTrigger as MenuContextTriggerPrimitive,
  MenuGroup as MenuGroupPrimitive,
  MenuGroupLabel as MenuGroupLabelPrimitive,
  MenuItem as MenuItemPrimitive,
  MenuItemIcon as MenuItemIconPrimitive,
  MenuItemIndicator as MenuItemIndicatorPrimitive,
  MenuItems,
  MenuRadioGroup as MenuRadioGroupPrimitive,
  MenuRadioItem as MenuRadioItemPrimitive,
  MenuSeparator as MenuSeparatorPrimitive,
  MenuShortcut as MenuShortcutPrimitive,
  MenuSub,
  MenuSubContent as MenuSubContentPrimitive,
  MenuSubTrigger as MenuSubTriggerPrimitive,
  MenuTrigger as MenuTriggerPrimitive,
  createMenuController,
} from "@ui-sdk/react/menu"
import type { MenuProps, MenuSubProps } from "@ui-sdk/react/menu"
import type * as React from "react"
import { cx } from "../lib/cx"
import { CheckGlyph, ChevronGlyph } from "../lib/menu-glyphs"
import type { ButtonShape, ButtonSize, ButtonTone, ButtonVariant } from "./button"

type MenuTriggerProps = Omit<React.ComponentProps<typeof MenuTriggerPrimitive>, "children"> & {
  children?: React.ReactNode
  variant?: ButtonVariant
  tone?: ButtonTone
  size?: ButtonSize
  shape?: ButtonShape
  /** Shows the pull-down chevron after the label. Turn it off for icon-only triggers. */
  indicator?: boolean
}

/** A pull-down button: a Macbetter button that opens its menu. */
function MenuTrigger({
  variant = "bezeled",
  tone = "accent",
  size = "md",
  shape = "auto",
  indicator = true,
  className,
  children,
  ...props
}: MenuTriggerProps) {
  return (
    <MenuTriggerPrimitive
      data-variant={variant}
      data-tone={tone}
      data-size={size}
      data-shape={shape}
      className={cx("mb-button mb-menu-trigger", className)}
      {...props}
    >
      {children}
      {indicator ? (
        <span className="mb-menu-trigger-indicator" aria-hidden="true">
          <ChevronGlyph direction="down" />
        </span>
      ) : null}
    </MenuTriggerPrimitive>
  )
}

function MenuContextTrigger({
  className,
  ...props
}: React.ComponentProps<typeof MenuContextTriggerPrimitive>) {
  return <MenuContextTriggerPrimitive className={cx("mb-menu-context-trigger", className)} {...props} />
}

function MenuContent<Payload = unknown>({
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof MenuContentPrimitive<Payload>>) {
  return (
    <MenuContentPrimitive<Payload> sideOffset={sideOffset} className={cx("mb-menu-content", className)} {...props} />
  )
}

function MenuSubContent<Payload = unknown>({
  sideOffset = 0,
  className,
  ...props
}: React.ComponentProps<typeof MenuSubContentPrimitive<Payload>>) {
  return (
    <MenuSubContentPrimitive<Payload>
      sideOffset={sideOffset}
      className={cx("mb-menu-content", className)}
      {...props}
    />
  )
}

function MenuItem({ className, ...props }: React.ComponentProps<typeof MenuItemPrimitive>) {
  return <MenuItemPrimitive className={cx("mb-menu-item", className)} {...props} />
}

function MenuItemIndicator({
  keepMounted = true,
  className,
  children,
  ...props
}: React.ComponentProps<typeof MenuItemIndicatorPrimitive>) {
  return (
    <MenuItemIndicatorPrimitive
      keepMounted={keepMounted}
      className={cx("mb-menu-item-indicator", className)}
      {...props}
    >
      {children ?? <CheckGlyph />}
    </MenuItemIndicatorPrimitive>
  )
}

/** A setting that toggles. Renders its own checkmark in the menu's leading column. */
function MenuCheckboxItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuCheckboxItemPrimitive>, "children"> & { children?: React.ReactNode }) {
  return (
    <MenuCheckboxItemPrimitive className={cx("mb-menu-item mb-menu-checkable", className)} {...props}>
      <MenuItemIndicator />
      {children}
    </MenuCheckboxItemPrimitive>
  )
}

/** One choice in a radio group. Apple menus mark it with a checkmark, like a checkbox item. */
function MenuRadioItem({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuRadioItemPrimitive>, "children"> & { children?: React.ReactNode }) {
  return (
    <MenuRadioItemPrimitive className={cx("mb-menu-item mb-menu-checkable", className)} {...props}>
      <MenuItemIndicator />
      {children}
    </MenuRadioItemPrimitive>
  )
}

function MenuRadioGroup<T extends string = string>({
  className,
  ...props
}: React.ComponentProps<typeof MenuRadioGroupPrimitive<T>>) {
  return <MenuRadioGroupPrimitive<T> className={cx("mb-menu-group", className)} {...props} />
}

function MenuItemIcon({ className, ...props }: React.ComponentProps<typeof MenuItemIconPrimitive>) {
  return <MenuItemIconPrimitive className={cx("mb-menu-item-icon", className)} {...props} />
}

function MenuShortcut({ className, ...props }: React.ComponentProps<typeof MenuShortcutPrimitive>) {
  return <MenuShortcutPrimitive className={cx("mb-menu-shortcut", className)} {...props} />
}

function MenuGroup({ className, ...props }: React.ComponentProps<typeof MenuGroupPrimitive>) {
  return <MenuGroupPrimitive className={cx("mb-menu-group", className)} {...props} />
}

function MenuGroupLabel({ className, ...props }: React.ComponentProps<typeof MenuGroupLabelPrimitive>) {
  return <MenuGroupLabelPrimitive className={cx("mb-menu-group-label", className)} {...props} />
}

function MenuSeparator({ className, ...props }: React.ComponentProps<typeof MenuSeparatorPrimitive>) {
  return <MenuSeparatorPrimitive className={cx("mb-menu-separator", className)} {...props} />
}

/** Opens a submenu. Renders its own trailing chevron. */
function MenuSubTrigger({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof MenuSubTriggerPrimitive>, "children"> & { children?: React.ReactNode }) {
  return (
    <MenuSubTriggerPrimitive className={cx("mb-menu-item mb-menu-sub-trigger", className)} {...props}>
      {children}
      <span className="mb-menu-sub-trigger-indicator" aria-hidden="true">
        <ChevronGlyph direction="right" />
      </span>
    </MenuSubTriggerPrimitive>
  )
}

export {
  createMenuController,
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuContextTrigger,
  MenuGroup,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuItemIndicator,
  MenuItems,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuShortcut,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
}
export type { MenuProps, MenuSubProps, MenuTriggerProps }
