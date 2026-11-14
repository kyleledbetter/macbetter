import { Calendar } from "macbetter/calendar"

export default function Example() {
  return (
    <Calendar
      aria-label="Report period"
      mode="range"
      months={2}
      defaultValue={["2026-11-09", "2026-11-19"]}
    />
  )
}
