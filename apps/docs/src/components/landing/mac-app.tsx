"use client"

import { Avatar } from "macbetter/avatar"
import { Badge } from "macbetter/badge"
import {
  Menu,
  MenuCheckboxItem,
  MenuContent,
  MenuGroupLabel,
  MenuRadioGroup,
  MenuRadioItem,
  MenuSeparator,
  MenuTrigger,
} from "macbetter/menu"
import { SegmentedControl, SegmentedControlItem } from "macbetter/segmented-control"
import { Sidebar, SidebarItem, SidebarSection } from "macbetter/sidebar"
import { Switch } from "macbetter/switch"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "macbetter/table"
import {
  Toolbar,
  ToolbarButton,
  ToolbarSearchField,
  ToolbarSpacer,
  ToolbarTitle,
} from "macbetter/toolbar"
import { Window, WindowBody, WindowSidebar, WindowTitlebar, WindowTrafficLights } from "macbetter/window"
import { ArrowUpDownIcon, CalendarIcon, CircleIcon, InboxIcon, PlusIcon, StarIcon } from "lucide-react"
import { useMemo, useState } from "react"
import { dueLabel, ME, projects, statusColors, statusLabels, TODAY } from "./data"
import type { SceneState } from "./hero-scene"

type Filter = "all" | "mine" | "soon"
type SortKey = "due" | "title" | "status"

const statusOrder = { doing: 0, review: 1, todo: 2, done: 3 }

function MacApp({ state }: { state: SceneState }) {
  const { projectId, setProjectId, showCompleted, setShowCompleted, statusOf } = state
  const [filter, setFilter] = useState<Filter>("all")
  const [sort, setSort] = useState<SortKey>("status")
  const [query, setQuery] = useState("")
  const [selected, setSelected] = useState<string[]>(["l1"])
  const project = projects.find((p) => p.id === projectId) ?? projects[0]

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase()
    return project.tasks
      .map((task) => ({ ...task, status: statusOf(task) }))
      .filter((task) => showCompleted || task.status !== "done")
      .filter((task) => filter !== "mine" || task.owner === ME)
      .filter((task) => filter !== "soon" || task.due <= TODAY + 3)
      .filter((task) => !q || task.title.toLowerCase().includes(q))
      .sort((a, b) =>
        sort === "title"
          ? a.title.localeCompare(b.title)
          : sort === "status"
            ? statusOrder[a.status] - statusOrder[b.status]
            : a.due - b.due
      )
  }, [project, query, showCompleted, filter, sort, statusOf])

  const open = project.tasks.filter((task) => statusOf(task) !== "done").length

  return (
    <Window aria-label="Projects for Mac" className="lp-mac-window">
      <WindowSidebar>
        <WindowTrafficLights />
        <Sidebar aria-label="Projects">
          <SidebarSection>
            <SidebarItem icon={<InboxIcon />} badge={4}>
              Inbox
            </SidebarItem>
            <SidebarItem icon={<StarIcon />}>Today</SidebarItem>
            <SidebarItem icon={<CalendarIcon />}>Upcoming</SidebarItem>
          </SidebarSection>
          <SidebarSection title="Projects">
            {projects.map((p) => (
              <SidebarItem
                key={p.id}
                tint={`var(--mb-${p.color})`}
                icon={<CircleIcon fill="currentColor" strokeWidth={0} />}
                current={p.id === project.id}
                onClick={() => setProjectId(p.id)}
              >
                {p.name}
              </SidebarItem>
            ))}
          </SidebarSection>
        </Sidebar>
      </WindowSidebar>
      <WindowTitlebar>
        <Toolbar aria-label={project.name}>
          <ToolbarTitle subtitle={`${open} open ${open === 1 ? "task" : "tasks"}`}>{project.name}</ToolbarTitle>
          <ToolbarSpacer />
          <SegmentedControl
            size="sm"
            aria-label="Show"
            value={filter}
            onValueChange={(value) => value && setFilter(value as Filter)}
            className="lp-mac-filter"
          >
            <SegmentedControlItem value="all">All</SegmentedControlItem>
            <SegmentedControlItem value="mine">Mine</SegmentedControlItem>
            <SegmentedControlItem value="soon">Due soon</SegmentedControlItem>
          </SegmentedControl>
          <Menu>
            <MenuTrigger variant="plain" tone="neutral" indicator={false} aria-label="Sort and view options" className="lp-mac-menu-trigger">
              <ArrowUpDownIcon aria-hidden="true" />
            </MenuTrigger>
            <MenuContent>
              <MenuRadioGroup name="sort" value={sort} onValueChange={(value) => setSort(value as SortKey)}>
                <MenuGroupLabel>Sort By</MenuGroupLabel>
                <MenuRadioItem value="due">Due Date</MenuRadioItem>
                <MenuRadioItem value="title">Title</MenuRadioItem>
                <MenuRadioItem value="status">Status</MenuRadioItem>
              </MenuRadioGroup>
              <MenuSeparator />
              <MenuCheckboxItem
                value="show-completed"
                checked={showCompleted}
                onCheckedChange={(checked) => setShowCompleted(Boolean(checked))}
              >
                Show Completed Tasks
              </MenuCheckboxItem>
            </MenuContent>
          </Menu>
          <ToolbarButton aria-label="New task">
            <PlusIcon aria-hidden="true" />
          </ToolbarButton>
          <ToolbarSearchField aria-label="Search tasks" value={query} onChange={(event) => setQuery(event.currentTarget.value)} />
        </Toolbar>
      </WindowTitlebar>
      <WindowBody className="lp-mac-body">
        <div className="lp-mac-table">
          <Table aria-label={`${project.name} tasks`} selectionMode="single" value={selected} onValueChange={setSelected}>
            <TableHeader>
              <TableColumn>Task</TableColumn>
              <TableColumn>Owner</TableColumn>
              <TableColumn>Due</TableColumn>
              <TableColumn>Status</TableColumn>
            </TableHeader>
            <TableBody>
              {rows.map((task) => (
                <TableRow key={task.id} value={task.id} data-done={task.status === "done" ? "" : undefined}>
                  <TableCell className="lp-mac-task">{task.title}</TableCell>
                  <TableCell secondary>
                    <span className="lp-mac-owner">
                      <Avatar name={task.owner} size="xs" color="auto" />
                      {task.owner === ME ? "Me" : task.owner.split(" ")[0]}
                    </span>
                  </TableCell>
                  <TableCell secondary>{dueLabel(task.due)}</TableCell>
                  <TableCell>
                    <Badge variant="dot" color={statusColors[task.status]}>
                      {statusLabels[task.status]}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          {rows.length === 0 ? <p className="lp-mac-empty">No tasks match.</p> : null}
        </div>
        <div className="lp-mac-footer">
          <span>
            {rows.length} {rows.length === 1 ? "task" : "tasks"}
          </span>
          <label className="lp-mac-footer-toggle">
            Show completed
            <Switch size="sm" checked={showCompleted} onCheckedChange={(checked) => setShowCompleted(Boolean(checked))} />
          </label>
        </div>
      </WindowBody>
    </Window>
  )
}

export { MacApp }
