"use client"

import { Button } from "@dreambase/stardust/button"
import { CheckIcon, CopyIcon } from "lucide-react"
import { useState } from "react"

/** Copies the page's MDX source, for pasting into a chat with an agent. */
function CopyPageButton({ slug }: { slug: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle")
  const copy = async () => {
    const url = `/docs/raw/${slug}`
    try {
      // Safari only keeps the user's gesture alive for a ClipboardItem built from a promise.
      if (typeof ClipboardItem !== "undefined" && navigator.clipboard.write) {
        const blob = fetch(url).then((response) => response.blob()).then((b) => new Blob([b], { type: "text/plain" }))
        await navigator.clipboard.write([new ClipboardItem({ "text/plain": blob })])
      } else {
        await navigator.clipboard.writeText(await (await fetch(url)).text())
      }
      setState("copied")
    } catch {
      setState("failed")
    }
    setTimeout(() => setState("idle"), 1800)
  }
  return (
    <Button variant="bezeled" tone="neutral" size="sm" onClick={copy}>
      {state === "copied" ? <CheckIcon aria-hidden="true" /> : <CopyIcon aria-hidden="true" />}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn’t copy" : "Copy page"}
      </span>
    </Button>
  )
}

export { CopyPageButton }
