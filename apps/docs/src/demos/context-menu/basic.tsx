"use client"

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "@dreambase/stardust/context-menu"
import {
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "@dreambase/stardust/menu"
import { CopyIcon, LinkIcon, MailIcon, MessageCircleIcon, PinIcon, ShareIcon, TrashIcon } from "lucide-react"

export default function Example() {
  return (
    <ContextMenu onAction={(value) => console.log(value)}>
      <ContextMenuTrigger
        tabIndex={0}
        aria-label="Weekend trip note"
        style={{
          width: 300,
          padding: 16,
          background: "var(--sd-bg-elevated)",
          boxShadow: "var(--sd-shadow-2)",
          display: "grid",
          gap: 4,
        }}
      >
        <strong style={{ font: "var(--sd-text-headline)" }}>Weekend trip</strong>
        <span style={{ color: "var(--sd-label-secondary)" }}>Pack the tent, book the ferry, and check the tide times.</span>
        <span style={{ color: "var(--sd-label-tertiary)", font: "var(--sd-text-footnote)" }}>
          Right-click or long-press the note
        </span>
      </ContextMenuTrigger>
      <ContextMenuContent>
        <MenuItem value="pin">
          <MenuItemIcon>
            <PinIcon />
          </MenuItemIcon>
          Pin Note
        </MenuItem>
        <MenuItem value="copy">
          <MenuItemIcon>
            <CopyIcon />
          </MenuItemIcon>
          Copy
        </MenuItem>
        <MenuSub>
          <MenuSubTrigger>
            <MenuItemIcon>
              <ShareIcon />
            </MenuItemIcon>
            Share
          </MenuSubTrigger>
          <MenuSubContent>
            <MenuItem value="share-messages">
              <MenuItemIcon>
                <MessageCircleIcon />
              </MenuItemIcon>
              Messages
            </MenuItem>
            <MenuItem value="share-mail">
              <MenuItemIcon>
                <MailIcon />
              </MenuItemIcon>
              Mail
            </MenuItem>
            <MenuItem value="share-link">
              <MenuItemIcon>
                <LinkIcon />
              </MenuItemIcon>
              Copy Link
            </MenuItem>
          </MenuSubContent>
        </MenuSub>
        <MenuSeparator />
        <MenuItem value="delete" destructive>
          <MenuItemIcon>
            <TrashIcon />
          </MenuItemIcon>
          Delete
        </MenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
