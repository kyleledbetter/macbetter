"use client"

import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview } from "macbetter/attachment"

export default function Example() {
  return (
    <Attachment variant="tile" render={<a href="/demos/wallpaper-coast.svg" target="_blank" rel="noreferrer" />}>
      <AttachmentPreview src="/demos/wallpaper-coast.svg" />
      <AttachmentName>Coast wallpaper.svg</AttachmentName>
      <AttachmentMeta>SVG image</AttachmentMeta>
    </Attachment>
  )
}
