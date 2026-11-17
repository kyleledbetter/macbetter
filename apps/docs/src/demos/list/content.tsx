import { List, ListRow, ListRowContent, ListRowTitle, ListRowValue, ListSection } from "macbetter/list"
import { TextField } from "macbetter/text-field"

export default function Example() {
  return (
    <List style={{ width: "100%", maxWidth: 560, marginInline: "auto" }}>
      <ListSection header="Profile" footer="Your display name appears on shared documents.">
        <ListRow>
          <ListRowTitle>Account</ListRowTitle>
          <ListRowValue>avery@example.com</ListRowValue>
        </ListRow>
        <ListRow>
          <ListRowContent>
            <TextField aria-label="Display name" defaultValue="Avery Chen" placeholder="Display name" />
          </ListRowContent>
        </ListRow>
      </ListSection>
    </List>
  )
}
