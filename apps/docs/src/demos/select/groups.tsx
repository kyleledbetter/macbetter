import {
  Select,
  SelectContent,
  SelectGroup,
  SelectGroupLabel,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  type ListData,
} from "@dreambase/stardust/select"
import { Fragment } from "react"

const families = [
  {
    label: "Sans Serif",
    fonts: [
      { value: "sf-pro", label: "SF Pro" },
      { value: "helvetica", label: "Helvetica Neue" },
      { value: "avenir", label: "Avenir Next" },
    ],
  },
  {
    label: "Serif",
    fonts: [
      { value: "new-york", label: "New York" },
      { value: "georgia", label: "Georgia" },
    ],
  },
  {
    label: "Monospaced",
    fonts: [
      { value: "sf-mono", label: "SF Mono" },
      { value: "menlo", label: "Menlo" },
    ],
  },
]

// Labels on the root let the button show "New York" before the menu has ever opened.
const items: ListData = families.map((family) => ({ type: "group", label: family.label, items: family.fonts }))

export default function Example() {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center", gap: 10 }}>
      <Select items={items} defaultValue="new-york">
        <SelectLabel>Font</SelectLabel>
        <SelectTrigger style={{ width: 180 }} />
        <SelectContent alignItemWithTrigger={false}>
          {families.map((family, index) => (
            <Fragment key={family.label}>
              {index > 0 ? <SelectSeparator /> : null}
              <SelectGroup>
                <SelectGroupLabel>{family.label}</SelectGroupLabel>
                {family.fonts.map((font) => (
                  <SelectItem key={font.value} value={font.value}>
                    {font.label}
                  </SelectItem>
                ))}
              </SelectGroup>
            </Fragment>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
