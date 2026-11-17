"use client"

import { Artwork } from "macbetter/artwork"
import {
  Attachment,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "macbetter/attachment"
import { useState } from "react"

const initial = [
  { id: "brief", name: "Festival brief.pdf", meta: "PDF · 2.4 MB", extension: "pdf", color: "red" as const },
  { id: "survey", name: "visitor-survey-2025.csv", meta: "CSV · 84 KB", extension: "csv", color: "green" as const },
  { id: "sketch", name: "Poster sketch.png", meta: "Image · 1.1 MB", art: true },
]

export default function Example() {
  const [files, setFiles] = useState(initial)
  const remove = (id: string) => setFiles((current) => current.filter((file) => file.id !== id))

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      <Attachments aria-label="Attachments">
        {files.map((file) => (
          <Attachment key={file.id}>
            <AttachmentPreview extension={file.extension} color={file.color}>
              {file.art ? <Artwork seed="Poster sketch" palette="sunset" /> : undefined}
            </AttachmentPreview>
            <AttachmentName>{file.name}</AttachmentName>
            <AttachmentMeta>{file.meta}</AttachmentMeta>
            <AttachmentRemove onClick={() => remove(file.id)} />
          </Attachment>
        ))}
        <Attachment state="uploading" progress={64}>
          <AttachmentPreview extension="pdf" color="red" />
          <AttachmentName>Site map.pdf</AttachmentName>
          <AttachmentMeta>Uploading · 12 of 19 MB</AttachmentMeta>
          <AttachmentRemove aria-label="Cancel upload of" />
        </Attachment>
        <Attachment state="error">
          <AttachmentPreview extension="mov" color="indigo" />
          <AttachmentName>Parade walkthrough.mov</AttachmentName>
          <AttachmentMeta>Too large to upload</AttachmentMeta>
          <AttachmentRemove />
        </Attachment>
      </Attachments>
    </div>
  )
}
