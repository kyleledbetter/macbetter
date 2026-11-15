import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { HomeSection, HomeSectionHeader, HomeSectionSummary, HomeSectionTitle } from "../src/components/home-section"

test("a room title opens the room from the keyboard", async () => {
  const user = userEvent.setup()
  const onClick = vi.fn()
  render(
    <HomeSection aria-labelledby="kitchen">
      <HomeSectionHeader>
        <HomeSectionTitle id="kitchen" onClick={onClick}>
          Kitchen
        </HomeSectionTitle>
        <HomeSectionSummary>72° · 2 lights on</HomeSectionSummary>
      </HomeSectionHeader>
    </HomeSection>
  )
  const heading = screen.getByRole("heading", { level: 2, name: "Kitchen" })
  expect(heading.className).toBe("mb-home-section-title")
  const link = screen.getByRole("button", { name: "Kitchen" })
  link.focus()
  await user.keyboard("{Enter}")
  expect(onClick).toHaveBeenCalledTimes(1)
  expect(screen.getByRole("region", { name: "Kitchen" }).className).toBe("mb-home-section")
})

test("an href makes the title a link, and a plain title has no control", () => {
  render(
    <>
      <HomeSectionTitle level={3} href="/rooms/garage">Garage</HomeSectionTitle>
      <HomeSectionTitle>Favorites</HomeSectionTitle>
    </>
  )
  expect(screen.getByRole("link", { name: "Garage" }).getAttribute("href")).toBe("/rooms/garage")
  expect(screen.getByRole("heading", { level: 3, name: "Garage" })).toBeTruthy()
  expect(screen.getByRole("heading", { name: "Favorites" }).querySelector("button, a")).toBeNull()
})
