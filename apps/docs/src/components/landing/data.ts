import type { SystemColor } from "macbetter"

type Status = "todo" | "doing" | "review" | "done"

type Task = {
  id: string
  title: string
  owner: string
  /** Day of November 2026. */
  due: number
  status: Status
}

type Project = {
  id: string
  name: string
  color: SystemColor
  tasks: Task[]
}

const ME = "Maya Chen"
const TODAY = 14

const projects: Project[] = [
  {
    id: "launch",
    name: "Macbetter launch",
    color: "orange",
    tasks: [
      { id: "l1", title: "Write the theming guide", owner: ME, due: 18, status: "doing" },
      { id: "l2", title: "Contrast pass on Nebula", owner: "Ana Lima", due: 14, status: "review" },
      { id: "l3", title: "Record the component walkthrough", owner: "Theo Park", due: 19, status: "todo" },
      { id: "l4", title: "Ship the floating tab bar", owner: "Kofi Mensah", due: 12, status: "done" },
      { id: "l5", title: "Publish release notes", owner: ME, due: 21, status: "todo" },
      { id: "l6", title: "Audit focus rings", owner: "Ana Lima", due: 10, status: "done" },
      { id: "l7", title: "Right-to-left screenshots", owner: "Theo Park", due: 14, status: "doing" },
    ],
  },
  {
    id: "website",
    name: "Website refresh",
    color: "green",
    tasks: [
      { id: "w1", title: "New pricing page", owner: "Inès Moreau", due: 16, status: "doing" },
      { id: "w2", title: "Customer stories layout", owner: ME, due: 14, status: "todo" },
      { id: "w3", title: "Compress hero video", owner: "Kofi Mensah", due: 11, status: "done" },
      { id: "w4", title: "Cookie banner copy", owner: "Inès Moreau", due: 20, status: "review" },
    ],
  },
  {
    id: "planning",
    name: "Q1 planning",
    color: "blue",
    tasks: [
      { id: "p1", title: "Draft team goals", owner: ME, due: 17, status: "doing" },
      { id: "p2", title: "Hiring plan", owner: "Wren Takahashi", due: 24, status: "todo" },
      { id: "p3", title: "Budget review", owner: "Wren Takahashi", due: 14, status: "review" },
    ],
  },
  {
    id: "research",
    name: "User research",
    color: "purple",
    tasks: [
      { id: "r1", title: "Interview five design leads", owner: "Theo Park", due: 15, status: "doing" },
      { id: "r2", title: "Synthesize onboarding notes", owner: ME, due: 19, status: "todo" },
      { id: "r3", title: "Recruit for the iPad study", owner: "Ana Lima", due: 9, status: "done" },
    ],
  },
]

const statusLabels: Record<Status, string> = {
  todo: "Not started",
  doing: "In progress",
  review: "In review",
  done: "Done",
}

const statusColors: Record<Status, SystemColor | "gray" | "accent"> = {
  todo: "gray",
  doing: "accent",
  review: "blue",
  done: "green",
}

function dueLabel(day: number) {
  if (day === TODAY) return "Today"
  if (day === TODAY + 1) return "Tomorrow"
  if (day === TODAY - 1) return "Yesterday"
  return `Nov ${day}`
}

export { dueLabel, ME, projects, statusColors, statusLabels, TODAY }
export type { Project, Status, Task }
