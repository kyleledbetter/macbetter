"use client"

import {
  Outline,
  OutlineGroup,
  OutlineItem,
  OutlineItemIcon,
  OutlineItemLabel,
  OutlineItemText,
} from "macbetter/outline"
import { FileIcon, FolderIcon } from "lucide-react"

export default function Example() {
  return (
    <Outline aria-label="Source" guides mode="multiple" defaultExpanded={["src", "src/components"]} style={{ width: "100%", maxWidth: 360 }}>
      <OutlineItem value="src">
        <OutlineItemLabel>
          <OutlineItemIcon>
            <FolderIcon aria-hidden="true" />
          </OutlineItemIcon>
          <OutlineItemText>src</OutlineItemText>
        </OutlineItemLabel>
        <OutlineGroup>
          <OutlineItem value="src/components">
            <OutlineItemLabel>
              <OutlineItemIcon>
                <FolderIcon aria-hidden="true" />
              </OutlineItemIcon>
              <OutlineItemText>components</OutlineItemText>
            </OutlineItemLabel>
            <OutlineGroup>
              <OutlineItem value="src/components/list.tsx">
                <OutlineItemLabel>
                  <OutlineItemIcon>
                    <FileIcon aria-hidden="true" />
                  </OutlineItemIcon>
                  <OutlineItemText>list.tsx</OutlineItemText>
                </OutlineItemLabel>
              </OutlineItem>
              <OutlineItem value="src/components/table.tsx">
                <OutlineItemLabel>
                  <OutlineItemIcon>
                    <FileIcon aria-hidden="true" />
                  </OutlineItemIcon>
                  <OutlineItemText>table.tsx</OutlineItemText>
                </OutlineItemLabel>
              </OutlineItem>
            </OutlineGroup>
          </OutlineItem>
          <OutlineItem value="src/index.ts">
            <OutlineItemLabel>
              <OutlineItemIcon>
                <FileIcon aria-hidden="true" />
              </OutlineItemIcon>
              <OutlineItemText>index.ts</OutlineItemText>
            </OutlineItemLabel>
          </OutlineItem>
        </OutlineGroup>
      </OutlineItem>
      <OutlineItem value="package.json">
        <OutlineItemLabel>
          <OutlineItemIcon>
            <FileIcon aria-hidden="true" />
          </OutlineItemIcon>
          <OutlineItemText>package.json</OutlineItemText>
        </OutlineItemLabel>
      </OutlineItem>
    </Outline>
  )
}
