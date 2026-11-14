import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test } from "vitest"
import {
  Autocomplete,
  AutocompleteContent,
  AutocompleteInput,
  AutocompleteItem,
  AutocompleteList,
  Combobox,
  ComboboxClear,
  ComboboxContent,
  ComboboxControl,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxStatus,
  ComboboxTrigger,
} from "../src/components/combo-box"

const cities = [
  { value: "paris", label: "Paris" },
  { value: "berlin", label: "Berlin" },
  { value: "lisbon", label: "Lisbon" },
]

function City() {
  return (
    <Combobox defaultValue="paris">
      <ComboboxLabel>City</ComboboxLabel>
      <ComboboxControl>
        <ComboboxInput />
        <ComboboxClear aria-label="Clear city" />
        <ComboboxTrigger aria-label="Show cities" />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxList>
          {cities.map((city) => (
            <ComboboxItem key={city.value} value={city.value} label={city.label}>
              {city.label}
            </ComboboxItem>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

test("the field pre-composes its chevron and clear glyphs", () => {
  render(<City />)
  const input = screen.getByRole("combobox", { name: "City" })
  expect(input.className).toBe("sd-combo-box-input")
  expect(input.parentElement?.className).toBe("sd-combo-box-control")
  expect(screen.getByRole("button", { name: "Show cities" }).querySelector("svg")).not.toBeNull()
  expect(screen.getByRole("button", { name: "Clear city" }).querySelector("svg")).not.toBeNull()
})

test("typing filters the list and Enter chooses the highlighted city", async () => {
  const user = userEvent.setup()
  render(<City />)
  const input = screen.getByRole("combobox", { name: "City" })
  await user.clear(input)
  await user.type(input, "ber")
  const list = screen.getByRole("listbox")
  expect(list.closest(".sd-combo-box-content")?.classList.contains("sd-menu-content")).toBe(true)
  expect(screen.queryByRole("option", { name: "Paris" })).toBeNull()
  const berlin = screen.getByRole("option", { name: "Berlin" })
  expect(berlin.className).toBe("sd-menu-item sd-menu-checkable sd-combo-box-item")
  await user.keyboard("{ArrowDown}{Enter}")
  expect((input as HTMLInputElement).value).toBe("Berlin")
  expect(screen.queryByRole("listbox")).toBeNull()
})

test("autocomplete suggestions share the look without a check column", async () => {
  const user = userEvent.setup()
  render(
    <Autocomplete>
      <AutocompleteInput aria-label="Destination" />
      <AutocompleteContent>
        <AutocompleteList>
          <AutocompleteItem value="Lisbon">Lisbon</AutocompleteItem>
          <AutocompleteItem value="Lima">Lima</AutocompleteItem>
        </AutocompleteList>
      </AutocompleteContent>
    </Autocomplete>
  )
  const input = screen.getByRole("combobox", { name: "Destination" })
  await user.type(input, "Li")
  const item = screen.getByRole("option", { name: "Lima" })
  expect(item.className).toBe("sd-menu-item sd-combo-box-item")
  await user.keyboard("{Escape}")
})

test("Escape closes the list and restores the chosen value; the control merges className", async () => {
  const user = userEvent.setup()
  render(<City />)
  const input = screen.getByRole("combobox", { name: "City" }) as HTMLInputElement
  expect(input.closest(".sd-combo-box-control")).not.toBeNull()
  await user.clear(input)
  await user.type(input, "Ber")
  expect(screen.getByRole("listbox")).toBeTruthy()
  await user.keyboard("{Escape}")
  await user.keyboard("{Escape}")
  expect(screen.queryByRole("listbox")).toBeNull()
  expect(input.value).toBe("Paris")
})

test("status gets its own class", async () => {
  const user = userEvent.setup()
  render(
    <Combobox>
      <ComboboxLabel>City</ComboboxLabel>
      <ComboboxControl className="wide">
        <ComboboxInput />
      </ComboboxControl>
      <ComboboxContent>
        <ComboboxStatus>Loading cities…</ComboboxStatus>
        <ComboboxList />
      </ComboboxContent>
    </Combobox>
  )
  expect(screen.getByRole("combobox", { name: "City" }).parentElement?.className).toBe("sd-combo-box-control wide")
  await user.type(screen.getByRole("combobox", { name: "City" }), "L")
  expect(document.querySelector(".sd-combo-box-status")?.textContent).toBe("Loading cities…")
})
