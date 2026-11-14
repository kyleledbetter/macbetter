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
      <AlertTrigger render={<Button />}>Close Document</AlertTrigger>
      <AlertContent>
        <AlertIcon>
          <img src="/app-icon.svg" alt="" />
        </AlertIcon>
        <AlertTitle>Do you want to save the changes you made to “Q3 Roadmap”?</AlertTitle>
        <AlertDescription>Your changes will be lost if you don’t save them.</AlertDescription>
        <AlertActions>
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction variant="primary" value="save">
            Save
          </AlertAction>
          <AlertAction tone="destructive" value="discard" data-agent-confirm="Discards unsaved changes to Q3 Roadmap">
            Don’t Save
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )
}
