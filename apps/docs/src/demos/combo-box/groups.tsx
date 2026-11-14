import {
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxGroupLabel,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from "macbetter/combo-box"
import { Fragment } from "react"

const regions = [
  {
    label: "Americas",
    cities: [
      { value: "America/New_York", label: "New York" },
      { value: "America/Chicago", label: "Chicago" },
      { value: "America/Los_Angeles", label: "Los Angeles" },
    ],
  },
  {
    label: "Europe",
    cities: [
      { value: "Europe/London", label: "London" },
      { value: "Europe/Paris", label: "Paris" },
      { value: "Europe/Berlin", label: "Berlin" },
    ],
  },
  {
    label: "Asia and Pacific",
    cities: [
      { value: "Asia/Tokyo", label: "Tokyo" },
      { value: "Asia/Singapore", label: "Singapore" },
      { value: "Australia/Sydney", label: "Sydney" },
    ],
  },
]

export default function Example() {
  return (
    <Combobox defaultValue="Europe/Paris">
      <div style={{ display: "grid", gap: 6 }}>
        <ComboboxLabel>Closest city</ComboboxLabel>
        <ComboboxControl>
          <ComboboxInput placeholder="Search cities" />
          <ComboboxClear aria-label="Clear city" />
          <ComboboxTrigger aria-label="Show cities" />
        </ComboboxControl>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No matching cities</ComboboxEmpty>
        <ComboboxList>
          {regions.map((region, index) => (
            <Fragment key={region.label}>
              {index > 0 ? <ComboboxSeparator /> : null}
              <ComboboxGroup>
                <ComboboxGroupLabel>{region.label}</ComboboxGroupLabel>
                {region.cities.map((city) => (
                  <ComboboxItem key={city.value} value={city.value} label={city.label}>
                    {city.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </Fragment>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
