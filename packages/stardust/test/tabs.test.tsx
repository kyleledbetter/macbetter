import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Tabs, TabsList, TabsPanel, TabsTab } from "../src/components/tabs"

function Example(props: { variant?: "bordered" | "plain" }) {
  return (
    <Tabs defaultValue="general" {...props}>
      <TabsList aria-label="Settings">
        <TabsTab value="general">General</TabsTab>
        <TabsTab value="sharing">Sharing</TabsTab>
      </TabsList>
      <TabsPanel value="general">General settings</TabsPanel>
      <TabsPanel value="sharing">Sharing settings</TabsPanel>
    </Tabs>
  )
}

test("renders its classes, variant and the sliding indicator", () => {
  const { container } = render(<Example variant="plain" />)
  const root = container.querySelector(".sd-tabs") as HTMLElement
  expect(root.dataset.variant).toBe("plain")
  const list = screen.getByRole("tablist", { name: "Settings" })
  expect(list.className).toContain("sd-tabs-list")
  expect(list.querySelector(".sd-tabs-indicator")).not.toBeNull()
  expect(screen.getByRole("tab", { name: "General" }).className).toContain("sd-tabs-tab")
  expect(screen.getByRole("tabpanel").className).toContain("sd-tabs-panel")
})

test("defaults to the bordered tab view", () => {
  const { container } = render(<Example />)
  expect((container.querySelector(".sd-tabs") as HTMLElement).dataset.variant).toBe("bordered")
})

test("arrow keys move the selection and show its panel", async () => {
  const user = userEvent.setup()
  render(<Example />)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("tab", { name: "General" }))
  await user.keyboard("{ArrowRight}")
  const sharing = screen.getByRole("tab", { name: "Sharing" })
  expect(sharing.getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("tabpanel").textContent).toBe("Sharing settings")
})
