"use client"

import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSearchField,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarTitle,
  ToolbarToggle,
} from "macbetter/toolbar"
import { Window, WindowBody, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import {
  ImageIcon,
  ListChecksIcon,
  PanelLeftIcon,
  ShareIcon,
  SquarePenIcon,
  TableIcon,
  TypeIcon,
} from "lucide-react"

export default function Example() {
  return (
    <Window aria-label="Notes" style={{ maxWidth: 720 }}>
      <WindowTitlebar>
        <WindowTrafficLights />
        <Toolbar aria-label="Note">
          <ToolbarToggle aria-label="Show Sidebar" defaultPressed>
            <PanelLeftIcon aria-hidden="true" />
          </ToolbarToggle>
          <ToolbarTitle subtitle="Edited 2 minutes ago">Launch checklist</ToolbarTitle>
          <ToolbarSpacer />
          <ToolbarGroup aria-label="Insert">
            <ToolbarButton aria-label="Format">
              <TypeIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton aria-label="Checklist">
              <ListChecksIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton aria-label="Table">
              <TableIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarButton aria-label="Attach Photo">
              <ImageIcon aria-hidden="true" />
            </ToolbarButton>
          </ToolbarGroup>
          <ToolbarSeparator />
          <ToolbarButton aria-label="Share">
            <ShareIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarButton aria-label="New Note">
            <SquarePenIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search notes" />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody style={{ padding: "20px 28px", height: 160 }}>
        <div className="mb-text-title-2">Launch checklist</div>
        <div className="mb-text-body mb-label-secondary" style={{ marginTop: 8 }}>
          Press Tab to reach the toolbar, then use the arrow keys to move between its buttons.
        </div>
      </WindowBody>
    </Window>
  )
}
