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
import { ArchiveIcon, CopyIcon, FolderIcon, PencilIcon, PinIcon, ShareIcon, TrashIcon } from "lucide-react"

export default function Example() {
  return (
    <Menu onAction={(value) => console.log(value)}>
      <MenuTrigger>Note</MenuTrigger>
      <MenuContent>
        <MenuItem value="rename" shortcut="mod+r">
          <MenuItemIcon>
            <PencilIcon />
          </MenuItemIcon>
          Rename
        </MenuItem>
        <MenuItem value="duplicate" shortcut="mod+d">
          <MenuItemIcon>
            <CopyIcon />
          </MenuItemIcon>
          Duplicate
        </MenuItem>
        <MenuItem value="pin" shortcut="mod+shift+p">
          <MenuItemIcon>
            <PinIcon />
          </MenuItemIcon>
          Pin Note
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <MenuItemIcon>
              <FolderIcon />
            </MenuItemIcon>
            Move To
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="move-personal">Personal</MenuItem>
            <MenuItem value="move-work">Work</MenuItem>
            <MenuItem value="move-recipes">Recipes</MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem value="share" shortcut="mod+alt+s">
          <MenuItemIcon>
            <ShareIcon />
          </MenuItemIcon>
          Share…
        </MenuItem>
        <MenuItem value="archive" disabled>
          <MenuItemIcon>
            <ArchiveIcon />
          </MenuItemIcon>
          Archive
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete" destructive shortcut="mod+backspace">
          <MenuItemIcon>
            <TrashIcon />
          </MenuItemIcon>
          Delete
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}
