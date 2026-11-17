import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview } from "macbetter/attachment"
import { Message, MessageAttachments, MessageBubble, MessageContent, MessageMeta } from "macbetter/message"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16, width: "100%", maxWidth: 560 }}>
      <Message from="user">
        <MessageAttachments>
          <Attachment variant="chip">
            <AttachmentPreview extension="PDF" color="red" />
            <AttachmentName>Lease renewal.pdf</AttachmentName>
            <AttachmentMeta>PDF · 1.2 MB</AttachmentMeta>
          </Attachment>
        </MessageAttachments>
        <MessageContent>
          <MessageBubble variant="neutral">
            Does this renewal change the notice period? The old lease said two months.
          </MessageBubble>
        </MessageContent>
        <MessageMeta>Edited</MessageMeta>
      </Message>
      <Message from="user">
        <MessageContent>
          <MessageBubble>And is the deposit the same?</MessageBubble>
        </MessageContent>
      </Message>
    </div>
  )
}
