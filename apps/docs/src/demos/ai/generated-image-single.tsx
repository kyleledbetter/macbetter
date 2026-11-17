"use client"

import { Artwork } from "macbetter/artwork"
import { Button } from "macbetter/button"
import { GeneratedImage, GeneratedImageActions, GeneratedImageStage } from "macbetter/generated-image"
import { DownloadIcon, PencilIcon } from "lucide-react"

export default function Example() {
  return (
    <GeneratedImage aspectRatio="16 / 9" style={{ maxWidth: 520 }}>
      <GeneratedImageStage>
        <Artwork seed="harbor-lights" variant="horizon" palette="dusk" aspect={16 / 9} title="Generated image" />
      </GeneratedImageStage>
      <GeneratedImageActions>
        <Button variant="glass" size="sm" shape="capsule">
          <PencilIcon aria-hidden="true" />
          Edit
        </Button>
        <Button variant="glass" size="sm" shape="circle" aria-label="Save">
          <DownloadIcon aria-hidden="true" />
        </Button>
      </GeneratedImageActions>
    </GeneratedImage>
  )
}
