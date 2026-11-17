import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  GeneratedImage,
  GeneratedImageActions,
  GeneratedImageStage,
  GeneratedImageThumbnail,
  GeneratedImageThumbnails,
} from "../src/components/generated-image"

const images = ["dunes", "tide", "dusk"]

function Example({ onValueChange }: { onValueChange?: (value: string | null) => void }) {
  return (
    <GeneratedImage defaultValue="dunes" aspectRatio="4 / 3" onValueChange={onValueChange}>
      <GeneratedImageStage>{(value) => <span data-testid="stage">{value}</span>}</GeneratedImageStage>
      <GeneratedImageActions>
        <button type="button">Edit</button>
      </GeneratedImageActions>
      <GeneratedImageThumbnails>
        {images.map((image, index) => (
          <GeneratedImageThumbnail key={image} value={image} aria-label={`Image ${index + 1}`} />
        ))}
      </GeneratedImageThumbnails>
    </GeneratedImage>
  )
}

test("thumbnails are a named radio group; arrow keys swap the stage image", async () => {
  const user = userEvent.setup()
  const onValueChange = vi.fn()
  const { container } = render(<Example onValueChange={onValueChange} />)
  const root = container.firstElementChild as HTMLElement
  expect(root.className).toBe("mb-generated-image")
  expect(root.style.getPropertyValue("--mb-generated-image-aspect")).toBe("4 / 3")
  expect(screen.getByRole("radiogroup", { name: "Images" }).className).toBe("mb-generated-image-thumbnails")
  const first = screen.getByRole("radio", { name: "Image 1" })
  expect(first.className).toBe("mb-generated-image-thumbnail")
  expect(first.getAttribute("aria-checked")).toBe("true")
  expect(screen.getByTestId("stage").textContent).toBe("dunes")

  await user.tab()
  await user.tab()
  expect(document.activeElement).toBe(first)
  await user.keyboard("{ArrowDown}")
  expect(screen.getByRole("radio", { name: "Image 2" }).getAttribute("aria-checked")).toBe("true")
  expect(screen.getByTestId("stage").textContent).toBe("tide")
  expect(onValueChange).toHaveBeenLastCalledWith("tide")
})

test("generating shows the placeholder and Creating image", () => {
  const { container } = render(
    <GeneratedImage state="generating">
      <GeneratedImageStage>
        <span data-testid="stage">final</span>
      </GeneratedImageStage>
    </GeneratedImage>
  )
  const root = container.firstElementChild as HTMLElement
  expect(root.dataset.state).toBe("generating")
  expect(root.getAttribute("aria-busy")).toBe("true")
  expect(screen.queryByTestId("stage")).toBeNull()
  expect(screen.getByText("Creating image…").className).toBe("mb-shimmer mb-generated-image-status")
  expect(container.querySelector(".mb-generated-image-placeholder")).not.toBeNull()
})
