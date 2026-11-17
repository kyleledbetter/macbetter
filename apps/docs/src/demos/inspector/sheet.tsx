"use client"

import { Artwork } from "macbetter/artwork"
import { Attachment, AttachmentMeta, AttachmentName, AttachmentPreview, Attachments } from "macbetter/attachment"
import { Button } from "macbetter/button"
import { Inspector, InspectorBody, InspectorSection, InspectorSectionTitle } from "macbetter/inspector"
import { Sheet, SheetBody, SheetClose, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "macbetter/sheet"
import { InfoIcon, PlusIcon } from "lucide-react"

export default function Example() {
  return (
    <Sheet detents={["medium", "large"]}>
      <SheetTrigger render={<Button />}>
        <InfoIcon aria-hidden="true" />
        Details
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Details</SheetTitle>
          <SheetClose variant="primary">Done</SheetClose>
        </SheetHeader>
        <SheetBody>
          <Inspector aria-label="Details">
            <InspectorBody>
              <InspectorSection>
                <InspectorSectionTitle
                  action={
                    <Button variant="plain" size="sm" shape="circle" aria-label="Add Output">
                      <PlusIcon aria-hidden="true" />
                    </Button>
                  }
                >
                  Outputs
                </InspectorSectionTitle>
                <Attachments layout="column" aria-label="Outputs">
                  <Attachment variant="row">
                    <AttachmentPreview>
                      <Artwork seed="Harbor festival poster" palette="sunset" />
                    </AttachmentPreview>
                    <AttachmentName>Harbor festival poster</AttachmentName>
                    <AttachmentMeta>Image</AttachmentMeta>
                  </Attachment>
                  <Attachment variant="row">
                    <AttachmentPreview extension="md" />
                    <AttachmentName>Launch brief</AttachmentName>
                    <AttachmentMeta>Document</AttachmentMeta>
                  </Attachment>
                </Attachments>
              </InspectorSection>
              <InspectorSection>
                <InspectorSectionTitle>Sources</InspectorSectionTitle>
                <Attachments layout="column" aria-label="Sources">
                  <Attachment variant="row">
                    <AttachmentPreview extension="csv" color="green" />
                    <AttachmentName>visitor-survey-2025.csv</AttachmentName>
                    <AttachmentMeta>CSV · 84 KB</AttachmentMeta>
                  </Attachment>
                </Attachments>
              </InspectorSection>
            </InspectorBody>
          </Inspector>
        </SheetBody>
      </SheetContent>
    </Sheet>
  )
}
