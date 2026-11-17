import { Artwork } from "macbetter/artwork"
import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"
import {
  Inspector,
  InspectorBody,
  InspectorHeader,
  InspectorSection,
  InspectorSectionTitle,
  InspectorTitle,
} from "macbetter/inspector"
import { Window, WindowBody, WindowTitle, WindowTitlebar, WindowTrafficLights } from "macbetter/window"

export default function Example() {
  return (
    <Window aria-label="Lantern parade.png" style={{ maxWidth: 820, height: 440 }}>
      <WindowTitlebar>
        <WindowTrafficLights />
        <WindowTitle>Lantern parade.png</WindowTitle>
      </WindowTitlebar>
      <WindowBody style={{ display: "grid", padding: 0 }}>
        <Artwork seed="Lantern parade" variant="bloom" palette="sunset" shape="square" />
      </WindowBody>
      <Inspector variant="floating">
        <InspectorHeader>
          <InspectorTitle>Image</InspectorTitle>
        </InspectorHeader>
        <InspectorBody>
          <InspectorSection>
            <InspectorSectionTitle>General</InspectorSectionTitle>
            <DescriptionList size="sm">
              <DescriptionItem>
                <DescriptionTerm>Kind</DescriptionTerm>
                <DescriptionDetails>PNG image</DescriptionDetails>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>Dimensions</DescriptionTerm>
                <DescriptionDetails>2048 × 1536</DescriptionDetails>
              </DescriptionItem>
              <DescriptionItem>
                <DescriptionTerm>Size</DescriptionTerm>
                <DescriptionDetails>3.8 MB</DescriptionDetails>
              </DescriptionItem>
            </DescriptionList>
          </InspectorSection>
          <InspectorSection>
            <InspectorSectionTitle>Prompt</InspectorSectionTitle>
            <p className="mb-text-callout" style={{ margin: 0 }}>
              Paper lanterns over a harbor at dusk, warm light on the water, a poster layout with room for a title.
            </p>
          </InspectorSection>
        </InspectorBody>
      </Inspector>
    </Window>
  )
}
