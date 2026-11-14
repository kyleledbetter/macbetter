"use client"

import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertTitle,
  AlertTrigger,
} from "macbetter/alert"
import { Button } from "macbetter/button"

export default function Example() {
  return (
    <Alert>
      <AlertTrigger render={<Button tone="destructive" />}>Delete Photo</AlertTrigger>
      <AlertContent variant="sheet">
        <AlertTitle>Delete this photo?</AlertTitle>
        <AlertDescription>It will be deleted from iCloud Photos on all your devices.</AlertDescription>
        <AlertActions>
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction
            tone="destructive"
            value="confirm"
            data-agent-confirm="Deletes the photo from every device"
          >
            Delete Photo
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )
}
