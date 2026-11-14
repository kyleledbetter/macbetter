"use client"

import { Button } from "@dreambase/stardust/button"
import { toast } from "@dreambase/stardust/toast"

function upload() {
  return new Promise((resolve) => setTimeout(resolve, 2000))
}

export default function Example() {
  return (
    <>
      <Button onClick={() => toast.success("Export complete", { description: "Q3 Roadmap.pdf is in Downloads." })}>
        Success
      </Button>
      <Button onClick={() => toast.warning("Storage almost full", { description: "1.2 GB of 15 GB left." })}>
        Warning
      </Button>
      <Button onClick={() => toast.error("Couldn’t sync", { description: "Check your connection and try again." })}>
        Error
      </Button>
      <Button
        onClick={() =>
          toast.promise(upload, { loading: "Uploading 12 photos…", success: "Photos uploaded", error: "Upload failed" })
        }
      >
        Loading
      </Button>
    </>
  )
}
