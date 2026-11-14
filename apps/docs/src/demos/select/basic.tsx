import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "macbetter/select"

const options = [
  { value: "automatic", label: "Automatically based on input" },
  { value: "when-scrolling", label: "When scrolling" },
  { value: "always", label: "Always" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <Select items={options} defaultValue="when-scrolling">
        <SelectLabel>Show scroll bars</SelectLabel>
        <SelectTrigger style={{ width: 260 }} />
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
