import { DatePicker, TimeField } from "macbetter/date-picker"

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span>Starts</span>
      <DatePicker variant="compact" aria-label="Start date" defaultValue="2026-11-14" />
      <TimeField aria-label="Start time" defaultValue="09:41" variant="filled" size="sm" />
    </div>
  )
}
