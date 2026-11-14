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

const languages = [
  "Čeština",
  "Dansk",
  "Deutsch",
  "English",
  "Español",
  "Français",
  "Italiano",
  "Nederlands",
  "Norsk",
  "Polski",
  "Português",
  "Suomi",
  "Svenska",
  "Türkçe",
]

export default function Example() {
  return (
    <Combobox defaultValue="English" presentation="auto">
      <div style={{ display: "grid", gap: 6 }}>
        <ComboboxLabel>Preferred language</ComboboxLabel>
        <ComboboxControl>
          <ComboboxInput placeholder="Search languages" />
          <ComboboxTrigger aria-label="Show languages" />
        </ComboboxControl>
      </div>
      <ComboboxContent>
        <ComboboxEmpty>No matching languages</ComboboxEmpty>
        <ComboboxList>
          {languages.map((language) => (
            <ComboboxItem key={language} value={language}>
              {language}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}
