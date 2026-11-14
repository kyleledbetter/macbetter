"use client"

import { MenuBar, MenuBarContent, MenuBarTrigger } from "@dreambase/stardust/menu-bar"
import {
  Menu,
  MenuCheckboxItem,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@dreambase/stardust/menu"

export default function Example() {
  return (
    <MenuBar aria-label="Notes">
      <Menu>
        <MenuBarTrigger app>Notes</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="about">About Notes</MenuItem>
          <MenuSeparator />
          <MenuItem value="settings" shortcut="mod+,">
            Settings…
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="hide" shortcut="mod+h">
            Hide Notes
          </MenuItem>
          <MenuItem value="quit" shortcut="mod+q">
            Quit Notes
          </MenuItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>File</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="new-note" shortcut="mod+n">
            New Note
          </MenuItem>
          <MenuItem value="new-folder" shortcut="mod+shift+n">
            New Folder
          </MenuItem>
          <MenuSub>
            <MenuSubTrigger>Open Recent</MenuSubTrigger>
            <MenuSubContent>
              <MenuItem value="recent-trip">Weekend trip</MenuItem>
              <MenuItem value="recent-groceries">Groceries</MenuItem>
              <MenuItem value="recent-ideas">Gift ideas</MenuItem>
            </MenuSubContent>
          </MenuSub>
          <MenuSeparator />
          <MenuItem value="close" shortcut="mod+w">
            Close
          </MenuItem>
          <MenuItem value="print" shortcut="mod+p">
            Print…
          </MenuItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>Edit</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="undo" shortcut="mod+z">
            Undo Typing
          </MenuItem>
          <MenuItem value="redo" shortcut="mod+shift+z" disabled>
            Redo
          </MenuItem>
          <MenuSeparator />
          <MenuItem value="cut" shortcut="mod+x">
            Cut
          </MenuItem>
          <MenuItem value="copy" shortcut="mod+c">
            Copy
          </MenuItem>
          <MenuItem value="paste" shortcut="mod+v">
            Paste
          </MenuItem>
          <MenuItem value="select-all" shortcut="mod+a">
            Select All
          </MenuItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>View</MenuBarTrigger>
        <MenuBarContent>
          <MenuRadioGroup name="layout" defaultValue="list">
            <MenuRadioItem value="list">as List</MenuRadioItem>
            <MenuRadioItem value="gallery">as Gallery</MenuRadioItem>
          </MenuRadioGroup>
          <MenuSeparator />
          <MenuCheckboxItem value="folders" defaultChecked>
            Show Folders
          </MenuCheckboxItem>
          <MenuCheckboxItem value="note-count">Show Note Count</MenuCheckboxItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>Window</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="minimize" shortcut="mod+m">
            Minimize
          </MenuItem>
          <MenuItem value="zoom">Zoom</MenuItem>
        </MenuBarContent>
      </Menu>
      <Menu>
        <MenuBarTrigger>Help</MenuBarTrigger>
        <MenuBarContent>
          <MenuItem value="help">Notes Help</MenuItem>
        </MenuBarContent>
      </Menu>
    </MenuBar>
  )
}
