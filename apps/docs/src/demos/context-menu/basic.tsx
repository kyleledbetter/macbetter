"use client"

import { ContextMenu, ContextMenuContent, ContextMenuTrigger } from "macbetter/context-menu"
import {
  MenuItem,
  MenuItemIcon,
  MenuSeparator,
  MenuSub,
  MenuSubContent,
  MenuSubTrigger,
} from "macbetter/menu"
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
          background: "var(--mb-bg-elevated)",
          boxShadow: "var(--mb-shadow-2)",
          display: "grid",
          gap: 4,
        }}
      >
        <strong style={{ font: "var(--mb-text-headline)" }}>Weekend trip</strong>
        <span style={{ color: "var(--mb-label-secondary)" }}>Pack the tent, book the ferry, and check the tide times.</span>
        <span style={{ color: "var(--mb-label-tertiary)", font: "var(--mb-text-footnote)" }}>
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
