"use client"

import { Button } from "macbetter/button"
import { createToaster, Toaster } from "macbetter/toast"
import { useState } from "react"

export default function Example() {
  const [notify] = useState(() => createToaster())
  return (
    <>
      <Button
        variant="filled"
        onClick={() =>
          notify("Kofi Mensah", {
            description: "Lunch on Thursday? There’s a new ramen place on Valencia.",
            data: { icon: <img src="/app-icon.svg" alt="" /> },
          })
        }
      >
        Show Banner
      </Button>
      <Toaster toaster={notify} />
    </>
  )
}
