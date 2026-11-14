"use client"

import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  AlertTrigger,
} from "macbetter/alert"
import { Button } from "macbetter/button"

export default function Example() {
  return (
    <Alert>
      <AlertTrigger render={<Button />}>Empty Trash…</AlertTrigger>
      <AlertContent>
        <AlertIcon>
          <img src="/app-icon.svg" alt="" />
        </AlertIcon>
        <AlertTitle>Are you sure you want to permanently erase the items in the Trash?</AlertTitle>
        <AlertDescription>You can’t undo this action.</AlertDescription>
        <AlertActions>
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction
            variant="primary"
            tone="destructive"
            value="confirm"
            data-agent-confirm="Permanently erases 24 items in the Trash"
          >
            Empty Trash
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )
}
