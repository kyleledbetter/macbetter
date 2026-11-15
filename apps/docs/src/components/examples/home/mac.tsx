"use client"

import { Button } from "macbetter/button"
import { Dialog, DialogBody, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "macbetter/dialog"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { Toolbar, ToolbarSpacer, ToolbarTitle } from "macbetter/toolbar"
import { Window, WindowAppName, WindowBody, WindowSidebar, WindowSidebarHeader, WindowTitlebar } from "macbetter/window"
import { Armchair } from "@phosphor-icons/react/dist/ssr/Armchair"
import { Bed } from "@phosphor-icons/react/dist/ssr/Bed"
import { Car } from "@phosphor-icons/react/dist/ssr/Car"
import { Clock } from "@phosphor-icons/react/dist/ssr/Clock"
import { CookingPot } from "@phosphor-icons/react/dist/ssr/CookingPot"
import { Door } from "@phosphor-icons/react/dist/ssr/Door"
import { House } from "@phosphor-icons/react/dist/ssr/House"
import { Tree } from "@phosphor-icons/react/dist/ssr/Tree"
import { PlusIcon } from "lucide-react"
import * as React from "react"
import { MacFrame } from "../shell"
import { AutomationEditor, AutomationList } from "./automation"
import { homes, type RoomId } from "./data"
import { addAutomation, categories, roomSummary, rooms, setHome, useHome } from "./store"
import { HomeOverview, OpenerContext, RoomView } from "./views"

const roomIcons: Record<RoomId, React.ReactNode> = {
  kitchen: <CookingPot weight="fill" />,
  living: <Armchair weight="fill" />,
  entry: <Door weight="fill" />,
  bedroom: <Bed weight="fill" />,
  garage: <Car weight="fill" />,
  backyard: <Tree weight="fill" />,
}

type Place = { kind: "home" } | { kind: "room"; room: RoomId } | { kind: "automation" }

const popover = { kind: "popover" as const }

function MacHome() {
  const { homeId, accessories, automations } = useHome()
  const [place, setPlace] = React.useState<Place>({ kind: "home" })
  const [editing, setEditing] = React.useState<string | null>(null)
  const home = homes.find((h) => h.id === homeId) ?? homes[0]

  const title =
    place.kind === "home" ? home.name : place.kind === "room" ? rooms.find((r) => r.id === place.room)?.name : "Automation"
  const subtitle =
    place.kind === "home"
      ? categories(accessories).find((c) => c.id === "lights")?.summary === "Off"
        ? "All lights off"
        : `Lights ${categories(accessories).find((c) => c.id === "lights")?.summary}`
      : place.kind === "room"
        ? roomSummary(place.room, accessories)
        : `${automations.filter((a) => a.enabled).length} on`

  const add = () => {
    const id = `automation-${Date.now()}`
    addAutomation({
      id,
      trigger: "time",
      title: "10:00 PM, every day",
      detail: "Turn off Pendant lights",
      enabled: true,
      time: "10:00 PM",
      turnOffAfter: "Never",
      sceneIds: [],
      accessoryIds: ["pendants"],
    })
    setPlace({ kind: "automation" })
    setEditing(id)
  }

  return (
    <OpenerContext.Provider value={popover}>
      <MacFrame>
        <Window aria-label="Home" className="ex-home-window">
          <WindowSidebar>
            <WindowSidebarHeader>
              <Menu>
                <MenuTrigger variant="plain" tone="neutral" aria-label={`Home: ${home.name}`}>
                  <WindowAppName icon={<House weight="fill" aria-hidden="true" className="ex-home-app-glyph" />}>{home.name}</WindowAppName>
                </MenuTrigger>
                <MenuContent align="start">
                  <MenuRadioGroup value={homeId} onValueChange={(value) => setHome(value as string)}>
                    <MenuGroupLabel>Homes</MenuGroupLabel>
                    {homes.map((h) => (
                      <MenuRadioItem key={h.id} value={h.id} closeOnSelect>
                        {h.name}
                      </MenuRadioItem>
                    ))}
                  </MenuRadioGroup>
                  <MenuSeparator />
                  <MenuItem value="settings">Home Settings…</MenuItem>
                </MenuContent>
              </Menu>
            </WindowSidebarHeader>
            <Sidebar aria-label="Home">
              <SidebarSection>
                <SidebarItem icon={<House weight="fill" />} current={place.kind === "home"} onClick={() => setPlace({ kind: "home" })}>
                  Home
                </SidebarItem>
                <SidebarItem
                  icon={<Clock weight="fill" />}
                  current={place.kind === "automation"}
                  onClick={() => setPlace({ kind: "automation" })}
                >
                  Automation
                </SidebarItem>
              </SidebarSection>
              <SidebarSection title="Rooms">
                {rooms.map((room) => (
                  <SidebarItem
                    key={room.id}
                    icon={roomIcons[room.id]}
                    current={place.kind === "room" && place.room === room.id}
                    onClick={() => setPlace({ kind: "room", room: room.id })}
                  >
                    {room.name}
                  </SidebarItem>
                ))}
              </SidebarSection>
            </Sidebar>
          </WindowSidebar>
          <WindowTitlebar>
            <Toolbar aria-label={title ?? "Home"}>
              <ToolbarTitle subtitle={subtitle}>{title}</ToolbarTitle>
              <ToolbarSpacer />
              <Menu onAction={(value) => value === "automation" && add()}>
                <MenuTrigger variant="plain" tone="neutral" shape="circle" aria-label="Add" indicator={false}>
                  <PlusIcon aria-hidden="true" />
                </MenuTrigger>
                <MenuContent align="end">
                  <MenuItem value="scene">Add Scene…</MenuItem>
                  <MenuItem value="automation">Add Automation…</MenuItem>
                  <MenuSeparator />
                  <MenuItem value="accessory" disabled>
                    Add accessories on iPhone or iPad
                  </MenuItem>
                </MenuContent>
              </Menu>
            </Toolbar>
          </WindowTitlebar>
          <WindowBody className="ex-home-mac-body ex-home-wallpaper">
            {place.kind === "home" ? (
              <HomeOverview onRoom={(room) => setPlace({ kind: "room", room })} />
            ) : place.kind === "room" ? (
              <RoomView room={place.room} />
            ) : (
              <div className="ex-home-mac-automation">
                <AutomationList onOpen={setEditing} />
              </div>
            )}
          </WindowBody>
        </Window>
        <Dialog open={editing !== null} onOpenChange={(open) => !open && setEditing(null)}>
          <DialogContent className="ex-home-dialog">
            <DialogHeader>
              <DialogTitle>Edit Automation</DialogTitle>
            </DialogHeader>
            <DialogBody>{editing ? <AutomationEditor id={editing} onDone={() => setEditing(null)} /> : null}</DialogBody>
            <DialogFooter>
              <Button variant="filled" onClick={() => setEditing(null)}>
                Done
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </MacFrame>
    </OpenerContext.Provider>
  )
}

export { MacHome }
