import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { HomeStatus, HomeStatusItem } from "../src/components/home-status"

test("chooses one category at a time, from the keyboard", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(
    <HomeStatus aria-label="Categories" onValueChange={onValueChange}>
      <HomeStatusItem value="climate" label="Climate" summary="68–72°" tint="teal" />
      <HomeStatusItem value="lights" label="Lights" summary="3 on" tint="yellow" />
      <HomeStatusItem value="water" label="Water" summary="Leak Detected" alert />
    </HomeStatus>
  )
  const climate = screen.getByRole("button", { name: "Climate 68–72°" })
  expect(climate.className).toContain("mb-home-status-item")
  expect(climate.dataset.tint).toBe("teal")
  climate.focus()
  await user.keyboard("{ArrowRight}")
  const lights = screen.getByRole("button", { name: "Lights 3 on" })
  expect(document.activeElement).toBe(lights)
  await user.keyboard(" ")
  expect(onValueChange).toHaveBeenLastCalledWith(["lights"], expect.anything())
  expect(lights.getAttribute("aria-pressed")).toBe("true")
  expect(screen.getByRole("button", { name: "Water Leak Detected" }).hasAttribute("data-alert")).toBe(true)
})
