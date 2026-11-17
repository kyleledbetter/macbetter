"use client"

import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentName, AttachmentPreview, AttachmentRemove, Attachments } from "macbetter/attachment"
import { useState } from "react"

const photos = [
  { id: "dock", name: "Harbor at dusk.heic", seed: "Harbor at dusk", palette: "ocean" as const },
  { id: "lanterns", name: "Lantern test.heic", seed: "Lantern test", palette: "sunset" as const },
  { id: "crowd", name: "Opening night.heic", seed: "Opening night", palette: "citrus" as const },
]

export default function Example() {
  const [items, setItems] = useState(photos)
  return (
    <Attachments aria-label="Photos" layout="scroll">
      {items.map((photo) => (
        <Attachment key={photo.id} variant="thumbnail">
          <AttachmentPreview>
            <Artwork seed={photo.seed} palette={photo.palette} />
          </AttachmentPreview>
          <AttachmentName>{photo.name}</AttachmentName>
          <AttachmentRemove onClick={() => setItems((current) => current.filter((item) => item.id !== photo.id))} />
        </Attachment>
      ))}
      <Attachment variant="thumbnail" state="uploading" progress={30}>
        <AttachmentPreview>
          <Artwork seed="Fireworks" palette="sunset" />
        </AttachmentPreview>
        <AttachmentName>Fireworks.heic</AttachmentName>
      </Attachment>
    </Attachments>
  )
}
