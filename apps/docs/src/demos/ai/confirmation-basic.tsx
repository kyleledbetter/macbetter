"use client"

import { Button } from "macbetter/button"
import {
  Confirmation,
  ConfirmationActions,
  ConfirmationDescription,
  ConfirmationDetails,
  ConfirmationIcon,
  ConfirmationTitle,
  type ConfirmationState,
} from "macbetter/confirmation"
import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import { CalendarIcon } from "lucide-react"
import { useState } from "react"

export default function Example() {
  const [state, setState] = useState<ConfirmationState>("pending")
  const [outcome, setOutcome] = useState("")

  const answer = (next: ConfirmationState, words: string) => {
    setOutcome(words)
    setState(next)
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16, width: "100%", maxWidth: 560 }}>
      <Confirmation state={state} outcome={outcome}>
        <ConfirmationIcon>
          <CalendarIcon aria-hidden="true" />
        </ConfirmationIcon>
        <ConfirmationTitle>Allow Calendar to create an event?</ConfirmationTitle>
        <ConfirmationDescription>Atlas wants to add this to your work calendar.</ConfirmationDescription>
        <ConfirmationDetails>
          <DescriptionList size="sm">
            <DescriptionItem>
              <DescriptionTerm>Title</DescriptionTerm>
              <DescriptionDetails>Design review</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>When</DescriptionTerm>
              <DescriptionDetails>Thursday, 10:00–10:45 AM</DescriptionDetails>
            </DescriptionItem>
            <DescriptionItem>
              <DescriptionTerm>Guests</DescriptionTerm>
              <DescriptionDetails>Mara Okafor, Theo Lind</DescriptionDetails>
            </DescriptionItem>
          </DescriptionList>
        </ConfirmationDetails>
        <ConfirmationActions>
          <Button onClick={() => answer("denied", "Denied")}>Deny</Button>
          <Button onClick={() => answer("allowed", "Always allowed for Calendar")}>Always allow</Button>
          <Button variant="filled" onClick={() => answer("allowed", "Allowed once")}>
            Allow once
          </Button>
        </ConfirmationActions>
      </Confirmation>
      {state !== "pending" ? (
        <Button size="sm" variant="plain" onClick={() => setState("pending")}>
          Ask again
        </Button>
      ) : null}
    </div>
  )
}
