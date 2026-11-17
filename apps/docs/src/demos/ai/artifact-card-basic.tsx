"use client"

import {
  ArtifactCard,
  ArtifactCardAction,
  ArtifactCardActions,
  ArtifactCardIcon,
  ArtifactCardMeta,
  ArtifactCardTitle,
} from "macbetter/artifact-card"
import { DownloadIcon, ExternalLinkIcon, PresentationIcon, SheetIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 560 }}>
      <ArtifactCard>
        <ArtifactCardIcon color="orange">
          <PresentationIcon />
        </ArtifactCardIcon>
        <ArtifactCardTitle render={<a href="#quarterly-review" />}>Quarterly review deck</ArtifactCardTitle>
        <ArtifactCardMeta>Slides · Only you</ArtifactCardMeta>
        <ArtifactCardActions>
          <ArtifactCardAction label="Download">
            <DownloadIcon aria-hidden="true" />
          </ArtifactCardAction>
          <ArtifactCardAction label="Open in new window">
            <ExternalLinkIcon aria-hidden="true" />
          </ArtifactCardAction>
        </ArtifactCardActions>
      </ArtifactCard>
      <ArtifactCard render={<a href="#trip-budget" />}>
        <ArtifactCardIcon color="green">
          <SheetIcon />
        </ArtifactCardIcon>
        <ArtifactCardTitle>Lisbon offsite budget</ArtifactCardTitle>
        <ArtifactCardMeta>Spreadsheet · Shared with Design</ArtifactCardMeta>
      </ArtifactCard>
    </div>
  )
}
