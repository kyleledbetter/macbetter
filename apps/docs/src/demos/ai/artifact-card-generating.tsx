import { ArtifactCard, ArtifactCardIcon, ArtifactCardMeta, ArtifactCardTitle } from "macbetter/artifact-card"
import { FileTextIcon, PresentationIcon } from "lucide-react"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10, width: "100%", maxWidth: 560 }}>
      <ArtifactCard state="generating">
        <ArtifactCardIcon color="orange">
          <PresentationIcon />
        </ArtifactCardIcon>
        <ArtifactCardTitle>Quarterly review deck</ArtifactCardTitle>
        <ArtifactCardMeta>Making slides…</ArtifactCardMeta>
      </ArtifactCard>
      <ArtifactCard state="generating" progress={64}>
        <ArtifactCardIcon color="blue">
          <FileTextIcon />
        </ArtifactCardIcon>
        <ArtifactCardTitle>Vendor contract summary</ArtifactCardTitle>
        <ArtifactCardMeta>Writing section 3 of 5…</ArtifactCardMeta>
      </ArtifactCard>
    </div>
  )
}
