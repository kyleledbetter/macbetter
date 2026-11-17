"use client"

import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview, Attachments } from "macbetter/attachment"
import { Button } from "macbetter/button"
import { InspectorSection, InspectorSectionTitle } from "macbetter/inspector"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { outputs, sourceFiles } from "./data"

function AddButton({ label }: { label: string }) {
  return (
    <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label={label}>
      <PlusIcon aria-hidden="true" />
    </Button>
  )
}

/** The conversation's outputs and sources: the Mac's inspector, and a sheet on iPhone. */
function ChatDetails() {
  const [all, setAll] = React.useState(false)
  const more = Array.from({ length: 11 }, (_, index) => ({
    name: `Cover, option ${index + 3}.png`,
    kind: "Image",
    seed: `northfield cover extra ${index}`,
  }))
  return (
    <>
      <InspectorSection>
        <InspectorSectionTitle action={<AddButton label="Add Output" />}>Outputs</InspectorSectionTitle>
        <Attachments layout="column" aria-label="Outputs">
          {outputs.map((output) => (
            <Attachment key={output.name} variant="row">
              <AttachmentPreview>
                <Artwork seed={output.seed} palette={output.palette} />
              </AttachmentPreview>
              <AttachmentName render={<button type="button" />}>{output.name}</AttachmentName>
              <AttachmentMeta>{output.kind}</AttachmentMeta>
            </Attachment>
          ))}
          {all
            ? more.map((output) => (
                <Attachment key={output.name} variant="row">
                  <AttachmentPreview>
                    <Artwork seed={output.seed} palette="ocean" variant="aurora" />
                  </AttachmentPreview>
                  <AttachmentName render={<button type="button" />}>{output.name}</AttachmentName>
                  <AttachmentMeta>{output.kind}</AttachmentMeta>
                </Attachment>
              ))
            : null}
        </Attachments>
        <Button variant="plain" size="sm" className="ex-ai-show-more" aria-expanded={all} onClick={() => setAll(!all)}>
          {all ? "Show fewer" : `Show ${more.length} more`}
        </Button>
      </InspectorSection>
      <InspectorSection>
        <InspectorSectionTitle action={<AddButton label="Add Source" />}>Sources</InspectorSectionTitle>
        <Attachments layout="column" aria-label="Sources">
          {sourceFiles.map((file) => (
            <Attachment key={file.name} variant="row">
              <AttachmentPreview extension={file.extension} color={file.color} />
              <AttachmentName render={<button type="button" />}>{file.name}</AttachmentName>
              <AttachmentMeta>{file.meta}</AttachmentMeta>
            </Attachment>
          ))}
        </Attachments>
      </InspectorSection>
    </>
  )
}

export { ChatDetails }
