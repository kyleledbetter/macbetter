"use client"

import { Button } from "@dreambase/stardust/button"
import { DeviceFrame } from "@dreambase/stardust/device-frame"
import {
  List,
  ListRow,
  ListRowAccessory,
  ListRowIcon,
  ListRowSubtitle,
  ListRowTitle,
  ListRowValue,
  ListSection,
} from "@dreambase/stardust/list"
import {
  NavigationBar,
  NavigationBarBackButton,
  NavigationBarTrailing,
  NavigationStack,
} from "@dreambase/stardust/navigation-bar"
import { Switch } from "@dreambase/stardust/switch"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "@dreambase/stardust/tab-bar"
import {
  BellIcon,
  CalendarCheckIcon,
  CircleCheckIcon,
  CircleIcon,
  FolderIcon,
  PlusIcon,
  SettingsIcon,
  SunMoonIcon,
} from "lucide-react"
import { usePreference } from "@ui-sdk/react/preferences"
import { useState } from "react"
import { colorScheme } from "@/lib/preferences"
import { dueLabel, ME, projects, statusLabels, TODAY, type Task } from "./data"
import type { SceneState } from "./hero-scene"

function TaskRow({ task, state }: { task: Task; state: SceneState }) {
  const status = state.statusOf(task)
  const done = status === "done"
  return (
    <ListRow
      onClick={() => state.toggleDone(task)}
      aria-pressed={done}
      className="lp-phone-task"
      data-done={done ? "" : undefined}
    >
      <span aria-hidden="true" className="lp-phone-check">
        {done ? <CircleCheckIcon /> : <CircleIcon />}
      </span>
      <ListRowTitle>{task.title}</ListRowTitle>
      <ListRowSubtitle>
        {task.owner === ME ? "Me" : task.owner} · {dueLabel(task.due)} · {statusLabels[status]}
      </ListRowSubtitle>
    </ListRow>
  )
}

function ProjectsTab({ state }: { state: SceneState }) {
  const [open, setOpen] = useState(false)
  const project = projects.find((p) => p.id === state.projectId) ?? projects[0]

  if (open) {
    const tasks = project.tasks.filter((task) => state.showCompleted || state.statusOf(task) !== "done")
    return (
      <NavigationStack key={project.id}>
        <NavigationBar title={project.name} headingLevel={3}>
          <NavigationBarBackButton onClick={() => setOpen(false)}>Projects</NavigationBarBackButton>
          <NavigationBarTrailing>
            <Button variant="plain" shape="circle" aria-label="New task">
              <PlusIcon aria-hidden="true" />
            </Button>
          </NavigationBarTrailing>
        </NavigationBar>
        <List className="lp-phone-list">
          <ListSection footer="Tap a task to mark it done. The Mac window follows.">
            {tasks.map((task) => (
              <TaskRow key={task.id} task={task} state={state} />
            ))}
          </ListSection>
        </List>
      </NavigationStack>
    )
  }

  return (
    <NavigationStack>
      <NavigationBar title="Projects" largeTitle headingLevel={3}>
        <NavigationBarTrailing>
          <Button variant="plain" shape="circle" aria-label="New project">
            <PlusIcon aria-hidden="true" />
          </Button>
        </NavigationBarTrailing>
      </NavigationBar>
      <List className="lp-phone-list">
        <ListSection>
          {projects.map((p) => {
            const remaining = p.tasks.filter((task) => state.statusOf(task) !== "done").length
            return (
              <ListRow
                key={p.id}
                onClick={() => {
                  state.setProjectId(p.id)
                  setOpen(true)
                }}
              >
                <ListRowIcon color={p.color}>
                  <FolderIcon aria-hidden="true" />
                </ListRowIcon>
                <ListRowTitle>{p.name}</ListRowTitle>
                <ListRowValue>{remaining}</ListRowValue>
                <ListRowAccessory type="disclosure" />
              </ListRow>
            )
          })}
        </ListSection>
        <ListSection>
          <ListRow>
            <ListRowIcon color="green">
              <CircleCheckIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Show completed</ListRowTitle>
            <ListRowAccessory>
              <Switch
                aria-label="Show completed"
                checked={state.showCompleted}
                onCheckedChange={(checked) => state.setShowCompleted(Boolean(checked))}
              />
            </ListRowAccessory>
          </ListRow>
        </ListSection>
      </List>
    </NavigationStack>
  )
}

function TodayTab({ state }: { state: SceneState }) {
  const tasks = projects.flatMap((p) => p.tasks).filter((task) => task.due === TODAY)
  return (
    <NavigationStack>
      <NavigationBar title="Today" largeTitle headingLevel={3} />
      <List className="lp-phone-list">
        <ListSection header="Due today">
          {tasks.map((task) => (
            <TaskRow key={task.id} task={task} state={state} />
          ))}
        </ListSection>
      </List>
    </NavigationStack>
  )
}

function SettingsTab({ state }: { state: SceneState }) {
  const scheme = usePreference(colorScheme)
  return (
    <NavigationStack>
      <NavigationBar title="Settings" largeTitle headingLevel={3} />
      <List className="lp-phone-list">
        <ListSection>
          <ListRow>
            <ListRowIcon color="red">
              <BellIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Due date reminders</ListRowTitle>
            <ListRowAccessory>
              <Switch aria-label="Due date reminders" defaultChecked />
            </ListRowAccessory>
          </ListRow>
          <ListRow>
            <ListRowIcon color="green">
              <CircleCheckIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Show completed</ListRowTitle>
            <ListRowAccessory>
              <Switch
                aria-label="Show completed"
                checked={state.showCompleted}
                onCheckedChange={(checked) => state.setShowCompleted(Boolean(checked))}
              />
            </ListRowAccessory>
          </ListRow>
          <ListRow
            onClick={(event) =>
              colorScheme.set(scheme.resolved === "dark" ? "light" : "dark", {
                reason: "press",
                event: event.nativeEvent,
              })
            }
          >
            <ListRowIcon color="indigo">
              <SunMoonIcon aria-hidden="true" />
            </ListRowIcon>
            <ListRowTitle>Appearance</ListRowTitle>
            <ListRowValue>{scheme.resolved === "dark" ? "Dark" : "Light"}</ListRowValue>
          </ListRow>
        </ListSection>
      </List>
    </NavigationStack>
  )
}

function PhoneApp({ state }: { state: SceneState }) {
  return (
    <DeviceFrame className="lp-phone" role="group" aria-label="Projects for iPhone">
      <TabBar defaultValue="projects">
        <TabBarPanel value="projects">
          <ProjectsTab state={state} />
        </TabBarPanel>
        <TabBarPanel value="today">
          <TodayTab state={state} />
        </TabBarPanel>
        <TabBarPanel value="settings">
          <SettingsTab state={state} />
        </TabBarPanel>
        <TabBarList aria-label="Sections">
          <TabBarItem value="projects" icon={<FolderIcon />}>
            Projects
          </TabBarItem>
          <TabBarItem value="today" icon={<CalendarCheckIcon />}>
            Today
          </TabBarItem>
          <TabBarItem value="settings" icon={<SettingsIcon />}>
            Settings
          </TabBarItem>
        </TabBarList>
      </TabBar>
    </DeviceFrame>
  )
}

export { PhoneApp }
