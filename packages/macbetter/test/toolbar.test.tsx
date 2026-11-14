import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Toolbar,
  ToolbarButton,
  ToolbarGroup,
  ToolbarSearchField,
  ToolbarSeparator,
  ToolbarSpacer,
  ToolbarTitle,
  ToolbarToggle,
  ToolbarToggleGroup,
} from "../src/components/toolbar"

function Finder() {
  return (
    <Toolbar aria-label="Finder" variant="floating">
      <ToolbarGroup aria-label="History">
        <ToolbarButton aria-label="Back">‹</ToolbarButton>
        <ToolbarButton aria-label="Forward">›</ToolbarButton>
      </ToolbarGroup>
      <ToolbarTitle subtitle="8 items">Documents</ToolbarTitle>
      <ToolbarSpacer />
      <ToolbarToggleGroup aria-label="View" defaultValue={["icons"]}>
        <ToolbarToggle value="icons" aria-label="Icons" />
        <ToolbarToggle value="list" aria-label="List" />
      </ToolbarToggleGroup>
      <ToolbarSeparator />
      <ToolbarSearchField aria-label="Search" />
    </Toolbar>
  )
}

test("carries Macbetter's classes and variant", () => {
  render(<Finder />)
  const toolbar = screen.getByRole("toolbar", { name: "Finder" })
  expect(toolbar.className).toBe("mb-toolbar")
  expect(toolbar.dataset.variant).toBe("floating")
  expect(screen.getByRole("button", { name: "Back" }).className).toBe("mb-toolbar-button")
  expect(screen.getByRole("group", { name: "History" }).className).toBe("mb-toolbar-group")
  expect(screen.getByRole("separator").className).toBe("mb-toolbar-separator")
  expect(toolbar.querySelector(".mb-toolbar-spacer")?.getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByText("8 items").className).toBe("mb-toolbar-subtitle")
  const search = screen.getByRole("searchbox", { name: "Search" })
  expect(search.getAttribute("placeholder")).toBe("Search")
})

test("is one tab stop with arrow keys between its items", async () => {
  const user = userEvent.setup()
  render(
    <>
      <Finder />
      <button type="button">After</button>
    </>
  )

  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Back" }))
  await user.keyboard("{ArrowRight}")
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Forward" }))
  await user.keyboard("{ArrowRight}")
  const icons = screen.getByRole("button", { name: "Icons" })
  expect(document.activeElement).toBe(icons)
  expect(icons.getAttribute("aria-pressed")).toBe("true")
  await user.keyboard("{ArrowRight}{Enter}")
  expect(screen.getByRole("button", { name: "List" }).getAttribute("aria-pressed")).toBe("true")
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "After" }))
})

test("the search field is a named search input inside the toolbar's arrow-key order", async () => {
  const user = userEvent.setup()
  render(<Finder />)
  const search = screen.getByRole("searchbox", { name: "Search" })
  expect(search.getAttribute("placeholder")).toBe("Search")
  expect(search.className).toBe("mb-toolbar-search-input")
  expect(search.parentElement?.className).toBe("mb-toolbar-search")
  expect(search.parentElement?.querySelector("svg")?.getAttribute("aria-hidden")).toBe("true")
  screen.getByRole("button", { name: "Back" }).focus()
  await user.keyboard("{End}")
  expect(document.activeElement).toBe(search)
})
