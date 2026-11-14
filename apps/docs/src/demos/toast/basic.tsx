"use client"

import { Button } from "macbetter/button"
import { toast } from "macbetter/toast"

export default function Example() {
  return (
    <Button
      variant="filled"
      onClick={() =>
        toast("Hollis Grant", {
          description: "Can you review the Q3 roadmap before Friday’s planning meeting?",
          data: { icon: <img src="/app-icon.svg" alt="" /> },
        })
      }
    >
      Send Notification
    </Button>
  )
}
