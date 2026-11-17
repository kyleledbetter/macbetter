"use client"

import {
  PromptInput,
  PromptInputField,
  PromptInputSubmit,
  PromptInputToolbar,
  PromptInputTools,
  type PromptInputTrigger,
} from "macbetter/prompt-input"
import { useState } from "react"

const triggers: PromptInputTrigger[] = [
  {
    char: "@",
    items: [
      { value: "trip-notes", label: "Trip notes.md" },
      { value: "budget", label: "Budget 2027.xlsx" },
      { value: "itinerary", label: "Porto itinerary.pdf" },
      { value: "maya", label: "Maya Okafor" },
    ],
  },
  {
    char: "/",
    boundary: "start",
    items: [
      { value: "summarize", label: "summarize" },
      { value: "translate", label: "translate" },
      { value: "table", label: "table" },
    ],
  },
]

export default function Example() {
  const [sent, setSent] = useState<string | null>(null)
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 600 }}>
      <PromptInput onSubmit={({ text }) => setSent(text)}>
        <PromptInputField placeholder="Type @ to mention a file or / for a command" triggers={triggers} triggerEmpty="No matches" />
        <PromptInputToolbar>
          <PromptInputTools />
          <PromptInputTools>
            <PromptInputSubmit />
          </PromptInputTools>
        </PromptInputToolbar>
      </PromptInput>
      <p className="mb-text-footnote mb-label-secondary" style={{ margin: 0 }} aria-live="polite">
        {sent ? `Sent “${sent}”` : "Return chooses a highlighted suggestion; it sends once the list is closed."}
      </p>
    </div>
  )
}
