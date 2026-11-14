import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Sidebar, SidebarItem, SidebarSection } from "../src/components/sidebar"

test("names its navigation and lists, and marks the current row", () => {
  render(
    <Sidebar aria-label="Mailboxes" selection="gray">
      <SidebarSection title="Favorites">
        <SidebarItem href="#inbox" icon={<svg />} badge={12} current>
          Inbox
        </SidebarItem>
        <SidebarItem href="#sent">Sent</SidebarItem>
      </SidebarSection>
    </Sidebar>
  )

  const nav = screen.getByRole("navigation", { name: "Mailboxes" })
  expect(nav.className).toBe("sd-sidebar")
  expect(nav.dataset.selection).toBe("gray")
  const list = screen.getByRole("list", { name: "Favorites" })
  expect(list.tagName).toBe("UL")
  expect(screen.getAllByRole("listitem")).toHaveLength(2)

  const inbox = screen.getByRole("link", { name: "Inbox 12" })
  expect(inbox.getAttribute("aria-current")).toBe("page")
  expect(inbox.className).toBe("sd-sidebar-item")
  expect(inbox.querySelector(".sd-sidebar-item-icon")?.getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByRole("link", { name: "Sent" }).hasAttribute("aria-current")).toBe(false)
})

test("rows without href are buttons that work from the keyboard", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <Sidebar aria-label="Library">
      <SidebarSection title="Library">
        <SidebarItem onClick={onClick} tint="var(--sd-pink)" data-testid="recent" title="Recently Added">
          Recently Added
        </SidebarItem>
      </SidebarSection>
    </Sidebar>
  )

  const row = screen.getByRole("button", { name: "Recently Added" })
  expect(row.style.getPropertyValue("--sd-sidebar-icon-color")).toBe("var(--sd-pink)")
  expect(row.dataset.testid).toBe("recent")
  row.focus()
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
})

test("a collapsible section hides its rows from its header", async () => {
  const user = userEvent.setup()
  render(
    <Sidebar aria-label="Finder">
      <SidebarSection title="Tags" collapsible>
        <SidebarItem href="#red">Red</SidebarItem>
      </SidebarSection>
    </Sidebar>
  )

  const header = screen.getByRole("button", { name: "Tags" })
  expect(header.getAttribute("aria-expanded")).toBe("true")
  expect(screen.getByRole("link", { name: "Red" })).toBeTruthy()

  header.focus()
  await user.keyboard("{Enter}")
  expect(header.getAttribute("aria-expanded")).toBe("false")
  expect(screen.queryByRole("link", { name: "Red" })).toBeNull()
})
