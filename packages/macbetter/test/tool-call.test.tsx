import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  ToolActivity,
  ToolActivityContent,
  ToolActivitySummary,
  ToolCall,
  ToolCallDetail,
  ToolCallSection,
  ToolCallTitle,
} from "../src/components/tool-call"

function Activity() {
  return (
    <ToolActivity defaultOpen>
      <ToolActivitySummary>Used Dataroom, read a file · 29s</ToolActivitySummary>
      <ToolActivityContent>
        <ToolCall>
          <ToolCallTitle verb="Read">data-workflows.md</ToolCallTitle>
          <ToolCallDetail>
            <ToolCallSection title="Request">path: data-workflows.md</ToolCallSection>
          </ToolCallDetail>
        </ToolCall>
        <ToolCall status="error">
          <ToolCallTitle verb="Queried">usage_daily</ToolCallTitle>
        </ToolCall>
        <ToolCall status="running">
          <ToolCallTitle verb="Listed datasets">inventory</ToolCallTitle>
        </ToolCall>
        <ToolCall>
          <ToolCallTitle>Searching the catalog for usage tables.</ToolCallTitle>
        </ToolCall>
      </ToolActivityContent>
    </ToolActivity>
  )
}

test("the summary opens a named list of steps", async () => {
  const user = userEvent.setup()
  render(<Activity />)
  const summary = screen.getByRole("button", { name: "Used Dataroom, read a file · 29s" })
  expect(summary.className).toBe("mb-tool-activity-summary")
  const list = screen.getByRole("list", { name: "Steps" })
  expect(list.querySelectorAll(":scope > li.mb-tool-activity-item")).toHaveLength(4)
  await user.click(summary)
  expect(summary.getAttribute("aria-expanded")).toBe("false")
})

test("only a step with detail is a button, and it opens from the keyboard", async () => {
  const user = userEvent.setup()
  render(<Activity />)
  const row = screen.getByRole("button", { name: "Read data-workflows.md" })
  expect(row.className).toBe("mb-tool-call-row")
  expect(screen.queryByRole("button", { name: /usage_daily/ })).toBeNull()
  expect(screen.queryByRole("button", { name: /Searching the catalog/ })).toBeNull()

  row.focus()
  await user.keyboard("{Enter}")
  expect(row.getAttribute("aria-expanded")).toBe("true")
  const section = screen.getByRole("region", { name: "Request" })
  expect(section.className).toBe("mb-tool-call-section")
  await user.keyboard(" ")
  expect(row.getAttribute("aria-expanded")).toBe("false")
})

test("says each status in words, not by color alone", () => {
  const { container } = render(<Activity />)
  const steps = container.querySelectorAll(".mb-tool-call")
  expect((steps[1] as HTMLElement).dataset.status).toBe("error")
  expect(steps[1]?.textContent).toContain("Failed")
  expect((steps[2] as HTMLElement).dataset.status).toBe("running")
  expect(steps[2]?.getAttribute("aria-busy")).toBe("true")
  expect(steps[2]?.textContent).toContain("In progress")
  expect(steps[2]?.querySelector(".mb-tool-call-title")?.hasAttribute("data-active")).toBe(true)
  expect(steps[3]?.querySelector(".mb-tool-call-title")?.hasAttribute("data-note")).toBe(true)
})
