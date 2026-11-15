"use client"

import { Button } from "macbetter/button"
import { Menu, MenuContent, MenuItem, MenuItemIcon, MenuSeparator, MenuTrigger } from "macbetter/menu"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarLeading,
  NavigationBarTrailing,
  NavigationStack,
} from "macbetter/navigation-bar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "macbetter/tab-bar"
import { CheckIcon, ClockIcon, HouseIcon, LayoutGridIcon, PlusIcon, SparklesIcon, XIcon } from "lucide-react"
import { DotsThree } from "@phosphor-icons/react/dist/ssr/DotsThree"
import * as React from "react"
import { ScreenSheet } from "../screen-sheet"
import { Phone, useStage } from "../shell"
import { AutomationEditor, AutomationList } from "./automation"
import { AccessoryControls, ConfirmContext, ControlsHeader, type Confirm } from "./controls"
import { homes, type RoomId } from "./data"
import { SetupFlow } from "./setup"
import { addAutomation, roomName, setHome, useHome } from "./store"
import { HomeOverview, OpenerContext, RoomView } from "./views"

type Pending = { title: string; action: string; run: () => void } | null

/** An action sheet drawn inside the phone screen, for unlocking and opening. */
function InScreenConfirm({ pending, onClose }: { pending: Pending; onClose: () => void }) {
  if (!pending) return null
  return (
    <div className="ex-home-confirm-layer">
      <div className="ex-home-confirm-backdrop" onClick={onClose} />
      <div className="ex-home-confirm" role="alertdialog" aria-modal="true" aria-label={pending.title}>
        <div className="ex-home-confirm-group">
          <p className="ex-home-confirm-title">{pending.title}</p>
          <Button
            variant="plain"
            block
            className="ex-home-confirm-action"
            onClick={() => {
              pending.run()
              onClose()
            }}
          >
            {pending.action}
          </Button>
        </div>
        <Button variant="plain" block className="ex-home-confirm-cancel" onClick={onClose} autoFocus>
          Cancel
        </Button>
      </div>
    </div>
  )
}

function HomeMenu() {
  const { homeId } = useHome()
  return (
    <Menu onAction={(value) => typeof value === "string" && setHome(value)}>
      <MenuTrigger variant="plain" shape="circle" aria-label="Home options" indicator={false}>
        <DotsThree weight="bold" aria-hidden="true" />
      </MenuTrigger>
      <MenuContent align="end">
        {homes.map((home) => (
          <MenuItem key={home.id} value={home.id}>
            <MenuItemIcon>{home.id === homeId ? <CheckIcon /> : <HouseIcon />}</MenuItemIcon>
            {home.name}
          </MenuItem>
        ))}
        <MenuSeparator />
        <MenuItem value="settings">
          <MenuItemIcon>
            <LayoutGridIcon />
          </MenuItemIcon>
          Edit Home View
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function AddMenu({ onAccessory, onAutomation }: { onAccessory: () => void; onAutomation: () => void }) {
  return (
    <Menu
      onAction={(value) => {
        if (value === "accessory") onAccessory()
        if (value === "automation") onAutomation()
      }}
    >
      <MenuTrigger variant="plain" shape="circle" aria-label="Add" indicator={false}>
        <PlusIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuContent align="end">
        <MenuItem value="accessory">
          <MenuItemIcon>
            <PlusIcon />
          </MenuItemIcon>
          Add Accessory
        </MenuItem>
        <MenuItem value="scene">
          <MenuItemIcon>
            <SparklesIcon />
          </MenuItemIcon>
          Add Scene
        </MenuItem>
        <MenuItem value="automation">
          <MenuItemIcon>
            <ClockIcon />
          </MenuItemIcon>
          Add Automation
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function newAutomation() {
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
  return id
}

function PhoneHome() {
  const { homeId } = useHome()
  const { frameless } = useStage()
  const [room, setRoom] = React.useState<RoomId | null>(null)
  const [control, setControl] = React.useState<string | null>(null)
  const [editing, setEditing] = React.useState<string | null>(null)
  const [adding, setAdding] = React.useState(false)
  const [tab, setTab] = React.useState("home")
  const [pending, setPending] = React.useState<Pending>(null)
  const confirm = React.useCallback<Confirm>((options) => setPending(options), [])
  const homeName = homes.find((h) => h.id === homeId)?.name ?? "Home"

  const opener = React.useMemo(() => ({ kind: "sheet" as const, open: setControl }), [])

  return (
    <OpenerContext.Provider value={opener}>
      <div className="ex-app-root ex-home-phone ex-home-wallpaper">
        <TabBar value={tab} onValueChange={(value) => setTab(String(value))} className="ex-home-tabs">
          <TabBarPanel value="home">
            {/* Keyed by screen, so a room opens at its top rather than at the Home tab's scroll position. */}
            <NavigationStack key={room ?? "home"} className="ex-home-stack">
              {room ? (
                <>
                  <NavigationBar title={roomName(room)} largeTitle>
                    <NavigationBarLeading>
                      <NavigationBarBackButton onClick={() => setRoom(null)}>{homeName}</NavigationBarBackButton>
                    </NavigationBarLeading>
                  </NavigationBar>
                  <RoomView room={room} />
                </>
              ) : (
                <>
                  <NavigationBar title={homeName} largeTitle>
                    <NavigationBarTrailing>
                      <AddMenu
                        onAccessory={() => setAdding(true)}
                        onAutomation={() => {
                          setTab("automation")
                          setEditing(newAutomation())
                        }}
                      />
                      <HomeMenu />
                    </NavigationBarTrailing>
                  </NavigationBar>
                  <HomeOverview onRoom={setRoom} />
                </>
              )}
            </NavigationStack>
          </TabBarPanel>
          <TabBarPanel value="automation">
            <NavigationStack className="ex-home-stack">
              <NavigationBar title="Automation" largeTitle>
                <NavigationBarTrailing>
                  <Button variant="plain" shape="circle" aria-label="Add Automation" onClick={() => setEditing(newAutomation())}>
                    <PlusIcon aria-hidden="true" />
                  </Button>
                </NavigationBarTrailing>
              </NavigationBar>
              <AutomationList onOpen={setEditing} />
            </NavigationStack>
          </TabBarPanel>
          <TabBarList aria-label="Home">
            <TabBarItem value="home" icon={<HouseIcon />}>
              Home
            </TabBarItem>
            <TabBarItem value="automation" icon={<ClockIcon />}>
              Automation
            </TabBarItem>
          </TabBarList>
        </TabBar>

        <ScreenSheet
          open={control !== null}
          onOpenChange={(open) => !open && setControl(null)}
          title={control ? "Accessory controls" : ""}
          className="ex-home-sheet"
        >
          {control ? (
            <ConfirmContext.Provider value={frameless ? null : confirm}>
              <ControlsHeader
                id={control}
                action={
                  <Button variant="bezeled" tone="neutral" shape="circle" size="sm" aria-label="Close" onClick={() => setControl(null)}>
                    <XIcon aria-hidden="true" />
                  </Button>
                }
              />
              <AccessoryControls id={control} />
              <InScreenConfirm pending={pending} onClose={() => setPending(null)} />
            </ConfirmContext.Provider>
          ) : null}
        </ScreenSheet>

        <ScreenSheet open={editing !== null} onOpenChange={(open) => !open && setEditing(null)} title="Edit Automation" hideTitle={false} className="ex-home-sheet">
          {editing ? (
            <>
              <div className="ex-home-sheet-done">
                <Button variant="plain" onClick={() => setEditing(null)}>
                  Done
                </Button>
              </div>
              <AutomationEditor id={editing} onDone={() => setEditing(null)} />
            </>
          ) : null}
        </ScreenSheet>

        <ScreenSheet open={adding} onOpenChange={setAdding} title="Add Accessory" className="ex-home-sheet">
          {adding ? <SetupFlow onClose={() => setAdding(false)} /> : null}
        </ScreenSheet>
      </div>
    </OpenerContext.Provider>
  )
}

function PhoneApp() {
  return (
    <Phone label="Home on iPhone">
      <PhoneHome />
    </Phone>
  )
}

export { PhoneApp }
