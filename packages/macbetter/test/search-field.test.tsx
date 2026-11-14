import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import { SearchField } from "../src/components/search-field"

test("draws the magnifier and a named clear button around a search input", async () => {
  const user = userEvent.setup()
  render(<SearchField aria-label="Search boards" size="sm" groupClassName="toolbar-search" />)

  const input = screen.getByRole("searchbox", { name: "Search boards" }) as HTMLInputElement
  expect(input.placeholder).toBe("Search")
  expect(input.className).toBe("mb-search-field-input")
  const group = input.parentElement as HTMLElement
  expect(group.className).toBe("mb-search-field toolbar-search")
  expect(group.dataset.size).toBe("sm")
  expect(group.querySelector(".mb-search-field-glyph")).toBeTruthy()
  expect(screen.queryByRole("button", { name: "Clear search" })).toBeNull()

  await user.click(input)
  await user.keyboard("revenue")
  await user.click(screen.getByRole("button", { name: "Clear search" }))
  expect(input.value).toBe("")
  expect(document.activeElement).toBe(input)
})
