"use client"

import { Button, ButtonSpinner } from "macbetter/button"
import { CloudUploadIcon } from "lucide-react"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export default function Example() {
  return (
    <>
      <Button variant="filled" onClick={() => wait(2000)} pendingAnnouncement="Publishing">
        <CloudUploadIcon data-show="idle" aria-hidden="true" />
        <ButtonSpinner />
        Publish
      </Button>
      <Button onClick={() => wait(2000)} pendingAnnouncement="Syncing">
        <ButtonSpinner />
        Sync Now
      </Button>
    </>
  )
}
