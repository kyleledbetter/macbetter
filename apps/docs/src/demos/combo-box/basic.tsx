import {
  Combobox,
  ComboboxContent,
  ComboboxControl,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxTrigger,
} from "macbetter/combo-box"

const sizes = ["9", "10", "11", "12", "13", "14", "18", "24", "36", "48", "64"]

export default function Example() {
  return (
    <Combobox defaultValue="13">
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <ComboboxLabel>Font size</ComboboxLabel>
        <ComboboxControl style={{ width: 120 }}>
          <ComboboxInput placeholder="Size" />
          <ComboboxTrigger aria-label="Show font sizes" />
        </ComboboxControl>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No matching sizes</ComboboxEmpty>
        <ComboboxList>
          {sizes.map((size) => (
            <ComboboxItem key={size} value={size} label={size}>
              {size}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
