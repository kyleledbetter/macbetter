import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "@dreambase/stardust/select"

const repeats = [
  { value: "never", label: "Never" },
  { value: "daily", label: "Every Day" },
  { value: "weekdays", label: "Every Weekday" },
  { value: "weekly", label: "Every Week" },
  { value: "monthly", label: "Every Month" },
  { value: "yearly", label: "Every Year" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <Select items={repeats} defaultValue="weekly" presentation="auto">
        <SelectLabel>Repeat</SelectLabel>
        <SelectTrigger />
        <SelectContent>
          {repeats.map((repeat) => (
            <SelectItem key={repeat.value} value={repeat.value}>
              {repeat.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
