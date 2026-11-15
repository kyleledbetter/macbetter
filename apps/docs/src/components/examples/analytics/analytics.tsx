"use client"

import {
  Alert,
  AlertAction,
  AlertActions,
  AlertContent,
  AlertDescription,
  AlertIcon,
  AlertTitle,
} from "macbetter/alert"
import { Avatar } from "macbetter/avatar"
import { Badge } from "macbetter/badge"
import { Button } from "macbetter/button"
import { Card } from "macbetter/card"
import { Gauge, GaugeLabel, GaugeValue } from "macbetter/gauge"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "macbetter/list"
import {
  Menu,
  MenuContent,
  MenuGroupLabel,
  MenuItem,
  MenuItemIcon,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
import { NavigationBar, NavigationBarTrailing, NavigationStack } from "macbetter/navigation-bar"
import { Progress, ProgressLabel, ProgressValue } from "macbetter/progress"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Select, SelectContent, SelectItem, SelectList, SelectTrigger } from "macbetter/select"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { Switch } from "macbetter/switch"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "macbetter/tab-bar"
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  type TableSort,
} from "macbetter/table"
import { toast } from "macbetter/toast"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSearchField,
  ToolbarSpacer,
  ToolbarTitle,
} from "macbetter/toolbar"
import {
  Window,
  WindowAppName,
  WindowBody,
  WindowSidebar,
  WindowSidebarHeader,
  WindowTitlebar,
} from "macbetter/window"
import {
  BellIcon,
  BotIcon,
  CircleIcon,
  DatabaseIcon,
  EllipsisIcon,
  GaugeIcon,
  LayoutDashboardIcon,
  RefreshCwIcon,
  SparklesIcon,
  Trash2Icon,
  TrendingUpIcon,
  TriangleAlertIcon,
} from "lucide-react"
import * as React from "react"
import { ExampleShell, MacFrame, Phone, useStage } from "../shell"
import { BarList, ChartFrame, ColumnChart, Donut, Sparkline, TrendChart, type Series } from "./charts"
import {
  activeUsers,
  agents as initialAgents,
  alerts,
  datasets as initialDatasets,
  freshnessLabel,
  kpis,
  labelsFor,
  ranges,
  statusColors,
  statusLabels,
  storage,
  tables,
  type Dataset,
  type Kpi,
  type Range,
} from "./data"
import "./analytics.css"

type Page = "overview" | "datasets" | "metrics" | "agents" | "alerts"

const agentRuns = [148, 162, 171, 214, 188, 96, 84]

function useAnalytics() {
  const [range, setRange] = React.useState<Range>("30d")
  const [env, setEnv] = React.useState("production")
  const [datasets, setDatasets] = React.useState(initialDatasets)
  const [agents, setAgents] = React.useState(initialAgents)
  const [doomed, setDoomed] = React.useState<Dataset | null>(null)
  const refresh = (dataset: Dataset) => {
    setDatasets((list) => list.map((d) => (d.id === dataset.id ? { ...d, status: "syncing", freshness: 0 } : d)))
    window.setTimeout(() => {
      setDatasets((list) => list.map((d) => (d.id === dataset.id ? { ...d, status: "healthy" } : d)))
      toast.success(`${dataset.name} refreshed`, { description: `${dataset.rows.toLocaleString("en")} rows synced` })
    }, 1400)
  }
  const remove = (dataset: Dataset) => {
    setDatasets((list) => list.filter((d) => d.id !== dataset.id))
    toast(`Deleted ${dataset.name}`)
  }
  return { range, setRange, env, setEnv, datasets, refresh, remove, doomed, setDoomed, agents, setAgents }
}

type Store = ReturnType<typeof useAnalytics>

/* ── Pieces ────────────────────────────────────────────────────── */

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <Card className="ex-kpi" role="group" aria-label={kpi.label}>
      <div className="ex-kpi-label">{kpi.label}</div>
      <div className="ex-kpi-value ex-mono">{kpi.value}</div>
      <div className="ex-kpi-foot">
        <span className="ex-delta" data-good={kpi.good ? "" : undefined}>
          <span className="mb-visually-hidden">{kpi.good ? "Improved" : "Worsened"} by </span>
          {kpi.delta}
        </span>
        <Sparkline values={kpi.trend} good={kpi.good} />
      </div>
    </Card>
  )
}

function StatusBadge({ status }: { status: Dataset["status"] }) {
  return (
    <Badge variant="dot" color={statusColors[status]} size="sm">
      {statusLabels[status]}
    </Badge>
  )
}

function UsersChart({ range, compact }: { range: Range; compact?: boolean }) {
  const labels = React.useMemo(() => labelsFor(range), [range])
  const { current, previous } = React.useMemo(() => activeUsers(range), [range])
  const long = ranges.find((r) => r.value === range)?.long
  const total = current.reduce((a, b) => a + b, 0)
  const series = React.useMemo<Series[]>(
    () => [
      { name: "This period", values: current, color: "accent" },
      { name: "Previous period", values: previous, color: "accentSecondary", dashed: true },
    ],
    [current, previous]
  )
  return (
    <ChartFrame
      title="Active users"
      description={`Daily active users over ${long}, against the period before. Up ${Math.round((total / previous.reduce((a, b) => a + b, 0) - 1) * 100)}%.`}
      legend={[
        { name: "This period", color: "var(--mb-accent)" },
        { name: "Previous period", color: "var(--mb-accent-secondary)", dashed: true },
      ]}
      table={{
        columns: ["Date", "This period", "Previous period"],
        rows: labels.map((label, i) => [label, current[i], previous[i]]),
      }}
    >
      <TrendChart
        labels={labels}
        height={compact ? 190 : 250}
        xTicks={compact ? 3 : 6}
        series={series}
      />
    </ChartFrame>
  )
}

function QuotaCard() {
  return (
    <Card className="ex-quota">
      <div className="ex-card-title">Plan usage</div>
      <div className="ex-quota-body">
        <Gauge variant="circular" size="lg" value={68} low={70} high={90} optimum={0}>
          <GaugeValue />
          <GaugeLabel>Compute</GaugeLabel>
        </Gauge>
        <div className="ex-quota-bars">
          <Progress value={4.2} max={10} size="sm" format={{ maximumFractionDigits: 1 }}>
            <ProgressLabel>Rows synced</ProgressLabel>
            <ProgressValue>{() => "4.2M of 10M"}</ProgressValue>
          </Progress>
          <Progress value={1304} max={2000} size="sm">
            <ProgressLabel>Agent runs</ProgressLabel>
            <ProgressValue>{() => "1,304 of 2,000"}</ProgressValue>
          </Progress>
          <Progress value={91} max={100} size="sm" tone="destructive">
            <ProgressLabel>Storage</ProgressLabel>
            <ProgressValue>{() => "91 of 100 GB"}</ProgressValue>
          </Progress>
        </div>
      </div>
    </Card>
  )
}

function DatasetMenu({ store, dataset }: { store: Store; dataset: Dataset }) {
  return (
    <Menu
      onAction={(action) => {
        if (action === "refresh") store.refresh(dataset)
        if (action === "delete") store.setDoomed(dataset)
      }}
    >
      <MenuTrigger variant="plain" tone="neutral" size="sm" shape="circle" indicator={false} aria-label={`Actions for ${dataset.name}`}>
        <EllipsisIcon aria-hidden="true" />
      </MenuTrigger>
      <MenuContent>
        <MenuItem value="refresh">
          <MenuItemIcon>
            <RefreshCwIcon />
          </MenuItemIcon>
          Refresh now
        </MenuItem>
        <MenuSeparator />
        <MenuItem value="delete" className="ex-menu-destructive">
          <MenuItemIcon>
            <Trash2Icon />
          </MenuItemIcon>
          Delete Dataset…
        </MenuItem>
      </MenuContent>
    </Menu>
  )
}

function DatasetTable({ store, limit }: { store: Store; limit?: number }) {
  const [sort, setSort] = React.useState<TableSort>({ column: "freshness", direction: "ascending" })
  const [selected, setSelected] = React.useState<string[]>([])
  const rows = React.useMemo(() => {
    const key = sort.column as "name" | "rows" | "freshness" | "status"
    const sorted = [...store.datasets].sort((a, b) => (a[key] < b[key] ? -1 : a[key] > b[key] ? 1 : 0))
    return (sort.direction === "ascending" ? sorted : sorted.reverse()).slice(0, limit)
  }, [store.datasets, sort, limit])

  return (
    <Table
      aria-label="Datasets"
      className="ex-table"
      selectionMode="single"
      value={selected}
      onValueChange={setSelected}
      sort={sort}
      onSortChange={setSort}
    >
      <TableHeader>
        <TableColumn value="name">Dataset</TableColumn>
        <TableColumn>Source</TableColumn>
        <TableColumn value="rows" align="end">
          Rows
        </TableColumn>
        <TableColumn value="freshness">Refreshed</TableColumn>
        <TableColumn value="status">Status</TableColumn>
        <TableColumn>Owner</TableColumn>
        <TableColumn>
          <span className="mb-visually-hidden">Actions</span>
        </TableColumn>
      </TableHeader>
      <TableBody>
        {rows.map((dataset) => (
          <TableRow key={dataset.id} value={dataset.id}>
            <TableCell>
              <DatabaseIcon aria-hidden="true" />
              <span className="ex-mono ex-dataset-name">{dataset.name}</span>
            </TableCell>
            <TableCell secondary>{dataset.source}</TableCell>
            <TableCell secondary align="end" className="ex-mono">
              {dataset.rows.toLocaleString("en")}
            </TableCell>
            <TableCell secondary>{freshnessLabel(dataset.freshness)}</TableCell>
            <TableCell>
              <StatusBadge status={dataset.status} />
            </TableCell>
            <TableCell secondary>{dataset.owner}</TableCell>
            <TableCell align="end" onClick={(event) => event.stopPropagation()} onKeyDown={(event) => event.stopPropagation()}>
              <DatasetMenu store={store} dataset={dataset} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

function DeleteAlert({ store }: { store: Store }) {
  const dataset = store.doomed
  return (
    <Alert open={dataset !== null} onOpenChange={(open) => !open && store.setDoomed(null)}>
      <AlertContent>
        <AlertIcon>
          <span className="ex-alert-icon">
            <DatabaseIcon />
          </span>
        </AlertIcon>
        <AlertTitle>Delete “{dataset?.name}”?</AlertTitle>
        <AlertDescription>
          Metrics and agents that read from this dataset will stop updating. You can’t undo this action.
        </AlertDescription>
        <AlertActions>
          <AlertAction variant="cancel">Cancel</AlertAction>
          <AlertAction
            variant="primary"
            tone="destructive"
            onClick={() => {
              if (dataset) store.remove(dataset)
            }}
          >
            Delete
          </AlertAction>
        </AlertActions>
      </AlertContent>
    </Alert>
  )
}

function RangePicker({ store, block }: { store: Store; block?: boolean }) {
  return (
    <SegmentedControl
      size="sm"
      aria-label="Date range"
      value={store.range}
      onValueChange={(v) => v && store.setRange(v as Range)}
      block={block}
    >
      {ranges.map((range) => (
        <SegmentedControlItem key={range.value} value={range.value} aria-label={range.long}>
          {range.label}
        </SegmentedControlItem>
      ))}
    </SegmentedControl>
  )
}

/* ── macOS ─────────────────────────────────────────────────────── */

const pages: { id: Page; label: string; icon: React.ComponentType }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboardIcon },
  { id: "datasets", label: "Datasets", icon: DatabaseIcon },
  { id: "metrics", label: "Metrics", icon: TrendingUpIcon },
  { id: "agents", label: "Agents", icon: BotIcon },
  { id: "alerts", label: "Alerts", icon: BellIcon },
]

function Overview({ store }: { store: Store }) {
  return (
    <div className="ex-dash">
      <div className="ex-kpis">
        {kpis(store.range).map((kpi) => (
          <KpiCard key={kpi.id} kpi={kpi} />
        ))}
      </div>
      <div className="ex-dash-row">
        <Card className="ex-dash-wide">
          <UsersChart range={store.range} />
        </Card>
        <QuotaCard />
      </div>
      <div className="ex-dash-row ex-dash-thirds">
        <Card>
          <BarList
            title="Busiest tables"
            description="Queries per table, last 30 days. events leads with 1.8M."
            items={tables}
          />
        </Card>
        <Card>
          <Donut
            title="Storage by schema"
            description="How 61 GB of database storage splits across schemas. public holds the most."
            parts={storage}
            total="61"
            unit="GB"
          />
        </Card>
        <Card>
          <ColumnChart
            title="Agent runs"
            description="Runs per day this week. Thursday peaked at 214 during the schema check."
            values={agentRuns}
            labels={["M", "T", "W", "T", "F", "S", "S"]}
            days={["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]}
          />
        </Card>
      </div>
      <Card className="ex-table-card">
        <div className="ex-card-head">
          <div className="ex-card-title">Datasets</div>
          <span className="ex-card-sub">{store.datasets.length} datasets · sorted by the column you choose</span>
        </div>
        <DatasetTable store={store} />
      </Card>
    </div>
  )
}

function AgentsPage({ store }: { store: Store }) {
  return (
    <List className="ex-dash-list">
      <ListSection header="Agents" footer="Agents run on your workspace’s schedule and post results to the channels you choose.">
        {store.agents.map((agent) => (
          <ListRow key={agent.id}>
            <ListRowTitle>{agent.name}</ListRowTitle>
            <ListRowSubtitle>
              {agent.detail} · {agent.runs.toLocaleString("en")} runs
            </ListRowSubtitle>
            <ListRowAccessory>
              <Switch
                aria-label={agent.name}
                checked={agent.on}
                onCheckedChange={(on) => store.setAgents((list) => list.map((a) => (a.id === agent.id ? { ...a, on } : a)))}
              />
            </ListRowAccessory>
          </ListRow>
        ))}
      </ListSection>
    </List>
  )
}

function AlertsPage() {
  return (
    <List className="ex-dash-list">
      <ListSection header="Open alerts">
        {alerts.map((alert) => (
          <ListRow key={alert.id} onClick={() => {}}>
            <span className="ex-alert-glyph" data-level={alert.level} aria-hidden="true">
              <TriangleAlertIcon />
            </span>
            <ListRowTitle>{alert.title}</ListRowTitle>
            <ListRowSubtitle>{alert.detail}</ListRowSubtitle>
            <ListRowValue>{alert.time}</ListRowValue>
            <ListRowAccessory type="disclosure" />
          </ListRow>
        ))}
      </ListSection>
    </List>
  )
}

function MacAnalytics({ store }: { store: Store }) {
  const [page, setPage] = React.useState<Page>("overview")
  const [workspace, setWorkspace] = React.useState("Northwind")
  const label = pages.find((p) => p.id === page)?.label ?? "Overview"
  return (
    <MacFrame>
      <Window aria-label="macbetter">
        <WindowSidebar>
          <WindowSidebarHeader>
            <Menu onAction={(action) => toast(action === "create" ? "Create a workspace" : `${workspace} settings`)}>
              <MenuTrigger variant="plain" tone="neutral" aria-label={`Workspace: ${workspace}`}>
                <WindowAppName icon={<Avatar shape="app" size="xs" name={workspace} color="auto" />}>{workspace}</WindowAppName>
              </MenuTrigger>
              <MenuContent align="start">
                <MenuRadioGroup value={workspace} onValueChange={(value) => setWorkspace(value as string)}>
                  <MenuGroupLabel>Workspaces</MenuGroupLabel>
                  {["Northwind", "Contoso", "Personal"].map((name) => (
                    <MenuRadioItem key={name} value={name} closeOnSelect>
                      {name}
                    </MenuRadioItem>
                  ))}
                </MenuRadioGroup>
                <MenuSeparator />
                <MenuItem value="create">
                  Create Workspace…
                </MenuItem>
                <MenuItem value="settings">
                  Workspace Settings
                </MenuItem>
              </MenuContent>
            </Menu>
          </WindowSidebarHeader>
          <Sidebar aria-label="Workspace">
            <SidebarSection title="Analytics">
              {pages.map((p) => (
                <SidebarItem
                  key={p.id}
                  icon={<p.icon />}
                  current={page === p.id}
                  badge={p.id === "alerts" ? alerts.length : p.id === "datasets" ? store.datasets.length : undefined}
                  onClick={() => setPage(p.id)}
                >
                  {p.label}
                </SidebarItem>
              ))}
            </SidebarSection>
            <SidebarSection title="Sources" collapsible>
              {[
                { name: "Supabase", tint: "var(--mb-green)" },
                { name: "Stripe", tint: "var(--mb-indigo)" },
                { name: "PostHog", tint: "var(--mb-yellow)" },
              ].map((source) => (
                <SidebarItem key={source.name} tint={source.tint} icon={<CircleIcon fill="currentColor" strokeWidth={0} />} onClick={() => setPage("datasets")}>
                  {source.name}
                </SidebarItem>
              ))}
            </SidebarSection>
          </Sidebar>
        </WindowSidebar>
        <WindowTitlebar>
          <Toolbar aria-label="Dashboard">
            <ToolbarTitle subtitle={`${workspace.toLowerCase()} · ${store.env}`}>{label}</ToolbarTitle>
            <ToolbarSpacer />
            <RangePicker store={store} />
            <Select
              value={store.env}
              onValueChange={(v) => v && store.setEnv(v as string)}
              items={[
                { value: "production", label: "Production" },
                { value: "staging", label: "Staging" },
                { value: "preview", label: "Preview" },
              ]}
            >
              <SelectTrigger size="sm" aria-label="Environment" />
              <SelectContent>
                <SelectList>
                  <SelectItem value="production">Production</SelectItem>
                  <SelectItem value="staging">Staging</SelectItem>
                  <SelectItem value="preview">Preview</SelectItem>
                </SelectList>
              </SelectContent>
            </Select>
            <ToolbarButton aria-label="Refresh all" onClick={() => toast("Refreshing 7 datasets")}>
              <RefreshCwIcon aria-hidden="true" />
            </ToolbarButton>
            <ToolbarSearchField aria-label="Search datasets and metrics" />
            <Button variant="filled" size="sm" onClick={() => toast("Ask the agent", { description: "Try “Why did errors rise on Tuesday?”" })}>
              <SparklesIcon aria-hidden="true" />
              Ask
            </Button>
          </Toolbar>
        </WindowTitlebar>
        <WindowBody>
          {page === "overview" ? <Overview store={store} /> : null}
          {page === "datasets" ? (
            <div className="ex-dash">
              <Card className="ex-table-card">
                <DatasetTable store={store} />
              </Card>
            </div>
          ) : null}
          {page === "metrics" ? (
            <div className="ex-dash">
              <div className="ex-kpis">
                {kpis(store.range).map((kpi) => (
                  <KpiCard key={kpi.id} kpi={kpi} />
                ))}
              </div>
              <Card>
                <UsersChart range={store.range} />
              </Card>
            </div>
          ) : null}
          {page === "agents" ? <AgentsPage store={store} /> : null}
          {page === "alerts" ? <AlertsPage /> : null}
        </WindowBody>
      </Window>
      <DeleteAlert store={store} />
    </MacFrame>
  )
}

/* ── iPhone ────────────────────────────────────────────────────── */

function PhoneAnalytics({ store }: { store: Store }) {
  return (
    <Phone label="macbetter on iPhone">
      <div className="ex-app-root">
        <TabBar defaultValue="overview">
          <TabBarPanel value="overview">
            <NavigationStack className="ex-grouped-stack">
              <NavigationBar title="Overview" largeTitle>
                <NavigationBarTrailing>
                  <Button variant="plain" shape="circle" aria-label="Ask the agent" onClick={() => toast("Ask the agent")}>
                    <SparklesIcon aria-hidden="true" />
                  </Button>
                </NavigationBarTrailing>
              </NavigationBar>
              <div className="ex-phone-dash">
                <RangePicker store={store} block />
                <div className="ex-kpis ex-kpis-phone">
                  {kpis(store.range).map((kpi) => (
                    <KpiCard key={kpi.id} kpi={kpi} />
                  ))}
                </div>
                <Card>
                  <UsersChart range={store.range} compact />
                </Card>
                <QuotaCard />
              </div>
            </NavigationStack>
          </TabBarPanel>
          <TabBarPanel value="datasets">
            <NavigationStack className="ex-grouped-stack">
              <NavigationBar title="Datasets" largeTitle />
              <List>
                <ListSection footer="Tap a dataset to see its schema and refresh history.">
                  {store.datasets.map((dataset) => (
                    <ListRow key={dataset.id} onClick={() => {}}>
                      <ListRowTitle className="ex-mono">{dataset.name}</ListRowTitle>
                      <ListRowSubtitle>
                        {dataset.source} · {freshnessLabel(dataset.freshness)}
                      </ListRowSubtitle>
                      <ListRowValue>
                        <StatusBadge status={dataset.status} />
                      </ListRowValue>
                      <ListRowAccessory type="disclosure" />
                    </ListRow>
                  ))}
                </ListSection>
              </List>
            </NavigationStack>
          </TabBarPanel>
          <TabBarPanel value="agents">
            <NavigationStack className="ex-grouped-stack">
              <NavigationBar title="Agents" largeTitle />
              <AgentsPage store={store} />
            </NavigationStack>
          </TabBarPanel>
          <TabBarPanel value="alerts">
            <NavigationStack className="ex-grouped-stack">
              <NavigationBar title="Alerts" largeTitle />
              <AlertsPage />
            </NavigationStack>
          </TabBarPanel>
          <TabBarList aria-label="macbetter">
            <TabBarItem value="overview" icon={<GaugeIcon />}>
              Overview
            </TabBarItem>
            <TabBarItem value="datasets" icon={<DatabaseIcon />}>
              Datasets
            </TabBarItem>
            <TabBarItem value="agents" icon={<BotIcon />}>
              Agents
            </TabBarItem>
            <TabBarItem value="alerts" icon={<BellIcon />}>
              Alerts
            </TabBarItem>
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
