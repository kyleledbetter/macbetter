import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { expect, test, vi } from "vitest"
import {
  Attachment,
  AttachmentMeta,
  AttachmentName,
  AttachmentPreview,
  AttachmentRemove,
  Attachments,
} from "../src/components/attachment"

test("a list of attachments makes each one a list item with its variant and state", () => {
  render(
    <Attachments aria-label="Attachments" layout="scroll" className="mine">
      <Attachment variant="tile">
        <AttachmentPreview extension="pdf" />
        <AttachmentName>Q3 Board Deck.pdf</AttachmentName>
        <AttachmentMeta>PDF · 2.4 MB</AttachmentMeta>
      </Attachment>
      <Attachment variant="tile" state="error">
        <AttachmentPreview extension="csv" />
        <AttachmentName>regional-sales.csv</AttachmentName>
        <AttachmentMeta>Upload failed</AttachmentMeta>
      </Attachment>
    </Attachments>
  )

  const list = screen.getByRole("list", { name: "Attachments" })
  expect(list.className).toBe("mb-attachments mine")
  expect(list.dataset.layout).toBe("scroll")
  const items = screen.getAllByRole("listitem")
  expect(items).toHaveLength(2)
  const first = items[0]?.firstElementChild as HTMLElement
  expect(first.className).toBe("mb-attachment")
  expect(first.dataset.variant).toBe("tile")
  expect(first.dataset.state).toBe("ready")
  expect((items[1]?.firstElementChild as HTMLElement).dataset.state).toBe("error")
  expect(items[1]?.querySelector(".mb-attachment-error")).not.toBeNull()
  expect(first.querySelector(".mb-attachment-extension")?.textContent).toBe("pdf")
})

test("uploading shows a named progress ring and marks the attachment busy", () => {
  const { container } = render(
    <Attachment state="uploading" progress={40}>
      <AttachmentPreview src="/photo.jpg" />
      <AttachmentName>IMG_0412.heic</AttachmentName>
    </Attachment>
  )
  const root = container.firstElementChild as HTMLElement
  expect(root.getAttribute("aria-busy")).toBe("true")
  const ring = screen.getByRole("progressbar", { name: "Uploading" })
  expect(ring.getAttribute("aria-valuenow")).toBe("40")
  expect(container.querySelector("img")?.getAttribute("alt")).toBe("")
})

test("the remove button is named after the attachment and works from the keyboard", async () => {
  const user = userEvent.setup()
  const onRemove = vi.fn()
  render(
    <Attachment>
      <AttachmentPreview extension="md" />
      <AttachmentName>release-notes.md</AttachmentName>
      <AttachmentMeta>Markdown · 4 KB</AttachmentMeta>
      <AttachmentRemove onClick={onRemove} />
    </Attachment>
  )
  const remove = screen.getByRole("button", { name: "Remove release-notes.md" })
  expect(remove.className).toBe("mb-attachment-remove")
  remove.focus()
  await user.keyboard("{Enter}")
  expect(onRemove).toHaveBeenCalledTimes(1)
})

test("renders as a link, or with a link for a name", () => {
  render(
    <>
      <Attachment variant="row" render={<a href="/files/plan.pdf" />}>
        <AttachmentName>plan.pdf</AttachmentName>
      </Attachment>
      <Attachment variant="chip">
        <AttachmentName render={<a href="/files/brief.pdf" />}>brief.pdf</AttachmentName>
        <AttachmentRemove />
      </Attachment>
    </>
  )
  const whole = screen.getByRole("link", { name: "plan.pdf" })
  expect(whole.className).toBe("mb-attachment")
  expect(whole.hasAttribute("data-interactive")).toBe(true)
  const name = screen.getByRole("link", { name: "brief.pdf" })
  expect(name.className).toBe("mb-attachment-name")
  expect(name.hasAttribute("data-interactive")).toBe(true)
  expect(screen.getByRole("button", { name: "Remove brief.pdf" })).toBeTruthy()
})
