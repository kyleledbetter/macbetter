import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteLabel,
  AutocompleteList,
  ComboboxControl,
} from "@dreambase/stardust/combo-box"

const destinations = ["Lisbon", "Lima", "Lyon", "Ljubljana", "Los Angeles", "Luang Prabang"]

export default function Example() {
  return (
    <Autocomplete>
      <div style={{ display: "grid", gap: 6 }}>
        <AutocompleteLabel>Destination</AutocompleteLabel>
        <ComboboxControl>
          <AutocompleteInput placeholder="Where to?" />
        </ComboboxControl>
      </div>
      <AutocompleteContent>
        <AutocompleteList>
          {destinations.map((city) => (
            <AutocompleteItem key={city} value={city}>
              {city}
            </AutocompleteItem>
          ))}
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
}
