"use client"

import { Artwork } from "macbetter/artwork"
import { Button } from "macbetter/button"
import {
  GeneratedImage,
  GeneratedImageActions,
  GeneratedImageStage,
  GeneratedImageThumbnail,
  GeneratedImageThumbnails,
} from "macbetter/generated-image"
import { PencilIcon, ShareIcon } from "lucide-react"

const images = [
  { value: "dawn", variant: "aurora", palette: "dusk" },
  { value: "tide", variant: "ribbon", palette: "ocean" },
  { value: "dune", variant: "strata", palette: "sunset" },
  { value: "field", variant: "bloom", palette: "forest" },
] as const

export default function Example() {
  return (
    <GeneratedImage defaultValue="dawn" style={{ maxWidth: 520 }}>
      <GeneratedImageStage>
        {(value) => {
          const image = images.find((item) => item.value === value) ?? images[0]
          return (
            <Artwork
              seed={image.value}
              variant={image.variant}
              palette={image.palette}
              title={`Generated image ${images.indexOf(image) + 1}`}
            />
          )
        }}
      </GeneratedImageStage>
      <GeneratedImageActions>
        <Button variant="glass" size="sm" shape="capsule">
          <PencilIcon aria-hidden="true" />
          Edit
        </Button>
        <Button variant="glass" size="sm" shape="circle" aria-label="Share">
          <ShareIcon aria-hidden="true" />
        </Button>
      </GeneratedImageActions>
      <GeneratedImageThumbnails>
        {images.map((image, index) => (
          <GeneratedImageThumbnail key={image.value} value={image.value} aria-label={`Image ${index + 1}`}>
            <Artwork seed={image.value} variant={image.variant} palette={image.palette} />
          </GeneratedImageThumbnail>
        ))}
      </GeneratedImageThumbnails>
    </GeneratedImage>
  )
}
