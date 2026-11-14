"use client"

import {
  createSelectController,
  Select as SelectPrimitive,
  SelectClear as SelectClearPrimitive,
  SelectContent as SelectContentPrimitive,
  SelectEmpty as SelectEmptyPrimitive,
  SelectGroup as SelectGroupPrimitive,
  SelectGroupLabel as SelectGroupLabelPrimitive,
  SelectInput as SelectInputPrimitive,
  SelectItem as SelectItemPrimitive,
  SelectItemIcon as SelectItemIconPrimitive,
  SelectItemIndicator as SelectItemIndicatorPrimitive,
  SelectItems,
  SelectItemText as SelectItemTextPrimitive,
  SelectLabel as SelectLabelPrimitive,
  SelectList as SelectListPrimitive,
  SelectSeparator as SelectSeparatorPrimitive,
  SelectStatus as SelectStatusPrimitive,
  SelectTrigger as SelectTriggerPrimitive,
  SelectValue as SelectValuePrimitive,
  SelectValueIcon as SelectValueIconPrimitive,
} from "@ui-sdk/react/select"
import type { ListData, SelectProps } from "@ui-sdk/react/select"
import * as React from "react"
import { cx } from "../lib/cx"
import { CheckGlyph, ChevronGlyph } from "../lib/menu-glyphs"

type PlatformSlot = { platform: string | null; setPlatform: (platform: string | null) => void }

/** The platform the trigger sits in, read as it's pressed or focused, so the list opens the native way. */
const PlatformContext = React.createContext<PlatformSlot | null>(null)

function Select<T = string, Multiple extends boolean | undefined = false>(props: SelectProps<T, Multiple>) {
  const [platform, setPlatform] = React.useState<string | null>(null)
  const slot = React.useMemo(() => ({ platform, setPlatform }), [platform])
  return (
    <PlatformContext.Provider value={slot}>
      <SelectPrimitive<T, Multiple> {...props} />
    </PlatformContext.Provider>
  )
}

function platformOf(element: Element) {
  return element.closest("[data-platform]")?.getAttribute("data-platform") ?? null
}

type SelectTriggerVariant = "auto" | "bezeled" | "plain"

type SelectTriggerProps = Omit<React.ComponentProps<typeof SelectTriggerPrimitive>, "children"> & {
  children?: React.ReactNode
  /**
   * `bezeled` is the Mac's pop-up button; `plain` is the iOS menu picker: accent text and an
   * up-and-down chevron. `auto` picks the one that fits the platform.
   */
  variant?: SelectTriggerVariant
  size?: "sm" | "md" | "lg"
}

/** The pop-up button. Shows the value and renders its own chevron cap; put a `SelectValue` inside. */
function SelectTrigger({
  variant = "auto",
  size = "md",
  className,
  children,
  onPointerDown,
  onFocus,
  ...props
}: SelectTriggerProps) {
  const slot = React.useContext(PlatformContext)
  return (
    <SelectTriggerPrimitive
      onPointerDown={(event) => {
        slot?.setPlatform(platformOf(event.currentTarget))
        onPointerDown?.(event)
      }}
      onFocus={(event) => {
        slot?.setPlatform(platformOf(event.currentTarget))
        onFocus?.(event)
      }}
      data-variant={variant}
      data-size={size}
      className={cx("sd-select-trigger", className)}
      {...props}
    >
      {children ?? <SelectValue />}
      <span className="sd-select-trigger-cap" aria-hidden="true">
        <ChevronGlyph direction="up-down" />
      </span>
    </SelectTriggerPrimitive>
  )
}

function SelectValue({ className, ...props }: React.ComponentProps<typeof SelectValuePrimitive>) {
  return <SelectValuePrimitive className={cx("sd-select-value", className)} {...props} />
}

function SelectValueIcon({ className, ...props }: React.ComponentProps<typeof SelectValueIconPrimitive>) {
  return <SelectValueIconPrimitive className={cx("sd-select-value-icon", className)} {...props} />
}

function SelectLabel({ className, ...props }: React.ComponentProps<typeof SelectLabelPrimitive>) {
  return <SelectLabelPrimitive className={cx("sd-select-label", className)} {...props} />
}

type SelectContentProps = Omit<React.ComponentProps<typeof SelectContentPrimitive>, "alignItemWithTrigger"> & {
  /**
   * Open over the trigger with the selected item on top of it. `auto` does that on the Mac only;
   * iOS and iPadOS menus open from the button.
   */
  alignItemWithTrigger?: boolean | "auto"
}

/** The menu. On the Mac it opens over the trigger with the selected item on top of it. */
function SelectContent({ alignItemWithTrigger = "auto", sideOffset = 4, className, ...props }: SelectContentProps) {
  const platform = React.useContext(PlatformContext)?.platform ?? "macos"
  return (
    <SelectContentPrimitive
      alignItemWithTrigger={alignItemWithTrigger === "auto" ? platform === "macos" : alignItemWithTrigger}
      sideOffset={sideOffset}
      className={cx("sd-menu-content sd-select-content", className)}
      {...props}
    />
  )
}

function SelectList({ className, ...props }: React.ComponentProps<typeof SelectListPrimitive>) {
  return <SelectListPrimitive className={cx("sd-select-list", className)} {...props} />
}

/** An option. Renders its own checkmark in the leading column. */
function SelectItem<T = string>({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof SelectItemPrimitive<T>>, "children"> & { children?: React.ReactNode }) {
  return (
    <SelectItemPrimitive<T> className={cx("sd-menu-item sd-menu-checkable sd-select-item", className)} {...props}>
      <SelectItemIndicator />
      {children}
    </SelectItemPrimitive>
  )
}

function SelectItemIndicator({
  keepMounted = true,
  className,
  children,
  ...props
}: React.ComponentProps<typeof SelectItemIndicatorPrimitive>) {
  return (
    <SelectItemIndicatorPrimitive
      keepMounted={keepMounted}
      className={cx("sd-menu-item-indicator sd-select-item-indicator", className)}
      {...props}
    >
      {children ?? <CheckGlyph />}
    </SelectItemIndicatorPrimitive>
  )
}

function SelectItemIcon({ className, ...props }: React.ComponentProps<typeof SelectItemIconPrimitive>) {
  return <SelectItemIconPrimitive className={cx("sd-menu-item-icon", className)} {...props} />
}

function SelectItemText({ className, ...props }: React.ComponentProps<typeof SelectItemTextPrimitive>) {
  return <SelectItemTextPrimitive className={cx("sd-select-item-text", className)} {...props} />
}

function SelectGroup({ className, ...props }: React.ComponentProps<typeof SelectGroupPrimitive>) {
  return <SelectGroupPrimitive className={cx("sd-menu-group", className)} {...props} />
}

function SelectGroupLabel({ className, ...props }: React.ComponentProps<typeof SelectGroupLabelPrimitive>) {
  return <SelectGroupLabelPrimitive className={cx("sd-menu-group-label", className)} {...props} />
}

function SelectSeparator({ className, ...props }: React.ComponentProps<typeof SelectSeparatorPrimitive>) {
  return <SelectSeparatorPrimitive className={cx("sd-menu-separator", className)} {...props} />
}

function SelectInput({ className, ...props }: React.ComponentProps<typeof SelectInputPrimitive>) {
  return <SelectInputPrimitive className={cx("sd-select-input", className)} {...props} />
}

function SelectEmpty({ className, ...props }: React.ComponentProps<typeof SelectEmptyPrimitive>) {
  return <SelectEmptyPrimitive className={cx("sd-select-empty", className)} {...props} />
}

function SelectStatus({ className, ...props }: React.ComponentProps<typeof SelectStatusPrimitive>) {
  return <SelectStatusPrimitive className={cx("sd-select-status", className)} {...props} />
}

function SelectClear({ className, ...props }: React.ComponentProps<typeof SelectClearPrimitive>) {
  return <SelectClearPrimitive className={cx("sd-select-clear", className)} {...props} />
}

export {
  createSelectController,
  Select,
  SelectClear,
  SelectContent,
  SelectEmpty,
  SelectGroup,
  SelectGroupLabel,
  SelectInput,
  SelectItem,
  SelectItemIcon,
  SelectItemIndicator,
  SelectItems,
  SelectItemText,
  SelectLabel,
  SelectList,
  SelectSeparator,
  SelectStatus,
  SelectTrigger,
  SelectValue,
  SelectValueIcon,
}
export type { ListData, SelectContentProps, SelectProps, SelectTriggerProps, SelectTriggerVariant }
