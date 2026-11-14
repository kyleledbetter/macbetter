import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../src/components/hover-card"

test("keeps the link a link and previews it on keyboard focus", async () => {
  const user = userEvent.setup()
  render(
    <HoverCard delay={0}>
      <HoverCardTrigger href="https://macbetter.dev">Macbetter site</HoverCardTrigger>
      <HoverCardContent>
        <p>Macbetter — macOS, iPadOS and iOS for the web</p>
      </HoverCardContent>
    </HoverCard>
  )

  const link = screen.getByRole("link", { name: "Macbetter site" })
  expect(link.className).toContain("mb-hover-card-trigger")
  expect(link.getAttribute("href")).toBe("https://macbetter.dev")

  await user.tab()
  await new Promise((resolve) => setTimeout(resolve, 20))
  const card = await screen.findByText("Macbetter — macOS, iPadOS and iOS for the web")
  const content = card.closest(".mb-hover-card")
  expect(content).not.toBeNull()
  expect(content?.querySelector(".mb-hover-card-arrow")).toBeNull()

  await user.keyboard("{Escape}")
  expect(link.hasAttribute("data-open")).toBe(false)
})
