"use client"

import { AutomationRow } from "macbetter/automation-row"
import { List, ListSection } from "macbetter/list"
import { DoorOpenIcon } from "@phosphor-icons/react/dist/ssr/DoorOpen"
import { DropIcon } from "@phosphor-icons/react/dist/ssr/Drop"
import { HouseIcon } from "@phosphor-icons/react/dist/ssr/House"
import { SunHorizonIcon } from "@phosphor-icons/react/dist/ssr/SunHorizon"
import { useState } from "react"

export default function Example() {
  const [opened, setOpened] = useState<string | null>(null)

  return (
    <div style={{ display: "grid", gap: 10, width: "min(100%, 420px)" }}>
      <List>
        <ListSection header="Automations">
          <AutomationRow
            icon={<HouseIcon weight="fill" />}
            iconColor="orange"
            title="When I arrive home"
            detail="Unlock Front door and turn on 3 lights"
            defaultEnabled
            onOpen={() => setOpened("When I arrive home")}
          />
          <AutomationRow
            icon={<SunHorizonIcon weight="fill" />}
            iconColor="indigo"
            title="At sunset"
            detail="Turn on Sconces and Pendant lights"
            defaultEnabled
            onOpen={() => setOpened("At sunset")}
          />
          <AutomationRow
            icon={<DoorOpenIcon weight="fill" />}
            iconColor="blue"
            title="When Back door opens"
            detail="Turn on Patio lights, after sunset"
            defaultEnabled={false}
            onOpen={() => setOpened("When Back door opens")}
          />
          <AutomationRow
            icon={<DropIcon weight="fill" />}
            iconColor="red"
            title="When a leak is detected"
            detail="Turn off Faucet"
            defaultEnabled
            onOpen={() => setOpened("When a leak is detected")}
          />
        </ListSection>
      </List>
      <p style={{ margin: 0, fontSize: 13, opacity: 0.7 }} aria-live="polite">
        {opened ? `Editing “${opened}”.` : "Choose an automation to edit it."}
      </p>
    </div>
  )
}
