import { act, fireEvent, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Dock, DockItem, DockSeparator } from "../src/components/dock"

function Example({ onClick }: { onClick?: () => void }) {
  return (
    <Dock aria-label="Dock">
      <DockItem label="Finder" running>
        <span />
      </DockItem>
      <DockItem label="Mail" onClick={onClick}>
        <span />
      </DockItem>
      <DockSeparator />
      <DockItem label="Downloads" href="/downloads">
        <span />
      </DockItem>
    </Dock>
  )
}

test("is a named toolbar of named items, with the running dot and label", () => {
  render(<Example />)
  const dock = screen.getByRole("toolbar", { name: "Dock" })
  expect(dock.className).toContain("sd-dock")
  const finder = screen.getByRole("button", { name: "Finder" })
  expect(finder.className).toContain("sd-dock-item")
  expect(finder.hasAttribute("data-running")).toBe(true)
  expect(finder.querySelector(".sd-dock-item-label")?.getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByRole("link", { name: "Downloads" }).getAttribute("href")).toBe("/downloads")
  expect(screen.getByRole("separator").className).toContain("sd-dock-separator")
})

test("one tab stop, arrows between items, and a bounce when an app launches", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(<Example onClick={onClick} />)
  await user.tab()
  expect(document.activeElement).toBe(screen.getByRole("button", { name: "Finder" }))
  await user.keyboard("{ArrowRight}")
  const mail = screen.getByRole("button", { name: "Mail" })
  expect(document.activeElement).toBe(mail)
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(mail.hasAttribute("data-bouncing")).toBe(true)
  act(() => {
    const end = new Event("animationend", { bubbles: true })
    Object.defineProperty(end, "animationName", { value: "sd-dock-bounce" })
    mail.querySelector(".sd-dock-item-icon")?.dispatchEvent(end)
  })
  expect(mail.hasAttribute("data-bouncing")).toBe(false)
})

test("magnifies the items near a mouse pointer and lets go when it leaves", async () => {
  render(<Example />)
  const dock = screen.getByRole("toolbar", { name: "Dock" })
  const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0)
    return 0
  })
  const pointer = (type: string) =>
    Object.assign(new MouseEvent(type, { bubbles: true, clientX: 0 }), { pointerType: "mouse" })
  fireEvent(dock, pointer("pointermove"))
  expect(dock.hasAttribute("data-magnifying")).toBe(true)
  const finder = screen.getByRole("button", { name: "Finder" })
  expect(Number(finder.style.getPropertyValue("--sd-dock-scale"))).toBeGreaterThan(1)
  fireEvent(dock, pointer("pointerout"))
  fireEvent.pointerLeave(dock)
  expect(dock.hasAttribute("data-magnifying")).toBe(false)
  expect(finder.style.getPropertyValue("--sd-dock-scale")).toBe("")
  raf.mockRestore()
})

test("doesn't magnify under Reduce Motion", () => {
  const media = vi.spyOn(window, "matchMedia").mockImplementation(
    (query: string) => ({ matches: query.includes("reduce"), media: query }) as MediaQueryList
  )
  const raf = vi.spyOn(window, "requestAnimationFrame").mockImplementation((callback) => {
    callback(0)
    return 0
  })
  render(<Example />)
  const dock = screen.getByRole("toolbar", { name: "Dock" })
  fireEvent(dock, Object.assign(new MouseEvent("pointermove", { bubbles: true, clientX: 0 }), { pointerType: "mouse" }))
  expect(dock.hasAttribute("data-magnifying")).toBe(false)
  media.mockRestore()
  raf.mockRestore()
})
