import { Listbox, ListboxItem } from "@dreambase/stardust/listbox"

export default function Example() {
  return (
    <div style={{ display: "grid", gap: 6, width: 240 }}>
      <span id="browser-label">Default web browser</span>
      <Listbox aria-labelledby="browser-label" defaultValue="safari">
        <ListboxItem value="safari">Safari</ListboxItem>
        <ListboxItem value="firefox">Firefox</ListboxItem>
        <ListboxItem value="chrome">Chrome</ListboxItem>
        <ListboxItem value="arc">Arc</ListboxItem>
      </Listbox>
    </div>
  )
}
