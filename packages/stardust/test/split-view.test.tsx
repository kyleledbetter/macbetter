import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { SplitView, SplitViewDivider, SplitViewPane } from "../src/components/split-view"

function Example({ onLayoutChange }: { onLayoutChange?: (layout: number[]) => void }) {
  return (
    <SplitView onLayoutChange={onLayoutChange}>
      <SplitViewPane variant="sidebar" defaultSize={30} minSize={20}>
        Mailboxes
      </SplitViewPane>
      <SplitViewDivider aria-label="Resize mailboxes" />
      <SplitViewPane>Messages</SplitViewPane>
    </SplitView>
  )
}

test("renders its classes and pane variants", () => {
  const { container } = render(<Example />)
  expect(container.querySelector(".sd-split-view")).not.toBeNull()
  const panes = container.querySelectorAll<HTMLElement>(".sd-split-view-pane")
  expect(panes[0].dataset.variant).toBe("sidebar")
  expect(panes[1].dataset.variant).toBe("content")
  expect(screen.getByRole("separator", { name: "Resize mailboxes" }).className).toContain("sd-split-view-divider")
})

test("arrow keys move the divider", async () => {
  const user = userEvent.setup()
  const onLayoutChange = vi.fn()
  const rect = vi.spyOn(HTMLElement.prototype, "getBoundingClientRect").mockReturnValue(new DOMRect(0, 0, 800, 400))
  render(<Example onLayoutChange={onLayoutChange} />)
  await act(() => new Promise((resolve) => setTimeout(resolve, 0)))
  screen.getByRole("separator", { name: "Resize mailboxes" }).focus()
  await user.keyboard("{ArrowRight}")
  expect(onLayoutChange).toHaveBeenCalled()
  expect(onLayoutChange.mock.calls[0][0][0]).toBeGreaterThan(30)
  rect.mockRestore()
})
