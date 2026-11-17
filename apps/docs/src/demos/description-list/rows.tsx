import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"

export default function Example() {
  return (
    <div style={{ width: "100%", maxWidth: 420 }}>
      <DescriptionList>
        <DescriptionItem>
          <DescriptionTerm>Id</DescriptionTerm>
          <DescriptionDetails mono>call_01JD8Q4ZK7M2X9VH3RT6WYB5NC</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Type</DescriptionTerm>
          <DescriptionDetails>Function call</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Name</DescriptionTerm>
          <DescriptionDetails mono>search_calendar</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Status</DescriptionTerm>
          <DescriptionDetails>Completed in 1.2 seconds</DescriptionDetails>
        </DescriptionItem>
        <DescriptionItem>
          <DescriptionTerm>Result</DescriptionTerm>
          <DescriptionDetails>
            Found 3 events between June 2 and June 6, including the design review moved to Thursday at 2:00 PM.
          </DescriptionDetails>
        </DescriptionItem>
      </DescriptionList>
    </div>
  )
}
