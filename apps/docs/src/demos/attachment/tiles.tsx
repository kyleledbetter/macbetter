import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview, Attachments } from "macbetter/attachment"

export default function Example() {
  return (
    <Attachments aria-label="Files in this project" style={{ maxWidth: 600 }}>
      <Attachment variant="tile">
        <AttachmentPreview>
          <Artwork seed="Lantern parade" variant="bloom" palette="sunset" />
        </AttachmentPreview>
        <AttachmentName>Lantern parade.png</AttachmentName>
        <AttachmentMeta>Image · 3.8 MB</AttachmentMeta>
      </Attachment>
      <Attachment variant="tile">
        <AttachmentPreview extension="pdf" color="red" />
        <AttachmentName>Festival brief.pdf</AttachmentName>
        <AttachmentMeta>PDF · 2.4 MB</AttachmentMeta>
      </Attachment>
      <Attachment variant="tile">
        <AttachmentPreview extension="csv" color="green" />
        <AttachmentName>visitor-survey-2025.csv</AttachmentName>
        <AttachmentMeta>CSV · 84 KB</AttachmentMeta>
      </Attachment>
      <Attachment variant="tile" state="uploading">
        <AttachmentPreview extension="zip" color="gray" />
        <AttachmentName>Print files.zip</AttachmentName>
        <AttachmentMeta>Uploading…</AttachmentMeta>
      </Attachment>
    </Attachments>
  )
}
