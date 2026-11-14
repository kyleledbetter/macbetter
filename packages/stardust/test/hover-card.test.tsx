import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "../src/components/hover-card"

test("keeps the link a link and previews it on keyboard focus", async () => {
  const user = userEvent.setup()
  render(
    <HoverCard delay={0}>
      <HoverCardTrigger href="https://stardust.dreambase.ai">Stardust site</HoverCardTrigger>
      <HoverCardContent>
        <p>Stardust — macOS, iPadOS and iOS for the web</p>
      </HoverCardContent>
    </HoverCard>
  )

  const link = screen.getByRole("link", { name: "Stardust site" })
  expect(link.className).toContain("sd-hover-card-trigger")
  expect(link.getAttribute("href")).toBe("https://stardust.dreambase.ai")

  await user.tab()
  await new Promise((resolve) => setTimeout(resolve, 20))
  const card = await screen.findByText("Stardust — macOS, iPadOS and iOS for the web")
  const content = card.closest(".sd-hover-card")
  expect(content).not.toBeNull()
  expect(content?.querySelector(".sd-hover-card-arrow")).toBeNull()

  await user.keyboard("{Escape}")
  expect(link.hasAttribute("data-open")).toBe(false)
})
