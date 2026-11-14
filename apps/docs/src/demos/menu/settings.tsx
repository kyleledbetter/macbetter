"use client"

import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "@dreambase/stardust/menu"

export default function Example() {
  return (
    <Menu>
      <MenuTrigger>View</MenuTrigger>
      <MenuContent>
        <MenuRadioGroup name="sort" defaultValue="modified">
          <MenuGroupLabel>Sort By</MenuGroupLabel>
          <MenuRadioItem value="modified">Date Modified</MenuRadioItem>
          <MenuRadioItem value="created">Date Created</MenuRadioItem>
          <MenuRadioItem value="title">Title</MenuRadioItem>
        </MenuRadioGroup>
        <MenuSeparator />
        <MenuCheckboxItem value="group-by-date" defaultChecked>
          Group by Date
        </MenuCheckboxItem>
        <MenuCheckboxItem value="show-previews" defaultChecked>
          Show Note Previews
        </MenuCheckboxItem>
        <MenuCheckboxItem value="show-attachments">Show Attachments</MenuCheckboxItem>
      </MenuContent>
    </Menu>
  )
}
