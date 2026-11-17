import { DescriptionDetails, DescriptionItem, DescriptionList, DescriptionTerm } from "macbetter/description-list"

const file = [
  ["Kind", "PDF document"],
  ["Size", "2.4 MB"],
  ["Created", "June 3, 2026 at 9:41 AM"],
  ["Where", "Documents › Harbor festival"],
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: 40, width: "100%", maxWidth: 640 }}>
      {(["md", "sm"] as const).map((size) => (
        <DescriptionList key={size} size={size} style={{ flex: "1 1 240px" }}>
          {file.map(([term, value]) => (
            <DescriptionItem key={term}>
              <DescriptionTerm>{term}</DescriptionTerm>
              <DescriptionDetails>{value}</DescriptionDetails>
            </DescriptionItem>
          ))}
        </DescriptionList>
      ))}
    </div>
  )
}
