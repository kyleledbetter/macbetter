"use client"

import { Avatar } from "macbetter/avatar"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "macbetter/list"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationStack,
} from "macbetter/navigation-bar"
import { SearchField } from "macbetter/search-field"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { Toolbar, ToolbarButton, ToolbarGroup, ToolbarTitle } from "macbetter/toolbar"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react"
import * as React from "react"
import "./settings.css"
import { ExampleShell, MacFrame, Pad, Phone, useStage } from "../shell"
import { useAppTheme } from "../use-app-theme"
import {
  accents,
  accountPane,
  initialSettings,
  paneById,
  paneGroups,
  searchPanes,
  type Pane,
  type PaneId,
  type SettingsState,
} from "./data"
import { PaneContent, rowValue, type Set } from "./panes"

type Store = { s: SettingsState; set: Set }

function useSettings(): Store {
  const [s, setState] = React.useState(initialSettings)
  const set = React.useCallback<Set>((key, value) => setState((prev) => ({ ...prev, [key]: value })), [])
  return { s, set }
}

function useSettingsTheme(s: SettingsState, platform: "macos" | "ipados" | "ios") {
  return useAppTheme({
    platform,
    accent: accents.find((accent) => accent.id === s.accent)?.color || undefined,
    scheme: s.appearance === "auto" ? undefined : s.appearance,
  })
}

function Tile({ pane, size = 20 }: { pane: Pane; size?: number }) {
  const Glyph = pane.icon
  const color = pane.color === "gray" ? "light-dark(#8e8e93, #636366)" : `var(--mb-${pane.color})`
  return (
    <span className="ex-tile" style={{ "--ex-tile": color, "--ex-tile-size": `${size}px` } as React.CSSProperties}>
      <Glyph aria-hidden="true" />
    </span>
  )
}

function groupsMatching(query: string) {
  const matches = new Set(searchPanes(query).map((pane) => pane.id))
  return paneGroups.map((group) => group.filter((pane) => matches.has(pane.id))).filter((group) => group.length)
}

/* ── macOS ─────────────────────────────────────────────────────── */

function MacSettings({ s, set }: Store) {
  const [history, setHistory] = React.useState<PaneId[]>(["appearance"])
  const [index, setIndex] = React.useState(0)
  const [query, setQuery] = React.useState("")
  const current = history[index]
  const pane = paneById(current)
  const groups = groupsMatching(query)
  const themeProps = useSettingsTheme(s, "macos")

  const go = (id: PaneId) => {
    if (id === current) return
    setHistory([...history.slice(0, index + 1), id])
    setIndex(index + 1)
  }

  return (
    <MacFrame maxWidth={860} maxHeight={660}>
      <Window aria-label="System Settings" {...themeProps} className="ex-settings-window">
        <WindowSidebar>
          <WindowTrafficLights />
          <div className="ex-settings-sidebar">
            <div className="ex-settings-search">
              <SearchField
                size="sm"
                aria-label="Search settings"
                value={query}
                onChange={(event) => setQuery(event.currentTarget.value)}
              />
            </div>
            <Sidebar aria-label="Settings panes">
              {query ? null : (
                <SidebarSection>
                  <SidebarItem
                    className="ex-profile-item"
                    icon={<Avatar name="Avery Chen" size="sm" color="orange" />}
                    current={current === "account"}
                    onClick={() => go("account")}
                  >
                    <span className="ex-profile-name">Avery Chen</span>
                    <span className="ex-profile-sub">Apple Account</span>
                  </SidebarItem>
                </SidebarSection>
              )}
              {groups.map((group) => (
                <SidebarSection key={group[0].id}>
                  {group.map((item) => (
                    <SidebarItem
                      key={item.id}
                      icon={<Tile pane={item} />}
                      current={current === item.id}
                      onClick={() => go(item.id)}
                    >
                      {item.label}
                    </SidebarItem>
                  ))}
                </SidebarSection>
              ))}
              {groups.length ? null : (
                <p className="ex-sidebar-empty" role="status">
                  No results for “{query}”
                </p>
              )}
            </Sidebar>
          </div>
        </WindowSidebar>
        <WindowTitlebar bordered={false}>
          <Toolbar aria-label="Navigation">
            <ToolbarGroup aria-label="History">
              <ToolbarButton aria-label="Back" disabled={index === 0} onClick={() => setIndex(index - 1)}>
                <ChevronLeftIcon aria-hidden="true" />
              </ToolbarButton>
              <ToolbarButton
                aria-label="Forward"
                disabled={index >= history.length - 1}
                onClick={() => setIndex(index + 1)}
              >
                <ChevronRightIcon aria-hidden="true" />
              </ToolbarButton>
            </ToolbarGroup>
            <ToolbarTitle>{current === "account" ? "Apple Account" : pane.label}</ToolbarTitle>
          </Toolbar>
        </WindowTitlebar>
        <WindowBody>
          <div key={current} className="ex-settings-content" role="region" aria-label={pane.label}>
            <PaneContent id={current} s={s} set={set} platform="macos" />
          </div>
        </WindowBody>
      </Window>
    </MacFrame>
  )
}

/* ── iPhone and iPad ───────────────────────────────────────────── */

function ProfileRow({ onClick, current }: { onClick: () => void; current?: boolean }) {
  return (
    <ListSection>
      <ListRow onClick={onClick} className="ex-profile-row" aria-current={current ? "page" : undefined}>
        <span className="ex-profile-avatar">
          <Avatar name="Avery Chen" size="lg" color="orange" />
        </span>
        <ListRowTitle className="ex-profile-title">Avery Chen</ListRowTitle>
        <ListRowSubtitle>Apple Account, iCloud, and more</ListRowSubtitle>
        <ListRowAccessory type="disclosure" />
      </ListRow>
    </ListSection>
  )
}

function RootList({
  s,
  query,
  current,
  onOpen,
}: {
  s: SettingsState
  query: string
  current?: PaneId
  onOpen: (id: PaneId) => void
}) {
  const groups = groupsMatching(query)
  return (
    <List className="ex-pane-list">
      {query ? null : <ProfileRow onClick={() => onOpen("account")} current={current === "account"} />}
      {groups.map((group) => (
        <ListSection key={group[0].id}>
          {group.map((pane) => {
            const Glyph = pane.icon
            return (
              <ListRow
                key={pane.id}
                onClick={() => onOpen(pane.id)}
                aria-current={current === pane.id ? "page" : undefined}
                className={current === pane.id ? "ex-row-current" : undefined}
              >
                <ListRowIcon color={pane.color}>
                  <Glyph aria-hidden="true" />
                </ListRowIcon>
                <ListRowTitle>{pane.label}</ListRowTitle>
                {rowValue(pane.id, s) ? <ListRowValue>{rowValue(pane.id, s)}</ListRowValue> : null}
                <ListRowAccessory type="disclosure" />
              </ListRow>
            )
          })}
        </ListSection>
      ))}
      {groups.length ? null : (
        <div className="ex-empty" role="status">
          <strong>No results</strong>
          <span>Check the spelling or try a new search.</span>
        </div>
      )}
    </List>
  )
}

function PhoneSettings({ s, set }: Store) {
  const [open, setOpen] = React.useState<PaneId | null>(null)
  const [popped, setPopped] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const themeProps = useSettingsTheme(s, "ios")

  return (
    <Phone label="Settings on iPhone">
      <div className="ex-app-root" {...themeProps}>
        {open ? (
          <NavigationStack key={open} className="ex-push ex-grouped-stack">
            <NavigationBar title={open === "account" ? "Apple Account" : paneById(open).label}>
              <NavigationBarBackButton
                onClick={() => {
                  setPopped(true)
                  setOpen(null)
                }}
              >
                Settings
              </NavigationBarBackButton>
            </NavigationBar>
            <PaneContent id={open} s={s} set={set} platform="ios" />
          </NavigationStack>
        ) : (
          <NavigationStack className={`ex-grouped-stack${popped ? " ex-pop" : ""}`}>
            <NavigationBar title="Settings" largeTitle />
            <div className="ex-ios-search">
              <SearchField aria-label="Search settings" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
            </div>
            <RootList s={s} query={query} onOpen={setOpen} />
          </NavigationStack>
        )}
      </div>
    </Phone>
  )
}

function PadSettings({ s, set }: Store) {
  const [current, setCurrent] = React.useState<PaneId>("appearance")
  const [query, setQuery] = React.useState("")
  const themeProps = useSettingsTheme(s, "ipados")
  const pane = current === "account" ? accountPane : paneById(current)

  return (
    <Pad label="Settings on iPad">
      <div className="ex-app-root ex-pad-split" {...themeProps}>
        <NavigationStack className="ex-grouped-stack ex-pad-primary">
          <NavigationBar title="Settings" largeTitle />
          <div className="ex-ios-search">
            <SearchField aria-label="Search settings" value={query} onChange={(e) => setQuery(e.currentTarget.value)} />
          </div>
          <RootList s={s} query={query} current={current} onOpen={setCurrent} />
        </NavigationStack>
        <NavigationStack key={current} className="ex-grouped-stack ex-pad-detail">
          <NavigationBar title={current === "account" ? "Apple Account" : pane.label} />
          <div className="ex-pad-detail-inner">
            <PaneContent id={current} s={s} set={set} platform="ipados" />
          </div>
        </NavigationStack>
      </div>
    </Pad>
  )
}

function SettingsApp() {
  const store = useSettings()
  const { platform } = useStage()
  if (platform === "ios") return <PhoneSettings {...store} />
  if (platform === "ipados") return <PadSettings {...store} />
  return <MacSettings {...store} />
}

function SettingsExample() {
  return (
    <ExampleShell title="Settings" platforms={["macos", "ipados", "ios"]}>
      <SettingsApp />
    </ExampleShell>
  )
}

export { SettingsApp, SettingsExample }
