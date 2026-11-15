"use client"

import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { ArchiveIcon, FileIcon, InboxIcon, SendIcon, StarIcon, Trash2Icon, FolderIcon } from "lucide-react"
import { useState } from "react"

const mailboxes = [
  { name: "Inbox", icon: InboxIcon, count: 12 },
  { name: "VIP", icon: StarIcon },
  { name: "Drafts", icon: FileIcon, count: 2 },
  { name: "Sent", icon: SendIcon },
  { name: "Archive", icon: ArchiveIcon },
  { name: "Trash", icon: Trash2Icon },
]

const folders = ["Customers", "Investors", "Receipts"]

export default function Example() {
  const [current, setCurrent] = useState("Inbox")

  return (
    <Sidebar
      aria-label="Mailboxes"
      style={{ width: 260, height: 420, borderRadius: 16, boxShadow: "var(--mb-glass-rim), var(--mb-shadow-menu)" }}
    >
      <SidebarSection title="Favorites">
        {mailboxes.map(({ name, icon: Icon, count }) => (
          <SidebarItem
            key={name}
            icon={<Icon />}
            badge={count}
            current={current === name}
            onClick={() => setCurrent(name)}
          >
            {name}
          </SidebarItem>
        ))}
      </SidebarSection>
      <SidebarSection title="macbetter" collapsible>
        {folders.map((name) => (
          <SidebarItem key={name} icon={<FolderIcon />} current={current === name} onClick={() => setCurrent(name)}>
            {name}
          </SidebarItem>
        ))}
      </SidebarSection>
    </Sidebar>
  )
}
