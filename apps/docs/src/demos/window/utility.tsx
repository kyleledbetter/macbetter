"use client"

import { Field, FieldGroup, FieldLabel } from "macbetter/field"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Slider } from "macbetter/slider"
import { Switch } from "macbetter/switch"
import { Tabs, TabsList, TabsPanel, TabsTab, TabsTabIcon } from "macbetter/tabs"
import { TextField } from "macbetter/text-field"
import { Window, WindowBody, WindowTitle, WindowTitlebar } from "macbetter/window"
import { AlignCenterIcon, AlignLeftIcon, AlignRightIcon, BellIcon, LockIcon, SettingsIcon } from "lucide-react"
import { useState } from "react"

const panes = [
  { id: "general", label: "General", icon: SettingsIcon },
  { id: "notifications", label: "Notifications", icon: BellIcon },
  { id: "privacy", label: "Privacy", icon: LockIcon },
]

const settings: Record<string, string[]> = {
  general: ["Open last project on launch", "Show file extensions"],
  notifications: ["Email me when someone comments", "Daily summary at 9:00"],
  privacy: ["Share anonymous usage data", "Require password to view exports"],
}

export default function Example() {
  const [pane, setPane] = useState("general")
  const label = panes.find((p) => p.id === pane)?.label

  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "flex-start", gap: 24, justifyContent: "center", width: "100%" }}>
      <Window aria-label="Inspector" style={{ width: 232, maxWidth: "100%" }}>
        <WindowTitlebar variant="compact">
          <WindowTitle align="center">Inspector</WindowTitle>
        </WindowTitlebar>
        <WindowBody style={{ padding: 14 }}>
          <FieldGroup>
            <Field name="layer-name">
              <FieldLabel>Layer</FieldLabel>
              <TextField size="sm" defaultValue="Hero image" />
            </Field>
            <Field name="alignment">
              <FieldLabel>Alignment</FieldLabel>
              <SegmentedControl size="sm" block aria-label="Alignment" defaultValue="center">
                <SegmentedControlItem value="left" aria-label="Left">
                  <AlignLeftIcon aria-hidden="true" />
                </SegmentedControlItem>
                <SegmentedControlItem value="center" aria-label="Center">
                  <AlignCenterIcon aria-hidden="true" />
                </SegmentedControlItem>
                <SegmentedControlItem value="right" aria-label="Right">
                  <AlignRightIcon aria-hidden="true" />
                </SegmentedControlItem>
              </SegmentedControl>
            </Field>
            <Field name="opacity">
              <FieldLabel>Opacity</FieldLabel>
              <Slider size="sm" defaultValue={80} thumbLabel="Opacity" />
            </Field>
            <label style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8 }}>
              <span className="mb-text-body">Clip content</span>
              <Switch size="sm" defaultChecked />
            </label>
          </FieldGroup>
        </WindowBody>
      </Window>

      <Window aria-label={`Settings, ${label}`} style={{ width: 420, maxWidth: "100%" }}>
        <WindowTitlebar variant="compact" bordered={false}>
          <WindowTitle align="center">{label}</WindowTitle>
        </WindowTitlebar>
        <Tabs variant="plain" value={pane} onValueChange={(next) => setPane(next as string)}>
          <div style={{ display: "flex", justifyContent: "center", padding: "4px 12px 8px", background: "var(--mb-bg-secondary)", boxShadow: "inset 0 -1px 0 var(--mb-separator)" }}>
            <TabsList aria-label="Settings">
              {panes.map(({ id, label, icon: Icon }) => (
                <TabsTab key={id} value={id}>
                  <TabsTabIcon>
                    <Icon />
                  </TabsTabIcon>
                  {label}
                </TabsTab>
              ))}
            </TabsList>
          </div>
          {panes.map(({ id }) => (
            <TabsPanel key={id} value={id} style={{ display: "grid", gap: 12, padding: "16px 20px 20px" }}>
              {settings[id].map((setting, index) => (
                <label key={setting} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12 }}>
                  <span className="mb-text-body">{setting}</span>
                  <Switch defaultChecked={index === 0} />
                </label>
              ))}
            </TabsPanel>
          ))}
        </Tabs>
      </Window>
    </div>
  )
}
