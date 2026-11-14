"use client"

import { Button } from "@dreambase/stardust/button"
import { createToaster, Toaster } from "@dreambase/stardust/toast"
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
            data: { icon: <img src="/dreambase-logo-mark.svg" alt="" /> },
          })
        }
      >
        Show Banner
      </Button>
      <Toaster toaster={notify} />
    </>
  )
}
