import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogClose,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@ui-sdk/react/alert-dialog"
import type * as React from "react"
import { cx, join } from "../lib/cx"

type AlertProps = React.ComponentProps<typeof AlertDialog>

function Alert(props: AlertProps) {
  return <AlertDialog {...props} />
}

function AlertTrigger(props: React.ComponentProps<typeof AlertDialogTrigger>) {
  return <AlertDialogTrigger {...props} />
}

type AlertContentProps<Payload = unknown> = React.ComponentProps<typeof AlertDialogContent<Payload>> & {
  /** `sheet` docks an iOS action sheet to the bottom of the screen. macOS always shows an alert. */
  variant?: "alert" | "sheet"
}

function AlertContent<Payload = unknown>({ variant = "alert", className, ...props }: AlertContentProps<Payload>) {
  return (
    <>
      <AlertDialogBackdrop className="mb-alert-backdrop" />
      <AlertDialogContent<Payload> data-variant={variant} className={cx("mb-alert", className)} {...props} />
    </>
  )
}

/** The app icon macOS shows above the title. Hidden on iOS and iPadOS, where alerts carry none. */
function AlertIcon({ className, ...props }: React.ComponentProps<"span">) {
  return <span aria-hidden="true" className={join("mb-alert-icon", className)} {...props} />
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof AlertDialogTitle>) {
  return <AlertDialogTitle className={cx("mb-alert-title", className)} {...props} />
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof AlertDialogDescription>) {
  return <AlertDialogDescription className={cx("mb-alert-description", className)} {...props} />
}

type AlertActionsProps = React.ComponentProps<"div"> & {
  /** `auto` puts two buttons side by side and stacks three or more, as the system does. */
  orientation?: "auto" | "horizontal" | "vertical"
}

function AlertActions({ orientation = "auto", className, ...props }: AlertActionsProps) {
  return <div data-orientation={orientation} className={join("mb-alert-actions", className)} {...props} />
}

type AlertActionProps = React.ComponentProps<typeof AlertDialogClose> & {
  /** `primary` is the default action (Return). `cancel` goes last in a stack and stands apart in an action sheet. */
  variant?: "default" | "primary" | "cancel"
  tone?: "accent" | "destructive"
}

function AlertAction({ variant = "default", tone = "accent", className, ...props }: AlertActionProps) {
  return (
    <AlertDialogClose
      data-variant={variant}
      data-tone={tone}
      className={cx("mb-alert-action", className)}
      {...props}
    />
  )
}

export { confirm, createAlertDialogController, createConfirm } from "@ui-sdk/react/alert-dialog"
export type { ConfirmOptions } from "@ui-sdk/react/alert-dialog"
export { Alert, AlertAction, AlertActions, AlertContent, AlertDescription, AlertIcon, AlertTitle, AlertTrigger }
export type { AlertActionProps, AlertActionsProps, AlertContentProps, AlertProps }
