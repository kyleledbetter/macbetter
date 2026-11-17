import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 360 }}>
      <DescriptionList layout="stacked">
        <DescriptionItem>
          <DescriptionTerm>Connection id</DescriptionTerm>
          <DescriptionDetails mono>conn_7f3a9e21c4b84d0f</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Context</DescriptionTerm>
          <DescriptionDetails>Team calendar, read only</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Query</DescriptionTerm>
          <DescriptionDetails>Meetings with the design team next week</DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  )
}
