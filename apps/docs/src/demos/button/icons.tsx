import { Button } from "@dreambase/stardust/button"
import { DownloadIcon, ShareIcon, TrashIcon } from "lucide-react"

export default function Example() {
  return (
    <>
      <Button variant="filled">
        <DownloadIcon aria-hidden="true" />
        Download
      </Button>
      <Button>
        <ShareIcon aria-hidden="true" />
        Share
      </Button>
      <Button variant="plain" tone="destructive">
        <TrashIcon aria-hidden="true" />
        Delete
      </Button>
      <Button variant="plain" tone="neutral" aria-label="Share">
        <ShareIcon aria-hidden="true" />
      </Button>
    </>
  )
}
