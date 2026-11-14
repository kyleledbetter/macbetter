"use client"

import { Button } from "@dreambase/stardust/button"
import { toast } from "@dreambase/stardust/toast"

export default function Example() {
  return (
    <Button
      variant="filled"
      onClick={() =>
        toast("Hollis Grant", {
          description: "Can you review the Q3 roadmap before Friday’s planning meeting?",
          data: { icon: <img src="/dreambase-logo-mark.svg" alt="" /> },
        })
      }
    >
      Send Notification
    </Button>
  )
}
