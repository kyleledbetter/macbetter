"use client"

import { ScrollView } from "@dreambase/stardust/scroll-view"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type TableSort,
} from "@dreambase/stardust/table"
import { FileTextIcon, FolderIcon, ImageIcon, SheetIcon } from "lucide-react"
import { useMemo, useState } from "react"

const files = [
  { id: "q4", name: "Q4 Planning", kind: "Folder", modified: "2026-11-12T09:14", size: null, icon: FolderIcon },
  { id: "brand", name: "Brand Guidelines.pdf", kind: "PDF document", modified: "2026-11-10T16:40", size: 8_412_000, icon: FileTextIcon },
  { id: "budget", name: "Budget 2027.numbers", kind: "Numbers spreadsheet", modified: "2026-11-09T11:02", size: 212_000, icon: SheetIcon },
  { id: "hero", name: "Hero Shot.heic", kind: "HEIC image", modified: "2026-11-03T18:21", size: 3_204_000, icon: ImageIcon },
  { id: "notes", name: "Meeting Notes.md", kind: "Markdown text", modified: "2026-10-28T08:47", size: 4_100, icon: FileTextIcon },
  { id: "logo", name: "Logo.svg", kind: "SVG image", modified: "2026-10-21T13:30", size: 18_200, icon: ImageIcon },
  { id: "roadmap", name: "Roadmap.key", kind: "Keynote presentation", modified: "2026-10-14T10:05", size: 24_800_000, icon: FileTextIcon },
  { id: "invoices", name: "Invoices", kind: "Folder", modified: "2026-09-30T15:12", size: null, icon: FolderIcon },
  { id: "contract", name: "Contract — Signed.pdf", kind: "PDF document", modified: "2026-09-18T12:00", size: 640_000, icon: FileTextIcon },
]

const bytes = new Intl.NumberFormat("en", { notation: "compact", style: "unit", unit: "byte", unitDisplay: "narrow" })
const date = new Intl.DateTimeFormat("en", { dateStyle: "medium", timeStyle: "short" })

export default function Example() {
  const [sort, setSort] = useState<TableSort>({ column: "modified", direction: "descending" })
  const [selected, setSelected] = useState<string[]>(["brand"])

  const rows = useMemo(() => {
    const key = sort.column as "name" | "modified" | "size"
    const sorted = [...files].sort((a, b) => {
      const x = a[key] ?? -1
      const y = b[key] ?? -1
      return x < y ? -1 : x > y ? 1 : 0
    })
    return sort.direction === "ascending" ? sorted : sorted.reverse()
  }, [sort])

  return (
    <ScrollView variant="bordered" orientation="both" style={{ width: "100%", maxWidth: 680, height: 220 }}>
      <Table
        aria-label="Documents"
        selectionMode="multiple"
        value={selected}
        onValueChange={setSelected}
        sort={sort}
        onSortChange={setSort}
        alternating
      >
        <TableHeader>
          <TableColumn value="name">Name</TableColumn>
          <TableColumn value="modified">Date Modified</TableColumn>
          <TableColumn value="size" align="end">
            Size
          </TableColumn>
          <TableColumn>Kind</TableColumn>
        </TableHeader>
        <TableBody>
          {rows.map((file) => (
            <TableRow key={file.id} value={file.id}>
              <TableCell>
                <file.icon aria-hidden="true" />
                {file.name}
              </TableCell>
              <TableCell secondary>{date.format(new Date(file.modified))}</TableCell>
              <TableCell secondary align="end">
                {file.size === null ? "--" : bytes.format(file.size)}
              </TableCell>
              <TableCell secondary>{file.kind}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </ScrollView>
  )
}
