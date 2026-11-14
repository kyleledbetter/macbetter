import {
  Dialog as DialogPrimitive,
  DialogBackdrop,
  DialogClose as DialogClosePrimitive,
  DialogContent as DialogContentPrimitive,
  DialogDescription as DialogDescriptionPrimitive,
  DialogTitle as DialogTitlePrimitive,
  DialogTrigger as DialogTriggerPrimitive,
} from "@ui-sdk/react/dialog"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type DialogProps = React.ComponentProps<typeof DialogPrimitive>

/** `presentation` defaults to `auto`: a swipeable page sheet on phones, a centered panel elsewhere. */
function Dialog({ presentation = "auto", ...props }: DialogProps) {
  return <DialogPrimitive presentation={presentation} {...props} />
}

function DialogTrigger(props: React.ComponentProps<typeof DialogTriggerPrimitive>) {
  return <DialogTriggerPrimitive {...props} />
}

type DialogContentProps<Payload = unknown> = React.ComponentProps<typeof DialogContentPrimitive<Payload>> & {
  /** The panel's width on macOS and iPadOS. iPhone always fills the screen. */
  size?: "sm" | "md" | "lg"
}

function DialogContent<Payload = unknown>({ size = "md", className, ...props }: DialogContentProps<Payload>) {
  return (
    <>
      <DialogBackdrop className="sd-dialog-backdrop" />
      <DialogContentPrimitive<Payload> data-size={size} className={cx("sd-dialog", className)} {...props} />
    </>
  )
}

/** Holds the title and description. On iOS and iPadOS it becomes the navigation bar. */
function DialogHeader({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-dialog-header", className)} {...props} />
}

function DialogTitle({ className, ...props }: React.ComponentProps<typeof DialogTitlePrimitive>) {
  return <DialogTitlePrimitive className={cx("sd-dialog-title", className)} {...props} />
}

function DialogDescription({ className, ...props }: React.ComponentProps<typeof DialogDescriptionPrimitive>) {
  return <DialogDescriptionPrimitive className={cx("sd-dialog-description", className)} {...props} />
}

function DialogBody({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-dialog-body", className)} {...props} />
}

/** Right-aligned buttons on macOS. On iOS and iPadOS its cancel and primary buttons move into the navigation bar. */
function DialogFooter({ className, ...props }: React.ComponentProps<"div">) {
  return <div className={join("sd-dialog-footer", className)} {...props} />
}

type DialogCloseProps = React.ComponentProps<typeof DialogClosePrimitive> & {
  /** `primary` is the default action (Done, Save); `cancel` dismisses. On touch they sit at the ends of the navigation bar. */
  variant?: "default" | "primary" | "cancel"
  tone?: "accent" | "destructive"
}

function DialogClose({ variant = "default", tone = "accent", className, ...props }: DialogCloseProps) {
  return (
    <DialogClosePrimitive
      data-variant={variant}
      data-tone={tone}
      className={cx("sd-dialog-close", className)}
      {...props}
    />
  )
}

export { createDialogController } from "@ui-sdk/react/dialog"
export {
  Dialog,
  DialogBody,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
}
export type { DialogCloseProps, DialogContentProps, DialogProps }
