"use client"

import { Button } from "@dreambase/stardust/button"
import { toast } from "@dreambase/stardust/toast"

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
