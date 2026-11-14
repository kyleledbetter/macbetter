import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { TabBar, TabBarItem, TabBarList, TabBarPanel } from "../src/components/tab-bar"

function Music({ variant }: { variant?: "floating" | "classic" }) {
  return (
    <TabBar defaultValue="home">
      <TabBarPanel value="home">Recently played</TabBarPanel>
      <TabBarPanel value="library">Your albums</TabBarPanel>
      <TabBarPanel value="search">Search Music</TabBarPanel>
      <TabBarList aria-label="Music" variant={variant}>
        <TabBarItem value="home" icon={<svg data-testid="icon" />}>Home</TabBarItem>
        <TabBarItem value="library" icon={<svg />}>Library</TabBarItem>
        <TabBarItem value="search" icon={<svg />}>Search</TabBarItem>
      </TabBarList>
    </TabBar>
  )
}

test("pre-composes the glass capsule, its pill and each item's icon and label", () => {
  render(<Music />)

  const list = screen.getByRole("tablist", { name: "Music" })
  expect(list.className).toBe("sd-tab-bar-list sd-glass")
  expect(list.dataset.variant).toBe("floating")
  expect(list.querySelector(".sd-tab-bar-indicator")).not.toBeNull()
  const home = screen.getByRole("tab", { name: "Home" })
  expect(home.className).toBe("sd-tab-bar-item")
  expect(screen.getByTestId("icon").parentElement?.className).toBe("sd-tab-bar-item-icon")
  expect(home.querySelector(".sd-tab-bar-item-label")?.textContent).toBe("Home")
  expect(screen.getByRole("tabpanel").className).toBe("sd-tab-bar-panel")
})

test("the classic bar has no glass and no pill", () => {
  render(<Music variant="classic" />)

  const list = screen.getByRole("tablist", { name: "Music" })
  expect(list.className).toBe("sd-tab-bar-list")
  expect(list.dataset.variant).toBe("classic")
  expect(list.querySelector(".sd-tab-bar-indicator")).toBeNull()
})

test("arrow keys move between tabs and show their panels", async () => {
  const user = userEvent.setup()
  render(<Music />)

  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("tabpanel", { name: "Home" }))
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("tab", { name: "Home" }))
  await user.keyboard("{ArrowRight}")
  const library = screen.getByRole("tab", { name: "Library" })
  expect(document.activeElement).toBe(library)
  expect(library.getAttribute("aria-selected")).toBe("true")
  expect(screen.getByRole("tabpanel", { name: "Library" }).textContent).toBe("Your albums")
})
