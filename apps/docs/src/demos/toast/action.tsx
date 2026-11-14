"use client"

import { Button } from "macbetter/button"
import { toast } from "macbetter/toast"

export default function Example() {
  return (
    <Button
      onClick={() =>
        toast("Message archived", {
          description: "“Lunch on Thursday?” moved to Archive.",
          action: { label: "Undo", onAction: () => toast("Message restored") },
        })
      }
    >
      Archive Message
    </Button>
  )
}
