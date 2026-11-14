import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Outline,
  OutlineGroup,
  OutlineItem,
  OutlineItemDetail,
  OutlineItemIcon,
  OutlineItemLabel,
  OutlineItemText,
} from "../src/components/outline"

function Files() {
  return (
    <Outline aria-label="Documents" guides>
      <OutlineItem value="projects">
        <OutlineItemLabel>
          <OutlineItemIcon>F</OutlineItemIcon>
          <OutlineItemText>Projects</OutlineItemText>
          <OutlineItemDetail>2 items</OutlineItemDetail>
        </OutlineItemLabel>
        <OutlineGroup>
          <OutlineItem value="projects/spec">
            <OutlineItemLabel>
              <OutlineItemText>Spec.pdf</OutlineItemText>
            </OutlineItemLabel>
          </OutlineItem>
        </OutlineGroup>
      </OutlineItem>
      <OutlineItem value="notes">
        <OutlineItemLabel>
          <OutlineItemText>Notes.md</OutlineItemText>
        </OutlineItemLabel>
      </OutlineItem>
    </Outline>
  )
}

test("a wrapped group still makes its item a branch with a disclosure triangle", () => {
  render(<Files />)
  const tree = screen.getByRole("tree", { name: "Documents" })
  expect(tree.className).toBe("sd-outline")
  expect(tree.hasAttribute("data-guides")).toBe(true)

  const projects = screen.getByRole("treeitem", { name: /Projects/ })
  expect(projects.className).toBe("sd-outline-item")
  expect(projects.getAttribute("aria-expanded")).toBe("false")
  const indicator = projects.querySelector(".sd-outline-indicator") as HTMLElement
  expect(indicator.hasAttribute("data-branch")).toBe(true)
  expect(projects.querySelector(".sd-outline-row")).not.toBeNull()
  expect(projects.querySelector(".sd-outline-icon")?.getAttribute("aria-hidden")).toBe("true")

  const notes = screen.getByRole("treeitem", { name: "Notes.md" })
  expect(notes.getAttribute("aria-expanded")).toBeNull()
})

test("arrows expand a branch, enter it and select", async () => {
  const user = userEvent.setup()
  render(<Files />)
  const projects = screen.getByRole("treeitem", { name: /Projects/ })

  await user.tab()
  expect(document.activeElement).toBe(projects)
  await user.keyboard("{ArrowRight}")
  expect(projects.getAttribute("aria-expanded")).toBe("true")
  await user.keyboard("{ArrowRight}")
  const spec = screen.getByRole("treeitem", { name: "Spec.pdf" })
  expect(document.activeElement).toBe(spec)
  await user.keyboard("{Enter}")
  expect(spec.getAttribute("aria-selected")).toBe("true")
  expect(spec.querySelector(".sd-outline-row")?.hasAttribute("data-selected")).toBe(true)
})

test("the selection follows the arrow keys, as in Finder, unless activation is manual", async () => {
  const user = userEvent.setup()
  const { unmount } = render(<Files />)
  await user.tab()
  await user.keyboard("{ArrowDown}")
  const notes = screen.getByRole("treeitem", { name: /Notes/ })
  expect(document.activeElement).toBe(notes)
  expect(notes.getAttribute("aria-selected")).toBe("true")
  unmount()

  render(
    <Outline aria-label="Manual" activation="manual">
      <OutlineItem value="a">
        <OutlineItemLabel>
          <OutlineItemText>A</OutlineItemText>
        </OutlineItemLabel>
      </OutlineItem>
      <OutlineItem value="b">
        <OutlineItemLabel>
          <OutlineItemText>B</OutlineItemText>
        </OutlineItemLabel>
      </OutlineItem>
    </Outline>
  )
  await user.tab()
  await user.keyboard("{ArrowDown}")
  expect(screen.getByRole("treeitem", { name: "B" }).getAttribute("aria-selected")).not.toBe("true")
})
