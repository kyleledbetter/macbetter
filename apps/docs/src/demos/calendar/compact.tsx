import { Calendar } from "@dreambase/stardust/calendar"

export default function Example() {
  return <Calendar size="sm" aria-label="Go to date" defaultValue="2026-11-18" unavailable={{ weekday: [0, 6] }} />
}
