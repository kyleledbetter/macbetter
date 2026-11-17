import { act, render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { Citation, Source, Sources, SourcesContent, SourcesTrigger } from "../src/components/sources"

test("the line opens a list of links that open in a new tab", async () => {
  const user = userEvent.setup()
  render(
    <Sources>
      <SourcesTrigger count={2} />
      <SourcesContent>
        <Source href="https://example.com/a" site="example.com">
          Tide tables for the bay
        </Source>
        <Source href="https://harbor.example/b" site="harbor.example">
          Harbor opening hours
        </Source>
      </SourcesContent>
    </Sources>
  )
  const trigger = screen.getByRole("button", { name: "Used 2 sources" })
  trigger.focus()
  await user.keyboard("{Enter}")
  const list = screen.getByRole("list", { name: "Sources" })
  expect(list.className).toBe("mb-sources-list")
  const link = screen.getByRole("link", { name: /Tide tables for the bay/ })
  expect(link.className).toBe("mb-source")
  expect(link.getAttribute("target")).toBe("_blank")
  expect(link.getAttribute("rel")).toBe("noreferrer")
  expect(link.textContent).toContain("opens in a new tab")
  const icon = link.querySelector(".mb-source-icon") as HTMLElement
  expect(icon.textContent).toBe("E")
  expect(icon.getAttribute("aria-hidden")).toBe("true")
  expect(icon.style.getPropertyValue("--mb-source-tint")).toMatch(/^var\(--mb-/)
})

test("a citation is a link chip named by its label and title, and focus previews the source", async () => {
  render(
    <p>
      The ferry runs hourly
      <Citation
        href="https://harbor.example/ferry"
        site="harbor.example"
        title="Ferry timetable"
        description="Departures from the north pier."
        hoverCardProps={{ delay: 0 }}
      >
        1
      </Citation>
    </p>
  )
  const link = screen.getByRole("link", { name: /^1 ?, Ferry timetable$/ })
  expect(link.className).toBe("mb-citation")
  expect(link.getAttribute("href")).toBe("https://harbor.example/ferry")
  expect(link.getAttribute("rel")).toBe("noreferrer")
  const user = userEvent.setup()
  await user.tab()
  expect(document.activeElement).toBe(link)
  await act(() => new Promise((resolve) => setTimeout(resolve, 20)))
  const card = document.querySelector(".mb-citation-card")
  expect(card?.textContent).toContain("Departures from the north pier.")
  expect(card?.textContent).toContain("Ferry timetable")
  await user.keyboard("{Escape}")
  expect(link.hasAttribute("data-open")).toBe(false)
})
