import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from "../src/components/table"

const files = [
  { id: "notes", name: "Meeting Notes.md", size: "4 KB" },
  { id: "budget", name: "Budget 2026.numbers", size: "212 KB" },
  { id: "logo", name: "Logo.svg", size: "18 KB" },
]

function Files(props: React.ComponentProps<typeof Table>) {
  return (
    <Table aria-label="Files" {...props}>
      <TableHeader>
        <TableColumn value="name">Name</TableColumn>
        <TableColumn value="size" align="end">
          Size
        </TableColumn>
        <TableColumn>Kind</TableColumn>
      </TableHeader>
      <TableBody>
        {files.map((file) => (
          <TableRow key={file.id} value={file.id}>
            <TableCell>{file.name}</TableCell>
            <TableCell align="end" secondary>
              {file.size}
            </TableCell>
            <TableCell secondary>Document</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

test("without selection it is a native table with Stardust's classes", () => {
  render(<Files alternating />)
  const table = screen.getByRole("table", { name: "Files" })
  expect(table.tagName).toBe("TABLE")
  expect(table.getAttribute("role")).toBeNull()
  expect(table.className).toBe("sd-table")
  expect(table.hasAttribute("data-alternating")).toBe(true)
  expect(screen.getAllByRole("row")[1].getAttribute("aria-selected")).toBeNull()
  expect(screen.getAllByRole("row")[1].getAttribute("tabindex")).toBeNull()
})

test("sortable columns carry aria-sort and toggle direction", async () => {
  const user = userEvent.setup()
  const onSortChange = vi.fn()
  render(<Files defaultSort={{ column: "name", direction: "ascending" }} onSortChange={onSortChange} />)

  const name = screen.getByRole("columnheader", { name: "Name" })
  const size = screen.getByRole("columnheader", { name: "Size" })
  const kind = screen.getByRole("columnheader", { name: "Kind" })
  expect(name.getAttribute("aria-sort")).toBe("ascending")
  expect(size.getAttribute("aria-sort")).toBe("none")
  expect(kind.getAttribute("aria-sort")).toBeNull()
  expect(size.dataset.align).toBe("end")

  await user.click(screen.getByRole("button", { name: "Name" }))
  expect(name.getAttribute("aria-sort")).toBe("descending")
  await user.click(screen.getByRole("button", { name: "Size" }))
  expect(size.getAttribute("aria-sort")).toBe("ascending")
  expect(name.getAttribute("aria-sort")).toBe("none")
  expect(onSortChange.mock.calls.map(([sort]) => sort)).toEqual([
    { column: "name", direction: "descending" },
    { column: "size", direction: "ascending" },
  ])
})

test("single selection follows a click and the arrow keys", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  render(<Files selectionMode="single" onValueChange={onValueChange} />)

  const grid = screen.getByRole("grid", { name: "Files" })
  expect(grid.getAttribute("aria-multiselectable")).toBeNull()
  const [, notes, budget, logo] = screen.getAllByRole("row")

  await user.click(notes)
  expect(notes.getAttribute("aria-selected")).toBe("true")
  expect(notes.hasAttribute("data-selected")).toBe(true)
  expect(document.activeElement).toBe(notes)

  await user.keyboard("{ArrowDown}")
  expect(document.activeElement).toBe(budget)
  expect(budget.getAttribute("aria-selected")).toBe("true")
  expect(notes.getAttribute("aria-selected")).toBe("false")

  await user.keyboard("{End}")
  expect(document.activeElement).toBe(logo)
  expect(onValueChange.mock.calls.map(([value]) => value)).toEqual([["notes"], ["budget"], ["logo"]])
})

test("multiple selection extends with Shift and selects all with Command-A", async () => {
  const user = userEvent.setup()
  const onAction = vi.fn()
  render(<Files selectionMode="multiple" onAction={onAction} />)

  const grid = screen.getByRole("grid", { name: "Files" })
  expect(grid.getAttribute("aria-multiselectable")).toBe("true")
  const [, notes, budget, logo] = screen.getAllByRole("row")

  await user.click(notes)
  await user.keyboard("{Shift>}{ArrowDown}{/Shift}")
  expect([notes, budget, logo].map((row) => row.getAttribute("aria-selected"))).toEqual(["true", "true", "false"])

  await user.keyboard("{Meta>}a{/Meta}")
  expect([notes, budget, logo].map((row) => row.getAttribute("aria-selected"))).toEqual(["true", "true", "true"])

  await user.keyboard("{Enter}")
  expect(onAction).toHaveBeenCalledWith("budget")
})

test("Command-A never clears a full selection, and Command-click toggles one row", async () => {
  const user = userEvent.setup()
  render(<Files selectionMode="multiple" />)
  const [, notes, budget, logo] = screen.getAllByRole("row")
  const selected = () => [notes, budget, logo].map((row) => row.getAttribute("aria-selected"))

  await user.click(notes)
  await user.keyboard("{Meta>}a{/Meta}")
  await user.keyboard("{Meta>}a{/Meta}")
  expect(selected()).toEqual(["true", "true", "true"])

  await user.keyboard("{Meta>}")
  await user.click(budget)
  await user.keyboard("{/Meta}")
  expect(selected()).toEqual(["true", "false", "true"])
})

test("Command-arrow moves focus alone, Space toggles, and Left/Right leave rows alone", async () => {
  const user = userEvent.setup()
  const onAction = vi.fn()
  render(<Files selectionMode="multiple" onAction={onAction} />)
  const [, notes, budget, logo] = screen.getAllByRole("row")

  await user.click(notes)
  await user.keyboard("{Meta>}{ArrowDown}{/Meta}")
  expect(document.activeElement).toBe(budget)
  expect(budget.getAttribute("aria-selected")).toBe("false")
  expect(notes.getAttribute("aria-selected")).toBe("true")

  await user.keyboard(" ")
  expect(budget.getAttribute("aria-selected")).toBe("true")

  await user.keyboard("{ArrowRight}")
  expect(document.activeElement).toBe(budget)

  await user.dblClick(logo)
  expect(onAction).toHaveBeenCalledWith("logo")
})

test("a controlled sort only changes when the caller says so", async () => {
  const user = userEvent.setup()
  const onSortChange = vi.fn()
  render(<Files sort={{ column: "size", direction: "descending" }} onSortChange={onSortChange} />)
  const size = screen.getByRole("columnheader", { name: "Size" })
  expect(size.dataset.sorted).toBe("descending")
  await user.click(screen.getByRole("button", { name: "Size" }))
  expect(onSortChange).toHaveBeenCalledWith({ column: "size", direction: "ascending" }, expect.anything())
  expect(size.getAttribute("aria-sort")).toBe("descending")
})
