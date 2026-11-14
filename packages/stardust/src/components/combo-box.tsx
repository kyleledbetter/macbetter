import {
  Autocomplete,
  AutocompleteClear as AutocompleteClearPrimitive,
  AutocompleteContent as AutocompleteContentPrimitive,
  AutocompleteEmpty as AutocompleteEmptyPrimitive,
  AutocompleteGroup as AutocompleteGroupPrimitive,
  AutocompleteGroupLabel as AutocompleteGroupLabelPrimitive,
  AutocompleteInput as AutocompleteInputPrimitive,
  AutocompleteItem as AutocompleteItemPrimitive,
  AutocompleteItemIcon as AutocompleteItemIconPrimitive,
  AutocompleteItems,
  AutocompleteItemText as AutocompleteItemTextPrimitive,
  AutocompleteLabel as AutocompleteLabelPrimitive,
  AutocompleteList as AutocompleteListPrimitive,
  AutocompleteSeparator as AutocompleteSeparatorPrimitive,
  AutocompleteStatus as AutocompleteStatusPrimitive,
  AutocompleteTrigger as AutocompleteTriggerPrimitive,
  createAutocompleteController,
} from "@ui-sdk/react/autocomplete"
import type { AutocompleteProps } from "@ui-sdk/react/autocomplete"
import {
  Combobox,
  ComboboxClear as ComboboxClearPrimitive,
  ComboboxContent as ComboboxContentPrimitive,
  ComboboxEmpty as ComboboxEmptyPrimitive,
  ComboboxGroup as ComboboxGroupPrimitive,
  ComboboxGroupLabel as ComboboxGroupLabelPrimitive,
  ComboboxInput as ComboboxInputPrimitive,
  ComboboxItem as ComboboxItemPrimitive,
  ComboboxItemIcon as ComboboxItemIconPrimitive,
  ComboboxItemIndicator as ComboboxItemIndicatorPrimitive,
  ComboboxItems,
  ComboboxItemText as ComboboxItemTextPrimitive,
  ComboboxLabel as ComboboxLabelPrimitive,
  ComboboxList as ComboboxListPrimitive,
  ComboboxSeparator as ComboboxSeparatorPrimitive,
  ComboboxStatus as ComboboxStatusPrimitive,
  ComboboxTrigger as ComboboxTriggerPrimitive,
  createComboboxController,
} from "@ui-sdk/react/combobox"
import type { ComboboxProps } from "@ui-sdk/react/combobox"
import type * as React from "react"
import { cx, join } from "../lib/cx"
import { CheckGlyph, ChevronGlyph } from "../lib/menu-glyphs"

function ClearGlyph() {
  return (
    <svg viewBox="0 0 16 16" aria-hidden="true">
      <circle cx="8" cy="8" r="7" fill="currentColor" />
      <path d="m5.6 5.6 4.8 4.8m0-4.8-4.8 4.8" stroke="var(--sd-bg-field)" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  )
}

/** The field: holds the input, and the clear button and trigger at its trailing edge. */
function ComboboxControl({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-combo-box-control", className)} {...props} />
}

function ComboboxLabel({ className, ...props }: React.ComponentProps<typeof ComboboxLabelPrimitive>) {
  return <ComboboxLabelPrimitive className={cx("sd-combo-box-label", className)} {...props} />
}

function ComboboxInput({ className, ...props }: React.ComponentProps<typeof ComboboxInputPrimitive>) {
  return <ComboboxInputPrimitive className={cx("sd-combo-box-input", className)} {...props} />
}

/** The button that shows every choice. Renders its own chevron; name it with `aria-label`. */
function ComboboxTrigger({ className, children, ...props }: React.ComponentProps<typeof ComboboxTriggerPrimitive>) {
  return (
    <ComboboxTriggerPrimitive className={cx("sd-combo-box-trigger", className)} {...props}>
      {children ?? <ChevronGlyph direction="down" />}
    </ComboboxTriggerPrimitive>
  )
}

function ComboboxClear({ className, children, ...props }: React.ComponentProps<typeof ComboboxClearPrimitive>) {
  return (
    <ComboboxClearPrimitive className={cx("sd-combo-box-clear", className)} {...props}>
      {children ?? <ClearGlyph />}
    </ComboboxClearPrimitive>
  )
}

function ComboboxContent({
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof ComboboxContentPrimitive>) {
  return (
    <ComboboxContentPrimitive
      sideOffset={sideOffset}
      className={cx("sd-menu-content sd-combo-box-content", className)}
      {...props}
    />
  )
}

function ComboboxList({ className, ...props }: React.ComponentProps<typeof ComboboxListPrimitive>) {
  return <ComboboxListPrimitive className={cx("sd-combo-box-list", className)} {...props} />
}

/** A choice. Renders its own checkmark beside the selected one. */
function ComboboxItem<T = string>({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof ComboboxItemPrimitive<T>>, "children"> & { children?: React.ReactNode }) {
  return (
    <ComboboxItemPrimitive<T> className={cx("sd-menu-item sd-menu-checkable sd-combo-box-item", className)} {...props}>
      <ComboboxItemIndicator />
      {children}
    </ComboboxItemPrimitive>
  )
}

function ComboboxItemIndicator({
  keepMounted = true,
  className,
  children,
  ...props
}: React.ComponentProps<typeof ComboboxItemIndicatorPrimitive>) {
  return (
    <ComboboxItemIndicatorPrimitive
      keepMounted={keepMounted}
      className={cx("sd-menu-item-indicator sd-combo-box-item-indicator", className)}
      {...props}
    >
      {children ?? <CheckGlyph />}
    </ComboboxItemIndicatorPrimitive>
  )
}

function ComboboxItemIcon({ className, ...props }: React.ComponentProps<typeof ComboboxItemIconPrimitive>) {
  return <ComboboxItemIconPrimitive className={cx("sd-menu-item-icon", className)} {...props} />
}

function ComboboxItemText({ className, ...props }: React.ComponentProps<typeof ComboboxItemTextPrimitive>) {
  return <ComboboxItemTextPrimitive className={cx("sd-combo-box-item-text", className)} {...props} />
}

function ComboboxGroup({ className, ...props }: React.ComponentProps<typeof ComboboxGroupPrimitive>) {
  return <ComboboxGroupPrimitive className={cx("sd-menu-group", className)} {...props} />
}

function ComboboxGroupLabel({ className, ...props }: React.ComponentProps<typeof ComboboxGroupLabelPrimitive>) {
  return <ComboboxGroupLabelPrimitive className={cx("sd-menu-group-label", className)} {...props} />
}

function ComboboxSeparator({ className, ...props }: React.ComponentProps<typeof ComboboxSeparatorPrimitive>) {
  return <ComboboxSeparatorPrimitive className={cx("sd-menu-separator", className)} {...props} />
}

function ComboboxEmpty({ className, ...props }: React.ComponentProps<typeof ComboboxEmptyPrimitive>) {
  return <ComboboxEmptyPrimitive className={cx("sd-combo-box-empty", className)} {...props} />
}

function ComboboxStatus({ className, ...props }: React.ComponentProps<typeof ComboboxStatusPrimitive>) {
  return <ComboboxStatusPrimitive className={cx("sd-combo-box-status", className)} {...props} />
}

function AutocompleteLabel({ className, ...props }: React.ComponentProps<typeof AutocompleteLabelPrimitive>) {
  return <AutocompleteLabelPrimitive className={cx("sd-combo-box-label", className)} {...props} />
}

function AutocompleteInput({ className, ...props }: React.ComponentProps<typeof AutocompleteInputPrimitive>) {
  return <AutocompleteInputPrimitive className={cx("sd-combo-box-input", className)} {...props} />
}

function AutocompleteTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AutocompleteTriggerPrimitive>) {
  return (
    <AutocompleteTriggerPrimitive className={cx("sd-combo-box-trigger", className)} {...props}>
      {children ?? <ChevronGlyph direction="down" />}
    </AutocompleteTriggerPrimitive>
  )
}

function AutocompleteClear({ className, children, ...props }: React.ComponentProps<typeof AutocompleteClearPrimitive>) {
  return (
    <AutocompleteClearPrimitive className={cx("sd-combo-box-clear", className)} {...props}>
      {children ?? <ClearGlyph />}
    </AutocompleteClearPrimitive>
  )
}

function AutocompleteContent({
  sideOffset = 4,
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteContentPrimitive>) {
  return (
    <AutocompleteContentPrimitive
      sideOffset={sideOffset}
      className={cx("sd-menu-content sd-combo-box-content", className)}
      {...props}
    />
  )
}

function AutocompleteList({ className, ...props }: React.ComponentProps<typeof AutocompleteListPrimitive>) {
  return <AutocompleteListPrimitive className={cx("sd-combo-box-list", className)} {...props} />
}

function AutocompleteItem({ className, ...props }: React.ComponentProps<typeof AutocompleteItemPrimitive>) {
  return <AutocompleteItemPrimitive className={cx("sd-menu-item sd-combo-box-item", className)} {...props} />
}

function AutocompleteItemIcon({ className, ...props }: React.ComponentProps<typeof AutocompleteItemIconPrimitive>) {
  return <AutocompleteItemIconPrimitive className={cx("sd-menu-item-icon", className)} {...props} />
}

function AutocompleteItemText({ className, ...props }: React.ComponentProps<typeof AutocompleteItemTextPrimitive>) {
  return <AutocompleteItemTextPrimitive className={cx("sd-combo-box-item-text", className)} {...props} />
}

function AutocompleteGroup({ className, ...props }: React.ComponentProps<typeof AutocompleteGroupPrimitive>) {
  return <AutocompleteGroupPrimitive className={cx("sd-menu-group", className)} {...props} />
}

function AutocompleteGroupLabel({
  className,
  ...props
}: React.ComponentProps<typeof AutocompleteGroupLabelPrimitive>) {
  return <AutocompleteGroupLabelPrimitive className={cx("sd-menu-group-label", className)} {...props} />
}

function AutocompleteSeparator({ className, ...props }: React.ComponentProps<typeof AutocompleteSeparatorPrimitive>) {
  return <AutocompleteSeparatorPrimitive className={cx("sd-menu-separator", className)} {...props} />
}

function AutocompleteEmpty({ className, ...props }: React.ComponentProps<typeof AutocompleteEmptyPrimitive>) {
  return <AutocompleteEmptyPrimitive className={cx("sd-combo-box-empty", className)} {...props} />
}

function AutocompleteStatus({ className, ...props }: React.ComponentProps<typeof AutocompleteStatusPrimitive>) {
  return <AutocompleteStatusPrimitive className={cx("sd-combo-box-status", className)} {...props} />
}

export {
  Autocomplete,
  AutocompleteClear,
  AutocompleteContent,
  AutocompleteEmpty,
  AutocompleteGroup,
  AutocompleteGroupLabel,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteItemIcon,
  AutocompleteItems,
  AutocompleteItemText,
  AutocompleteLabel,
  AutocompleteList,
  AutocompleteSeparator,
  AutocompleteStatus,
  AutocompleteTrigger,
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxItemIcon,
  ComboboxItemIndicator,
  ComboboxItems,
  ComboboxItemText,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxStatus,
  ComboboxTrigger,
  createAutocompleteController,
  createComboboxController,
}
export type { AutocompleteProps, ComboboxProps }
