"use client"

import {
  Menu,
  MenuContent,
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
  MenuTrigger,
} from "@dreambase/stardust/menu"
import {
  CopyIcon,
  FolderIcon,
  LinkIcon,
  MailIcon,
  MessageCircleIcon,
  PrinterIcon,
  TrashIcon,
} from "lucide-react"

export default function Example() {
  return (
    <Menu presentation="auto" onAction={(value) => console.log(value)}>
      <MenuTrigger>Share Photo</MenuTrigger>
      <MenuContent>
        <MenuItem value="copy">
          <MenuItemIcon>
            <CopyIcon />
          </MenuItemIcon>
          Copy
        </MenuItem>
        <MenuItem value="copy-link">
          <MenuItemIcon>
            <LinkIcon />
          </MenuItemIcon>
          Copy Link
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="messages">
          <MenuItemIcon>
            <MessageCircleIcon />
          </MenuItemIcon>
          Send in Messages
        </MenuItem>
        <MenuItem value="mail">
          <MenuItemIcon>
            <MailIcon />
          </MenuItemIcon>
          Send by Mail
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <MenuItemIcon>
              <FolderIcon />
            </MenuItemIcon>
            Add to Album
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="album-favorites">Favorites</MenuItem>
            <MenuItem value="album-trips">Trips</MenuItem>
            <MenuItem value="album-family">Family</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuItem value="print">
          <MenuItemIcon>
            <PrinterIcon />
          </MenuItemIcon>
          Print
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete" destructive>
          <MenuItemIcon>
            <TrashIcon />
          </MenuItemIcon>
          Delete Photo
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
