import { render, screen } from "@testing-library/react"
import { expect, test } from "vitest"
import {
  DescriptionDetails,
  DescriptionItem,
  DescriptionList,
  DescriptionTerm,
} from "../src/components/description-list"

test("renders a real description list with its layout, size and mono values", () => {
  const { container } = render(
    <DescriptionList layout="stacked" size="sm" className="mine">
      <DescriptionItem>
        <DescriptionTerm>Id</DescriptionTerm>
        <DescriptionDetails mono>call_8f2c41d07a</DescriptionDetails>
      </DescriptionItem>
      <DescriptionItem>
        <DescriptionTerm>Type</DescriptionTerm>
        <DescriptionDetails>Function</DescriptionDetails>
      </DescriptionItem>
    </DescriptionList>
  )

  const list = container.querySelector("dl") as HTMLElement
  expect(list.className).toBe("mb-description-list mine")
  expect(list.dataset.layout).toBe("stacked")
  expect(list.dataset.size).toBe("sm")
  expect(list.querySelectorAll(":scope > div.mb-description-item")).toHaveLength(2)

  const id = screen.getByText("call_8f2c41d07a")
  expect(id.tagName).toBe("DD")
  expect(id.hasAttribute("data-mono")).toBe(true)
  expect(screen.getByText("Function").hasAttribute("data-mono")).toBe(false)
  expect(screen.getByText("Id").tagName).toBe("DT")
  expect(screen.getAllByRole("term")).toHaveLength(2)
  expect(screen.getAllByRole("definition")).toHaveLength(2)
})

test("defaults to rows at the regular size", () => {
  const { container } = render(<DescriptionList />)
  const list = container.querySelector("dl") as HTMLElement
  expect(list.dataset.layout).toBe("rows")
  expect(list.dataset.size).toBe("md")
})
