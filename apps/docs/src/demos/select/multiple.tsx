import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@dreambase/stardust/select"

const events = [
  { value: "mentions", label: "Mentions" },
  { value: "replies", label: "Replies" },
  { value: "reactions", label: "Reactions" },
  { value: "new-members", label: "New members" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <Select items={events} multiple defaultValue={["mentions", "replies"]} placeholder="Nothing">
        <SelectLabel>Notify me about</SelectLabel>
        <SelectTrigger style={{ width: 220 }}>
          <SelectValue maxLabels={2} />
        </SelectTrigger>
        <SelectContent>
          {events.map((event) => (
            <SelectItem key={event.value} value={event.value}>
              {event.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
