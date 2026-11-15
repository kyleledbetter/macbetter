"use client"

import { ActivityIndicator } from "macbetter/activity-indicator"
import { Avatar } from "macbetter/avatar"
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
import { NavigationBar, NavigationStack } from "macbetter/navigation-bar"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "macbetter/tab-bar"
import { toast } from "macbetter/toast"
import { Toolbar, ToolbarSearchField, ToolbarSpacer, ToolbarTitle } from "macbetter/toolbar"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitlebar,
} from "macbetter/window"
import { ActivityIcon, ChartCandlestickIcon, HeartIcon, LayoutDashboardIcon } from "lucide-react"
import * as React from "react"
import { ExampleShell, MacFrame, Phone, useStage } from "../shell"
import { RangeControl } from "./charts"
import { generalRanges, type GeneralRange } from "./general-data"
import { healthPeriods, type HealthPeriod } from "./health-data"
import { stockRanges, type StockRange } from "./stocks-data"
import "./analytics.css"

/*
 * One app, four dashboards, one per family of charts in the macbetter chart
 * kit: Stocks, Health, Fitness, and Reports, the general-purpose set. Each
 * dashboard is its own file with its own data, loaded when it's first shown.
 */

type Section = "stocks" | "health" | "fitness" | "general"

const StocksScreen = React.lazy(() => import("./stocks").then((m) => ({ default: m.StocksScreen })))
const HealthScreen = React.lazy(() => import("./health").then((m) => ({ default: m.HealthScreen })))
const FitnessScreen = React.lazy(() => import("./fitness").then((m) => ({ default: m.FitnessScreen })))
const GeneralScreen = React.lazy(() => import("./general").then((m) => ({ default: m.GeneralScreen })))

const sections: {
  id: Section
  label: string
  /** The toolbar and navigation bar title. */
  title: string
  icon: React.ComponentType
  search: string
}[] = [
  { id: "stocks", label: "Stocks", title: "Stocks", icon: ChartCandlestickIcon, search: "Search symbols" },
  { id: "health", label: "Health", title: "Summary", icon: HeartIcon, search: "Search health data" },
  { id: "fitness", label: "Fitness", title: "Activity", icon: ActivityIcon, search: "Search workouts" },
  { id: "general", label: "Reports", title: "Reports", icon: LayoutDashboardIcon, search: "Search accounts" },
]

/** `?section=` accepts each section's id, and "reports" for the general set. */
function sectionFrom(value: string | null): Section | null {
  if (value === "reports") return "general"
  return sections.some((s) => s.id === value) ? (value as Section) : null
}

function useAnalytics() {
  const { preview } = useStage()
  const [section, setSectionState] = React.useState<Section>("stocks")
  const [stockRange, setStockRange] = React.useState<StockRange>("1D")
  const [healthPeriod, setHealthPeriod] = React.useState<HealthPeriod>("W")
  const [generalRange, setGeneralRange] = React.useState<GeneralRange>("12M")
  const [queries, setQueries] = React.useState<Record<Section, string>>({ stocks: "", health: "", fitness: "", general: "" })
  const [workspace, setWorkspace] = React.useState("Northwind")

  React.useEffect(() => {
    if (preview) return
    const requested = sectionFrom(new URLSearchParams(window.location.search).get("section"))
    if (requested) setSectionState(requested)
  }, [preview])

  const setSection = (next: Section) => {
    setSectionState(next)
    if (preview) return
    // Keeps ?platform= and ?view= as they are, so a reload or a shared link opens the same dashboard.
    const url = new URL(window.location.href)
    url.searchParams.set("section", next)
    window.history.replaceState(window.history.state, "", `${url.pathname}${url.search}${url.hash}`)
  }
  const setQuery = (value: string) => setQueries((current) => ({ ...current, [section]: value }))

  return {
    section,
    setSection,
    stockRange,
    setStockRange,
    healthPeriod,
    setHealthPeriod,
    generalRange,
    setGeneralRange,
    queries,
    setQuery,
    workspace,
    setWorkspace,
  }
}

type Store = ReturnType<typeof useAnalytics>

function Loading() {
  return (
    <div className="ex-section-loading">
      <ActivityIndicator aria-label="Loading dashboard" />
    </div>
  )
}

/** The section's screen. `compact` stacks its key charts for a phone. */
function Screen({ store, compact }: { store: Store; compact?: boolean }) {
  const query = store.queries[store.section]
  return (
    <React.Suspense fallback={<Loading />}>
      {store.section === "stocks" ? (
        <StocksScreen range={store.stockRange} onRangeChange={store.setStockRange} query={query} compact={compact} />
      ) : store.section === "health" ? (
        <HealthScreen period={store.healthPeriod} onPeriodChange={store.setHealthPeriod} query={query} compact={compact} />
      ) : store.section === "fitness" ? (
        <FitnessScreen query={query} compact={compact} />
      ) : (
        <GeneralScreen
          range={store.generalRange}
          onRangeChange={store.setGeneralRange}
          query={query}
          workspace={store.workspace}
          compact={compact}
        />
      )}
    </React.Suspense>
  )
}

/** The toolbar's range control: each section's own ranges, or nothing where time doesn't apply. */
function ToolbarRange({ store }: { store: Store }) {
  if (store.section === "stocks") {
    return <RangeControl ranges={stockRanges} value={store.stockRange} onValueChange={store.setStockRange} label="Chart range" />
  }
  if (store.section === "health") {
    return (
      <RangeControl ranges={healthPeriods} value={store.healthPeriod} onValueChange={store.setHealthPeriod} label="Steps and heart rate period" />
    )
  }
  if (store.section === "general") {
    return <RangeControl ranges={generalRanges} value={store.generalRange} onValueChange={store.setGeneralRange} label="Report range" />
  }
  return null
}

function subtitleFor(store: Store) {
  switch (store.section) {
    case "stocks":
      return "Markets closed · prices at Friday’s close"
    case "health":
      return "Health · Saturday, November 14"
    case "fitness":
      return "Fitness · Saturday, November 14"
    default:
      return `General charts · ${store.workspace}`
  }
}

/* ── macOS ─────────────────────────────────────────────────────── */

function MacAnalytics({ store }: { store: Store }) {
  const current = sections.find((s) => s.id === store.section)!
  return (
    <MacFrame>
      <Window aria-label="Analytics">
        <WindowSidebar>
          <WindowSidebarHeader>
            <Menu onAction={(action) => toast(action === "create" ? "Create a workspace" : `${store.workspace} settings`)}>
              <MenuTrigger variant="plain" tone="neutral" aria-label={`Workspace: ${store.workspace}`}>
                <WindowAppName icon={<Avatar shape="app" size="xs" name={store.workspace} color="auto" />}>{store.workspace}</WindowAppName>
              </MenuTrigger>
              <MenuContent align="start">
                <MenuRadioGroup value={store.workspace} onValueChange={(value) => store.setWorkspace(value as string)}>
                  <MenuGroupLabel>Workspaces</MenuGroupLabel>
                  {["Northwind", "Contoso", "Personal"].map((name) => (
                    <MenuRadioItem key={name} value={name} closeOnSelect>
                      {name}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
                <MenuSeparator />
                <MenuItem value="create">Create Workspace…</MenuItem>
                <MenuItem value="settings">Workspace Settings</MenuItem>
              </MenuContent>
            </Menu>
          </WindowSidebarHeader>
          <Sidebar aria-label="Dashboards">
            <SidebarSection title="Dashboards">
              {sections.map((s) => (
                <SidebarItem key={s.id} icon={<s.icon />} current={store.section === s.id} onClick={() => store.setSection(s.id)}>
                  {s.label}
                </SidebarItem>
              ))}
            </SidebarSection>
          </Sidebar>
        </WindowSidebar>
        <WindowTitlebar>
          <Toolbar aria-label={current.label}>
            <ToolbarTitle subtitle={subtitleFor(store)}>{current.title}</ToolbarTitle>
            <ToolbarSpacer />
            <ToolbarRange store={store} />
            <ToolbarSearchField
              aria-label={current.search}
              placeholder={current.search}
              value={store.queries[store.section]}
              onChange={(event) => store.setQuery(event.currentTarget.value)}
            />
          </Toolbar>
        </WindowTitlebar>
        <WindowBody className="ex-analytics-body" data-section={store.section}>
          <Screen store={store} />
        </WindowBody>
      </Window>
    </MacFrame>
  )
}

/* ── iPhone ────────────────────────────────────────────────────── */

function PhoneAnalytics({ store }: { store: Store }) {
  return (
    <Phone label="Analytics on iPhone">
      <div className="ex-app-root">
        <TabBar value={store.section} onValueChange={(value) => value && store.setSection(value as Section)}>
          {sections.map((s) => (
            <TabBarPanel key={s.id} value={s.id}>
              <NavigationStack className="ex-phone-stack" data-section={s.id}>
                <NavigationBar title={s.title} largeTitle />
                {store.section === s.id ? <Screen store={store} compact /> : null}
              </NavigationStack>
            </TabBarPanel>
          ))}
          <TabBarList aria-label="Dashboards">
            {sections.map((s) => (
              <TabBarItem key={s.id} value={s.id} icon={<s.icon />}>
                {s.label}
              </TabBarItem>
            ))}
          </TabBarList>
        </TabBar>
      </div>
    </Phone>
  )
}

function AnalyticsApp() {
  const store = useAnalytics()
  const { platform } = useStage()
  return platform === "ios" ? <PhoneAnalytics store={store} /> : <MacAnalytics store={store} />
}

function AnalyticsExample() {
  return (
    <ExampleShell title="Analytics" platforms={["macos", "ios"]}>
      <AnalyticsApp />
    </ExampleShell>
  )
}

export { AnalyticsApp, AnalyticsExample }
