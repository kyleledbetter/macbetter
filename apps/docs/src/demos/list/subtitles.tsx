import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowSubtitle,
  ListRowTitle,
  ListSection,
} from "macbetter/list"
import { AtSignIcon, CloudIcon, MailIcon } from "lucide-react"

export default function Example() {
  return (
    <List style={{ width: "100%", maxWidth: 560, marginInline: "auto" }}>
      <ListSection header="Accounts">
        <ListRow href="#icloud">
          <ListRowIcon color="cyan">
            <CloudIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>iCloud</ListRowTitle>
          <ListRowSubtitle>Mail, Contacts, Calendars, Notes</ListRowSubtitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#work">
          <ListRowIcon color="indigo">
            <MailIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Macbetter</ListRowTitle>
          <ListRowSubtitle>Mail, Calendars</ListRowSubtitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
        <ListRow href="#personal">
          <ListRowIcon color="accent">
            <AtSignIcon aria-hidden="true" />
          </ListRowIcon>
          <ListRowTitle>Personal</ListRowTitle>
          <ListRowSubtitle>Mail</ListRowSubtitle>
          <ListRowAccessory type="disclosure" />
        </ListRow>
      </ListSection>
    </List>
  )
}
