import { Select, SelectContent, SelectItem, SelectLabel, SelectTrigger } from "macbetter/select"

const sorts = [
  { value: "date", label: "Date" },
  { value: "name", label: "Name" },
  { value: "size", label: "Size" },
  { value: "kind", label: "Kind" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, whiteSpace: "nowrap" }}>
      <Select items={sorts} defaultValue="date">
        <SelectLabel>Sort by</SelectLabel>
        <SelectTrigger variant="plain" />
        <SelectContent>
          {sorts.map((sort) => (
            <SelectItem key={sort.value} value={sort.value}>
              {sort.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
