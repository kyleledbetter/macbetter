import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  ArtifactCard,
  ArtifactCardAction,
  ArtifactCardActions,
  ArtifactCardIcon,
  ArtifactCardMeta,
  ArtifactCardTitle,
} from "../src/components/artifact-card"

test("the title is the card's one link, and actions sit beside it with full names", async () => {
  const user = userEvent.setup()
  const onDownload = vi.fn()
  render(
    <ArtifactCard>
      <ArtifactCardIcon color="orange">D</ArtifactCardIcon>
      <ArtifactCardTitle render={<a href="/files/review" />}>Quarterly review deck</ArtifactCardTitle>
      <ArtifactCardMeta>Slides · Only you</ArtifactCardMeta>
      <ArtifactCardActions>
        <ArtifactCardAction label="Download" onClick={onDownload}>
          ↓
        </ArtifactCardAction>
      </ArtifactCardActions>
    </ArtifactCard>
  )
  const link = screen.getByRole("link", { name: "Quarterly review deck" })
  expect(link.className).toBe("mb-artifact-card-title")
  expect(link.hasAttribute("data-interactive")).toBe(true)
  const download = screen.getByRole("button", { name: "Download Quarterly review deck" })
  expect(link.contains(download)).toBe(false)
  download.focus()
  await user.keyboard("{Enter}")
  expect(onDownload).toHaveBeenCalledTimes(1)
  const icon = document.querySelector(".mb-artifact-card-icon") as HTMLElement
  expect(icon.style.getPropertyValue("--mb-artifact-card-tint")).toBe("var(--mb-orange)")
})

test("generating shimmers the meta line and shows a named progress ring", () => {
  const { container } = render(
    <ArtifactCard state="generating" progress={40}>
      <ArtifactCardIcon>D</ArtifactCardIcon>
      <ArtifactCardTitle>Quarterly review deck</ArtifactCardTitle>
      <ArtifactCardMeta>Making slides…</ArtifactCardMeta>
    </ArtifactCard>
  )
  const card = container.firstElementChild as HTMLElement
  expect(card.className).toBe("mb-artifact-card")
  expect(card.dataset.state).toBe("generating")
  expect(card.getAttribute("aria-busy")).toBe("true")
  expect(screen.getByRole("progressbar", { name: "Generating" }).getAttribute("aria-valuenow")).toBe("40")
  expect(screen.getByText("Making slides…").hasAttribute("data-active")).toBe(true)
})

test("render makes the whole card one button", async () => {
  const user = userEvent.setup()
  const onOpen = vi.fn()
  render(
    <ArtifactCard render={<button type="button" onClick={onOpen} />}>
      <ArtifactCardTitle>Trip budget</ArtifactCardTitle>
    </ArtifactCard>
  )
  const button = screen.getByRole("button", { name: "Trip budget" })
  expect(button.hasAttribute("data-interactive")).toBe(true)
  await user.click(button)
  expect(onOpen).toHaveBeenCalledTimes(1)
})
