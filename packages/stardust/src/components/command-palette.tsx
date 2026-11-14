import {
  Command as CommandPrimitive,
  CommandEmpty as CommandEmptyPrimitive,
  CommandGroup as CommandGroupPrimitive,
  CommandGroupLabel as CommandGroupLabelPrimitive,
  CommandInput as CommandInputPrimitive,
  CommandItem as CommandItemPrimitive,
  CommandItemIcon as CommandItemIconPrimitive,
  CommandItems,
  CommandItemText as CommandItemTextPrimitive,
  CommandList as CommandListPrimitive,
  CommandPage,
  CommandSeparator as CommandSeparatorPrimitive,
  CommandShortcut as CommandShortcutPrimitive,
  CommandStatus as CommandStatusPrimitive,
  createCommandController,
} from "@ui-sdk/react/command"
import type { CommandProps } from "@ui-sdk/react/command"
import {
  Dialog,
  DialogBackdrop,
  DialogContent,
  DialogShortcut,
  DialogTitle,
  DialogTrigger,
} from "@ui-sdk/react/dialog"
import type * as React from "react"
import { cx } from "../lib/cx"
import { SearchGlyph } from "../lib/menu-glyphs"

/** The palette's root: a dialog that holds a `Command`. Control it with `open` and `onOpenChange`. */
function CommandPalette(props: React.ComponentProps<typeof Dialog>) {
  return <Dialog {...props} />
}

type CommandPaletteTriggerProps = Omit<React.ComponentProps<typeof DialogTrigger>, "children"> & {
  children?: React.ReactNode
}

/** A search-field-shaped button that opens the palette, with ⌘K by default. */
function CommandPaletteTrigger({
  shortcut = "mod+k",
  className,
  children,
  ...props
}: CommandPaletteTriggerProps) {
  return (
    <DialogTrigger shortcut={shortcut} className={cx("sd-command-palette-trigger", className)} {...props}>
      <SearchGlyph />
      <span className="sd-command-palette-trigger-label">{children ?? "Search"}</span>
      <DialogShortcut className="sd-command-palette-trigger-shortcut" />
    </DialogTrigger>
  )
}

type CommandPaletteContentProps = Omit<React.ComponentProps<typeof DialogContent>, "children"> & {
  children?: React.ReactNode
  /** Names the palette for screen readers. It isn't shown. */
  title?: string
}

/** The floating panel, Spotlight-style: a large translucent sheet of glass near the top of the screen. */
function CommandPaletteContent({ title = "Search", className, children, ...props }: CommandPaletteContentProps) {
  return (
    <>
      <DialogBackdrop className="sd-command-palette-backdrop" />
      <DialogContent className={cx("sd-command-palette", className)} {...props}>
        <DialogTitle className="sd-visually-hidden">{title}</DialogTitle>
        {children}
      </DialogContent>
    </>
  )
}

function Command({ className, ...props }: CommandProps) {
  return <CommandPrimitive className={cx("sd-command", className)} {...props} />
}

/** The search field. Renders its own magnifier. */
function CommandInput({ className, ...props }: React.ComponentProps<typeof CommandInputPrimitive>) {
  return (
    <div className="sd-command-search">
      <SearchGlyph />
      <CommandInputPrimitive className={cx("sd-command-input", className)} {...props} />
    </div>
  )
}

function CommandList({ className, ...props }: React.ComponentProps<typeof CommandListPrimitive>) {
  return <CommandListPrimitive className={cx("sd-command-list", className)} {...props} />
}

function CommandItem({ className, ...props }: React.ComponentProps<typeof CommandItemPrimitive>) {
  return <CommandItemPrimitive className={cx("sd-command-item", className)} {...props} />
}

function CommandItemIcon({ className, ...props }: React.ComponentProps<typeof CommandItemIconPrimitive>) {
  return <CommandItemIconPrimitive className={cx("sd-command-item-icon", className)} {...props} />
}

function CommandItemText({ className, ...props }: React.ComponentProps<typeof CommandItemTextPrimitive>) {
  return <CommandItemTextPrimitive className={cx("sd-command-item-text", className)} {...props} />
}

function CommandShortcut({ className, ...props }: React.ComponentProps<typeof CommandShortcutPrimitive>) {
  return <CommandShortcutPrimitive className={cx("sd-command-shortcut", className)} {...props} />
}

function CommandGroup({ className, ...props }: React.ComponentProps<typeof CommandGroupPrimitive>) {
  return <CommandGroupPrimitive className={cx("sd-command-group", className)} {...props} />
}

function CommandGroupLabel({ className, ...props }: React.ComponentProps<typeof CommandGroupLabelPrimitive>) {
  return <CommandGroupLabelPrimitive className={cx("sd-command-group-label", className)} {...props} />
}

function CommandSeparator({ className, ...props }: React.ComponentProps<typeof CommandSeparatorPrimitive>) {
  return <CommandSeparatorPrimitive className={cx("sd-command-separator", className)} {...props} />
}

function CommandEmpty({ className, ...props }: React.ComponentProps<typeof CommandEmptyPrimitive>) {
  return <CommandEmptyPrimitive className={cx("sd-command-empty", className)} {...props} />
}

function CommandStatus({ className, ...props }: React.ComponentProps<typeof CommandStatusPrimitive>) {
  return <CommandStatusPrimitive className={cx("sd-command-status", className)} {...props} />
}

export {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandGroupLabel,
  CommandInput,
  CommandItem,
  CommandItemIcon,
  CommandItems,
  CommandItemText,
  CommandList,
  CommandPage,
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
  CommandSeparator,
  CommandShortcut,
  CommandStatus,
  createCommandController,
}
export type { CommandPaletteContentProps, CommandPaletteTriggerProps, CommandProps }
