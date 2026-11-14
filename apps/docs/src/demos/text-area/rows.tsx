import { TextArea } from "macbetter/text-area"

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 340 }}>
      <TextArea
        aria-label="Reply"
        minRows={1}
        maxRows={4}
        placeholder="Reply to Hollis…"
        submitShortcut="enter"
      />
      <TextArea
        aria-label="Description"
        minRows={4}
        defaultValue="Weekly revenue by region, refreshed every morning from the warehouse."
      />
    </div>
  )
}
