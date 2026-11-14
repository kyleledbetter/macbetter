import { Checkbox, CheckboxGroup } from "macbetter/checkbox"

const folders = [
  { value: "desktop", label: "Desktop" },
  { value: "documents", label: "Documents" },
  { value: "downloads", label: "Downloads" },
  { value: "pictures", label: "Pictures" },
]

export default function Example() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      <span id="sync-folders" style={{ font: "var(--mb-text-headline)" }}>
        Sync these folders
      </span>
      <CheckboxGroup aria-labelledby="sync-folders" defaultValue={["desktop", "documents"]}>
        {folders.map((folder) => (
          <Checkbox key={folder.value} value={folder.value}>
            {folder.label}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </div>
  )
}
