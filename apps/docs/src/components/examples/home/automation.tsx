"use client"

import { AutomationRow } from "macbetter/automation-row"
import { Button } from "macbetter/button"
import { List, ListSection } from "macbetter/list"
import { toast } from "macbetter/toast"
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock"
import { DropHalfBottom } from "@phosphor-icons/react/dist/ssr/DropHalfBottom"
import { HouseLine } from "@phosphor-icons/react/dist/ssr/HouseLine"
import { SignOut } from "@phosphor-icons/react/dist/ssr/SignOut"
import { SunHorizon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { scenes, type Automation } from "./data"
import { SelectRow, ToggleRow, ValueRow } from "../rows"
import { removeAutomation, setAutomation, useHome } from "./store"

const triggerOptions = [
  { value: "arrive", label: "People Arrive" },
  { value: "leave", label: "People Leave" },
  { value: "time", label: "A Time of Day Occurs" },
  { value: "accessory", label: "An Accessory is Controlled" },
  { value: "sensor", label: "A Sensor Detects Something" },
]

const timeOptions = ["Sunrise", "Sunset", "6:30 AM", "7:00 AM", "10:00 PM"].map((value) => ({ value, label: value }))
const offOptions = ["Never", "5 minutes", "15 minutes", "1 hour", "4 hours"].map((value) => ({ value, label: value }))

function TriggerGlyph({ automation }: { automation: Automation }) {
  if (automation.trigger === "arrive") return <HouseLine weight="fill" aria-hidden="true" />
  if (automation.trigger === "leave") return <SignOut weight="fill" aria-hidden="true" />
  if (automation.trigger === "sensor") return <DropHalfBottom weight="fill" aria-hidden="true" />
  if (automation.time === "Sunset" || automation.time === "Sunrise") return <SunHorizon weight="fill" aria-hidden="true" />
  return <Clock weight="fill" aria-hidden="true" />
}

/** The Automation tab's list. */
function AutomationList({ onOpen }: { onOpen: (id: string) => void }) {
  const { automations } = useHome()
  return (
    <List variant="inset-grouped" className="ex-home-automations">
      <ListSection>
        {automations.map((automation) => (
          <AutomationRow
            key={automation.id}
            icon={<TriggerGlyph automation={automation} />}
            title={automation.title}
            detail={automation.enabled ? automation.detail : `Off · ${automation.detail}`}
            enabled={automation.enabled}
            onEnabledChange={(enabled) => setAutomation(automation.id, { enabled })}
            onOpen={() => onOpen(automation.id)}
          />
        ))}
      </ListSection>
    </List>
  )
}

/** Editing one automation: its trigger, what it controls, and when the accessories turn off again. */
function AutomationEditor({ id, onDone }: { id: string; onDone: () => void }) {
  const { automations, accessories } = useHome()
  const automation = automations.find((a) => a.id === id)
  if (!automation) return null
  const targets = accessories.filter((a) => ["light", "outlet", "faucet", "lock", "shade", "fan"].includes(a.kind))
  const toggleIn = (list: string[], value: string) => (list.includes(value) ? list.filter((v) => v !== value) : [...list, value])
  return (
    <div className="ex-home-editor">
      <List variant="inset-grouped">
        <ListSection>
          <ToggleRow
            title="Enable This Automation"
            checked={automation.enabled}
            onCheckedChange={(enabled) => setAutomation(id, { enabled })}
          />
        </ListSection>
        <ListSection header="When">
          <SelectRow
            title="Trigger"
            value={automation.trigger}
            options={triggerOptions}
            onValueChange={(value) => setAutomation(id, { trigger: value as Automation["trigger"] })}
          />
          {automation.trigger === "time" ? (
            <SelectRow
              title="Time"
              value={automation.time ?? "Sunset"}
              options={timeOptions}
              onValueChange={(time) => setAutomation(id, { time })}
            />
          ) : null}
        </ListSection>
        <ListSection header="Scenes">
          {scenes.map((scene) => (
            <ValueRow
              key={scene.id}
              title={scene.name}
              checked={automation.sceneIds.includes(scene.id)}
              onClick={() => setAutomation(id, { sceneIds: toggleIn(automation.sceneIds, scene.id) })}
            />
          ))}
        </ListSection>
        <ListSection header="Accessories">
          {targets.map((accessory) => (
            <ValueRow
              key={accessory.id}
              title={accessory.name}
              subtitle={accessory.room === "kitchen" ? "Kitchen" : undefined}
              checked={automation.accessoryIds.includes(accessory.id)}
              onClick={() => setAutomation(id, { accessoryIds: toggleIn(automation.accessoryIds, accessory.id) })}
            />
          ))}
        </ListSection>
        <ListSection footer="Accessories this automation turns on can turn off again after a while.">
          <SelectRow
            title="Turn Off"
            value={automation.turnOffAfter ?? "Never"}
            options={offOptions}
            onValueChange={(turnOffAfter) => setAutomation(id, { turnOffAfter })}
          />
        </ListSection>
      </List>
      <div className="ex-home-editor-actions">
        <Button variant="bezeled" block onClick={() => toast(`Tested “${automation.title}”`)}>
          Test This Automation
        </Button>
        <Button
          variant="bezeled"
          tone="destructive"
          block
          onClick={() => {
            removeAutomation(id)
            onDone()
          }}
        >
          Delete Automation
        </Button>
      </div>
    </div>
  )
}

export { AutomationEditor, AutomationList }
