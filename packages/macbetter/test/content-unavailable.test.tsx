import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Button } from "../src/components/button"
import {
  ContentUnavailable,
  ContentUnavailableActions,
  ContentUnavailableDescription,
  ContentUnavailableIcon,
  ContentUnavailableTitle,
} from "../src/components/content-unavailable"

test("composes an icon, a heading, a description and actions", async () => {
  const user = userEvent.setup()
  const onRetry = vi.fn()
  const { container } = render(
    <ContentUnavailable size="lg" className="mine">
      <ContentUnavailableIcon>
        <svg />
      </ContentUnavailableIcon>
      <ContentUnavailableTitle>No Results for “quarterly”</ContentUnavailableTitle>
      <ContentUnavailableDescription>Check the spelling or try a new search.</ContentUnavailableDescription>
      <ContentUnavailableActions>
        <Button onClick={onRetry}>Try Again</Button>
      </ContentUnavailableActions>
    </ContentUnavailable>
  )

  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-content-unavailable mine")
  expect(root.dataset.size).toBe("lg")
  expect(root.querySelector(".mb-content-unavailable-icon")?.getAttribute("aria-hidden")).toBe("true")
  expect(screen.getByRole("heading", { level: 2, name: "No Results for “quarterly”" }).className).toBe(
    "mb-content-unavailable-title"
  )
  expect(screen.getByText("Check the spelling or try a new search.").tagName).toBe("P")

  await user.tab()
  await user.keyboard("{Enter}")
  expect(onRetry).toHaveBeenCalledTimes(1)
})

test("the title can take another heading level", () => {
  render(<ContentUnavailableTitle render={<h3 />}>No Recent Chats</ContentUnavailableTitle>)
  expect(screen.getByRole("heading", { level: 3, name: "No Recent Chats" })).toBeTruthy()
})
