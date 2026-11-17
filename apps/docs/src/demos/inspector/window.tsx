"use client"

import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview, Attachments } from "macbetter/attachment"
import { Button } from "macbetter/button"
import {
  Inspector,
  InspectorBody,
  InspectorClose,
  InspectorHeader,
  InspectorSection,
  InspectorSectionTitle,
  InspectorTitle,
} from "macbetter/inspector"
import { Toolbar, ToolbarButton } from "macbetter/toolbar"
import {
  Window,
  WindowBody,
  WindowTitle,
  WindowTitlebar,
  WindowTitlebarTrailing,
  WindowTrafficLights,
} from "macbetter/window"
import { PanelRightIcon, PlusIcon } from "lucide-react"
import { useState } from "react"

const outputs = [
  { name: "Harbor festival poster", kind: "Image", art: "Harbor festival poster" },
  { name: "Poster, square crop", kind: "Image", art: "Poster square crop" },
  { name: "Launch brief", kind: "Document", extension: "md" },
]

const sources = [
  { name: "visitor-survey-2025.csv", kind: "CSV · 84 KB", extension: "csv", color: "green" as const },
  { name: "brand-guidelines.pdf", kind: "PDF · 3.1 MB", extension: "pdf", color: "red" as const },
]

export default function Example() {
  const [open, setOpen] = useState(true)
  return (
    <Window aria-label="Harbor festival" style={{ maxWidth: 820, height: 440 }}>
      <WindowTitlebar>
        <WindowTrafficLights />
        <WindowTitle subtitle="3 outputs · 2 sources">Harbor festival</WindowTitle>
        <WindowTitlebarTrailing>
          <Toolbar aria-label="View">
            <ToolbarButton
              aria-label={open ? "Hide Inspector" : "Show Inspector"}
              aria-pressed={open}
              onClick={() => setOpen(!open)}
            >
              <PanelRightIcon aria-hidden="true" />
            </ToolbarButton>
          </Toolbar>
        </WindowTitlebarTrailing>
      </WindowTitlebar>
      <WindowBody style={{ padding: "28px 32px" }}>
        <h1 className="mb-text-title-2" style={{ margin: "0 0 8px" }}>
          Poster for the harbor festival
        </h1>
        <p className="mb-text-body mb-label-secondary" style={{ margin: "0 0 12px", maxWidth: 460 }}>
          Three drafts so far. The square crop is for the ticket page; the full poster goes to print on Friday.
        </p>
        <p className="mb-text-body" style={{ margin: 0, maxWidth: 460 }}>
          The survey says most visitors come for the evening lantern parade, so the poster leads with it and the
          dates sit under the title.
        </p>
      </WindowBody>
      {open ? (
        <Inspector>
          <InspectorHeader>
            <InspectorTitle>Details</InspectorTitle>
            <InspectorClose onClick={() => setOpen(false)} />
          </InspectorHeader>
          <InspectorBody>
            <InspectorSection>
              <InspectorSectionTitle
                action={
                  <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Add Output">
                    <PlusIcon aria-hidden="true" />
                  </Button>
                }
              >
                Outputs
              </InspectorSectionTitle>
              <Attachments layout="column" aria-label="Outputs">
                {outputs.map((output) => (
                  <Attachment key={output.name} variant="row">
                    <AttachmentPreview extension={output.extension}>
                      {output.art ? <Artwork seed={output.art} palette="sunset" /> : undefined}
                    </AttachmentPreview>
                    <AttachmentName render={<button type="button" />}>{output.name}</AttachmentName>
                    <AttachmentMeta>{output.kind}</AttachmentMeta>
                  </Attachment>
                ))}
              </Attachments>
              <Button variant="plain" size="sm">
                Show 11 more
              </Button>
            </InspectorSection>
            <InspectorSection>
              <InspectorSectionTitle
                action={
                  <Button variant="plain" tone="neutral" size="sm" shape="circle" aria-label="Add Source">
                    <PlusIcon aria-hidden="true" />
                  </Button>
                }
              >
                Sources
              </InspectorSectionTitle>
              <Attachments layout="column" aria-label="Sources">
                {sources.map((source) => (
                  <Attachment key={source.name} variant="row">
                    <AttachmentPreview extension={source.extension} color={source.color} />
                    <AttachmentName render={<button type="button" />}>{source.name}</AttachmentName>
                    <AttachmentMeta>{source.kind}</AttachmentMeta>
                  </Attachment>
                ))}
              </Attachments>
            </InspectorSection>
          </InspectorBody>
        </Inspector>
      ) : null}
    </Window>
  )
}
