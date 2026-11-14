"use client"

import {
  Outline,
  OutlineGroup,
  OutlineItem,
  OutlineItemDetail,
  OutlineItemIcon,
  OutlineItemLabel,
  OutlineItemText,
} from "macbetter/outline"
import { FileTextIcon, FolderIcon, ImageIcon, PresentationIcon, SheetIcon } from "lucide-react"

type Node = { value: string; name: string; detail: string; kind: "folder" | "doc" | "image" | "sheet" | "deck"; children?: Node[] }

const files: Node[] = [
  {
    value: "projects",
    name: "Projects",
    detail: "12 items",
    kind: "folder",
    children: [
      {
        value: "projects/macbetter",
        name: "Macbetter",
        detail: "4 items",
        kind: "folder",
        children: [
          { value: "projects/macbetter/spec", name: "Design Spec.pdf", detail: "2.4 MB", kind: "doc" },
          { value: "projects/macbetter/icons", name: "App Icons.png", detail: "860 KB", kind: "image" },
          { value: "projects/macbetter/launch", name: "Launch Plan.key", detail: "18 MB", kind: "deck" },
        ],
      },
      { value: "projects/budget", name: "Budget 2027.numbers", detail: "212 KB", kind: "sheet" },
    ],
  },
  {
    value: "photos",
    name: "Photos",
    detail: "3 items",
    kind: "folder",
    children: [
      { value: "photos/offsite", name: "Team Offsite.heic", detail: "3.2 MB", kind: "image" },
      { value: "photos/headshot", name: "Headshot.jpg", detail: "1.1 MB", kind: "image" },
    ],
  },
  { value: "notes", name: "Meeting Notes.md", detail: "4 KB", kind: "doc" },
  { value: "contract", name: "Contract — Signed.pdf", detail: "640 KB", kind: "doc" },
]

const icons = { folder: FolderIcon, doc: FileTextIcon, image: ImageIcon, sheet: SheetIcon, deck: PresentationIcon }

function Items({ items }: { items: Node[] }) {
  return items.map((item) => {
    const Icon = icons[item.kind]
    return (
      <OutlineItem key={item.value} value={item.value} label={item.name}>
        <OutlineItemLabel>
          <OutlineItemIcon>
            <Icon aria-hidden="true" />
          </OutlineItemIcon>
          <OutlineItemText>{item.name}</OutlineItemText>
          <OutlineItemDetail>{item.detail}</OutlineItemDetail>
        </OutlineItemLabel>
        {item.children ? (
          <OutlineGroup>
            <Items items={item.children} />
          </OutlineGroup>
        ) : null}
      </OutlineItem>
    )
  })
}

export default function Example() {
  return (
    <Outline
      aria-label="Documents"
      defaultExpanded={["projects", "projects/macbetter"]}
      defaultValue="projects/macbetter/spec"
      style={{ width: "100%", maxWidth: 520 }}
    >
      <Items items={files} />
    </Outline>
  )
}
